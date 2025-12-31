import { inject } from "vue";

export const ThemeKey = Symbol("logon-user");

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

export interface IThemeProvide {
  theme: ITheme;
}

export const useTheme = (): IThemeProvide => inject(ThemeKey) as IThemeProvide;

export interface IThemeToken {
  color?: {
    primary?: string;
    success?: string;
    warning?: string;
    danger?: string;
    error?: string;
    info?: string;
  };
  extraColor?: {
    text: { base: string; regular: string; secondary: string; placeholder: string; disabled: string };
    border: { base: string; light: string };
    bg: { base: string; light: string };
    mode: { base: string; reverse: string };
  };
  radius?: string;
  lineHeight?: number;
  spacing?: number;
}

export const ThemeToken = {
  color: {
    primary: "#409eff",
    success: "#67c23a",
    warning: "#e6a23c",
    danger: "#f56c6c",
    error: "#f56c6c",
    info: "#909399",
  },
  extraColor: {
    text: { base: "#303133", regular: "#606266", secondary: "#909399", placeholder: "#a8abb2", disabled: "#c0c4cc" },
    border: { base: "#dcdfe6", light: "#e4e7ed" },
    bg: { base: "white", light: "#f8f8f8" },
    mode: { base: "white", rgb: "255,255,255", reverse: "black", "reverse-rgb": "0,0,0" },
  },
  radius: "4px",
  lineHeight: 1.5714285714285714,
  spacing: 4,
};

/**
 *
 */
export const DarkThemeToken = {
  ...ThemeToken,
  extraColor: {
    text: { base: "#E5EAF3", regular: "#CFD3DC", secondary: "#A3A6AD", placeholder: "#8D9095", disabled: "#6C6E72" },
    border: { base: "#4C4D4F", light: "#414243" },
    bg: { base: "black", light: "#141414" },
    mode: { base: "black", rgb: "0,0,0", reverse: "white", "reverse-rgb": "255,255,255" },
  },
};

/****************************************************/

export const AppConfig = {
  layout: "compose", //布局
  //
  primary: ThemeToken.color.primary, //主题色
  isDark: false, //暗黑主题
  //
  menuBar: "",
  menuBarColor: "",
  menuBarActiveColor: "",
  //
  isTagsView: true, //展示layout tabs
  isTagsViewIcon: false,
  isTagsViewCache: true,
  isTagsViewDrag: true,
  //
  isBreadcrumb: false, //展示面包屑
  //
  isCollapse: false, //左侧菜单 最小化/展开
  isShowLogo: true,
  isGray: false,
  isInvert: false,
  isWatermark: true, //水印
  //
  locale: "zh",//默认中文
};

export type TAppConfig = typeof AppConfig;
