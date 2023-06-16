import { ParsedUrlQueryInput, stringify } from "querystring";
import { get } from "lodash";
import { existsSync } from "fs";
import { join } from "path";
import { IState } from "./state";

const stringifyMetaContent = (o: ParsedUrlQueryInput) =>
  stringify(o, ",", "=", {
    encodeURIComponent: (v) => v,
  });

export const getHtmlOptions = (options: any, state: IState) => {
  const hasFavicon = existsSync(join(state.context, "favicon.ico"));
  const hasIndexHTML = existsSync(join(state.context!, "index.html"));

  const nextOptions = { ...options };
  nextOptions.title = get(state.meta, ["manifest", "name"]);
  if (hasFavicon) {
    nextOptions.favicon = "./favicon.ico";
  }
  if (hasIndexHTML) {
    nextOptions.template = "./index.html";
  }
  nextOptions.meta = {
    ...nextOptions.meta,
    "devkit:app": stringifyMetaContent({
      name: state.name,
      version: state.project?.version || new Date().valueOf(),
    }),
    "devkit:config":
      process.env.NODE_ENV === "production" ? "__APP_CONFIG__" : stringifyMetaContent(state.meta.config || {}),
  };
  return nextOptions;
};

export const rewriteHtmlPlugin = (config: any, state: IState) => {
  config.plugin("html").tap((hs: any) => {
    hs[0] = getHtmlOptions(hs[0], state);
    return hs;
  });
};
