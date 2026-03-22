# SysFolio Preference System Research Report

研究日期：2026-03-22  
研究范围：官方设计系统、平台能力、成熟产品的偏好设置实践  
研究目的：判断 SysFolio 当前 preference system 还缺哪些关键能力，并给出可落地的优先级建议

## 一、结论摘要

当前 SysFolio 已经补上的 preference system，只覆盖了第一层：

- `themeMode`
- `uiDensity`
- `motionMode`
- `leftRailPref`
- `tocPref`
- `contextPanelPref`

这还不够。

结合 2026-03-22 调研到的业界实践，当前还缺的能力主要有 5 类：

1. `accessibility preferences`
   重点缺 `contrast preference / forced-colors support / text scale or zoom / reduced transparency`。
2. `reading preferences`
   重点缺 `content width / code wrap / TOC expand depth / sticky aids` 这类阅读与导航细偏好。
3. `interaction preferences`
   重点缺 `keyboard shortcut mode / hover-preview opt-out / link underline` 这类可发现性与误触控制。
4. `scope and persistence model`
   重点缺“全局、workspace、document 三级作用域”和清晰的 precedence / sync 策略。
5. `profiles and sharing`
   重点缺“偏好组合成 profile”的能力，尤其适合阅读模式、浏览模式、演示模式。

如果只给一个最短答案：

`SysFolio 现在有 appearance / density / panel defaults，但还没有 accessibility、reading、scope、profile 四个关键层。`

## 二、当前 SysFolio 方案的现状

当前已定义的 preference system 更像：

- 外观偏好：`themeMode`
- 全局密度偏好：`uiDensity`
- 动效偏好：`motionMode`
- 面板默认行为：`leftRailPref / tocPref / contextPanelPref`

当前优点：

- 已经把 preference 和 capability、view state 分开了
- 已经知道 panel preference 只能影响默认行为，不能覆盖当前环境能力
- 已经有 `raw preference -> resolved mode` 的意识

当前缺口：

- 偏好还主要停留在 shell 和 appearance，没进入 accessibility 与 reading
- 没有 scope 模型
- 没有 sync / profile / share 模型
- 没有“系统偏好优先于产品偏好”的完整矩阵，只是原则级表述

## 三、业界实践观察

## 1. 平台层：偏好首先来自 OS / UA

Web 平台和系统层已经把“用户偏好”做成正式输入，而不是产品自定义开关。

当前最成熟的几类是：

- `prefers-color-scheme`
- `prefers-reduced-motion`
- `prefers-contrast`
- `forced-colors`
- `color-scheme`

另外还有两类值得关注，但目前不适合作为主能力：

- `prefers-reduced-transparency`
- `prefers-reduced-data`

设计含义很明确：

1. preference system 不能只围绕产品自定义开关设计，必须先接 OS / browser signals。
2. theme 不只是 light / dark，还要考虑 `contrast` 与 `forced colors`。
3. motion 不只是 `full / reduced`，还要明确 OS 已要求 reduced 时，产品不能反向覆盖。

对 SysFolio 的直接影响：

- 现在必须新增 `contrastPref` 和 `forcedColorsSupport`。
- 如果以后要用 blur / translucent panel，必须预留 `reduced transparency` 分支。

## 2. 设计系统层：token 与 theme 是 preference 的承接层

Fluent、Atlassian、Carbon 的共同做法很稳定：

- preference 不直接改单个组件值
- 先进入 token / theme 层
- 再由组件消费 resolved tokens

共同特征：

- 用 token 区分 `global/raw` 和 `alias/semantic`
- 用 theme 切换 light / dark / high contrast
- motion、spacing、elevation 也应能进入 token 系统，而不是写死在组件里

这意味着：

- SysFolio 当前把 preference system 写在总览和专题规范里是对的
- 但下一步必须继续下沉到 token alias 与 selector contract

否则 preference 只是概念，不是可接线的系统。

## 3. 产品层：成熟产品的 preference 远不止主题

GitHub 和 VS Code 这类成熟产品给出的信号非常明确：

- preference 不止“主题”
- preference 也不止“无障碍”
- preference 应覆盖“如何看、如何操作、如何组织工作区”

GitHub 侧体现出来的能力包括：

