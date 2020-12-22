<template>
  <div>
    network
    {{ loading }}
    {{ JSON.stringify(data) }}

    <div>
      <button @click="run">refresh</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from "vue";
import { useRequest, createRequestActor } from "@vue-start/request";
import { map } from "lodash";

const test = createRequestActor<
  undefined,
  {
    code: number;
    msg: string;
    data: { vehicleId: number; plateId: string; lon: string; lat: string }[];
  }
>("test", () => {
  return {
    method: "GET",
    url: `//huaibei-datafusion.rockontrol.com/datafusion/rkVehicleObddetails/allvehiclePoint`,
  };
});

export default defineComponent({
  name: "NetWork",
  setup() {
    const { data, loading, run } = useRequest(test);

    watchEffect(() => {
      console.log("@@@data", data.value);

      console.log("@@@loading", loading.value);
    });

    return { data, loading, run };
  },
});
</script>
