# SysFolio Frontend

前端实现采用 React + TypeScript + Vite，围绕 `home` 与 `article` 两类内容文件构建统一的文件系统式阅读体验。

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run typecheck`
- `npm run test`

## Structure

- `src/app`: 入口、路由、页面壳
- `src/entities`: 内容领域类型与 schema
- `src/features`: 文件树、阅读区、右栏、路径栏、引导层等功能切片
- `src/shared`: 样式体系、数据层、store、纯 TS 工具
- `docs`: 前端实现规范与 mock 约束
