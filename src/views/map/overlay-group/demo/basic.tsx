import { defineComponent } from "vue";
import { Map, OverlayGroup, Marker, Rectangle, useMap } from "@vue-start/map";
import { css } from "@emotion/css";

const Content = defineComponent(() => {
  const { mapRef } = useMap();

  const center = mapRef.value.getCenter();
  const anotherPoint = new window.AMap.LngLat(center.lng + 0.1, center.lat + 0.1);

  return () => {
    return (
      <OverlayGroup bindTime={2000}>
        <Marker opts={{ position: mapRef.value.getCenter() }} />
        <Rectangle
          opts={{
            bounds: new window.AMap.Bounds(center, anotherPoint),
            fillColor: "blue",
            fillOpacity: 0.5,
          }}
        />
      </OverlayGroup>
    );
  };
});

export default defineComponent(() => {
  return () => {
    return (
      <Map class={css({ height: 500 })}>
        <Content />
      </Map>
    );
  };
});
