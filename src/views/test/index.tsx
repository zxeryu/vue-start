import { defineComponent, reactive } from "vue";
import { css } from "@emotion/css";
import { ProTypography, ProShowText, ProShowDigit, ProShowOptions, ProShowTree, ProShowDate } from "@vue-start/pro";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

export default defineComponent(() => {
  const router = useRouter();

  const state = reactive({
    fillMode: true,
    showFooter: true,
  });

  const handleOpeFill = () => {
    state.fillMode = !state.fillMode;
  };

  const handleOpeFooter = () => {
    state.showFooter = !state.showFooter;
  };

  return () => {
    return (
      <pro-page
        // loading
        fillMode={state.fillMode}
        title={"这是一个标题"}
        subTitle={"这是一个副标题"}
        // fillMode={false}
        v-slots={{
          extra: () => <div>extra</div>,
          footer: () => {
            if (!state.showFooter) {
              return null;
            }
            return <>底部内容</>;
          },
        }}>
        Test
        <div onClick={() => router.push({ name: "TestDetail" })}>to detail</div>
        <div onClick={() => router.push({ name: "TestDetail", query: { id: "1234", title: "1245" } })}>
          to detail with query
        </div>
        <div onClick={handleOpeFill}>{state.fillMode ? "不固定" : "固定"} header footer</div>
        <div onClick={handleOpeFooter}>{state.showFooter ? "关闭" : "打开"}footer</div>
        <div
          class={css({
            width: 300,
            height: 300,
            border: "1px solid #999",
          })}>
          <ProTypography content={"这是一段文本内容111"} />
          <br />
          <ProTypography content={"这是一段文本内容文本内容文本内容文本内容文本内容文本内容"} ellipsis />
          <br />
          <ProTypography
            content={
              "这是一段文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容"
            }
            ellipsis={{
              rows: 2,
            }}
          />
          <br />
          <ProShowText
            value={
              "这是一段文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容"
            }
            showProps={{
              ellipsis: true,
              popoverProps: {},
            }}
          />
          <br />
          <ProShowDigit value={"12346525.123"} decimalFixed={2} thousandDivision />
          <br />
          <ProShowOptions
            value={"1"}
            options={[
              { value: "1", label: "1-label" },
              { value: "2", label: "2-label" },
            ]}
            colorMap={{ "1": "red", "2": "green" }}
          />
          <br />
          <ProShowTree
            value={["1-1", "2-1"]}
            fieldNames={{ value: "id" }}
            options={[
              {
                id: "1",
                label: "1-label",
                children: [
                  { id: "1-1", label: "1-1-label" },
                  { id: "2-1", label: "2-1-label" },
                ],
              },
              { id: "2", label: "2-label" },
            ]}
          />
        </div>
        <br />
        <ProShowDate value={dayjs().valueOf()} />
        <br />
        <ProShowDate value={dayjs().unix()} isUnix format={"YYYY-MM-DD HH:mm:ss"} />
        <div class={css({ height: 900, backgroundColor: "pink" })} />
        <div>end</div>
      </pro-page>
    );
  };
});
