/*---
title: Marker
desc: 基础使用；动态属性；内容自定义；事件；
---*/
import { computed, defineComponent, ref } from "vue";
import { Map, Marker } from "@vue-start/map";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const changeRef = ref("default");

  const position = computed(() => {
    if (changeRef.value === "change") return [116.415315, 39.918775];
    return [116.415315, 39.908775];
  });
  const icon = computed(() => {
    if (changeRef.value === "change") return "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png";
    return "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png";
  });

  const handleClick = (e: any) => {
    console.log("click", e);
  };

  //事件
  const events = [{ type: "click", handler: handleClick }];

  return () => {
    return (
      <Map class={css({ height: 300 })}>
        <div class={css({ position: "absolute", top: 0, left: 0 })}>
          <button
            onClick={() => {
              changeRef.value = changeRef.value === "change" ? "default" : "change";
            }}>
            切换
          </button>
        </div>
        {/*静态*/}
        <Marker opts={{ position: [116.406315, 39.908775] }} events={events} />
        {/*动态*/}
        <Marker
          opts={{ angle: 45 }}
          opts$={{
            position: position.value,
            icon: new AMap.Icon({ image: icon.value, imageSize: new AMap.Size(26, 36) }),
          }}
          events={events}
        />
        {/*内容自定义*/}
        <Marker opts={{ position: [116.436315, 39.908775] }} events={events}>
          <div class={css({ color: "red", fontSize: 16 })}>marker</div>
        </Marker>
      </Map>
    );
  };
});
