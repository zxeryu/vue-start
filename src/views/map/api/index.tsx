import { defineComponent } from "vue";

import Geocoder from './demo/geocoder'

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Geocoder />
      </>
    );
  };
});