- `theme mode` 支持跟随系统或显式 light / dark
- `contrast` 是单独入口，不只是附带在主题里
- `motion` 可以单独控制，且默认跟随系统
- `link underlines` 可配置
- `hovercards` 可关闭
- `keyboard shortcuts` 可部分关闭或自定义

VS Code 侧体现出来的能力更完整：

- color theme 与 high contrast 分开建模
- file icon theme 与 product icon theme 独立
- display language 可覆盖系统语言
- zoom level 是正式 preference
- minimap / breadcrumbs / sticky scroll / centered layout / zen mode 都可单独开关
- settings 有 user / workspace / profile / sync 多层作用域
- profiles 可导出、分享、跨机器同步

这说明业界已经普遍把 preference 分成两层：

1. `accessibility and comfort`
2. `workflow and information handling`

SysFolio 现在只做到了前者的一部分，而且还是偏 appearance 的那一部分。

## 4. 密度不是单个组件的微调，而是全局模式

SAP Fiori 的实践在这里非常有参考价值。

它把 density 明确为应用级的内容密度模式：

- `cozy`
- `compact`

关键点有三个：

1. 密度由设备能力和用户偏好共同决定。
2. 不应在同一层级里混用多种 density。
3. 用户可在支持的设备上持久化覆盖默认密度。

这对 SysFolio 很重要，因为我们已经有 `uiDensity`，但还缺两件事：

- 它的应用边界还不够清楚
- 它的 token 偏移量还没有正式定义

也就是说：

`uiDensity` 现在还是概念标签，还不是严格的系统模式。

## 5. 可访问性偏好不应只有 dark / motion

Apple、Fluent、GitHub、VS Code 的共同方向是：

可访问性偏好至少应覆盖以下几类：

- dark interface
- sufficient contrast / high contrast
- reduced motion
- larger text / zoom
- keyboard-first usage
- differentiate without color alone

Apple 还特别强调：

- dark mode 要与 `Increase Contrast` 组合测试
- reduced motion 下不应简单删光动画，而应替换为更轻、更稳定的反馈
- larger text 是正式要求，不是附属优化

对 SysFolio 来说，这里最缺的是：

- `contrast preference`
- `text scale`
- `keyboard shortcut / keyboard-first tuning`

## 四、对 SysFolio 的缺口判断

下面按优先级列当前缺失能力。

## P0：必须补

### 1. `contrastPref`

建议值：

- `system`
- `normal`
- `more`

原因：

- 现在只有 `themeMode`，没有 contrast layer
- 这会让 dark theme 和 accessibility 体系断层
- GitHub、VS Code、Fluent、Apple 都把高对比作为正式能力

设计要求：

- 与 `themeMode` 解耦
- `dark + high contrast` 必须可同时成立
- 非文本状态差异也要进入对比度检查

### 2. `forcedColorsSupport`

这不一定要作为用户设置入口，但必须作为 resolved capability / accessibility mode 存在。

原因：

- Web 平台已经正式支持 `forced-colors`
- 如果不设计，后续自定义 rail、selection、focus ring、code tokens 都容易坏

设计要求：

- 把它看作比产品主题更高优先级的模式
- 优先保证结构、ownership、focus，而不是保原品牌颜色

### 3. `textScale` 或 `zoomLevel`

建议值：

- `system`
- `100%`
- `110%`
- `125%`

或做连续缩放。

原因：

- Apple 明确强调 larger text
- VS Code 把 zoom 作为正式 preference
- 文档阅读产品不提供 text scale，很容易在长文场景失分

设计要求：

- 影响正文、TOC、PathBar、panel 文本
- 不只放大 body text，还要校准 heading、meta、toolbar
- 需要和 `uiDensity` 分离

### 4. `preference scopes`

至少要定义：

- `global`
- `workspace`
- `document`

原因：

- VS Code 的 user / workspace / profile / sync 说明了 scope 是成熟 preference 系统的基础能力
- 没有 scope，很多偏好会互相打架

建议：

- `themeMode / uiDensity / motionMode / contrastPref / textScale` 归 `global`
- `leftRailPref / contextPanelPref / fileTreeRevealMode` 可支持 `workspace`
- `tocPref / contentWidth / codeWrap` 可支持 `document`

