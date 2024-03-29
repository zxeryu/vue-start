import { defineComponent } from "vue";

import Marker from "./demo/marker";
import Text from "./demo/text";
import CircleMarker from "./demo/circle-marker";
import ElasticMarker from "./demo/elastic-marker";
import Control from "./demo/control";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Marker />
        <Text />
        <CircleMarker />
        <ElasticMarker />
        <Control />
      </>
    );
  };
});
