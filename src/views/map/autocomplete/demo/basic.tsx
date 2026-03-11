import { defineComponent } from "vue";
import { Map, MapAutoComplete } from "@vue-start/map";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const onSelect = (item: any) => {
    console.log("######### select=", item);
  };

  return () => {
    return (
      <Map class={css({ height: 400 })}>
        <MapAutoComplete class={css({ width: 300, position: "absolute", top: 10, right: 10 })} onSelect={onSelect} />
      </Map>
    );
  };
});
