<template>
  <div>
    network
    {{ loading }}
    {{ JSON.stringify(data) }}

    <div>
      <button @click="run">refresh</button>
    </div>
    <div>
      <input type="date" :onchange="timeChange" />
      <input type="date" :onchange="endTimeChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref, reactive, watch } from "vue";
import { useRequest, tapWhen } from "@vue-start/request";
import { useEpic } from "@vue-start/store";
import { test, getRadar, getRadarPic } from "../clients";

export default defineComponent({
  name: "NetWork",
  setup() {
    const [data, loading, run] = useRequest(test, { joinSub: true });
    const [radarData, , radarRun] = useRequest(getRadar, { manual: true, joinSub: true });

    const params = reactive({ stime: "2020-12-1 00:00:00", etime: "2020-12-22 00:00:00" });

    const [radarPicData] = useRequest(getRadarPic, {
      params,
      deps: params,
    });

    useEpic(tapWhen(() => radarRun(), test));

    watchEffect(() => {
      // console.log("@@@data", data.value);
      //
      // console.log("#$$$$$$$$$$", radarPicData.value);
      // console.log("time", params);
    });

    const timeChange = (e) => {
      params.stime = e.target.value + " 00:00:00";
    };
    const endTimeChange = (e) => {
      params.etime = e.target.value + " 00:00:00";
    };

    return { data, loading, run, timeChange, endTimeChange };
  },
});
</script>
