import MarkdownIt from "markdown-it";

export const createMD = () => {
  const hljs = require("highlight.js/lib/core");

  hljs.registerLanguage("actionscript", require("highlight.js/lib/languages/actionscript"));
  hljs.registerLanguage("apache", require("highlight.js/lib/languages/apache"));
  hljs.registerLanguage("armasm", require("highlight.js/lib/languages/armasm"));
  hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
  hljs.registerLanguage("avrasm", require("highlight.js/lib/languages/avrasm"));
  hljs.registerLanguage("bash", require("highlight.js/lib/languages/bash"));
  hljs.registerLanguage("clojure", require("highlight.js/lib/languages/clojure"));
  hljs.registerLanguage("cmake", require("highlight.js/lib/languages/cmake"));
  hljs.registerLanguage("coffeescript", require("highlight.js/lib/languages/coffeescript"));
  hljs.registerLanguage("c", require("highlight.js/lib/languages/c"));
  hljs.registerLanguage("cpp", require("highlight.js/lib/languages/cpp"));
  hljs.registerLanguage("arduino", require("highlight.js/lib/languages/arduino"));
  hljs.registerLanguage("css", require("highlight.js/lib/languages/css"));
  hljs.registerLanguage("diff", require("highlight.js/lib/languages/diff"));
  hljs.registerLanguage("django", require("highlight.js/lib/languages/django"));
  hljs.registerLanguage("dockerfile", require("highlight.js/lib/languages/dockerfile"));
  hljs.registerLanguage("ruby", require("highlight.js/lib/languages/ruby"));
  hljs.registerLanguage("fortran", require("highlight.js/lib/languages/fortran"));
  hljs.registerLanguage("glsl", require("highlight.js/lib/languages/glsl"));
  hljs.registerLanguage("go", require("highlight.js/lib/languages/go"));
  hljs.registerLanguage("groovy", require("highlight.js/lib/languages/groovy"));
  hljs.registerLanguage("handlebars", require("highlight.js/lib/languages/handlebars"));
  hljs.registerLanguage("haskell", require("highlight.js/lib/languages/haskell"));
  hljs.registerLanguage("ini", require("highlight.js/lib/languages/ini"));
  hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));
  hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
  hljs.registerLanguage("json", require("highlight.js/lib/languages/json"));
  hljs.registerLanguage("latex", require("highlight.js/lib/languages/latex"));
  hljs.registerLanguage("less", require("highlight.js/lib/languages/less"));
  hljs.registerLanguage("lisp", require("highlight.js/lib/languages/lisp"));
  hljs.registerLanguage("livescript", require("highlight.js/lib/languages/livescript"));
  hljs.registerLanguage("lua", require("highlight.js/lib/languages/lua"));
  hljs.registerLanguage("makefile", require("highlight.js/lib/languages/makefile"));
  hljs.registerLanguage("matlab", require("highlight.js/lib/languages/matlab"));
  hljs.registerLanguage("mipsasm", require("highlight.js/lib/languages/mipsasm"));
  hljs.registerLanguage("perl", require("highlight.js/lib/languages/perl"));
  hljs.registerLanguage("nginx", require("highlight.js/lib/languages/nginx"));
  hljs.registerLanguage("objectivec", require("highlight.js/lib/languages/objectivec"));
  hljs.registerLanguage("php", require("highlight.js/lib/languages/php"));
  hljs.registerLanguage("python", require("highlight.js/lib/languages/python"));
  hljs.registerLanguage("rust", require("highlight.js/lib/languages/rust"));
  hljs.registerLanguage("scala", require("highlight.js/lib/languages/scala"));
  hljs.registerLanguage("scheme", require("highlight.js/lib/languages/scheme"));
  hljs.registerLanguage("scss", require("highlight.js/lib/languages/scss"));
  hljs.registerLanguage("smalltalk", require("highlight.js/lib/languages/smalltalk"));
  hljs.registerLanguage("stylus", require("highlight.js/lib/languages/stylus"));
  hljs.registerLanguage("swift", require("highlight.js/lib/languages/swift"));
  hljs.registerLanguage("tcl", require("highlight.js/lib/languages/tcl"));
  hljs.registerLanguage("typescript", require("highlight.js/lib/languages/typescript"));
  hljs.registerLanguage("verilog", require("highlight.js/lib/languages/verilog"));
  hljs.registerLanguage("vhdl", require("highlight.js/lib/languages/vhdl"));
  hljs.registerLanguage("yaml", require("highlight.js/lib/languages/yaml"));

  const mdHtml = new MarkdownIt({
    linkify: true, // autoconvert URL-like texts to links
    typographer: true, // Enable smartypants and other sweet transforms
    highlight: (str, lang) => {
      const esc = mdHtml.utils.escapeHtml;

      if (lang && lang !== "auto" && hljs.getLanguage(lang)) {
        return (
          '<pre class="hljs language-' +
          esc(lang.toLowerCase()) +
          '"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } else if (lang === "auto") {
        const result = hljs.highlightAuto(str);

        /*eslint-disable no-console*/
        console.log("highlight language: " + result.language + ", relevance: " + result.relevance);

        return '<pre class="hljs language-' + esc(result.language) + '"><code>' + result.value + "</code></pre>";
      }

      return '<pre class="hljs"><code>' + esc(str) + "</code></pre>";
    },
  });

  return mdHtml;
};
