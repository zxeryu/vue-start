import { defineComponent, ref } from "vue";
import { ElDialog } from "element-plus";
import { CurdAction, useProCurd, ProCurdForm } from "@vue-start/pro";
import { omit } from "lodash";
import { columns } from "@/common/columns";
import { userAdd, userDel, userDetail, userEdit, userList } from "@/clients/client";
import { IRequestActor } from "@vue-start/request";

const CurdModal = defineComponent({
  props: {
    ...ElDialog.props,
  },
  setup: (props, { slots }) => {
    const { curdState, getOperate, formProps } = useProCurd();

    const formRef = ref();

    const handleCancel = () => {
      curdState.mode = undefined;
      curdState.detailData = {};
      curdState.detailLoading = false;
      curdState.addAction = undefined;
    };

    return () => {
      return (
        <el-dialog
          key={curdState.mode}
          {...omit(props, "destroyOnClose", "closeOnClickModal", "title", "modelValue")}
          destroyOnClose
          closeOnClickModal={curdState.mode === CurdAction.DETAIL}
          title={props.title || getOperate(curdState.mode!)?.label}
          modelValue={!!curdState.mode}
          onClose={handleCancel}
          v-slots={{
            footer:
              curdState.mode === CurdAction.DETAIL
                ? undefined
                : () => (
                    <div>
                      <el-button onClick={handleCancel}>取消</el-button>
                      <el-button
                        type={"primary"}
                        loading={curdState.operateLoading}
                        onClick={() => {
                          formRef.value?.submit();
                        }}>
                        确认
                      </el-button>
                    </div>
                  ),
            ...slots,
          }}>
          <ProCurdForm ref={formRef} {...formProps?.value} />
        </el-dialog>
      );
    };
  },
});

export default defineComponent(() => {
  const operates = [
    {
      action: CurdAction.LIST,
      actor: userList,
      convertData: (actor: IRequestActor) => {
        const data = actor.res?.data?.data;
        return { total: data?.total, dataSource: data?.list };
      },
    },
    {
      action: CurdAction.DETAIL,
      actor: userDetail,
      convertData: (actor: IRequestActor) => {
        return actor.res?.data?.data;
      },
      show: true,
    },
    {
      action: CurdAction.ADD,
      actor: userAdd,
      convertParams: (body: Record<string, any>) => ({ body }),
      show: true,
    },
    {
      action: CurdAction.EDIT,
      actor: userEdit,
      convertParams: (body: Record<string, any>) => ({ body }),
      show: true,
    },
    {
      action: CurdAction.DELETE,
      actor: userDel,
      show: true,
    },
  ];

  return () => {
    return (
      <pro-modal-curd
        columns={columns}
        operates={operates}
        formProps={{
          labelWidth: 80,
        }}>
        <pro-curd-list />
        <CurdModal />
      </pro-modal-curd>
    );
  };
});
