import { createIconButtonPreset } from "./icon-button-factory";

/** 顶栏 / 工具带：ghost + sm */
export const IconButtonGhostSm = createIconButtonPreset({
  tone: "ghost",
  size: "sm",
  type: "button",
  loading: false,
});

/** 块内工具：ghost + md */
export const IconButtonGhostMd = createIconButtonPreset({
  tone: "ghost",
  size: "md",
  type: "button",
  loading: false,
});
