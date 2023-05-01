import { defineComponent } from "vue";

import LabelsLayer from "./demo/labels-layer";
import MassMarks from "./demo/mass-marks";
import LayerGroup from "./demo/layer-group";
import ImageLayer from "./demo/image-layer";
import CanvasLayer from "./demo/canvas-layer";
import HeatMap from "./demo/heatmap";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <LabelsLayer />
        <MassMarks />
        <LayerGroup />
        <ImageLayer />
        <CanvasLayer />
        <HeatMap />
      </>
    );
  };
});
