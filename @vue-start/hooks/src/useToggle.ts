import { shallowRef } from "vue";
type IState = string | number | boolean | undefined;

export interface Actions<T = IState> {
  setLeft: () => void;
  setRight: () => void;
  toggle: (value?: T) => void;
}

function useToggle<T = boolean | undefined>(): [T: Actions<T>];
function useToggle<T = IState>(defaultValue: T): [T, Actions<T>];
function useToggle<T = IState, U = IState>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];
function useToggle<D extends IState = IState, R extends IState = IState>(
  defaultValue: D = false as D,
  reverseValue?: R,
) {
  const state = shallowRef<D | R>(defaultValue);
  //init reverse value
  const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

  const toggle = (value?: D | R) => {
    if (value !== undefined) {
      state.value = value;
      return;
    }
    state.value = state.value === defaultValue ? reverseValueOrigin : defaultValue;
  };

  const setLeft = () => (state.value = defaultValue);
  const setRight = () => (state.value = reverseValueOrigin);

  return [state, { toggle, setLeft, setRight }];
}

export default useToggle;
