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
import { useRequest, tapWhen } from "@vue-start/request";
import { useEpic } from "@vue-start/store";
import { test, getRadar } from "../clients";

export default defineComponent({
  name: "NetWork",
  setup() {
    const [data, loading, run] = useRequest(test, { joinSub: true });
    const [radarData, , radarRun] = useRequest(getRadar, { manual: true, joinSub: true });
    useEpic(tapWhen(() => radarRun(), test));

    watchEffect(() => {
      console.log("@@@data", data.value);

      console.log("#$$$$$$$$$$", radarData.value);
    });

    return { data, loading, run };
  },
});
</script>
