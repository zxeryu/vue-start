import { defineComponent } from "vue";

import LabelsLayer from "./demo/labels-layer";
import MassMarks from "./demo/mass-marks";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <LabelsLayer />
        <MassMarks />
      </>
    );
  };
});
