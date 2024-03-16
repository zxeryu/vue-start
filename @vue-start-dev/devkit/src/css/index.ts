import { Plugin } from "vite";
import { forEach, reduce, size } from "lodash";

/**
 * 必须放在 @vitejs/plugin-vue-jsx 之前（因为只是代码层面的转换）
 * @param opts
 */
export const cssToCls = (opts?: { fileTypes?: string[] }): Plugin => {
  const { fileTypes = [".ts", ".tsx", ".js", ".jsx"] } = opts || {};
  const fileTypeMap: Record<string, boolean> = reduce(fileTypes, (pair, item) => ({ ...pair, [item]: true }), {});

  return {
    name: "cssToCls",
    transform: (code, id) => {
      const fileType = id.substring(id.lastIndexOf("."));
      if (!fileTypeMap[fileType]) return;

      const pattern = /css=\{\{[\s\S]*?\}\}/g;
      if (!pattern.test(code)) return;

      const list = code.match(pattern);
      if (size(list) <= 0) return;

      //替换成css方法
      let reCode = code;
      forEach(list, (item) => {
        const newItem = `class={css(${item.replace("css={{", "{").replace("}}", "}")})}`;
        reCode = reCode.replace(item, newItem);
      });

      //如未引入css方法，补全
      const cssImportPattern = /[\/\/]*\s*import[\s\S].*?@emotion\/css/;
      const cssImportStr = cssImportPattern.exec(code)?.[0];
      //未引入 已注释 引入但不包含css
      if (
        !cssImportStr ||
        /\/\/\s.*?import/.test(cssImportStr) ||
        cssImportStr.replace("@emotion/css", "").indexOf("css") === -1
      ) {
        reCode = `import { css } from "@emotion/css";${reCode}`;
      }
      return { code: reCode };
    },
  };
};
