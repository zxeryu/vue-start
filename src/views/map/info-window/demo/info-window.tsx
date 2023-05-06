/*---
title: InfoWindow
---*/
import { defineComponent, ref } from "vue";
import { Map, InfoWindow, Marker, useMap } from "@vue-start/map";
import { css } from "@emotion/css";

const Content = defineComponent(() => {
  const { mapRef } = useMap();

  const visibleRef = ref(false);

  const events = [
    {
      type: "click",
      handler: () => {
        visibleRef.value = true;
      },
    },
  ];

  return () => {
    return (
      <>
        {visibleRef.value && (
          <InfoWindow
            opts={{ position: mapRef.value.getCenter(), offset: [0, -40] }}
            //@ts-ignore
            onClose={() => {
              visibleRef.value = false;
            }}>
            <div class={css({ backgroundColor: "white", padding: 20 })}>自定义弹窗内容</div>
          </InfoWindow>
        )}
        <Marker opts={{ position: mapRef.value.getCenter() }} events={events} />
      </>
    );
  };
});

export default defineComponent(() => {
  return () => {
    return (
      <Map class={css({ height: 400 })}>
        <Content />
      </Map>
    );
  };
});
