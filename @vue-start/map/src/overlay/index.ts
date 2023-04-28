import { createFeature, useMapConnect } from "../Feature";
import { useMapOverlayConnect } from "./OverlayGroup";

export * from "./OverlayGroup";
export * from "./InfoWindow";

/******************************* base *******************************/
export const ElasticMarker = createFeature("ElasticMarker", { useMapConnect });
export const CircleMarker = createFeature("CircleMarker", { useMapConnect });
// export const LabelMarker = createFeature("LabelMarker", { useMapConnect });
export const Text = createFeature("Text", { useMapConnect });

/******************************* overlay group *******************************/
export const Marker = createFeature("Marker", { useMapConnect: useMapOverlayConnect, needDom: true });
export const Polygon = createFeature("Polygon", { useMapConnect: useMapOverlayConnect });
export const Polyline = createFeature("Polyline", { useMapConnect: useMapOverlayConnect });
export const Circle = createFeature("Circle", { useMapConnect: useMapOverlayConnect });
export const Rectangle = createFeature("Rectangle", { useMapConnect: useMapOverlayConnect });
export const Ellipse = createFeature("Ellipse", { useMapConnect: useMapOverlayConnect });
export const BezierCurve = createFeature("BezierCurve", { useMapConnect: useMapOverlayConnect });
