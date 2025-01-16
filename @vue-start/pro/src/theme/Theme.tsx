import { mix } from "polished";
import { DarkThemeToken, ITheme, IThemeToken, TColor, ThemeKey, ThemeToken } from "./ctx";
import { join, map, reduce } from "lodash";
import { computed, defineComponent, PropType, provide, reactive } from "vue";
import { setReactiveValue, useEffect, useUpdateKey, useWatch } from "@vue-start/hooks";
import { Global } from "@vue-start/css";
import { useAppConfig } from "./config";

const darker = (color: string, i: number) => mix(i / 10, "#000000", color);
const lighter = (color: string, i: number) => mix(i / 10, "#ffffff", color);

export const createTheme = (tt?: IThemeToken, defTT?: IThemeToken): ITheme => {
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
      primary: createColor(tt?.color?.primary || defTT?.color?.primary!),
      success: createColor(tt?.color?.success || defTT?.color?.success!),
      warning: createColor(tt?.color?.warning || defTT?.color?.warning!),
      danger: createColor(tt?.color?.danger || defTT?.color?.danger!),
      error: createColor(tt?.color?.error || defTT?.color?.error!),
      info: createColor(tt?.color?.info || defTT?.color?.info!),
      //
      ...defTT?.extraColor,
    } as any,
    radius: { base: "4px", lg: "8px", md: "4px", sm: "2px" },
    fontSize: { base: "14px", lg: "16px", md: "14px", sm: "13px", xs: "12px" },
    lineHeight: { base: 1.5714285714285714, lg: 1.5, md: 1.5714285714285714, sm: 1.6666666666666667 },
    spacing: reduce(indexes, (pair, i) => ({ ...pair, [String(i)]: i * defTT?.spacing! + "px" }), {}) as any,
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
   * 主题
   */
  mode: { type: String as PropType<"light" | "dark"> },
  /**
   * 根据themeToken生成theme
   */
  themeToken: { type: Object as PropType<IThemeToken> },
  /**
   * 将生成的ITheme对象映射成 css 变量
   */
  createCssVar: { type: Function as PropType<(t: ITheme, mode: string) => Record<string, string | number>> },
  //默认themeToken
  lightThemeToken: { type: Object as PropType<IThemeToken>, default: ThemeToken },
  darkThemeToken: { type: Object as PropType<IThemeToken>, default: DarkThemeToken },
});

export const ProTheme = defineComponent({
  props: {
    ...proThemeProps(),
  },
  setup: (props, { slots }) => {
    const { appConfig } = useAppConfig();

    const [cssKey, updateCssKey] = useUpdateKey();

    const mode = computed(() => {
      if (props.mode) return props.mode;
      return appConfig.isDark ? "dark" : "light";
    });

    const initTheme = () => {
      if (props.theme) return props.theme;

      const tt = props.themeToken;
      return createTheme(
        {
          ...tt,
          color: { ...tt?.color, primary: tt?.color?.primary || appConfig.primary },
        },
        mode.value === "dark" ? props.darkThemeToken : props.lightThemeToken,
      );
    };

    const theme = reactive({ ...initTheme() });

    useWatch(() => {
      setReactiveValue(theme, initTheme());
    }, [() => props.theme, () => props.themeToken, () => appConfig.primary, () => appConfig.isDark]);

    useEffect(() => {
      if (mode.value === "dark") {
        document.querySelector("html")?.classList.add("dark");
      } else {
        document.querySelector("html")?.classList.remove("dark");
      }
    }, mode);

    //更新css变量
    useWatch(
      () => {
        updateCssKey();
      },
      theme,
      { deep: true },
    );

    provide(ThemeKey, { theme });

    const values = computed(() => {
      if (!props.createCssVar) return {};
      return props.createCssVar(theme as any, mode.value);
    });

    const styles = computed(() => {
      if (mode.value === "dark") return { "html.dark": values.value };
      return { ":root": values.value };
    });

    const domStyle = computed(() => {
      return join(
        map(values.value, (v, k) => `${k}:${v}`),
        ";",
      );
    });

    return () => {
      if (props.global) {
        return (
          <>
            {props.createCssVar && <Global key={cssKey.value} styles={styles.value} />}

            {slots.default?.()}
          </>
        );
      }

      return (
        <div class={"pro-theme"} style={domStyle.value}>
          {slots.default?.()}
        </div>
      );
    };
  },
});
