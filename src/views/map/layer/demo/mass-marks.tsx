import { defineComponent, ref } from "vue";
import { Map, MassMarks, Marker } from "@vue-start/map";
import { useFetch } from "@vue-start/request";
import { getCities } from "@/clients/map-data";
import { size } from "lodash";
import { css } from "@emotion/css";

const Content = defineComponent(() => {
  const { data } = useFetch(getCities, { initEmit: true });

  const currentRef = ref();

  const style = [
    {
      url: "https://webapi.amap.com/images/mass/mass0.png",
      anchor: new AMap.Pixel(6, 6),
      size: new AMap.Size(11, 11),
      zIndex: 3,
    },
    {
      url: "https://webapi.amap.com/images/mass/mass1.png",
      anchor: new AMap.Pixel(4, 4),
      size: new AMap.Size(7, 7),
      zIndex: 2,
    },
    {
      url: "https://webapi.amap.com/images/mass/mass2.png",
      anchor: new AMap.Pixel(3, 3),
      size: new AMap.Size(5, 5),
      zIndex: 1,
    },
  ];

  const events = [
    {
      type: "mouseover",
      handler: (e: any) => {
        currentRef.value = e.data;
      },
    },
    {
      type: "mouseout",
      handler: () => {
        currentRef.value = null;
      },
    },
  ];

  return () => {
    if (size(data.list) <= 0) return null;
    return (
      <>
        <MassMarks
          opts={{ opacity: 0.8, zIndex: 111, cursor: "pointer", style: style, data: data.list }}
          events={events}
        />
        {currentRef.value && (
          <Marker opts$={{ position: currentRef.value.lnglat }}>
            <div class={css({ width: 80, backgroundColor: "white", textAlign: "center" })}>{currentRef.value.name}</div>
          </Marker>
        )}
      </>
    );
  };
});

export default defineComponent(() => {
  return () => {
    return (
      <Map
        class={css({ height: 400 })}
        opts={{ zoom: 4, center: [102.342785, 35.312316], showIndoorMap: false, viewMode: "3D" }}>
        <Content />
      </Map>
    );
  };
});
