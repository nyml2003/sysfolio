# Ubuntu Docker 部署快速测试

## 1. Ubuntu 先决条件

- 已安装 Docker Engine + Docker Compose Plugin
- 当前登录用户可执行 `docker compose`（必要时加入 `docker` 组）
- 防火墙放行你要映射的端口（默认 `8080`）

## 2. 本机设置环境变量（PowerShell）

```powershell
$env:UBUNTU_HOST = "your.server.ip"
$env:UBUNTU_USER = "ubuntu"
$env:UBUNTU_PORT = "22"
$env:UBUNTU_REMOTE_DIR = "~/apps/sysfolio-frontend"
# 可选：私钥路径
$env:UBUNTU_SSH_KEY = "C:\Users\you\.ssh\id_rsa"
# 可选：映射端口（默认 8080）
$env:APP_PORT = "8080"
```

## 3. 执行部署

在 `frontend` 目录运行：

```powershell
python .\scripts\deploy_to_ubuntu.py
```

## 4. 验证

- 首页：`http://<UBUNTU_HOST>:<APP_PORT>`
- 健康检查：`http://<UBUNTU_HOST>:<APP_PORT>/healthz`

## 5. Ubuntu 侧常用命令

```bash
cd ~/apps/sysfolio-frontend
docker compose ps
docker compose logs -f web
docker compose restart web
```

## 6. 本地 Win11 快速烟测

在 `frontend` 目录：

```powershell
python .\scripts\local_docker_smoke_test.py --logs
```

常用参数：

- `--down`：测试完成后自动 `docker compose down`
- `--no-build`：跳过 build（只测 up）
- `--port 8080`：指定本地端口（需与 compose 端口一致）
