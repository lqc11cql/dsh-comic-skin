# dsh-comic-skin

**漫画贴纸主题 / Comic sticker skin** for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — a neo-brutalist manga reskin: cream halftone paper, ink outlines, hard offset shadows and sticker controls.

![Comic sticker skin preview](docs/preview.svg)

## 特性 / Features

- 奶油网点纸底、墨线描边、硬投影、橙黑强调色，覆盖聊天、侧栏、设置、菜单、弹窗、代码块与表格。
- 两处开关：**设置 → 通用 → 漫画贴纸主题**，或输入框下方的 **★ 漫画** 贴纸。
- 纯 CSS 皮肤：不写入 `ui-theme` 设置，关闭后立即回到原来的浅色/深色主题。
- 不依赖任何 Harness 客户端包，只使用 `react`、`ctx.slots`、`ctx.locale` 与 `ctx.effect`。

## 安装 / Install

桌面端：**设置 → 插件 → 添加插件**，填 `github:lqc11cql/dsh-comic-skin`，安装后重启一次。

命令行：

```sh
dsh plugin --profile <profile> add github:lqc11cql/dsh-comic-skin
```

重启 `dsh web` / 桌面端后生效。仓库内已包含构建好的 `client.js`，安装时不需要构建。

## 使用 / Usage

1. 打开 **设置 → 通用**，找到 **漫画贴纸主题** 一行，点开关。
2. 或在任意会话的输入框下方点 **★ 漫画** 贴纸。
3. 选择保存在浏览器 `localStorage`（`dsh.comic-skin.enabled`）。

皮肤自带配色，因此「外观」里的浅色/深色选项要等关闭皮肤后才看得出来。

## 实现 / How it works

- 浏览器端插件注入一张全局样式表，全部规则限定在 `html[data-dsh-comic]` 下。
- 在 `body` 上覆盖整套 `--dsw-*` 别名 token（含深色选择器），因此聊天、设置、菜单等会一起变色；同时把 `color-scheme` 固定为浅色，避免原生滚动条/控件跟着深色走。
- 卡片、弹窗、菜单、输入卡、用户气泡、代码块、表格与图片查看器使用墨线描边 + 硬投影；小控件保持产品原生几何，避免挤压。
- 标签栏选中态是一枚黑色贴纸（`::before` 绘制，内缩以避开标题栏分隔线）。

## 兼容 / Compatibility

- DSH `0.2.x`（在 `0.2.2-rc.3` 上开发与验证）。
- 使用编译后类名后缀（如 `_card`、`_sidebarCol`）做装饰选择器；DSH 大版本重命名模块时可能丢掉个别装饰，但配色 token 不受影响。

## 已知限制 / Limits

- 不是 `ui-theme` 注册主题：不会出现在「外观」的三个方块里（第三方主题 id 本来也不会持久化）。
- 只对继承 `--dsw-*` token 的界面生效；其他插件完全自绘、未使用 token 的表面只会部分跟随。

## 开发 / Development

```sh
node scripts/build.mjs   # src/theme.css + src/client.template.js -> client.js
```

修改样式请改 `src/theme.css`，然后重新构建；`client.js` 是提交到仓库的产物。

## License

MIT
