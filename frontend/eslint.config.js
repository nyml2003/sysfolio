import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
// 新增：导入 prettier 相关插件
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "eslint.config.js",
      "postcss.config.cjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // 1. 先禁用 ESLint 冲突规则
  eslintConfigPrettier,
  // 2. 集成 Prettier 插件（让 ESLint 处理格式问题）
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // 开启 Prettier 规则（把格式问题转为 ESLint 报错/警告）
      "prettier/prettier": ["error", {
        // 这里直接写 Prettier 配置（不用单独建 .prettierrc 了）
        tabWidth: 2,
        useTabs: false,
        printWidth: 100, // 换行：单行超过100字符自动换行
        trailingComma: "es5",
        endOfLine: "lf",
        semi: true,
        singleQuote: true,
        jsxBracketSameLine: false,
      }],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
    },
  },
  {
    files: ["tests/**/*.ts", "playwright.config.ts"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
    },
  },
);
