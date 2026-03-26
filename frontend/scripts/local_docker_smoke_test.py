import argparse
import subprocess
import sys
import time
from urllib.error import URLError
from urllib.request import urlopen


def run(cmd: list[str]) -> None:
    print("$", " ".join(cmd))
    subprocess.run(cmd, check=True)


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
    parser = argparse.ArgumentParser(description="Local Docker smoke test for frontend.")
    parser.add_argument("--port", default="8080", help="Published local port (default: 8080)")
    parser.add_argument(
        "--project-dir",
        default=".",
        help="Directory containing docker-compose.yml (default: current directory)",
    )
    parser.add_argument(
        "--no-build",
        action="store_true",
        help="Skip docker compose build step",
    )
    parser.add_argument(
        "--down",
        action="store_true",
        help="Run docker compose down at the end",
    )
    parser.add_argument(
        "--logs",
        action="store_true",
        help="Print `docker compose logs --tail=80 web` after startup",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=60,
        help="Health check timeout seconds (default: 60)",
    )
    args = parser.parse_args()

    compose_base = ["docker", "compose", "--project-directory", args.project_dir]

    if not args.no_build:
        run(compose_base + ["build"])

    run(compose_base + ["up", "-d"])
    run(compose_base + ["ps"])

    healthz_url = f"http://localhost:{args.port}/healthz"
    if not check_health(healthz_url, timeout_seconds=args.timeout, interval_seconds=1.5):
        print(f"healthz failed: {healthz_url}")
        if args.logs:
            run(compose_base + ["logs", "--tail=120", "web"])
        return 1

    print(f"app url: http://localhost:{args.port}")

    if args.logs:
        run(compose_base + ["logs", "--tail=80", "web"])

    if args.down:
        run(compose_base + ["down"])

    return 0


if __name__ == "__main__":
    sys.exit(main())
