import { defineComponent, ref, reactive } from "vue";
import { useConfig } from "@vue-start/config";
import { css } from "@emotion/css";
import { getPlatform, PlatformOptions, setPlatform } from "@/common/platform";
import { columnStr } from "@/common/columns";
import { useEffect } from "@vue-start/hooks";
import { ProAppConfigDrawer } from "@vue-start/pro";
import { useChengState } from "@/store/StoreCurrent";

const DemoDataModal = defineComponent(() => {
  const visibleRef = ref(false);
  const domRef = ref();

  useEffect(() => {
    domRef.value && (domRef.value.innerHTML = columnStr);
  }, domRef);

  return () => {
    return (
      <>
        <pro-modal v-model:visible={visibleRef.value} title={"demo数据"}>
          <div ref={domRef} />
        </pro-modal>
        <pro-operate
          items={[
            {
              value: "value",
              label: "demo数据",
              onClick: () => {
                visibleRef.value = !visibleRef.value;
              },
            },
          ]}
        />
      </>
    );
  };
});

const Platform = defineComponent(() => {
  const handleChange = (v: string) => {
    setPlatform(v);
    window.location.reload();
  };

  return () => {
    const value = getPlatform();
    return (
      <pro-radio
        value={value}
        onUpdate:value={handleChange}
        modelValue={value}
        onUpdate:modelValue={handleChange}
        optionType={"button"}
        options={PlatformOptions}
      />
    );
  };
});

const ConfigSet = defineComponent(() => {
  const state = reactive({ visible: false });

  const handleClick = () => (state.visible = true);

  const onCancel = () => (state.visible = false);

  return () => {
    return (
      <>
        <pro-button onClick={handleClick}>设置</pro-button>
        {state.visible && <ProAppConfigDrawer visible onCancel={onCancel} />}
      </>
    );
  };
});

export const HeaderLeft = defineComponent(() => {
  const { VITE_APP_TITLE } = useConfig();
  return () => {
    return (
      <>
        <div class={css({ fontWeight: "bold", fontSize: 20, marginLeft: 10 })}>{VITE_APP_TITLE}</div>
        <div class={css({ width: 60 })} />
      </>
    );
  };
});

export const HeaderRight = defineComponent(() => {
  const [, setChengState] = useChengState();

  const handleChengClick = () => {
    setChengState({ show: true });
  };

  return () => {
    return (
      <>
        <pro-operate items={[{ value: "value", label: "cheng", onClick: handleChengClick }]} />
        <DemoDataModal />
        <div class={css({ width: 16 })} />
        <Platform />
        <ConfigSet />
      </>
    );
  };
});