### 5. `resolved preference model`

现在只有原则，没有完整输出对象。

建议显式定义：

```ts
type PreferenceResolution = {
  theme: "light" | "dark";
  contrast: "normal" | "more" | "forced";
  motion: "full" | "reduced";
  density: "comfortable" | "compact";
  textScale: number;
  leftRailMode: "persistent" | "collapsible" | "temporary";
  tocMode: "persistent" | "entry";
  contextPanelMode: "persistent" | "entry";
};
```

重点不是这个类型长什么样，而是：

- raw preference
- OS / environment signals
- resolved mode

这三层必须分开。

## P1：应该补

### 6. `contentWidth`

建议值：

- `auto`
- `comfortable`
- `wide`
- `focus`

原因：

- 文档型产品的长期偏好不应只有 theme 和 TOC
- VS Code 有 centered layout / zen mode；这类偏好本质上都是内容宽度与周边噪声管理
- SysFolio 是阅读型产品，这一项价值很高

### 7. `codeWrap`

建议值：

- `inherit`
- `wrap`
- `scroll`

原因：

- 文档产品里代码块是高频内容
- wrap 与 scroll 是真实阅读偏好，不是实现细节

### 8. `tocExpandDepth`

建议值：

- `auto`
- `h1-only`
- `h1-h2`
- `all`

原因：

- 当前 TOC 只设计了激活状态机，没有设计阅读偏好
- 业界成熟工具普遍允许导航结构做轻量定制

### 9. `fileTreeRevealMode`

建议值：

- `auto`
- `keep-context`
- `manual`

原因：

- FileTree 是否自动展开并 reveal 当前文件，是典型 workspace 偏好
- 这类偏好对浏览效率影响很大，但不应混入瞬时 state

### 10. `linkAffordancePref`

建议值：

- `default`
- `underline-links`
- `reduced-preview`

原因：

- GitHub 证明了 link underline 和 hover preview 都是正式偏好
- 对阅读型产品，这类微偏好对可发现性和认知负担影响很大

## P2：可选但值得预留

### 11. `shortcutMode` / command trigger customization

原因：

- GitHub 允许自定义 command palette 快捷键
- 对重度键盘用户，这不是“高级发烧项”，而是常规能力

### 12. `iconTheme` / accent preference

原因：

- VS Code 将 color theme、file icon theme、product icon theme 分开
- 这对内容工具类产品是成熟模式

对 SysFolio：

- 不一定现在就做
- 但至少不要把 iconography 和 theme 锁死成一层

### 13. `reducedTransparency`

原因：

- 如果未来使用 blur / translucent surface，必须预留
- 当前 Web 支持还不够稳，先不做显式用户开关也可以

### 14. `reducedData`

原因：

- 对正文图片、预览图、远程内容有意义
- 但浏览器支持仍不成熟，应作为 future-ready 预留

### 15. `focusMode` / simplified mode

原因：

- Apple 的 Assistive Access、VS Code 的 Zen Mode 都说明“降噪模式”是有效产品能力
- 对阅读型产品，它可以是后期 profile，而不一定是单独 preference

## 五、推荐给 SysFolio 的 Preference Taxonomy

建议把 preference system 收成 6 组。

## 1. Appearance

- `themeMode`
- `contrastPref`
- `iconTheme`（后期）

## 2. Comfort

- `uiDensity`
- `textScale`
- `motionMode`
- `reducedTransparency`（后期）

## 3. Layout

- `leftRailPref`
- `tocPref`
- `contextPanelPref`
- `contentWidth`

## 4. Reading

- `codeWrap`
- `tocExpandDepth`
- `stickyHeadingPref` 或同类阅读辅助项

## 5. Interaction

- `linkAffordancePref`
- `shortcutMode`
- `hoverPreviewPref`

## 6. Scope and Profiles

- `global / workspace / document`
- `profile = reading / browsing / presenting`

## 六、建议的优先级路线

## Phase A：先补基础缺口

1. `contrastPref`
2. `textScale`
3. `preference scopes`
4. `resolved preference model`

原因：

- 这是让当前 preference system 真正成立的最低门槛

## Phase B：补阅读型偏好

