import { defineComponent, inject, PropType, provide, reactive } from "vue";
import { Global } from "@vue-start/css";
import { mix } from "polished";
import { reduce } from "lodash";
import { setReactiveValue, useUpdateKey, useWatch } from "@vue-start/hooks";

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
    bg: string;
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
  radius?: string;
  lineHeight?: number;
  spacing?: number;
}

const darker = (color: string, i: number) => mix(i / 10, "#000000", color);
const lighter = (color: string, i: number) => mix(i / 10, "#ffffff", color);

export const ThemeToken: IThemeToken = {
  color: {
    primary: "#409eff",
    success: "#67c23a",
    warning: "#e6a23c",
    danger: "#f56c6c",
    error: "#f56c6c",
    info: "#909399",
  },
  radius: "4px",
  lineHeight: 1.5714285714285714,
  spacing: 4,
};

export const createTheme = (tt?: IThemeToken): ITheme => {
  const indexes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const createColor = (color: string): TColor => {
    return {
      base: color,
      light: reduce(indexes, (pair, i) => ({ ...pair, [String(i)]: lighter(color, i) }), {}) as any,
      dark: { "2": darker(color, 2) },
    };
  };

  return {
    color: {
      primary: createColor(tt?.color?.primary || ThemeToken.color?.primary!),
      success: createColor(tt?.color?.success || ThemeToken.color?.success!),
      warning: createColor(tt?.color?.warning || ThemeToken.color?.warning!),
      danger: createColor(tt?.color?.danger || ThemeToken.color?.danger!),
      error: createColor(tt?.color?.error || ThemeToken.color?.error!),
      info: createColor(tt?.color?.info || ThemeToken.color?.info!),
      //
      text: { base: "#303133", regular: "#606266", secondary: "#909399", placeholder: "#a8abb2", disabled: "#c0c4cc" },
      border: { base: "#dcdfe6", light: "#e4e7ed" },
      bg: "#ffffff",
    },
    radius: { base: "4px", lg: "8px", md: "4px", sm: "2px" },
    fontSize: { base: "14px", lg: "16px", md: "14px", sm: "13px", xs: "12px" },
    lineHeight: { base: 1.5714285714285714, lg: 1.5, md: 1.5714285714285714, sm: 1.6666666666666667 },
    spacing: reduce(indexes, (pair, i) => ({ ...pair, [String(i)]: i * 4 + "px" }), {}) as any,
    shadow: {
      base: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      lg: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      md: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      sm: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    },
  };
};

const proThemeProps = () => ({
  theme: { type: Object },
  /**
   * 是否在全局注册css变量
   */
  global: { type: Boolean, default: true },
  /**
   * 根据themeToken生成theme
   */
  themeToken: { type: Object as PropType<IThemeToken> },
  /**
   * 将生成的ITheme对象映射成 css 变量
   */
  createCssVar: { type: Function as PropType<(t: ITheme) => Record<string, string | number>> },
});

export const ProTheme = defineComponent({
  props: {
    ...proThemeProps(),
  },
  setup: (props, { slots }) => {
    const [cssKey, updateCssKey] = useUpdateKey();

    const initTheme = () => {
      if (props.theme) {
        return props.theme;
      }
      return createTheme(props.themeToken);
    };

    const theme = reactive({ ...initTheme() });

    useWatch(
      () => {
        setReactiveValue(theme, initTheme());
      },
      () => props.themeToken,
    );

    useWatch(
      () => {
        updateCssKey();
      },
      theme,
      { deep: true },
    );

    provide(ThemeKey, { theme });

    return () => {
      if (props.global) {
        return (
          <>
            {props.createCssVar && <Global key={cssKey.value} styles={{ ":root": props.createCssVar(theme as any) }} />}

            {slots.default?.()}
          </>
        );
      }

      return slots.default?.();
    };
  },
});
