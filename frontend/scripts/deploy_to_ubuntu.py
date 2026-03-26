import os
import shlex
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path


EXCLUDES = {
    "node_modules",
    "dist",
    ".git",
    ".cursor",
    "coverage",
    "vitest-report",
}


def run(cmd: list[str]) -> None:
    print("$", " ".join(shlex.quote(part) for part in cmd))
    subprocess.run(cmd, check=True)


def should_include(path: Path, project_root: Path) -> bool:
    rel = path.relative_to(project_root)
    parts = set(rel.parts)
    return not bool(parts & EXCLUDES)


def create_archive(project_root: Path, output_file: Path) -> None:
    with tarfile.open(output_file, "w:gz") as tar:
        for path in project_root.rglob("*"):
            if not should_include(path, project_root):
                continue
            rel = path.relative_to(project_root)
            tar.add(path, arcname=rel.as_posix())


def main() -> int:
    project_root = Path(__file__).resolve().parents[1]

    host = os.getenv("UBUNTU_HOST")
    user = os.getenv("UBUNTU_USER")
    port = os.getenv("UBUNTU_PORT", "22")
    remote_dir = os.getenv("UBUNTU_REMOTE_DIR", "~/apps/sysfolio-frontend")
    ssh_key = os.getenv("UBUNTU_SSH_KEY", "")

    if not host or not user:
        print("缺少环境变量: UBUNTU_HOST / UBUNTU_USER")
        return 1

    ssh_target = f"{user}@{host}"
    ssh_base = ["ssh", "-p", port]
    scp_base = ["scp", "-P", port]
    if ssh_key:
        ssh_base.extend(["-i", ssh_key])
        scp_base.extend(["-i", ssh_key])

    with tempfile.TemporaryDirectory() as temp_dir:
        archive = Path(temp_dir) / "frontend.tar.gz"
        create_archive(project_root, archive)

        remote_archive = "/tmp/sysfolio-frontend.tar.gz"
        run(scp_base + [str(archive), f"{ssh_target}:{remote_archive}"])

        remote_cmd = f"""
set -e
mkdir -p {shlex.quote(remote_dir)}
tar -xzf {shlex.quote(remote_archive)} -C {shlex.quote(remote_dir)}
cd {shlex.quote(remote_dir)}
docker compose down --remove-orphans || true
docker compose up -d --build
docker compose ps
"""
        run(ssh_base + [ssh_target, remote_cmd])

        print()
        print("部署完成，可访问:")
        print(f"http://{host}:{os.getenv('APP_PORT', '8080')}")
        print(f"http://{host}:{os.getenv('APP_PORT', '8080')}/healthz")

    return 0


if __name__ == "__main__":
    sys.exit(main())
