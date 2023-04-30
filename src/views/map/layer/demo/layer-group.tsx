import { defineComponent, ref } from "vue";
import { css } from "@emotion/css";
import { Map, LayerGroup, TileLayerRoadNet, TileLayerTraffic } from "@vue-start/map";

export default defineComponent(() => {
  const showRef = ref(true);

  const optionsRef = ref({
    opacity: 1,
  });

  return () => {
    return (
      <Map class={css({ height: 400 })} opts={{ zoom: 13 }}>
        <div class={css({ position: "absolute" })}>
          <button
            onClick={() => {
              showRef.value = !showRef.value;
            }}>
            {showRef.value ? "hide" : "show"}
          </button>
          <button
            onClick={() => {
              optionsRef.value = { opacity: Math.random() };
            }}>
            change options
          </button>
        </div>

        <LayerGroup bindTime={1000} show={showRef.value} opts$={{ options: optionsRef.value as any }}>
          <TileLayerTraffic opts={{ zIndex: 11 }} />
          <TileLayerRoadNet opts={{ zIndex: 10 }} />
        </LayerGroup>
      </Map>
    );
  };
});
