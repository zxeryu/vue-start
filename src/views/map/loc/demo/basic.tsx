import { defineComponent, ref } from "vue";
import { Map, MapLoc } from "@vue-start/map";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const locRef = ref();
  const locationRef = ref();

  const handleClick = (e: any) => {
    console.log("######### click=", e);
    //逆地理编码
    locRef.value?.geoReqCurrent();
  };

  const handleSelect = (e: any) => {
    console.log("######### select=", e);
    //逆地理编码
    locRef.value?.geoReqCurrent();
  };

  const onAddress = (result: any) => {
    console.log("######### address=", result);
  };

  return () => {
    return (
      <Map
        class={css({
          height: 400,
          ".map-autocomplete": {
            position: "absolute",
            width: 300,
            top: 10,
            right: 10,
          },
        })}>
        <MapLoc
          ref={locRef}
          v-model={locationRef.value}
          onClick={handleClick}
          onSelect={handleSelect}
          onAddress={onAddress}
        />
      </Map>
    );
  };
});
