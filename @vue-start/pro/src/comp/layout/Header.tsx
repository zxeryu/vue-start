import { defineComponent } from "vue";

export const Header = defineComponent((_, { slots }) => {
  return () => {
    return (
      <header>
        {slots.start?.()}

        {slots.menus?.()}
        {slots.default?.()}

        {slots.end?.()}
      </header>
    );
  };
});
