# Theme Mapping

> **本文档**：light/dark、token 与组件职责、语义色映射。  
> **相关**：[文档索引](./README.md) · [样式体系](./styling-system.md)

## Goal

- 支持 light / dark 双主题
- 主题切换只变 token，不变组件结构
- 组件层不直接写死浅色或深色色值

## Mapping Rules

- 原始变量统一用 `--sys-*`
- 组件层只消费语义 token 或组件别名变量
- `ThemeToggle` 只切换根节点主题标识

## Data Rules

- 主题偏好通过统一偏好层读取和写入
- 业务层不直接调用浏览器存储
- 主题值用字符串枚举表达，不用 `Date`、`Map` 等复杂对象

## 0.5 Scope

- 支持 light / dark
- 支持跨会话恢复
- 只考虑文件系统视图下的主题一致性
