import { computed, defineComponent } from "vue";
import { useEffect, useWatch } from "@vue-start/hooks";
import Interact from "interactjs";

export const Atom = defineComponent({
  props: {
    id: String,
    resizable: { type: Boolean, default: true },
    draggable: { type: Boolean, default: true },
    enable: { type: Boolean, default: true },
  },
  setup: (props, { slots }) => {
    const id = props.id;

    const unset = () => {
      Interact("#" + id).unset();
    };

    const init = () => {
      unset();

      const int = Interact("#" + id);
      if (props.resizable) {
        int.resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },
          // enable inertial throwing
          inertia: false,
          modifiers: [
            // keep the edges inside the parent
            Interact.modifiers.restrictEdges({ outer: "parent" }),
            // minimum size
            Interact.modifiers.restrictSize({
              min: { width: 10, height: 10 },
            }),
          ],
          listeners: {
            move: (event) => {
              const target = event.target;
              let x = parseFloat(target.getAttribute("data-x")) || 0;
              let y = parseFloat(target.getAttribute("data-y")) || 0;

              // update the element's style
              target.style.width = event.rect.width + "px";
              target.style.height = event.rect.height + "px";

              // translate when resizing from top or left edges
              x += event.deltaRect.left;
              y += event.deltaRect.top;

              // target.style.transform = "translate(" + x + "px," + y + "px)";
              target.style.left = x + "px";
              target.style.top = y + "px";

              target.setAttribute("data-x", x);
              target.setAttribute("data-y", y);
            },
            end: (event) => {
              const target = event.target;
              const x = target.getAttribute("data-x");
              const y = target.getAttribute("data-y");
              console.log("resize end", event, x, y);
            },
          },
        });
      }
      if (props.draggable) {
        int.draggable({
          // enable inertial throwing
          inertia: false,
          // keep the element within the area of it's parent
          modifiers: [Interact.modifiers.restrictRect({ restriction: "parent", endOnly: true })],
          // enable autoScroll
          autoScroll: true,
          listeners: {
            move: (event) => {
              const target = event.target;
              // keep the dragged position in the data-x/data-y attributes
              const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
              const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

              // translate the element
              // target.style.transform = "translate(" + x + "px, " + y + "px)";
              target.style.left = x + "px";
              target.style.top = y + "px";

              // update the posiion attributes
              target.setAttribute("data-x", x);
              target.setAttribute("data-y", y);
            },
            end: (event) => {
              const target = event.target;
              const x = target.getAttribute("data-x");
              const y = target.getAttribute("data-y");
              console.log("move end", event, x, y);
            },
          },
        });
      }
    };

    useEffect(() => {
      if (props.enable) {
        init();
      }

      return () => {
        unset();
      };
    }, []);

    useWatch(
      () => {
        if (props.enable) {
          init();
        } else {
          unset();
        }
      },
      () => props.enable,
    );

    const cls = computed(() => {
      const list = ["atom"];
      if (props.enable) list.push("enable");
      return list;
    });

    return () => {
      return (
        <div class={cls.value} id={props.id}>
          {slots.default?.()}
        </div>
      );
    };
  },
});
