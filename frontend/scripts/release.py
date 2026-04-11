import argparse
import json
import mimetypes
import os
import shlex
import shutil
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
DEFAULT_REPO = "nyml2003/sysfolio"
DEFAULT_DEPLOY_DIR = "~/apps/sysfolio-frontend"
DEFAULT_CONTAINER_NAME = "sysfolio-frontend"
DEFAULT_IMAGE = "m.daocloud.io/docker.io/library/nginx:1.27-alpine"


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
        except (OSError, TimeoutError, URLError):
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
        "User-Agent": "sysfolio-release-script",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token != "":
        headers["Authorization"] = f"Bearer {token}"
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


def get_github_release(repo: str, tag: str, token: str) -> dict:
    if tag == "":
        return github_request(f"https://api.github.com/repos/{repo}/releases/latest", token)

    return github_request(f"https://api.github.com/repos/{repo}/releases/tags/{tag}", token)


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


def download_release_asset(release: dict, asset_name: str, token: str, output_file: Path) -> None:
    assets = release.get("assets", [])
    asset = next((item for item in assets if item.get("name") == asset_name), None)
    if asset is None:
        release_name = release.get("tag_name", "<unknown>")
        raise FileNotFoundError(f"asset not found on release {release_name}: {asset_name}")

    request = Request(
        asset["url"],
        headers=github_headers(
            token,
            {
                "Accept": "application/octet-stream",
            },
        ),
    )
    with urlopen(request, timeout=60) as response:
        output_file.write_bytes(response.read())


