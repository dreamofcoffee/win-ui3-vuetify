# WinUI 3 for Vuetify

本目录是应用唯一的 Vuetify 外观增强入口。它保留 Vuetify 的组件、状态管理、可访问性与交互能力，并用 WinUI 3 的设计令牌、尺寸、圆角、轮廓、阴影和动效规则统一渲染结果。

## 接入

应用只需注册增强库：

```ts
import { installWinuiVuetify } from '@/lib/winui3-vuetify'

installWinuiVuetify(app)
```

该函数会安装预配置的 Vuetify、引入全部基础样式，并全局注册 `WinuiDateField`。

## 临时查看 Vuetify 原貌

修改 `config.ts` 中唯一的总开关：

```ts
export const winuiEnabled = false
```

`false` 会同时屏蔽 WinUI 3 主题、组件默认值和增强样式；改回 `true` 即可完整恢复。目前该开关故意设为 `false`，用于对照检查 Vuetify 原生效果。

## 目录职责

- `defaults.ts`：Vuetify 控件的默认密度、圆角、尺寸、ripple 和弹层策略。
- `themes.ts`：WinUI 明暗主题色。
- `styles/_core.scss`：设计令牌和单一控件的基础视觉、状态及动效。
- `styles/_patterns.scss`：导航、命令栏、组合按钮、数据工具栏等可复用组合模式。
- `styles/_date-picker.scss`：日期选择器的 WinUI 日、月、年视图。
- `strategies/selectLocation.ts`：ComboBox 弹层围绕当前选择项展开，并与输入框同宽。
- `components/WinuiDateField.vue`：基于 Vuetify 弹层和日期选择器的统一日期字段。

## 页面开发约束

页面可以保留业务布局、响应式网格和业务状态色，但不要覆盖 Vuetify 内部结构：

- 禁止在业务 Vue 中使用 `:deep(.v-*)` 或直接选择 `.v-*`。
- 不要重复声明已由默认值接管的 `rounded`、`elevation`、`density`、`ripple` 和默认 `size`。
- `color` 与 `variant` 表达业务语义时应保留，例如主要操作使用 `color="primary" variant="flat"`，次要操作使用 `variant="outlined"`。
- 需要新的跨页面外观规则时，在本库增加基础规则或 `winui-*` 语义类，不在业务页面修补 Vuetify DOM。

## 现有语义类

- `winui-field--large`、`winui-control--large`：40px 大尺寸输入和按钮。
- `winui-navigation-pane`、`winui-navigation-list`、`winui-navigation-footer`：NavigationView 结构。
- `winui-command-bar`、`winui-user-button`：顶部命令栏。
- `winui-component-card`：控件展示卡片的标题和内容间距。
- `winui-showcase*`、`winui-form-grid`、`winui-dialog-form`：设置/控件验收页的响应式布局、状态读数和表单排列。
- `winui-split-button`：组合按钮边缘和分隔轮廓。
- `winui-data-commandbar`、`winui-data-search`：数据表命令栏。
- `winui-month-selector`、`winui-calendar-cell`：排程月选择和日历单元格。
- `winui-task-select`、`winui-control-row`、`winui-number-field`：表格内紧凑编辑组合。
- `winui-responsive-color-picker`：窄屏自适应颜色选择器。
- `winui-login-card`：登录内容表面。

这些类是库的公开样式接口；页面不应依赖其内部 `.v-*` 实现。
