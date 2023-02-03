import { endsWith } from "lodash";
import { Plugin } from "vite";
import { relative } from "path";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";
import { encode } from "js-base64";
import { createMD } from "./md";

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

    let codeStrVue = "";

    const vuePath = file.replace("/demo/", "/demo-vue/").replace('.tsx','.vue');
    if (existsSync(vuePath)) {
      const str = readFileSync(vuePath, { encoding: "utf-8" });
      codeStrVue = md.render(`\`\`\`xml
${str}
\`\`\``);
    }

    //实际代码包裹<demo-box>组件
    if (src.indexOf("const __default__ =") > -1) {
      let targetStr = src.replace("const __default__ =", "const Default =");

      const demoBoxStr = `
        const __default__ = defineComponent(()=>{
        
          const title = "${info.title || ""}";
          const desc = "${info.desc || ""}";
          const codeStr = "${encode(codeStr)}";
          const codeStrVue = "${encode(codeStrVue)}";
        
          const domRef = _ref();  
          const domVueRef = _ref();  
        
          _useEffect(()=>{
            if(domRef.value){
              domRef.value.innerHTML = decode(codeStr);
            }
            if(domVueRef.value){
              domVueRef.value.innerHTML = decode(codeStrVue);
            }
          },[domRef,domVueRef]);
        
          return ()=>{
            return _createVNode(
            _resolveComponent("demo-box"),
            {
              title,
              desc
            },
            {
              default:()=>_createVNode(Default,null,null),
              codeStr:()=>_createVNode('div',{ref:domRef},null),
              codeStrVue:()=>_createVNode('div',{ref:domVueRef},null),
            }
            )
          }
        });
        export default __default__
      `;

      targetStr = targetStr.replace("export default __default__", demoBoxStr);

      targetStr =
        `
      import { ref as _ref} from "vue";
      import { useEffect as _useEffect } from "@vue-start/hooks";
      import { decode } from 'js-base64';
      ` + targetStr;

      return targetStr;
    }

    return src;
  };
};

//index页面（demo集合）集成md文档
const createTsxWithMd = (root = process.cwd(), md: any) => {
  return (src: string, file: string) => {
    const mdPath = file.substring(0, file.lastIndexOf("/")) + "/README.md";

    if (existsSync(mdPath)) {
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
          
          const descRef = _ref();
          const apiRef = _ref();
          
          const descHtml = "${descHtml}";
          const apiHtml = "${apiHtml}";
          
          _useEffect(()=>{
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
                _createVNode('div',{ ref:descRef, style:"margin-bottom:20px", class: "markdown" },null),
                _createVNode(Default,null,null),
                _createVNode('div',{ ref:apiRef, class: "markdown" },null),
              ]
            )
          }
        });
        export default __default__
      `;
      targetStr = targetStr.replace("export default __default__", proPageStr);

      targetStr =
        `
      import { resolveComponent as _resolveComponent, ref as _ref} from "vue";
      import { useEffect as _useEffect} from "@vue-start/hooks";
      import { decode } from 'js-base64';
      ` + targetStr;

      return targetStr;
    }

    return src;
  };
};

const createTsxToMd = (root = process.cwd(), md: any) => {
  return (src: string, file: string) => {
    const mdPath = file.substring(0, file.lastIndexOf("/")) + "/README.md";
    if (existsSync(mdPath)) {
      const mdStr = readFileSync(mdPath, { encoding: "utf-8" });
      const mdHtml = md.render(mdStr);

      return `
        import { defineComponent, resolveComponent, createVNode, ref } from "vue";
        import { useEffect } from "@vue-start/hooks";
        import { decode } from 'js-base64';
        
        const __default__ = defineComponent(()=>{
          
          const mdHtml = "${encode(mdHtml)}";
          
          const domRef = ref();
          
          useEffect(()=>{
            if(domRef.value){
              domRef.value.innerHTML = decode(mdHtml);
            }
          },domRef)
          
          return ()=>{
            return createVNode(
              resolveComponent("pro-page"),
              null, 
              [createVNode("div", {ref:domRef}, null)]
            );
          }
        });
        
        export default __default__
        
      `;
    }
    return src;
  };
};

export const tsxWithCode = (options: any = {}): Plugin => {
  const { root, markdown } = options;

  const md = createMD();
  const tsxWithCodeStr = createTsxWithCode(root, md);
  const tsxWithCodeMd = createTsxWithMd(root, md);
  const tsxToMd = createTsxToMd(root, md);

  return {
    name: "tsxWithCode",
    transform: (code, id) => {
      if (id.indexOf("/views/") > -1 && endsWith(id, ".tsx")) {
        if (id.indexOf("/demo/") > -1) {
          return {
            code: tsxWithCodeStr(code, id),
            map: null,
          };
        } else if (endsWith(id, "index.tsx")) {
          return {
            code: tsxWithCodeMd(code, id),
            map: null,
          };
        } else if (endsWith(id, "index-md.tsx")) {
          return {
            code: tsxToMd(code, id),
            map: null,
          };
        }
      }
    },
  };
};
