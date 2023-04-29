import { createFeature } from "../Feature";
import { useMapLayerConnect } from "./LayerGroup";
import { omit } from "lodash";

export * from "./LayerGroup";
export * from "./LabelsLayer";

export const TileLayer = createFeature("TileLayer", { useMapConnect: useMapLayerConnect });
export const TileLayerSatellite = createFeature("TileLayer.Satellite", { useMapConnect: useMapLayerConnect });
export const TileLayerRoadNet = createFeature("TileLayer.RoadNet", { useMapConnect: useMapLayerConnect });
export const TileLayerTraffic = createFeature("TileLayer.Traffic", { useMapConnect: useMapLayerConnect });
export const Buildings = createFeature("Buildings", { useMapConnect: useMapLayerConnect });
export const MassMarks = createFeature("MassMarks", {
  useMapConnect: useMapLayerConnect,
  createFeatureObj: (opts) => new window.AMap.MassMarks(opts?.data || [], omit(opts, "data")),
});

//自定义
export const TileLayerFlexible = createFeature("TileLayer.Flexible", { useMapConnect: useMapLayerConnect });
export const ImageLayer = createFeature("ImageLayer", { useMapConnect: useMapLayerConnect });
export const VideoLayer = createFeature("VideoLayer" as any, { useMapConnect: useMapLayerConnect });
export const CanvasLayer = createFeature("CanvasLayer", { useMapConnect: useMapLayerConnect });
export const CustomLayer = createFeature("CustomLayer", { useMapConnect: useMapLayerConnect });
