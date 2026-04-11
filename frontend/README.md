# SysFolio Frontend

前端实现采用 React + TypeScript + Vite，围绕 `home` 与 `article` 两类内容文件构建统一的文件系统式阅读体验。

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm lint` / `pnpm typecheck`
- `pnpm test` / `pnpm test:coverage`（纯 TS 模块覆盖率阈值见 `vite.config.ts` 与 `docs/testing-strategy.md`）
- `pnpm test:e2e`（Playwright，默认使用移动端视口跑 `tests/e2e`）
- `python scripts/release.py build`
- `python scripts/release.py upload`
- `python scripts/release.py deploy`

## Structure

- `src/app`: 入口、路由、页面壳
- `src/entities`: 内容领域类型与 schema
- `src/features`: 文件树、阅读区、右栏、路径栏、引导层等功能切片
- `src/shared`: 样式体系、数据层、store、纯 TS 工具
- `docs`: 前端实现规范与 mock 约束

## Release Flow

本仓库已经提供一套基于 Python 标准库的跨平台发布脚本：

- 校验并构建发布归档：
  - `python scripts/release.py build`
  - 默认输出 `frontend/dist.tar.gz`
  - 跳过校验：`python scripts/release.py build --skip-validate`
- 上传已构建归档到 GitHub Release：
  - `python scripts/release.py upload --tag <tag>`
  - 或直接：`python scripts/release.py upload`
    脚本会优先用当前 git tag；如果没有，再回退到 `package.json` 的 `version` 并生成 `v{version}`
  - 指定上传文件：`python scripts/release.py upload --archive dist.tar.gz --tag <tag>`
- 部署到当前机器：
  - 从本地归档部署：`python scripts/release.py deploy --archive dist.tar.gz`
  - 从 GitHub Release 部署：`python scripts/release.py deploy --repo <owner/name>`
  - 省略 `--release-tag` 时，脚本会调用 GitHub `releases/latest` 并部署最新 Release
  - 如需指定版本：`python scripts/release.py deploy --repo <owner/name> --release-tag <tag>`
  - 指定端口：`python scripts/release.py deploy --port 8080`
  - 默认部署目录是 `~/apps/sysfolio-frontend`，其中会生成 `dist/` 和 `nginx.conf`

GitHub Release / 本机部署支持环境变量：

- `GITHUB_TOKEN`
- `APP_PORT`
- `SYSFOLIO_RUNTIME_IMAGE`
