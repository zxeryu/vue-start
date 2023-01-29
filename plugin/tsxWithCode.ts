import { endsWith } from "lodash";
import { Plugin } from "vite";
import { relative } from "path";
import { readFileSync } from "fs";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { encode } from "js-base64";

//demo组件中注入title、desc、codeStr
const createTsxWithCode = (root = process.cwd(), md: any) => {
  return (src: string, file: string) => {
    const relativePath = relative(root, file);

    //展示的代码
    const str = readFileSync(relativePath, { encoding: "utf-8" });
    const { content, data: info } = matter(str, { delimiters: ["/*---", "---*/"] });

    const codeStr = md.render(`\`\`\`tsx
${content}
\`\`\``);

    //实际代码包裹<demo-box>组件
    if (src.indexOf("const __default__ =") > -1) {
      let targetStr = src.replace("const __default__ =", "const Default =");

      const demoBoxStr = `
        const __default__ = defineComponent(()=>{
        
          const title = "${info.title || ""}";
          const desc = "${info.desc || ""}";
          const codeStr = "${encodeURIComponent(codeStr)}";
        
          return ()=>{
            return _createVNode(
            _resolveComponent("demo-box"),
            {
              title,
              desc,
              codeStr
            },
            [_createVNode(Default,null,null)]
            )
          }
        });
        export default __default__
      `;

      targetStr = targetStr.replace("export default __default__", demoBoxStr);

      return targetStr;
    }

    return src;
  };
};

//index页面（demo集合）集成md文档
const createTsxWithMd = (root = process.cwd(), md: any) => {
  return (src: string, file: string) => {
    const relativePath = relative(root, file);

    //原始文件内容
    const str = readFileSync(relativePath, { encoding: "utf-8" });
    const { data: info } = matter(str, { delimiters: ["/*---", "---*/"] });

    if (info?.md) {
      const mdPath = relative(root, info.md);
      const mdStr = readFileSync(mdPath, { encoding: "utf-8" });
      const mdStrList = mdStr?.split?.("## API");
      let descHtml = "",
        apiHtml = "";
      if (mdStrList && mdStrList[0]) {
        descHtml = md.render(mdStrList[0]);
        descHtml = encode(descHtml);
        // descHtml = Buffer.from(descHtml).toString("base64");
      }
      if (mdStrList && mdStrList[1]) {
        apiHtml = md.render("## API" + mdStrList[1]);
        apiHtml = encode(apiHtml);
        // apiHtml = Buffer.from(apiHtml).toString("base64");
      }

      let targetStr = src.replace("const __default__ =", "const Default =");

      const proPageStr = `
      const __default__ = defineComponent(()=>{
          
          const descRef = ref();
          const apiRef = ref();
          
          const descHtml = "${descHtml}";
          const apiHtml = "${apiHtml}";
          
          useEffect(()=>{
            if(descRef.value && apiRef.value){
              descRef.value.innerHTML = decode(descHtml);
              apiRef.value.innerHTML = decode(apiHtml);
            }
          },[descRef,apiRef]);
          
          return ()=>{
            return _createVNode(
              _resolveComponent("pro-page"),
              null,
              [
                _createVNode('div',{ ref:descRef, style:"margin-bottom:20px" },null),
                _createVNode(Default,null,null),
                _createVNode('div',{ref:apiRef},null),
              ]
            )
          }
        });
        export default __default__
      `;
      targetStr = targetStr.replace("export default __default__", proPageStr);

      targetStr =
        `
      import { resolveComponent as _resolveComponent, ref} from "vue";
      import { useEffect } from "@vue-start/hooks";
      import { decode } from 'js-base64';
      ` + targetStr;

      return targetStr;
    }

    return src;
  };
};

export const tsxWithCode = (options: any = {}): Plugin => {
  const { root, markdown } = options;

  const md = new MarkdownIt({
    html: true,
    linkify: true,
  });
  const tsxWithCodeStr = createTsxWithCode(root, md);
  const tsxWithCodeMd = createTsxWithMd(root, md);

  return {
    name: "tsxWithCode",
    transform: (code, id) => {
      if (endsWith(id, ".tsx")) {
        if (id.indexOf("/demo/") > -1) {
          return {
            code: tsxWithCodeStr(code, id),
            map: null,
          };
        } else if (id.indexOf("/views/") > -1 && endsWith(id, "index.tsx")) {
          return {
            code: tsxWithCodeMd(code, id),
            map: null,
          };
        }
      }
    },
  };
};
