import { defineComponent, ref } from "vue";
import { useConfig } from "@vue-start/config";
import { css } from "@emotion/css";
import { getPlatform, PlatformOptions, setPlatform } from "@/common/platform";
import { columnStr } from "@/common/columns";
import { useEffect } from "@vue-start/hooks";
import {} from "./";
import { TopMenu } from "@/layout/Menu";

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

export const Header = defineComponent(() => {
  const { VITE_APP_TITLE } = useConfig();

  return () => {
    return (
      <header
        class={css({
          display: "flex",
          alignItems: "center",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          padding: "0 16px",
          height: "var(--header-hei)",
        })}>
        <div class={css({ fontWeight: "bold", fontSize: 20 })}>{VITE_APP_TITLE}</div>
        <div class={css({ width: 60 })} />
        <TopMenu />
        <div class={css({ flexGrow: 1 })} />
        <DemoDataModal />
        <div class={css({ width: 16 })} />
        <Platform />
      </header>
    );
  };
});
