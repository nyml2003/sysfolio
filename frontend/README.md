# SysFolio Frontend

前端实现采用 React + TypeScript + Vite，围绕 `home` 与 `article` 两类内容文件构建统一的文件系统式阅读体验。

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm lint` / `pnpm typecheck`
- `pnpm test` / `pnpm test:coverage`（纯 TS 模块覆盖率阈值见 `vite.config.ts` 与 `docs/testing-strategy.md`）
- `pnpm test:e2e`（Playwright，默认使用移动端视口跑 `tests/e2e`）
- `python scripts/release.py local-release`
- `python scripts/release.py package-dist`
- `python scripts/release.py github-release`
- `python scripts/release.py remote-release`

## Structure

- `src/app`: 入口、路由、页面壳
- `src/entities`: 内容领域类型与 schema
- `src/features`: 文件树、阅读区、右栏、路径栏、引导层等功能切片
- `src/shared`: 样式体系、数据层、store、纯 TS 工具
- `docs`: 前端实现规范与 mock 约束

## Release Flow

本仓库已经提供一套基于 Python 标准库的跨平台发布脚本：

- 本地先构建 `dist/`，再把静态产物复制进 Docker 镜像并验收：
  - `python scripts/release.py local-release`
- 本地构建并打包 `dist.tar.gz`：
  - `python scripts/release.py package-dist`
- 本地构建并上传 GitHub Release 资产：
  - `python scripts/release.py github-release --tag <tag>`
  - 或直接：`python scripts/release.py github-release`
    脚本会优先用当前 git tag；如果没有，再回退到 `package.json` 的 `version` 并生成 `v{version}`
  - 如果要在上传前补跑 `typecheck/test/lint`：`python scripts/release.py github-release --validate`
- 远端无构建部署（上传本地归档）：
  - `python scripts/release.py remote-release --host <host> --user <user> --archive dist.tar.gz`
- 远端无构建部署（直接下载 GitHub Release 资产）：
  - `python scripts/release.py remote-release --host <host> --user <user> --repo <owner/name> --release-tag <tag>`
- 指定本地端口：
  - `python scripts/release.py local-release --port 8080`
- 跳过校验直接拉起：
  - `python scripts/release.py local-release --skip-validate`

GitHub Release / 远端部署支持环境变量：

- `GITHUB_TOKEN`
- `UBUNTU_HOST`
- `UBUNTU_USER`
- `UBUNTU_PORT`
- `UBUNTU_REMOTE_DIR`
- `UBUNTU_SSH_KEY`
- `APP_PORT`
