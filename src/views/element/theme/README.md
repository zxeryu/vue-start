## ProTheme

```tsx
//根
<ProTheme createCssVar={createCssVar}>{slots.default()}</ProTheme>
```

## API

### 属性

| 名称           | 说明                      | 类型            | 默认值 |
| -------------- | ------------------------- | --------------- | ------ |
| `theme`        | 全部主题配置              | `ITheme`        | --     |
| `global`       | 根                        | `boolean`       | true   |
| `mode`         | 主题                      | ` light``dark ` | --     |
| `themeToken`   | 生成主题配置              | `IThemeToken`   | --     |
| `createCssVar` | 根据 theme 生成 css3 变量 | `function`      | --     |

```ts
export type TLight = Record<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9", string>;
export type TDark = Record<"2", string>;
export type TColor = { base: string; light: TLight; dark: TDark };
export type TSubType = { base: string; lg: string; md: string; sm: string };

export interface ITheme {
  color: {
    primary: TColor;
    success: TColor;
    warning: TColor;
    danger: TColor;
    error: TColor;
    info: TColor;
    //
    text: { base: string; regular: string; secondary: string; placeholder: string; disabled: string };
    border: { base: string; light: string };
    bg: { base: string; light: string };
    mode: { base: string; reverse: string };
  };
  radius: TSubType;
  fontSize: TSubType & { xs: string };
  lineHeight: { base: number; lg: number; md: number; sm: number };
  spacing: TLight;
  shadow: TSubType & { inner: string };
}
```

### 插槽

| 名称      | 说明 | 类型  |
| --------- | ---- | ----- |
| `default` | --   | VNode |
