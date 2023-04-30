import { defineComponent } from "vue";

import LabelsLayer from "./demo/labels-layer";
import MassMarks from "./demo/mass-marks";
import LayerGroup from "./demo/layer-group";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <LabelsLayer />
        <MassMarks />
        <LayerGroup />
      </>
    );
  };
});
