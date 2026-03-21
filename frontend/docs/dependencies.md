# Dependencies

## Tooling

- 包管理器：`pnpm`
- 构建：Vite
- 样式处理：PostCSS + `postcss-apply`

## Third-party

- React / React DOM
- React Router
- Zustand
- `clsx`
- TanStack Virtual
- TypeScript
- PostCSS + `postcss-apply`
- ESLint / Vitest / Testing Library
- `zod`

## Zod Boundary Rule

- `zod` 只允许出现在边界层：
  - native API
  - 网络返回
  - 浏览器 API
  - storage / URL / 外部输入适配层
- 业务模型、feature、store、renderer 不直接依赖 `zod`

## Second-party

- `shared/ui`
  - tokens、atomic、molecular、primitives
- `shared/data`
  - repository、mock fixtures、generator、偏好层 adapter
- `shared/lib`
  - tree、path、theme、progress、资源状态等纯 TS 能力
