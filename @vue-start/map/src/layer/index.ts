import { createFeature, createPluginFeature, useMapConnect2 } from "../Feature";
import { useMapLayerConnect } from "./LayerGroup";
import { omit } from "lodash";
import { MapPluginType } from "../Plugin";

export * from "./LayerGroup";
export * from "./LabelsLayer";

export const TileLayer = createFeature("TileLayer", { useMapConnect: useMapLayerConnect });
export const TileLayerSatellite = createFeature("TileLayer.Satellite", {
  useMapConnect: useMapLayerConnect,
  createFeatureObj: (opts) => {
    return new window.AMap.TileLayer.Satellite(opts);
  },
});
export const TileLayerRoadNet = createFeature("TileLayer.RoadNet", {
  useMapConnect: useMapLayerConnect,
  createFeatureObj: (opts) => {
    return new window.AMap.TileLayer.RoadNet(opts);
  },
});
export const TileLayerTraffic = createFeature("TileLayer.Traffic", {
  useMapConnect: useMapLayerConnect,
  createFeatureObj: (opts) => {
    return new window.AMap.TileLayer.Traffic(opts);
  },
});
export const Buildings = createFeature("Buildings", { useMapConnect: useMapLayerConnect });

export const MassMarks = createFeature("MassMarks", {
  useMapConnect: useMapConnect2,
  createFeatureObj: (opts) => {
    return new window.AMap.MassMarks(opts?.data || [], omit(opts, "data"));
  },
});

//自定义
export const TileLayerFlexible = createFeature("TileLayer.Flexible", {
  useMapConnect: useMapLayerConnect,
  createFeatureObj: (opts) => {
    return new window.AMap.TileLayer.Flexible(opts);
  },
});
export const ImageLayer = createFeature("ImageLayer", { useMapConnect: useMapLayerConnect });
export const VideoLayer = createFeature("VideoLayer" as any, { useMapConnect: useMapLayerConnect });
export const CanvasLayer = createFeature("CanvasLayer", { useMapConnect: useMapLayerConnect });
export const CustomLayer = createFeature("CustomLayer", { useMapConnect: useMapLayerConnect });

// DistrictLayer
export const DistrictLayerWorld = createFeature("DistrictLayer.World", {
  useMapConnect: useMapLayerConnect,
  createFeatureObj: (opts) => {
    return new window.AMap.DistrictLayer.World(opts);
  },
});
export const DistrictLayerCountry = createFeature("DistrictLayer.Country", {
  useMapConnect: useMapLayerConnect,
  createFeatureObj: (opts) => {
    return new window.AMap.DistrictLayer.Country(opts);
  },
});
export const DistrictLayerProvince = createFeature("DistrictLayer.Province", {
  useMapConnect: useMapLayerConnect,
  createFeatureObj: (opts) => {
    return new window.AMap.DistrictLayer.Province(opts);
  },
});

//plugin

const HeatMapComp = createFeature("HeatMap" as any, {
  useMapConnect: useMapConnect2,
  createFeatureObj: (opts) => {
    //@ts-ignore
    return new window.AMap.HeatMap(null, opts);
  },
});

export const HeatMap = createPluginFeature([MapPluginType.HeatMap], HeatMapComp);
