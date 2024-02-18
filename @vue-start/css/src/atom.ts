import { camelCase, forEach, isArray, isObject, isString, reduce } from "lodash";

type AtomItem = { prop: string | number; name: string };
type AtomGroup = {
  prefix?: string; //前缀
  replace?: string | string[]; //替换字符串后，再拼上前缀
  list: (string | AtomItem)[];
};

const objs: { [k: string]: AtomGroup } = {
  "box-sizing": {
    list: [
      { prop: "border-box", name: "box-border" },
      { prop: "content-box", name: "box-content" },
    ],
  },
  display: {
    list: [
      "block",
      "inline-block",
      "inline",
      "flex",
      "inline-flex",
      "grid",
      "inline-grid",
      { prop: "none", name: "hidden" },
    ],
  },
  overflow: { prefix: "overflow", list: ["auto", "hidden"] },
  "overflow-x": { prefix: "overflow-x", list: ["auto", "hidden"] },
  "overflow-y": { prefix: "overflow-y", list: ["auto", "hidden"] },
  position: {
    list: ["static", "fixed", "absolute", "relative", "sticky"],
  },
  visibility: {
    list: ["visible", { prop: "hidden", name: "invisible" }, "collapse"],
  },
  /**********************flex***********************/
  "flex-direction": {
    prefix: "flex",
    list: [
      "row",
      "row-reverse",
      { prop: "column", name: "flex-col" },
      { prop: "column-reverse", name: "flex-col-reverse" },
    ],
  },
  "flex-wrap": { prefix: "flex", list: ["wrap", "wrap-reverse", "nowrap"] },
  flex: {
    list: [
      { prop: "1 1 0%", name: "flex-1" },
      { prop: "1 1 auto", name: "flex-auto" },
      { prop: "0 1 auto", name: "flex-initial" },
      { prop: "none", name: "flex-none" },
    ],
  },
  "flex-grow": { list: [{ prop: 1, name: "flex-grow" }] },
  "flex-shrink": { list: [{ prop: 1, name: "flex-shrink" }] },
  "justify-content": {
    prefix: "justify",
    replace: ["flex-", "space-"],
    list: ["normal", "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "stretch"],
  },
  "align-items": {
    prefix: "items",
    replace: "flex-",
    list: ["flex-start", "flex-end", "center", "baseline", "stretch"],
  },
  "align-self": {
    prefix: "self",
    replace: "flex-",
    list: ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"],
  },
  /**************************grid*************************/
  "grid-auto-flow": {
    prefix: "grid-flow",
    list: [
      "row",
      "column",
      "dense",
      { prop: "row dense", name: "grid-flow-row-dense" },
      { prop: "column dense", name: "grid-flow-col-dense" },
    ],
  },
  "grid-auto-columns": {
    prefix: "auto-cols",
    replace: "-content",
    list: ["auto", "min-content", "max-content", { prop: "minmax(0, 1fr)", name: "auto-cols-fr" }],
  },
  "grid-auto-rows": {
    prefix: "auto-rows",
    replace: "-content",
    list: ["auto", "min-content", "max-content", { prop: "minmax(0, 1fr)", name: "auto-rows-fr" }],
  },
  "justify-items": {
    prefix: "justify-items",
    list: ["start", "end", "center", "stretch"],
  },
  "justify-self": {
    prefix: "justify-self",
    list: ["auto", "start", "end", "center", "stretch"],
  },
  "align-content": {
    prefix: "content",
    replace: ["flex-", "space-"],
    list: [
      "normal",
      "center",
      "flex-start",
      "flex-end",
      "space-between",
      "space-around",
      "space-evenly",
      "baseline",
      "stretch",
    ],
  },
  "place-content": {
    prefix: "place-content",
    replace: "space-",
    list: ["center", "start", "end", "space-between", "space-around", "space-evenly", "baseline", "stretch"],
  },
  "place-items": {
    prefix: "place-items",
    list: ["start", "end", "center", "baseline", "stretch"],
  },
  "place-self": {
    prefix: "place-self",
    list: ["auto", "start", "end", "center", "stretch"],
  },
  /**************************typography*************************/
  "text-align": {
    prefix: "text",
    list: ["left", "center", "right", "justify", "start", "end"],
  },
  "text-decoration-line": {
    list: ["underline", "overline", "line-through", { prop: "none", name: "no-underline" }],
  },
  "text-decoration-style": {
    list: ["solid", "double", "dotted", "dashed", "wavy"],
  },
  "text-transform": {
    list: ["uppercase", "lowercase", "capitalize", { prop: "none", name: "normal-case" }],
  },
  "text-overflow": {
    prefix: "text",
    list: ["ellipsis", "clip"],
  },
  "text-wrap": {
    prefix: "text",
    list: ["wrap", "nowrap", "balance", "pretty"],
  },
  "vertical-align": {
    prefix: "align",
    list: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super"],
  },
  "white-space": {
    prefix: "whitespace",
    list: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"],
  },
  "word-break": {
    list: ["break-all", "keep-all"],
  },
  hyphens: {
    prefix: "hyphens",
    list: ["none", "manual", "auto"],
  },
  /**************************background*************************/
  "background-attachment": {
    prefix: "bg",
    list: ["fixed", "local", "scroll"],
  },
  "background-clip": {
    prefix: "bg-clip",
    replace: "-box",
    list: ["border-box", "padding-box", "content-box", "text"],
  },
  "background-origin": {
    prefix: "bg-origin",
    replace: "-box",
    list: ["border-box", "padding-box", "content-box"],
  },
  "background-position": {
    prefix: "bg",
    list: [
      "bottom",
      "center",
      "left",
      { prop: "left bottom", name: "bg-left-bottom" },
      { prop: "left top", name: "bg-left-top" },
      "right",
      { prop: "right bottom", name: "bg-right-bottom" },
      { prop: "right top", name: "bg-right-top" },
      "top",
    ],
  },
  "background-repeat": {
    prefix: "bg",
    list: ["repeat", "no-repeat", "repeat-x", "repeat-y", "round", "space"],
  },
  "background-size": {
    prefix: "bg",
    list: ["auto", "cover", "contain"],
  },
  /**************************extra*************************/
  "box-shadow": {
    list: [
      { prop: "0 1px 2px 0 rgb(0 0 0 / 0.05)", name: "shadow-sm" },
      { prop: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)", name: "shadow" },
      { prop: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", name: "shadow-md" },
      { prop: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", name: "shadow-lg" },
      { prop: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", name: "shadow-xl" },
      { prop: "0 25px 50px -12px rgb(0 0 0 / 0.25)", name: "shadow-2xl" },
      { prop: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)", name: "shadow-inner" },
    ],
  },
  cursor: {
    prefix: "cursor",
    list: [
      "auto",
      "default",
      "pointer",
      "wait",
      "text",
      "move",
      "help",
      "not-allowed",
      "none",
      "context-menu",
      "progress",
      "cell",
      "crosshair",
      "vertical-text",
      "alias",
      "copy",
      "grab",
      "grabbing",
      "all-scroll",
      "col-resize",
      "row-resize",
      "n-resize",
      "e-resize",
      "s-resize",
      "s-resize",
      "w-resize",
      "ne-resize",
      "nw-resize",
      "se-resize",
      "sw-resize",
      "ew-resize",
      "ns-resize",
      "nesw-resize",
      "nwse-resize",
      "zoom-in",
      "zoom-out",
    ],
  },
  "pointer-events": {
    prefix: "pointer-events",
    list: ["none", "auto"],
  },
  resize: {
    prefix: "resize",
    list: ["none", { prop: "vertical", name: "resize-y" }, { prop: "horizontal", name: "resize-x" }, "both"],
  },
};

export const createAtom = () => {
  const clsList: Record<string, any>[] = [];
  forEach(objs, (v, k) => {
    const { prefix, replace, list } = v;
    forEach(list, (item) => {
      //定义了name
      if (isObject(item)) {
        const { prop, name } = item as AtomItem;
        clsList.push({ name: `.${name}`, key: camelCase(k), value: prop });
        return;
      }
      let name = item as string;
      if (isArray(replace)) {
        forEach(replace, (r) => {
          name = name.replace(r, "");
        });
      } else if (isString(replace)) {
        name = name.replace(replace, "");
      }
      if (prefix) {
        name = `${prefix}-${name}`;
      }
      clsList.push({ name: `.${name}`, key: camelCase(k), value: item });
    });
  });

  const clsObj = reduce(clsList, (pair, item) => ({ ...pair, [item.name]: { [item.key]: item.value } }), {});

  return { clsList, clsObj };
};

/*flex-basis*/
/*order*/

/*grid-template-columns*/
/*grid-column grid-column-start grid-column-end*/
/*grid-template-rows*/
/*grid-row grid-row-start grid-row-end*/
/*gap column-gap row-gap*/

/*padding padding-left padding-right padding-top padding-bottom padding-inline-start padding-inline-end*/
/*p-x p-y*/
/*margin margin-left margin-right margin-top margin-bottom margin-inline-start margin-inline-end*/
/*m-x m-y*/

/*width min-width max-width*/
/*height min-height max-height*/
/*size*/

/*font-size*/
/*font-weight*/
/*letter-spacing*/
/*line-clamp*/
/*line-height*/
/*text-decoration-thickness*/
/*text-underline-offset*/
/*text-indent*/

/*opacity*/
/*filter*/
