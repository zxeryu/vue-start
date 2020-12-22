<template>
  <div>About</div>
  <TestPermission><span>i am span</span></TestPermission>
  <button @click="change">change</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePermission, MustOneOfPermissions, mustOneOfPermissions } from "@vue-start/access";
import { createRequestActor } from "../../@vue-start/request/src";

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

const TestPermission = mustOneOfPermissions(test);

export default defineComponent({
  name: "About",
  components: { MustOneOfPermissions, TestPermission },

  setup() {
    const pmRef = usePermission();
    const change = () => {
      pmRef.value = { test: !pmRef.value.test };
    };
    return {
      change,
    };
  },
});
</script>
