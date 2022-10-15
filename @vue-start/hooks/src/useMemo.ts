import { useState } from "./useState";
import useEffect from "./useEffect";

export const useMemo = (cb: () => any, deps: any | any[]) => {
  const [state, setState] = useState();

  useEffect(() => {
    setState(cb());
  }, deps);

  return state;
};
