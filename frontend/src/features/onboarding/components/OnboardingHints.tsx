import { useState } from "react";

import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import { usePreferences } from "@/shared/store/preferences";
import { Button } from "@/shared/ui/primitives";

import styles from "./OnboardingHints.module.css";

const tipLayout = [
  {
    id: "tree",
    dotStyle: { top: "25%", left: "13%" },
    popoverStyle: { top: "28%", left: "15%" },
  },
  {
    id: "content",
    dotStyle: { top: "23%", left: "50%" },
    popoverStyle: { top: "26%", left: "52%" },
  },
  {
    id: "path",
    dotStyle: { top: "6%", left: "53%" },
    popoverStyle: { top: "8%", left: "55%" },
  },
] as const;

export function OnboardingHints() {
  const { onboardingVisible, dismissOnboarding } = usePreferences();
  const copy = useUiCopy();
  const [activeTipId, setActiveTipId] = useState<string>("tree");

  const tips = [
    { ...tipLayout[0], label: copy.onboarding.treeTip },
    { ...tipLayout[1], label: copy.onboarding.contentTip },
    { ...tipLayout[2], label: copy.onboarding.pathTip },
  ] as const;

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
        <Button
          className={styles.dot}
          key={tip.id}
          onClick={(event) => {
            event.stopPropagation();
            setActiveTipId(tip.id);
          }}
          style={tip.dotStyle}
          tone="ghost"
          type="button"
        >
          {null}
        </Button>
      ))}
      <div
        className={styles.popover}
        onClick={(event) => {
          event.stopPropagation();
        }}
        style={activeTip.popoverStyle}
      >
        <div className={styles.popoverBody}>{activeTip.label}</div>
        <Button
          className={styles.dismiss}
          onClick={() => {
            dismissOnboarding();
          }}
          tone="ghost"
          type="button"
        >
          {copy.onboarding.dismiss}
        </Button>
      </div>
    </div>
  );
}
