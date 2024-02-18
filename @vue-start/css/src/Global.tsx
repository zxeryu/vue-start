import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { cache } from "@emotion/css";
import { StyleSheet } from "@emotion/sheet";
import { Interpolation, serializeStyles } from "@emotion/serialize";
import { useEffect } from "@vue-start/hooks";
import { isArray } from "lodash";

type StyleArg = TemplateStringsArray | Interpolation<any>;

const globalProps = () => ({
  styles: { type: [Object, Array] as PropType<StyleArg | StyleArg[]> },
});

export type GlobalProps = Partial<ExtractPropTypes<ReturnType<typeof globalProps>>>;

export const Global = defineComponent<GlobalProps>({
  props: {
    ...globalProps(),
  } as any,
  setup: (props) => {
    const styles = isArray(props.styles) ? props.styles : [props.styles];
    const serialized = serializeStyles(styles, undefined, cache);

    useEffect(() => {
      const key = `${cache.key}-global`;

      const sheet = new StyleSheet({
        key,
        nonce: cache.sheet.nonce,
        container: cache.sheet.container,
        speedy: (cache.sheet as any).isSpeedy,
      });

      const node = document.querySelector(`style[data-emotion="${key} ${serialized.name}"]`);
      if (cache.sheet.tags.length) {
        sheet.before = cache.sheet.tags[0];
      }
      if (node !== null) {
        // clear the hash so this node won't be recognizable as rehydratable by other <Global/>s
        node.setAttribute("data-emotion", key);
        sheet.hydrate([node as HTMLStyleElement]);
      }

      cache.insert(``, serialized, sheet as any, false);

      return () => {
        sheet && sheet.flush();
      };
    }, []);

    return () => {
      return null;
    };
  },
});
