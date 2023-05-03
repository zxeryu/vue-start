import { computed, defineComponent } from "vue";
import { Geocoder_getLocation, Map, useMapApi } from "@vue-start/map";
import { css } from "@emotion/css";
import { useEffect } from "@vue-start/hooks";

const Content = defineComponent(() => {
  const { data, request, requesting } = useMapApi(Geocoder_getLocation, {});

  useEffect(() => {
    request(
      {
        city: "010", //城市设为北京，默认：“全国”
      },
      ["北京市朝阳区阜荣街10号"],
    );
  }, []);

  const position = computed(() => {
    const lnglat = data.geocodes[0].location;
  });

  return () => {
    console.log('########',data.geocodes?.[0]?.location)
    return (
      <div class={css({ position: "absolute" })}>
        {!requesting.value && data.geocodes && <div>{data.geocodes[0].location.toString()}</div>}
      </div>
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
