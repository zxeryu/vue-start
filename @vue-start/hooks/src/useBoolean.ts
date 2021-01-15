import useToggle from "./useToggle";

interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  toggle: (value?: boolean | undefined) => void;
}

export default function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, { toggle }] = useToggle(defaultValue);

  const setTrue = () => toggle(true);
  const setFalse = () => toggle(false);

  return [state, { toggle, setTrue, setFalse }];
}