def write_runtime_nginx_conf(output_file: Path) -> None:
    output_file.write_text(
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


def add_common_validation_flags(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--skip-validate",
        action="store_true",
        help="Skip pnpm typecheck/test/lint before packaging or deploying.",
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


def resolve_input_archive(project_dir: Path, requested_archive: str, asset_name: str) -> Path:
    return Path(requested_archive) if requested_archive else project_dir / asset_name


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


def expand_deploy_dir(deploy_dir: str) -> Path:
    resolved = Path(deploy_dir).expanduser()
    if resolved.is_absolute():
        return resolved
    return frontend_root() / resolved


def resolve_runtime_image(requested_image: str) -> str:
    env_image = os.getenv("SYSFOLIO_RUNTIME_IMAGE", "").strip()
    return requested_image or env_image or DEFAULT_IMAGE


def remove_container(project_dir: Path, adapter: PlatformAdapter, container_name: str) -> None:
    subprocess.run(
        adapter.resolve_command(["docker", "rm", "-f", container_name]),
        cwd=str(project_dir),
        check=False,
        env=adapter.build_env(),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def print_container_logs(
    project_dir: Path,
    adapter: PlatformAdapter,
    container_name: str,
    tail_lines: int,
) -> None:
    run(["docker", "logs", f"--tail={tail_lines}", container_name], project_dir, adapter)


def stage_runtime_files(
    archive_path: Path,
    deploy_dir: Path,
    asset_name: str,
    keep_archive: bool,
) -> None:
    archive_path = archive_path.resolve()
    deploy_dir.mkdir(parents=True, exist_ok=True)
    dist_dir = deploy_dir / "dist"
    if dist_dir.exists():
        shutil.rmtree(dist_dir)

    with tarfile.open(archive_path, "r:gz") as tar:
        tar.extractall(deploy_dir)

    write_runtime_nginx_conf(deploy_dir / "nginx.conf")

    final_archive = (deploy_dir / asset_name).resolve()
    if keep_archive and final_archive != archive_path:
        shutil.copyfile(archive_path, final_archive)
    elif not keep_archive and final_archive.exists() and final_archive != archive_path:
        final_archive.unlink()


def run_runtime_container(
    project_dir: Path,
    adapter: PlatformAdapter,
    deploy_dir: Path,
    container_name: str,
    image: str,
    port: int,
) -> None:
    run(["docker", "pull", image], project_dir, adapter)
    remove_container(project_dir, adapter, container_name)
    run(
        [
            "docker",
            "run",
            "-d",
            "--name",
            container_name,
            "--restart",
            "unless-stopped",
            "-p",
            f"{port}:80",
            "-v",
            f"{deploy_dir / 'dist'}:/usr/share/nginx/html:ro",
            "-v",
            f"{deploy_dir / 'nginx.conf'}:/etc/nginx/conf.d/default.conf:ro",
            image,
        ],
        project_dir,
        adapter,
    )


def run_build(args: argparse.Namespace) -> int:
    project_dir = frontend_root()
    adapter = current_platform_adapter()
    output_file = resolve_output_archive(project_dir, args.output, args.asset_name)

    if not args.skip_validate:
        run_validation(project_dir, adapter)

    run_frontend_build(project_dir, adapter)
    create_dist_archive(project_dir, output_file)

    print(f"packaged: {output_file}")
    return 0


def run_upload(args: argparse.Namespace) -> int:
    project_dir = frontend_root()
    adapter = current_platform_adapter()
    token = args.token or os.getenv("GITHUB_TOKEN", "")
    if token == "":
        print("missing GitHub token: --token or GITHUB_TOKEN")
        return 1

    tag = resolve_release_tag(project_dir, adapter, args.tag)
    archive_path = resolve_input_archive(project_dir, args.archive, args.asset_name)
    if not archive_path.exists():
        print(f"archive not found: {archive_path}")
        return 1

    release = ensure_github_release(
        repo=args.repo,
        tag=tag,
        token=token,
        title=args.title or tag,
        body=args.body,
        target_commitish=args.target or "main",
    )
    asset = upload_release_asset(args.repo, release, archive_path, token)

    print(f"release: {release.get('html_url', '')}")
    print(f"asset: {asset.get('browser_download_url', '')}")
    return 0


def run_deploy(args: argparse.Namespace) -> int:
    project_dir = frontend_root()
    adapter = current_platform_adapter()
    deploy_dir = expand_deploy_dir(args.deploy_dir)
    image = resolve_runtime_image(args.image)
    release_tag = ""

    with tempfile.TemporaryDirectory() as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        if args.archive != "":
            archive_path = Path(args.archive)
            if not archive_path.exists():
                print(f"archive not found: {archive_path}")
                return 1
        else:
            archive_path = temp_dir / args.asset_name
            release = get_github_release(args.repo, args.release_tag, args.token)
            release_tag = str(release.get("tag_name", ""))
            if release_tag == "":
                print("failed to resolve release tag")
                return 1
            download_release_asset(release, args.asset_name, args.token, archive_path)
        stage_runtime_files(archive_path, deploy_dir, args.asset_name, args.keep_archive)

    run_runtime_container(
        project_dir=project_dir,
        adapter=adapter,
        deploy_dir=deploy_dir,
        container_name=args.container_name,
        image=image,
        port=args.port,
    )

    healthz_url = f"http://localhost:{args.port}/healthz"
    if not check_health(healthz_url, timeout_seconds=args.timeout, interval_seconds=1.5):
        print(f"healthz failed: {healthz_url}")
        if args.logs:
            print_container_logs(project_dir, adapter, args.container_name, 120)
        if args.down:
            remove_container(project_dir, adapter, args.container_name)
        return 1

    if release_tag != "":
        print(f"release tag: {release_tag}")
    else:
        print(f"archive: {Path(args.archive)}")
    print(f"app url: http://localhost:{args.port}")
    print(f"healthz: {healthz_url}")
    print(f"deploy dir: {deploy_dir}")
    print(f"image: {image}")

    if args.logs:
        print_container_logs(project_dir, adapter, args.container_name, 80)

    if args.down:
        remove_container(project_dir, adapter, args.container_name)

    return 0


def add_build_subparser(subparsers: argparse._SubParsersAction) -> None:
    parser = subparsers.add_parser(
        "build",
        help="Validate, build dist/, and package it as a release archive.",
    )
    add_common_validation_flags(parser)
    add_dist_archive_flags(parser)
    parser.set_defaults(handler=run_build)


def add_upload_subparser(subparsers: argparse._SubParsersAction) -> None:
    parser = subparsers.add_parser(
        "upload",
        help="Upload a prebuilt release archive to a GitHub Release.",
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
    parser.add_argument(
        "--archive",
        default="",
        help="Local archive path to upload. Defaults to frontend/dist.tar.gz or the selected asset name.",
    )
    parser.add_argument(
        "--asset-name",
        default=DIST_ARCHIVE_NAME,
        help=f"Release asset name, default {DIST_ARCHIVE_NAME}.",
    )
    parser.set_defaults(handler=run_upload)


def add_deploy_subparser(subparsers: argparse._SubParsersAction) -> None:
    parser = subparsers.add_parser(
        "deploy",
        help="Deploy a release archive to the current machine from a local file or GitHub Release.",
    )
    parser.add_argument(
        "--repo",
        default=DEFAULT_REPO,
        help=f"GitHub repo in owner/name format, default {DEFAULT_REPO}. Ignored when --archive is set.",
    )
    parser.add_argument(
        "--release-tag",
        default="",
        help="Release tag to deploy. Omit to use the latest release when --archive is not set.",
    )
    parser.add_argument(
        "--archive",
        default="",
        help="Local archive path to deploy. If omitted, deploy from GitHub Release.",
    )
    parser.add_argument(
        "--asset-name",
        default=DIST_ARCHIVE_NAME,
        help=f"Release asset name, default {DIST_ARCHIVE_NAME}. Used for GitHub download and kept archive naming.",
    )
    parser.add_argument(
        "--deploy-dir",
        default=DEFAULT_DEPLOY_DIR,
        help=f"Deployment directory on the current machine, default {DEFAULT_DEPLOY_DIR}.",
    )
    parser.add_argument(
        "--container-name",
        default=DEFAULT_CONTAINER_NAME,
        help=f"Docker container name, default {DEFAULT_CONTAINER_NAME}.",
    )
    parser.add_argument(
        "--image",
        default="",
        help=f"Runtime image, default {DEFAULT_IMAGE}, or use SYSFOLIO_RUNTIME_IMAGE.",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("APP_PORT", "8080")),
        help="Published HTTP port, default 8080.",
    )
    parser.add_argument(
        "--token",
        default=os.getenv("GITHUB_TOKEN", ""),
        help="Optional GitHub token. Recommended to avoid rate limits.",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=60,
        help="Health check timeout seconds, default 60.",
    )
    parser.add_argument(
        "--keep-archive",
        action="store_true",
        help="Keep the deployed archive in the deploy directory.",
    )
    parser.add_argument("--logs", action="store_true", help="Print container logs after startup.")
    parser.add_argument("--down", action="store_true", help="Remove the runtime container at the end.")
    parser.set_defaults(handler=run_deploy)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Cross-platform release helpers for packaging and deploying the frontend."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    add_build_subparser(subparsers)
    add_upload_subparser(subparsers)
    add_deploy_subparser(subparsers)

    args = parser.parse_args(argv)
    return args.handler(args)


if __name__ == "__main__":
    sys.exit(main())