1. `contentWidth`
2. `codeWrap`
3. `tocExpandDepth`
4. `fileTreeRevealMode`

原因：

- 这些才真正体现 SysFolio 的文档产品属性

## Phase C：补高阶个性化

1. `linkAffordancePref`
2. `shortcutMode`
3. `profiles`
4. `sync / export / import`

原因：

- 这是产品成熟度提升项，不是当前 handoff 的最短板

## 七、对当前文档体系的建议

如果继续沿用现在的文档结构，不建议再新开很多专题文档。

建议这样吸收：

- [design-overview.md](design-overview.md)
  保留 preference system 总模型与优先级
- [layout-behavior-spec.md](layout-behavior-spec.md)
  承接 `leftRailPref / tocPref / contextPanelPref / contentWidth`
- [view-density-spec.md](view-density-spec.md)
  承接 `uiDensity / textScale`
- [navigation-state-spec.md](navigation-state-spec.md)
  承接 `tocExpandDepth / fileTreeRevealMode`
- [dark-theme-spec.md](dark-theme-spec.md)
  承接 `themeMode / contrastPref / forced colors`
- [motion-spec.md](motion-spec.md)
  承接 `motionMode / reducedTransparency`
- [design-todo.md](design-todo.md)
  维护优先级，不重复展开

## 八、最终判断

对 SysFolio 来说，真正完整的 preference system 不应只是：

- 主题
- 密度
- 动效
- 面板默认开关

而应扩展为：

`appearance + accessibility + reading + layout + interaction + scopes/profiles`

如果只列最关键的缺失项，我建议前 6 名是：

1. `contrastPref`
2. `textScale`
3. `preference scopes`
4. `resolved preference model`
5. `contentWidth`
6. `codeWrap`

## 参考来源

以下均为 2026-03-22 访问的官方来源：

- MDN: [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-color-scheme)
- MDN: [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- MDN: [prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-contrast)
- MDN: [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/forced-colors)
- MDN: [color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme)
- MDN: [CSS color adjustment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_color_adjustment)
- MDN: [prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-reduced-transparency)
- MDN: [prefers-reduced-data](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-data)
- Apple HIG: [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Apple App Store Connect: [Dark Interface evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/dark-interface-evaluation-criteria)
- Apple App Store Connect: [Reduced Motion evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)
- Fluent 2: [Design tokens](https://fluent2.microsoft.design/design-tokens)
- Fluent 2: [Accessibility](https://fluent2.microsoft.design/accessibility)
- Fluent 2: [Motion](https://fluent2.microsoft.design/motion)
- Atlassian Design System: [Design tokens explained](https://atlassian.design/foundations/tokens/design-tokens/)
- Atlassian Design System: [Color](https://atlassian.design/foundations/color/)
- Carbon Design System: [Themes](https://carbondesignsystem.com/elements/themes/overview/)
- Carbon Design System: [Motion](https://v10.carbondesignsystem.com/guidelines/motion/overview/)
- GitHub Docs: [Managing your theme settings](https://docs.github.com/get-started/accessibility/managing-your-theme-settings)
- GitHub Docs: [Managing accessibility settings](https://docs.github.com/en/enterprise-cloud%40latest/account-and-profile/how-tos/account-settings/managing-accessibility-settings)
- GitHub Docs: [GitHub Command Palette](https://docs.github.com/en/get-started/accessibility/github-command-palette)
- VS Code Docs: [Themes](https://code.visualstudio.com/docs/configure/themes)
- VS Code Docs: [Accessibility](https://code.visualstudio.com/docs/configure/accessibility/accessibility)
- VS Code Docs: [User and workspace settings](https://code.visualstudio.com/docs/configure/settings)
- VS Code Docs: [Profiles in Visual Studio Code](https://code.visualstudio.com/docs/configure/profiles)
- VS Code Docs: [Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync)
- VS Code Docs: [Display Language](https://code.visualstudio.com/docs/configure/locales)
- VS Code Docs: [Custom Layout](https://code.visualstudio.com/docs/configure/custom-layout)
- SAP Fiori: [Content Density (Cozy and Compact)](https://experience.sap.com/fiori-design-web/cozy-compact/)
