<template>
  <ProForm ref="formRef">
    <FormItem name="name" label="label" :rules="[{ required: true }]">
      <Input />
    </FormItem>

    <Button type="pirmary" htmlType="submit">submit</Button>
  </ProForm>
</template>

<script>
import { ProForm } from "@vue-start/antd-pro";
import { ref } from "vue";
import { FormItem, Input, Button } from "ant-design-vue";
export default {
  name: "Comp",
  components: { ProForm, FormItem, Input, Button },
  setup: () => {
    const formRef = ref();

    console.log("###########", formRef);

    return {
      formRef,
    };
  },
};
</script>
