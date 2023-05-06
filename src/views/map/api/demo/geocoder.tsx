/*---
title: geocoder
---*/
import { defineComponent } from "vue";
import { ApiNames, Map, useMapApi, Marker, useMap } from "@vue-start/map";
import { css } from "@emotion/css";

const Content = defineComponent(() => {
  const { mapRef } = useMap();

  const { data, requesting } = useMapApi(ApiNames.Geocoder_getLocation, {
    initEmit: true,
    opts: { city: "010" }, //城市设为北京
    params: ["北京市朝阳区阜荣街10号"],
    onSuccess: (result) => {
      mapRef.value.panTo(result.geocodes[0].location);
    },
  });

  const { data: manualData, request, requesting: manualRequesting } = useMapApi(ApiNames.Geocoder_getLocation, {});

  const handleClick = () => {
    request({ city: "010" }, ["北京市朝阳区三里屯"]);
  };

  return () => {
    return (
      <div class={css({ position: "absolute" })}>
        <div>
          初始化请求：（"北京市朝阳区阜荣街10号"），结果：
          {requesting.value ? (
            <pro-loading loading>
              <div>请求中...</div>
            </pro-loading>
          ) : (
            <>
              {data.geocodes?.[0]?.location?.toString()}
              <Marker opts={{ position: data.geocodes?.[0]?.location }} />
            </>
          )}
        </div>
        <br />
        <div>
          <button onClick={handleClick}>手动请求：（"北京市朝阳区三里屯"）</button>，结果：
          {manualRequesting.value ? (
            <pro-loading loading>
              <div>请求中...</div>
            </pro-loading>
          ) : (
            <>
              {" "}
              {manualData.geocodes?.[0]?.location?.toString()}
              <Marker opts={{ position: manualData.geocodes?.[0]?.location }} />
            </>
          )}
        </div>
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
