import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

export const createMD = () => {
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
