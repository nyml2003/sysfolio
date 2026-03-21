import { useState } from "react";

import { usePreferences } from "@/shared/store/preferences/PreferencesProvider";

import styles from "./OnboardingHints.module.css";

const tips = [
  {
    id: "tree",
    label: "左侧浏览文件和目录。",
    dotStyle: { top: "25%", left: "13%" },
    popoverStyle: { top: "28%", left: "15%" },
  },
  {
    id: "content",
    label: "中间查看首页、目录或阅读当前文件。",
    dotStyle: { top: "23%", left: "50%" },
    popoverStyle: { top: "26%", left: "52%" },
  },
  {
    id: "path",
    label: "这里查看当前所在路径并切换主题。",
    dotStyle: { top: "6%", left: "53%" },
    popoverStyle: { top: "8%", left: "55%" },
  },
] as const;

export function OnboardingHints() {
  const { onboardingVisible, dismissOnboarding } = usePreferences();
  const [activeTipId, setActiveTipId] = useState<string>("tree");

  if (!onboardingVisible) {
    return null;
  }

  const activeTip = tips.find((tip) => tip.id === activeTipId) ?? tips[0];

  return (
    <div
      className={styles.root}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          dismissOnboarding();
        }
      }}
      role="presentation"
    >
      {tips.map((tip) => (
        <button
          className={styles.dot}
          key={tip.id}
          onClick={(event) => {
            event.stopPropagation();
            setActiveTipId(tip.id);
          }}
          style={tip.dotStyle}
          type="button"
        />
      ))}
      <div
        className={styles.popover}
        onClick={(event) => {
          event.stopPropagation();
        }}
        style={activeTip.popoverStyle}
      >
        <div className={styles.popoverBody}>{activeTip.label}</div>
        <button
          className={styles.dismiss}
          onClick={() => {
            dismissOnboarding();
          }}
          type="button"
        >
          知道了
        </button>
      </div>
    </div>
  );
}
