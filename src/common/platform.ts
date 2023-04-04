const PlatformKey = "platform";

export const getPlatform = () => {
  return localStorage.getItem(PlatformKey);
};

export const setPlatform = (platform: string) => {
  localStorage.setItem(PlatformKey, platform);
};

export const PlatformOptions = [
  { value: "element-plus", label: "element" },
  { value: "ant-design-vue", label: "antv" },
];

export const isElementPlus = () => {
  return getPlatform() === "element-plus";
};
