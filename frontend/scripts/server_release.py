import argparse
import json
import os
import shlex
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time
from pathlib import Path
from shutil import which
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


DEFAULT_REPO = "nyml2003/sysfolio"
DEFAULT_ASSET_NAME = "dist.tar.gz"
DEFAULT_DEPLOY_DIR = "~/apps/sysfolio-frontend"
DEFAULT_CONTAINER_NAME = "sysfolio-frontend"
DEFAULT_IMAGE = "nginx:1.27-alpine"


def print_command(parts: list[str]) -> None:
    print("$", " ".join(shlex.quote(part) for part in parts))


def resolve_command(parts: list[str]) -> list[str]:
    if not parts:
        raise ValueError("command must not be empty")

    executable = which(parts[0])
    return [executable, *parts[1:]] if executable is not None else parts


def run(parts: list[str], cwd: Path | None = None, env: dict[str, str] | None = None) -> None:
    print_command(parts)
    subprocess.run(
        resolve_command(parts),
        cwd=None if cwd is None else str(cwd),
        check=True,
        env=env,
    )


def github_headers(token: str) -> dict[str, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "sysfolio-server-release",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token != "":
        headers["Authorization"] = f"Bearer {token}"
    return headers


def github_request(url: str, token: str) -> dict:
    request = Request(url, headers=github_headers(token))
    with urlopen(request, timeout=30) as response:
        body = response.read().decode("utf-8")
        return json.loads(body) if body else {}


def get_release(repo: str, tag: str, token: str) -> dict:
    if tag == "":
        return github_request(f"https://api.github.com/repos/{repo}/releases/latest", token)

    return github_request(f"https://api.github.com/repos/{repo}/releases/tags/{tag}", token)


def download_release_asset(repo: str, release: dict, asset_name: str, token: str, output: Path) -> None:
    assets = release.get("assets", [])
    asset = next((item for item in assets if item.get("name") == asset_name), None)
    if asset is None:
        release_name = release.get("tag_name", "<unknown>")
        raise FileNotFoundError(f"asset not found on release {release_name}: {asset_name}")

    request = Request(
        asset["url"],
        headers={
            **github_headers(token),
            "Accept": "application/octet-stream",
        },
    )
    with urlopen(request, timeout=60) as response:
        output.write_bytes(response.read())


def write_nginx_conf(output: Path) -> None:
    output.write_text(
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


def expand_remote_dir(remote_dir: str) -> Path:
    return Path(remote_dir).expanduser()


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


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Deploy a dist.tar.gz GitHub Release asset on the current machine without building."
    )
    parser.add_argument(
        "--repo",
        default=DEFAULT_REPO,
        help=f"GitHub repo in owner/name format, default {DEFAULT_REPO}.",
    )
    parser.add_argument(
        "--release-tag",
        default="",
        help="Release tag to deploy. Omit to use the latest release.",
    )
    parser.add_argument(
        "--asset-name",
        default=DEFAULT_ASSET_NAME,
        help=f"Release asset name, default {DEFAULT_ASSET_NAME}.",
    )
    parser.add_argument(
        "--deploy-dir",
        default=DEFAULT_DEPLOY_DIR,
        help=f"Deployment directory, default {DEFAULT_DEPLOY_DIR}.",
    )
    parser.add_argument(
        "--container-name",
        default=DEFAULT_CONTAINER_NAME,
        help=f"Docker container name, default {DEFAULT_CONTAINER_NAME}.",
    )
    parser.add_argument(
        "--image",
        default=DEFAULT_IMAGE,
        help=f"Nginx image, default {DEFAULT_IMAGE}.",
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
        help="Keep the downloaded release archive in the deploy directory.",
    )
    args = parser.parse_args()

    deploy_dir = expand_remote_dir(args.deploy_dir)
    deploy_dir.mkdir(parents=True, exist_ok=True)

    release = get_release(args.repo, args.release_tag, args.token)
    release_tag = release.get("tag_name", "")
    if release_tag == "":
        print("failed to resolve release tag")
        return 1

    with tempfile.TemporaryDirectory() as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        archive_path = temp_dir / args.asset_name
        nginx_conf = temp_dir / "nginx.conf"

        download_release_asset(args.repo, release, args.asset_name, args.token, archive_path)
        write_nginx_conf(nginx_conf)

        dist_dir = deploy_dir / "dist"
        if dist_dir.exists():
            shutil.rmtree(dist_dir)

        with tarfile.open(archive_path, "r:gz") as tar:
            tar.extractall(deploy_dir)

        final_nginx_conf = deploy_dir / "nginx.conf"
        final_nginx_conf.write_text(nginx_conf.read_text(encoding="utf-8"), encoding="utf-8")

        if args.keep_archive:
            final_archive = deploy_dir / args.asset_name
            final_archive.write_bytes(archive_path.read_bytes())

    run(["docker", "pull", args.image])
    subprocess.run(resolve_command(["docker", "rm", "-f", args.container_name]), check=False)
    run(
        [
            "docker",
            "run",
            "-d",
            "--name",
            args.container_name,
            "--restart",
            "unless-stopped",
            "-p",
            f"{args.port}:80",
            "-v",
            f"{dist_dir}:/usr/share/nginx/html:ro",
            "-v",
            f"{deploy_dir / 'nginx.conf'}:/etc/nginx/conf.d/default.conf:ro",
            args.image,
        ]
    )

    healthz_url = f"http://localhost:{args.port}/healthz"
    if not check_health(healthz_url, timeout_seconds=args.timeout, interval_seconds=1.5):
        print(f"healthz failed: {healthz_url}")
        return 1

    print(f"release tag: {release_tag}")
    print(f"app url: http://localhost:{args.port}")
    print(f"healthz: {healthz_url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
