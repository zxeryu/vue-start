import { useEventListener } from "@vue-start/hooks";
import { computed, ref } from "vue";

export const DEVICE_MODES = {
  MOBILE: "mobile",
  TABLET: "tablet",
  PC: "pc",
  LARGE_PC: "large-pc",
};

export type TDeviceMode = typeof DEVICE_MODES[keyof typeof DEVICE_MODES];

export const getDeviceMode = (width: number) => {
  if (width < 768) {
    return DEVICE_MODES.MOBILE;
  } else if (width < 1024) {
    return DEVICE_MODES.TABLET;
  } else if (width >= 2560) {
    return DEVICE_MODES.LARGE_PC;
  }

  return DEVICE_MODES.PC;
};

export const useResponsive = () => {
  const width = ref(window.innerWidth);
  const device = computed(() => getDeviceMode(width.value));

  const isMobile = computed(() => device.value === DEVICE_MODES.MOBILE);
  const isTablet = computed(() => device.value === DEVICE_MODES.TABLET);
  const isPC = computed(() => device.value === DEVICE_MODES.PC);
  const isLargePC = computed(() => device.value === DEVICE_MODES.LARGE_PC);

  useEventListener("resize", () => {
    width.value = window.innerWidth;
  });

  return { width, device, isMobile, isTablet, isPC, isLargePC };
};
