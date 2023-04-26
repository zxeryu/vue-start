/*---
title: ProShowDate
---*/

import { defineComponent } from "vue";
import { ProShowDate } from "@vue-start/pro";
import dayjs from "dayjs";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <ProShowDate value={dayjs().valueOf()} />
        <br />
        <br />
        unix &nbsp;
        <ProShowDate value={dayjs().unix()} isUnix format={"YYYY-MM-DD HH:mm:ss"} />
      </>
    );
  };
});
