/*---
title: DistrictLayerCountry
---*/
import { defineComponent } from "vue";
import { Map, DistrictLayerCountry } from "@vue-start/map";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const SOC = "CHN";
  const colors: Record<string, any> = {};
  const GDPSpeed: any = {
    "520000": 10, //贵州
    "540000": 10, //西藏
    "530000": 8.5, //云南
    "500000": 8.5, //重庆
    "360000": 8.5, //江西
    "340000": 8.0, //安徽
    "510000": 7.5, //四川
    "350000": 8.5, //福建
    "430000": 8.0, //湖南
    "420000": 7.5, //湖北
    "410000": 7.5, //河南
    "330000": 7.0, //浙江
    "640000": 7.5, //宁夏
    "650000": 7.0, //新疆
    "440000": 7.0, //广东
    "370000": 7.0, //山东
    "450000": 7.3, //广西
    "630000": 7.0, //青海
    "320000": 7.0, //江苏
    "140000": 6.5, //山西
    "460000": 7, // 海南
    "310000": 6.5, //上海
    "110000": 6.5, // 北京
    "130000": 6.5, // 河北
    "230000": 6, // 黑龙江
    "220000": 6, // 吉林
    "210000": 6.5, //辽宁
    "150000": 6.5, //内蒙古
    "120000": 5, // 天津
    "620000": 6, // 甘肃
    "610000": 8.5, // 甘肃
    "710000": 6.64, //台湾
    "810000": 6.0, //香港
    "820000": 6.7, //澳门
  };
  const getColorByDGP = (adcode: string) => {
    if (!colors[adcode]) {
      const gdp = GDPSpeed[adcode];
      if (!gdp) {
        colors[adcode] = "rgb(227,227,227)";
      } else {
        const rg = 255 - Math.floor(((gdp - 5) / 5) * 255);
        colors[adcode] = "rgb(" + rg + "," + rg + ",255)";
      }
    }
    return colors[adcode];
  };

  const opts = {
    zIndex: 10,
    SOC: "CHN",
    depth: 2,
    styles: {
      "nation-stroke": "#f09",
      "coastline-stroke": [0.85, 0.63, 0.94, 1],
      "province-stroke": "white",
      "city-stroke": "rgba(255,255,255,0.15)", //中国特有字段
      fill: (props: any) => {
        //中国特有字段
        return getColorByDGP(props.adcode_pro);
      },
    },
  };

  return () => {
    return (
      <Map
        class={css({ height: 500 })}
        opts={{
          zooms: [4, 8],
          center: [104.188488, 34.302032],
          showIndoorMap: false,
          zoom: 3,
          isHotspot: false,
          defaultCursor: "pointer",
          touchZoomCenter: 1,
          pitch: 0,
          layers: [],
          viewMode: "3D",
        }}>
        <DistrictLayerCountry opts={opts} />
      </Map>
    );
  };
});
