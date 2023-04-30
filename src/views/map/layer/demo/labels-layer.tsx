import { computed, defineComponent, ref } from "vue";
import { Map, LabelsLayer, Marker } from "@vue-start/map";
import { useFetch } from "@vue-start/request";
import { getMockPosition } from "@/clients/map-data";
import { map, size, slice } from "lodash";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const pointRef = ref(null);

  const { data } = useFetch(getMockPosition, { initEmit: true });

  const icon = {
    type: "image",
    image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
    size: [6, 9],
    anchor: "bottom-center",
  };

  const items = computed(() => {
    return map(slice(data.list, 0, 3e4), (item) => {
      return { position: item, icon };
    });
  });

  const events = [
    {
      type: "mouseover",
      handler: (e: any) => {
        const position = e.data.data && e.data.data.position;
        if (position) {
          pointRef.value = position;
        }
      },
    },
    {
      type: "mouseout",
      handler: () => {
        pointRef.value = null;
      },
    },
  ];

  return () => {
    return (
      <Map
        class={css({ height: 400 })}
        opts={{
          zoom: 10,
          viewMode: "3D",
          center: [116.12, 40.11],
          mapStyle: "amap://styles/whitesmoke",
          showLabel: false,
          showIndoorMap: false,
        }}>
        {size(data.list) > 0 && (
          <LabelsLayer
            opts={{ zooms: [3, 20], zIndex: 1000, collision: false }}
            data={items.value as any}
            events={events as any}
          />
        )}
        <Marker opts={{ anchor: "bottom-center", offset: [0, -15] }} opts$={{ position: pointRef.value }}>
          <div class={css({ backgroundColor: "white" })}>{pointRef.value}</div>
        </Marker>
      </Map>
    );
  };
});
