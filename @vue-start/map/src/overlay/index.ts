import { createFeature, createPluginFeature, useMapConnect, useMapControlConnect } from "../Feature";
import { useMapOverlayConnect } from "./OverlayGroup";
import { MapPluginType } from "../Plugin";

export * from "./OverlayGroup";
export * from "./InfoWindow";

/******************************* base *******************************/
export const CircleMarker = createFeature("CircleMarker", { useMapConnect });
// export const LabelMarker = createFeature("LabelMarker", { useMapConnect });
export const Text = createFeature("Text", { useMapConnect });
//plugin
export const ElasticMarker = createFeature("ElasticMarker", { useMapConnect });

/******************************* overlay group *******************************/
export const Marker = createFeature("Marker", { useMapConnect: useMapOverlayConnect, needDom: true });
export const Polygon = createFeature("Polygon", { useMapConnect: useMapOverlayConnect });
export const Polyline = createFeature("Polyline", { useMapConnect: useMapOverlayConnect });
export const Circle = createFeature("Circle", { useMapConnect: useMapOverlayConnect });
export const Rectangle = createFeature("Rectangle", { useMapConnect: useMapOverlayConnect });
export const Ellipse = createFeature("Ellipse", { useMapConnect: useMapOverlayConnect });
export const BezierCurve = createFeature("BezierCurve", { useMapConnect: useMapOverlayConnect });

/******************************* control *******************************/
const ToolBarComp = createFeature("ToolBar" as any, { useMapConnect: useMapControlConnect });
export const ToolBar = createPluginFeature([MapPluginType.ToolBar], ToolBarComp);
const ScaleComp = createFeature("Scale" as any, { useMapConnect: useMapControlConnect });
export const Scale = createPluginFeature([MapPluginType.Scale], ScaleComp);
const HawkEyeComp = createFeature("HawkEye" as any, { useMapConnect: useMapControlConnect });
export const HawkEye = createPluginFeature([MapPluginType.HawkEye], HawkEyeComp);
const MapTypeComp = createFeature("MapType" as any, { useMapConnect: useMapControlConnect });
export const MapType = createPluginFeature([MapPluginType.MapType], MapTypeComp);
const ControlBarComp = createFeature("ControlBar" as any, { useMapConnect: useMapControlConnect });
export const ControlBar = createPluginFeature([MapPluginType.ControlBar], ControlBarComp);
