import { UnwrapNestedRefs } from "vue";
import { createStateUse } from "@vue-start/store";

const useAccessState = createStateUse("access", undefined, true);

export interface IAccess extends Record<string, any> {
  token?: string;
}

export type TAccess = UnwrapNestedRefs<IAccess>;

export const useAccess = (): { access: TAccess; setAccess: (access: TAccess) => void; delAccess: () => void } => {
  const [access, setAccess] = useAccessState();

  const delAccess = () => {
    setAccess(undefined);
  };

  return { access, setAccess: setAccess as any, delAccess };
};

export const useAccessMgr = () => {
  const [access, setAccess] = useAccessState();

  const deleteAccess = () => {
    setAccess(undefined);
  };

  return [access, setAccess, deleteAccess] as const;
};
