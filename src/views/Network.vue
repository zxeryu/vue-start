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
      <button :onclick="anotherChange">change t</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, reactive, ref, toRaw } from "vue";
import { useRequest, useDirectRequest } from "@vue-start/request";
import { useObservable } from "@vue-start/store";
import { test, getRadar, getRadarPic } from "../clients";

export default defineComponent({
  name: "NetWork",
  setup() {
    const data = ref();
    const [run, loading$] = useRequest(test, {
      onSuccess: (actor) => {
        data.value = actor.res?.data;
      },
    });
    const loading = useObservable(loading$);

    const [radarRun] = useRequest(getRadar);

    radarRun({});

    const params = reactive({ stime: "2020-12-1 00:00:00", etime: "2020-12-22 00:00:00" });
    const another = ref();

    const [radarPicData] = useDirectRequest(
      getRadarPic,
      () => {
        return { ...toRaw(params), t: another.value };
      },
      [params, another],
    );

    watchEffect(() => {
      // console.log("@@@data", data.value);
      //
      // console.log("#$$$$$$$$$$", radarPicData.value);
      console.log("time", params);
    });

    const timeChange = (e:any) => {
      params.stime = e.target.value + " 00:00:00";
    };
    const endTimeChange = (e:any) => {
      params.etime = e.target.value + " 00:00:00";
    };

    const anotherChange = () => {
      another.value = new Date().valueOf();
    };

    return { data, loading, run: () => run({}), timeChange, endTimeChange, anotherChange };
  },
});
</script>
