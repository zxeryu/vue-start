/*---
title: ImageLayer
---*/
import { defineComponent } from "vue";
import { css } from "@emotion/css";
import { Map, ImageLayer } from "@vue-start/map";

export default defineComponent(() => {
  return () => {
    return (
      <Map class={css({ height: 400 })} opts={{ center: [116.33719, 39.942384], zoom: 15 }}>
        <ImageLayer
          opts={{
            url: "https://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg",
            bounds: new AMap.Bounds([116.327911, 39.939229], [116.342659, 39.946275]),
            zooms: [13, 20],
          }}
        />
      </Map>
    );
  };
});
