import argparse
import json
import mimetypes
import os
import shlex
import subprocess
import sys
import tarfile
import tempfile
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from shutil import which
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


DIST_ARCHIVE_NAME = "dist.tar.gz"
NGINX_IMAGE = "nginx:1.27-alpine"
REMOTE_CONTAINER_NAME = "sysfolio-frontend"
DEFAULT_REPO = "nyml2003/sysfolio"


class PlatformAdapter(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        raise NotImplementedError

    @abstractmethod
    def format_command(self, parts: Iterable[str]) -> str:
        raise NotImplementedError

    @abstractmethod
    def resolve_command(self, parts: list[str]) -> list[str]:
        raise NotImplementedError

    def build_env(self, extra_env: dict[str, str] | None = None) -> dict[str, str]:
        env = dict(os.environ)
        if extra_env:
            env.update(extra_env)
        return env


@dataclass(frozen=True)
class PosixAdapter(PlatformAdapter):
    @property
    def name(self) -> str:
        return "posix"

    def format_command(self, parts: Iterable[str]) -> str:
        return " ".join(shlex.quote(part) for part in parts)

    def resolve_command(self, parts: list[str]) -> list[str]:
        if not parts:
            raise ValueError("command must not be empty")

        executable = which(parts[0])
        return [executable, *parts[1:]] if executable is not None else parts


@dataclass(frozen=True)
class WindowsAdapter(PlatformAdapter):
    @property
    def name(self) -> str:
        return "windows"

    def format_command(self, parts: Iterable[str]) -> str:
        return subprocess.list2cmdline(list(parts))

    def resolve_command(self, parts: list[str]) -> list[str]:
        if not parts:
            raise ValueError("command must not be empty")

        executable = which(parts[0])
        if executable is not None:
            return [executable, *parts[1:]]

        if parts[0] == "pnpm":
            cmd_executable = which("cmd")
            if cmd_executable is not None:
                return [cmd_executable, "/c", "pnpm", *parts[1:]]

        return parts


def current_platform_adapter() -> PlatformAdapter:
    return WindowsAdapter() if os.name == "nt" else PosixAdapter()


def frontend_root() -> Path:
    return Path(__file__).resolve().parents[1]


def print_command(parts: Iterable[str], adapter: PlatformAdapter) -> None:
    print("$", adapter.format_command(parts))


def run(
    parts: list[str],
    cwd: Path,
    adapter: PlatformAdapter,
    extra_env: dict[str, str] | None = None,
) -> None:
    print_command(parts, adapter)
    subprocess.run(
        adapter.resolve_command(parts),
        cwd=str(cwd),
        check=True,
        env=adapter.build_env(extra_env),
    )


def run_capture(parts: list[str], cwd: Path, adapter: PlatformAdapter) -> str:
    result = subprocess.run(
        adapter.resolve_command(parts),
        cwd=str(cwd),
        check=True,
        capture_output=True,
        text=True,
        env=adapter.build_env(),
    )
    return result.stdout.strip()


def check_health(url: str, timeout_seconds: int, interval_seconds: float) -> bool:
    deadline = time.time() + timeout_seconds

    while time.time() < deadline:
        try:
            with urlopen(url, timeout=3) as response:
                body = response.read().decode("utf-8", errors="ignore").strip()
                if response.status == 200:
                    print(f"healthz ok: status=200 body={body!r}")
                    return True
        except URLError:
            pass
        except TimeoutError:
            pass

        time.sleep(interval_seconds)

    return False


def run_validation(project_dir: Path, adapter: PlatformAdapter) -> None:
    run(["pnpm", "typecheck"], project_dir, adapter)
    run(["pnpm", "test"], project_dir, adapter)
    run(["pnpm", "lint"], project_dir, adapter)


def run_frontend_build(project_dir: Path, adapter: PlatformAdapter) -> None:
    run(["pnpm", "build"], project_dir, adapter)


def create_dist_archive(project_dir: Path, output_file: Path) -> None:
    dist_dir = project_dir / "dist"
    if not dist_dir.exists():
        raise FileNotFoundError(f"dist directory not found: {dist_dir}")

    with tarfile.open(output_file, "w:gz") as tar:
        tar.add(dist_dir, arcname="dist")


def github_headers(token: str, extra_headers: dict[str, str] | None = None) -> dict[str, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "User-Agent": "sysfolio-release-script",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if extra_headers:
        headers.update(extra_headers)
    return headers


def github_request(
    url: str,
    token: str,
    method: str = "GET",
    data: bytes | None = None,
    headers: dict[str, str] | None = None,
) -> dict:
    request = Request(
        url,
        data=data,
        method=method,
        headers=github_headers(token, headers),
    )
    with urlopen(request, timeout=30) as response:
        body = response.read().decode("utf-8")
        return json.loads(body) if body else {}


def github_request_optional(
    url: str,
    token: str,
    method: str = "GET",
    data: bytes | None = None,
    headers: dict[str, str] | None = None,
) -> dict | None:
    try:
        return github_request(url, token, method=method, data=data, headers=headers)
    except HTTPError as error:
        if error.code == 404:
            return None
        raise


def ensure_github_release(
    repo: str,
    tag: str,
    token: str,
    title: str,
    body: str,
    target_commitish: str,
) -> dict:
    existing = github_request_optional(
        f"https://api.github.com/repos/{repo}/releases/tags/{tag}",
        token,
    )
    if existing is not None:
        return existing

    payload = json.dumps(
        {
            "tag_name": tag,
            "name": title,
            "body": body,
            "target_commitish": target_commitish,
            "draft": False,
            "prerelease": False,
        }
    ).encode("utf-8")
    return github_request(
        f"https://api.github.com/repos/{repo}/releases",
        token,
        method="POST",
        data=payload,
        headers={"Content-Type": "application/json"},
    )


def delete_existing_asset(repo: str, release: dict, asset_name: str, token: str) -> None:
    for asset in release.get("assets", []):
        if asset.get("name") != asset_name:
            continue

        asset_id = asset.get("id")
        if asset_id is None:
            continue

        github_request(
            f"https://api.github.com/repos/{repo}/releases/assets/{asset_id}",
            token,
            method="DELETE",
        )


def upload_release_asset(repo: str, release: dict, asset_path: Path, token: str) -> dict:
    delete_existing_asset(repo, release, asset_path.name, token)
    upload_url = release["upload_url"].split("{", 1)[0]
    upload_url = f"{upload_url}?{urlencode({'name': asset_path.name})}"
    content_type = mimetypes.guess_type(asset_path.name)[0] or "application/octet-stream"
    data = asset_path.read_bytes()
    return github_request(
        upload_url,
        token,
        method="POST",
        data=data,
        headers={
            "Content-Type": content_type,
            "Accept": "application/vnd.github+json",
        },
    )


def download_release_asset(
    repo: str,
    tag: str,
    token: str,
    asset_name: str,
    output_file: Path,
) -> None:
    release = github_request(
        f"https://api.github.com/repos/{repo}/releases/tags/{tag}",
        token,
    )
    assets = release.get("assets", [])
    asset = next((item for item in assets if item.get("name") == asset_name), None)
    if asset is None:
        raise FileNotFoundError(f"asset not found on release {tag}: {asset_name}")

    download_url = asset["url"]
    request = Request(
        download_url,
        headers=github_headers(
            token,
            {
                "Accept": "application/octet-stream",
            },
        ),
    )
    with urlopen(request, timeout=60) as response:
        output_file.write_bytes(response.read())


def write_remote_nginx_conf(temp_dir: Path) -> Path:
    nginx_conf = temp_dir / "nginx.conf"
    nginx_conf.write_text(
        "\n".join(
            [
                "server {",
                "  listen 80;",
                "  server_name _;",
                "",
                "  root /usr/share/nginx/html;",
                "  index index.html;",
                "",
                "  location / {",
                "    try_files $uri $uri/ /index.html;",
                "  }",
                "",
                "  location /healthz {",
                "    access_log off;",
                '    return 200 "ok\\n";',
                "    add_header Content-Type text/plain;",
                "  }",
                "}",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return nginx_conf


def add_common_validation_flags(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--skip-validate",
        action="store_true",
        help="Skip pnpm typecheck/test/lint before packaging or deploying.",
    )


def add_optional_validation_flag(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Run pnpm typecheck/test/lint before building and uploading.",
    )


def add_dist_archive_flags(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--asset-name",
        default=DIST_ARCHIVE_NAME,
        help=f"Release asset name, default {DIST_ARCHIVE_NAME}.",
    )
    parser.add_argument(
        "--output",
        default="",
        help="Output archive path. Defaults to frontend/dist.tar.gz.",
    )


def resolve_output_archive(project_dir: Path, requested_output: str, asset_name: str) -> Path:
    return Path(requested_output) if requested_output else project_dir / asset_name


def resolve_package_version_tag(project_dir: Path) -> str:
    package_json = project_dir / "package.json"
    if not package_json.exists():
        raise ValueError(f"package.json not found: {package_json}")

    package_data = json.loads(package_json.read_text(encoding="utf-8"))
    version = str(package_data.get("version", "")).strip()
    if version == "":
        raise ValueError("package.json version is empty")

    return version if version.startswith("v") else f"v{version}"


def resolve_release_tag(project_dir: Path, adapter: PlatformAdapter, requested_tag: str) -> str:
    if requested_tag != "":
        return requested_tag

    for env_name in ("RELEASE_TAG", "GITHUB_REF_NAME"):
        value = os.getenv(env_name, "").strip()
        if value != "":
            return value

    try:
        return run_capture(["git", "describe", "--tags", "--exact-match"], project_dir, adapter)
    except subprocess.CalledProcessError:
        pass

    return resolve_package_version_tag(project_dir)


def run_local_release(args: argparse.Namespace) -> int:
    project_dir = frontend_root()
    adapter = current_platform_adapter()
    compose_base = ["docker", "compose", "--project-directory", str(project_dir)]
    published_port = str(args.port) if args.port is not None else os.getenv("APP_PORT", "8080")
    compose_env = {"APP_PORT": published_port}

    if not args.skip_validate:
        run_validation(project_dir, adapter)

    run_frontend_build(project_dir, adapter)

    run(compose_base + ["build"], project_dir, adapter, compose_env)
    run(compose_base + ["up", "-d"], project_dir, adapter, compose_env)
    run(compose_base + ["ps"], project_dir, adapter, compose_env)

    healthz_url = f"http://localhost:{published_port}/healthz"
    if not check_health(healthz_url, timeout_seconds=args.timeout, interval_seconds=1.5):
        print(f"healthz failed: {healthz_url}")
        if args.logs:
            run(compose_base + ["logs", "--tail=120", "web"], project_dir, adapter, compose_env)
        return 1

    print(f"platform: {adapter.name}")
    print(f"app url: http://localhost:{published_port}")

    if args.logs:
        run(compose_base + ["logs", "--tail=80", "web"], project_dir, adapter, compose_env)

    if args.down:
        run(compose_base + ["down"], project_dir, adapter, compose_env)

    return 0


def run_package_dist(args: argparse.Namespace) -> int:
    project_dir = frontend_root()
    adapter = current_platform_adapter()
    output_file = resolve_output_archive(project_dir, args.output, args.asset_name)

    if not args.skip_validate:
        run_validation(project_dir, adapter)

    run_frontend_build(project_dir, adapter)
    create_dist_archive(project_dir, output_file)

    print(f"packaged: {output_file}")
    return 0


def run_github_release(args: argparse.Namespace) -> int:
    project_dir = frontend_root()
    adapter = current_platform_adapter()
    token = args.token or os.getenv("GITHUB_TOKEN", "")
    if token == "":
        print("missing GitHub token: --token or GITHUB_TOKEN")
        return 1
    tag = resolve_release_tag(project_dir, adapter, args.tag)

    output_file = resolve_output_archive(project_dir, args.output, args.asset_name)
    if args.validate:
        run_validation(project_dir, adapter)

    run_frontend_build(project_dir, adapter)
    create_dist_archive(project_dir, output_file)

    release = ensure_github_release(
        repo=args.repo,
        tag=tag,
        token=token,
        title=args.title or tag,
        body=args.body,
        target_commitish=args.target or "main",
    )
    asset = upload_release_asset(args.repo, release, output_file, token)

    print(f"release: {release.get('html_url', '')}")
    print(f"asset: {asset.get('browser_download_url', '')}")
    return 0


def run_remote_release(args: argparse.Namespace) -> int:
    project_dir = frontend_root()
    adapter = current_platform_adapter()
    host = args.host or os.getenv("UBUNTU_HOST", "")
    user = args.user or os.getenv("UBUNTU_USER", "")
    port = str(args.port or os.getenv("UBUNTU_PORT", "22"))
    ssh_key = args.ssh_key or os.getenv("UBUNTU_SSH_KEY", "")
    remote_dir = args.remote_dir or os.getenv("UBUNTU_REMOTE_DIR", "~/apps/sysfolio-frontend")
    app_port = str(args.app_port or os.getenv("APP_PORT", "8080"))
    token = args.token or os.getenv("GITHUB_TOKEN", "")

    if host == "" or user == "":
        print("missing deploy target: --host/--user or UBUNTU_HOST/UBUNTU_USER")
        return 1

    if args.archive == "" and args.release_tag == "":
        print("remote-release requires either --archive or --release-tag")
        return 1

    if args.release_tag != "" and (args.repo == "" or token == ""):
        print("release download requires --repo and --token/GITHUB_TOKEN")
        return 1

    ssh_target = f"{user}@{host}"
    ssh_base = ["ssh", "-p", port]
    scp_base = ["scp", "-P", port]
    if ssh_key != "":
        ssh_base.extend(["-i", ssh_key])
        scp_base.extend(["-i", ssh_key])

    with tempfile.TemporaryDirectory() as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        archive_path = Path(args.archive) if args.archive != "" else temp_dir / args.asset_name
        if args.release_tag != "":
            download_release_asset(
                repo=args.repo,
                tag=args.release_tag,
                token=token,
                asset_name=args.asset_name,
                output_file=archive_path,
            )

        nginx_conf = write_remote_nginx_conf(temp_dir)
        remote_archive = "/tmp/sysfolio-frontend-dist.tar.gz"
        remote_nginx_conf = "/tmp/sysfolio-frontend-nginx.conf"

        run(scp_base + [str(archive_path), f"{ssh_target}:{remote_archive}"], project_dir, adapter)
        run(scp_base + [str(nginx_conf), f"{ssh_target}:{remote_nginx_conf}"], project_dir, adapter)

        remote_script = f"""
set -e
mkdir -p {shlex.quote(remote_dir)}
rm -rf {shlex.quote(remote_dir)}/dist
tar -xzf {shlex.quote(remote_archive)} -C {shlex.quote(remote_dir)}
mv {shlex.quote(remote_nginx_conf)} {shlex.quote(remote_dir)}/nginx.conf
docker pull {shlex.quote(NGINX_IMAGE)}
docker rm -f {shlex.quote(REMOTE_CONTAINER_NAME)} || true
docker run -d \\
  --name {shlex.quote(REMOTE_CONTAINER_NAME)} \\
  --restart unless-stopped \\
  -p {shlex.quote(app_port)}:80 \\
  -v {shlex.quote(remote_dir)}/dist:/usr/share/nginx/html:ro \\
  -v {shlex.quote(remote_dir)}/nginx.conf:/etc/nginx/conf.d/default.conf:ro \\
  {shlex.quote(NGINX_IMAGE)}
docker ps --filter name={shlex.quote(REMOTE_CONTAINER_NAME)}
"""
        run(ssh_base + [ssh_target, remote_script], project_dir, adapter)

    print()
    print("deploy complete")
    print(f"http://{host}:{app_port}")
    print(f"http://{host}:{app_port}/healthz")
    return 0


def add_local_subparser(subparsers: argparse._SubParsersAction) -> None:
    parser = subparsers.add_parser(
        "local-release",
        help="Build dist locally, build the runtime image from dist, run it, and health-check it.",
    )
    parser.add_argument("--port", type=int, default=None, help="Published port, default 8080.")
    parser.add_argument("--down", action="store_true", help="Run docker compose down at the end.")
    parser.add_argument("--logs", action="store_true", help="Print docker compose logs after startup.")
    parser.add_argument(
        "--timeout",
        type=int,
        default=60,
        help="Health check timeout in seconds, default 60.",
    )
    add_common_validation_flags(parser)
    parser.set_defaults(handler=run_local_release)


def add_package_subparser(subparsers: argparse._SubParsersAction) -> None:
    parser = subparsers.add_parser(
        "package-dist",
        help="Run validation, build dist/, and package it as dist.tar.gz.",
    )
    add_common_validation_flags(parser)
    add_dist_archive_flags(parser)
    parser.set_defaults(handler=run_package_dist)


def add_github_release_subparser(subparsers: argparse._SubParsersAction) -> None:
    parser = subparsers.add_parser(
        "github-release",
        help="Build dist.tar.gz locally and upload it to a GitHub Release.",
    )
    parser.add_argument(
        "--repo",
        default=DEFAULT_REPO,
        help=f"GitHub repo in owner/name format, default {DEFAULT_REPO}.",
    )
    parser.add_argument(
        "--tag",
        default="",
        help="Release tag name. If omitted, use RELEASE_TAG / GITHUB_REF_NAME / current git tag.",
    )
    parser.add_argument("--title", default="", help="Release title, defaults to the tag.")
    parser.add_argument("--body", default="", help="Release notes body.")
    parser.add_argument("--target", default="", help="Target branch or commit, defaults to main.")
    parser.add_argument("--token", default="", help="GitHub token, or use GITHUB_TOKEN.")
    add_optional_validation_flag(parser)
    add_dist_archive_flags(parser)
    parser.set_defaults(handler=run_github_release)


def add_remote_subparser(subparsers: argparse._SubParsersAction) -> None:
    parser = subparsers.add_parser(
        "remote-release",
        help="Deploy a prebuilt dist.tar.gz to a remote host without building on the server.",
    )
    parser.add_argument("--host", default="", help="Remote host, or use UBUNTU_HOST.")
    parser.add_argument("--user", default="", help="Remote user, or use UBUNTU_USER.")
    parser.add_argument("--port", default="", help="Remote SSH port, default 22.")
    parser.add_argument("--ssh-key", default="", help="SSH private key path, or use UBUNTU_SSH_KEY.")
    parser.add_argument(
        "--remote-dir",
        default="",
        help="Remote deployment directory, or use UBUNTU_REMOTE_DIR.",
    )
    parser.add_argument(
        "--app-port",
        default="",
        help="Published port on the remote host, default 8080.",
    )
    parser.add_argument(
        "--archive",
        default="",
        help="Local dist.tar.gz path to upload. If omitted, use --release-tag.",
    )
    parser.add_argument(
        "--release-tag",
        default="",
        help="GitHub Release tag to download before deployment.",
    )
    parser.add_argument("--repo", default="", help="GitHub repo in owner/name format.")
    parser.add_argument("--token", default="", help="GitHub token, or use GITHUB_TOKEN.")
    parser.add_argument(
        "--asset-name",
        default=DIST_ARCHIVE_NAME,
        help=f"Release asset name, default {DIST_ARCHIVE_NAME}.",
    )
    parser.set_defaults(handler=run_remote_release)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Cross-platform release helpers for packaging and deploying the frontend."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    add_local_subparser(subparsers)
    add_package_subparser(subparsers)
    add_github_release_subparser(subparsers)
    add_remote_subparser(subparsers)

    args = parser.parse_args()
    return args.handler(args)


if __name__ == "__main__":
    sys.exit(main())
