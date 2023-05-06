import { defineComponent } from "vue";

import World from "./demo/world";
import Country from "./demo/country";
import Province from "./demo/province";
import MassMarks from "./demo/mass-marks";
import ImageLayer from "./demo/image-layer";
import CanvasLayer from "./demo/canvas-layer";
import HeatMap from "./demo/heatmap";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <World />
        <Country />
        <Province />
        <MassMarks />
        <ImageLayer />
        <CanvasLayer />
        <HeatMap />
      </>
    );
  };
});
