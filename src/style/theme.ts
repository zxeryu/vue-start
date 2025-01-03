import { ITheme } from "@vue-start/pro";
import { forEach, get } from "lodash";

export const createCssVar = (theme: ITheme) => {
  const colors: Record<string, any> = {};
  forEach(theme.color, (v, k) => {
    if (k === "bg") {
      colors["--pro-color-bg"] = get(v, "base");
      colors["--pro-color-bg-light"] = get(v, "light");
      colors["--pro-color-bg-reverse"] = get(v, "reverse");
      return;
    }
    if (k === "mode") {
      colors["--pro-color-mode"] = get(v, "base");
      colors["--pro-color-mode-rgb"] = get(v, "rgb");
      colors["--pro-color-mode-reverse"] = get(v, "reverse");
      colors["--pro-color-mode-reverse-rgb"] = get(v, "reverse-rgb");
      return;
    }
    if (k === "border") {
      colors["--pro-color-border"] = get(v, "base");
      colors["--pro-color-border-light"] = get(v, "light");
      return;
    }
    if (k === "text") {
      colors["--pro-color-text"] = get(v, "base");
      colors["--pro-color-text-regular"] = get(v, "regular");
      colors["--pro-color-text-secondary"] = get(v, "secondary");
      colors["--pro-color-text-placeholder"] = get(v, "placeholder");
      return;
    }
    colors[`--pro-color-${k}`] = get(v, "base");

    if (k !== "primary") return;
    //
    colors[`--el-color-${k}`] = get(v, "base");
    forEach(get(v, "light"), (sc, si) => {
      if (["3", "5", "7", "8", "9"].indexOf(si) > -1) {
        colors[`--el-color-${k}-light-${si}`] = sc;
        colors[`--pro-color-${k}-light-${si}`] = sc;
      }
    });
    colors[`--el-color-${k}-dark-2`] = get(v, ["dark", "2"]);
  });

  const nameMap = { radius: "radius", fontSize: "size", lineHeight: "line-height", shadow: "shadow" };

  const obj: Record<string, any> = {};

  forEach(nameMap, (v, k) => {
    forEach(get(theme, k), (sv, sk) => {
      if (sk === "base") {
        obj[`--pro-${v}`] = sv;
      } else {
        obj[`--pro-${v}-${sk}`] = sv;
      }
    });
  });

  const spacing: Record<string, any> = {};
  forEach(theme.spacing, (v, k) => {
    spacing[`--pro-spacing-${k}`] = v;
  });

  return { ...colors, ...obj, ...spacing };
};
