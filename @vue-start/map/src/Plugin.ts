import { defineComponent, PropType, ref } from "vue";
import { useMap } from "./Map";
import { useEffect } from "@vue-start/hooks";
import { size } from "lodash";

export const useMapPlugin = (plugins: string[], cb: () => void) => {
  const { mapRef } = useMap();

  useEffect(() => {
    if (!mapRef.value) {
      console.warn("请在Map组件内使用 useMapPlugin");
      return;
    }
    if (!plugins || size(plugins) <= 0) {
      cb();
      return;
    }

    window.AMap.plugin(plugins, cb);
  }, []);
};

export const MapPlugin = defineComponent({
  props: {
    plugins: Array as PropType<string[]>,
  },
  setup: (props, { slots }) => {
    const loadedRef = ref(false);

    useMapPlugin(props.plugins!, () => {
      loadedRef.value = true;
    });

    return () => {
      if (!loadedRef.value) return null;

      return slots.default?.();
    };
  },
});

export const MapPluginType = {
  // "AMap.CloudDataLayer", //
  // "AMap.PlaceSearchLayer", //
  ElasticMarker: "AMap.ElasticMarker", //灵活点标记，可以随着地图级别改变样式和大小的 Marker
  ToolBar: "AMap.ToolBar", //工具条，控制地图的缩放、平移等
  Scale: "AMap.Scale", //比例尺，显示当前地图中心的比例尺
  HawkEye: "AMap.HawkEye", //鹰眼，显示缩略图
  MapType: "AMap.MapType", //图层切换，用于几个常用图层切换显示
  AdvancedInfoWindow: "AMap.AdvancedInfoWindow", //高级信息窗体，整合了周边搜索、路线规划功能
  DragRoute: "AMap.DragRoute", //拖拽导航插件，可拖拽起终点、途经点重新进行路线规划
  IndoorMap: "AMap.IndoorMap", //室内地图，用于在地图中显示室内地图
  MouseTool: "AMap.MouseTool", //鼠标工具插件
  CircleEditor: "AMap.CircleEditor", //圆编辑插件
  PolygonEditor: "AMap.PolygonEditor", //多边形编辑插件
  PolylineEditor: "AMap.PolylineEditor", //折线编辑器
  MarkerCluster: "AMap.MarkerCluster", //点聚合插件
  RangingTool: "AMap.RangingTool", //测距插件，可以用距离或面积测量
  /********************* api **************************/
  Geolocation: "AMap.Geolocation", //定位，提供了获取用户当前准确位置、所在城市的方法
  Geocoder: "AMap.Geocoder", //地理编码与逆地理编码服务，提供地址与坐标间的相互转换
  AutoComplete: "AMap.AutoComplete", //输入提示，提供了根据关键字获得提示信息的功能
  PlaceSearch: "AMap.PlaceSearch", //地点搜索服务，提供了关键字搜索、周边搜索、范围内搜索等功能
  LineSearch: "AMap.LineSearch", //公交路线服务，提供公交路线相关信息查询服务
  DistrictSearch: "AMap.DistrictSearch", //行政区查询服务，提供了根据名称关键字、citycode、adcode 来查询行政区信息的功能
  StationSearch: "AMap.StationSearch", //公交站点查询服务，提供途经公交线路、站点位置等信息
  CitySearch: "AMap.CitySearch", //城市获取服务，获取用户所在城市信息或根据给定IP参数查询城市信息
  CloudDataSearch: "AMap.CloudDataSearch", //云图搜索服务，根据关键字搜索云图点信息
  RoadInfoSearch: "AMap.RoadInfoSearch", //道路信息查询，已停止数据更新，反馈信息仅供参考
  Driving: "AMap.Driving", //驾车路线规划服务，提供按照起、终点进行驾车路线的功能
  TruckDriving: "AMap.TruckDriving", //货车路线规划
  Transfer: "AMap.Transfer", //公交路线规划服务，提供按照起、终点进行公交路线的功能
  Walking: "AMap.Walking", //步行路线规划服务，提供按照起、终点进行步行路线的功能
  Riding: "AMap.Riding", //骑行路线规划服务，提供按照起、终点进行骑行路线的功能
  ArrivalRange: "AMap.ArrivalRange", //公交到达圈，根据起点坐标，时长计算公交出行是否可达及可达范围
  GraspRoad: "AMap.GraspRoad", //轨迹纠偏服务插件
  HeatMap: "AMap.HeatMap", //热力图插件
  Weather: "AMap.Weather", //天气预报插件，用于获取未来的天气信息
};
