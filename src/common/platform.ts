const PlatformKey = "platform";

export const getPlatform = () => {
  return localStorage.getItem(PlatformKey) || "element-plus";
};

export const setPlatform = (platform: string) => {
  localStorage.setItem(PlatformKey, platform);
};

export const PlatformOptions = [
  { value: "element-plus", label: "el" },
  { value: "ant-design-vue", label: "ant" },
];

export const isElementPlus = () => {
  return getPlatform() === "element-plus";
};
