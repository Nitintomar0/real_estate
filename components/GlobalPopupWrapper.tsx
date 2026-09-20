"use client";

import { useEffect, useRef, useState } from "react";
import LeadPopup from "./LeadPopup";
import FloatingContact from "./FloatingContact";
import {
  dismissVisitorInterestPopup,
  getVisitorInterestSummary,
  hasVisitorInterestSubmitted,
  isVisitorInterestDismissed,
  shouldTriggerSmartPopup,
  VISITOR_INTEREST_CHANGED_EVENT,
  VisitorInterestSummary,
} from "@/components/visitor-interest/storage";
import { SMART_POPUP_TRIGGER } from "@/components/visitor-interest/config";


export default function GlobalPopupWrapper() {
  const [popupOpen, setPopupOpen] = useState(false);
  const autoOpenTimer = useRef<number | null>(null);

  useEffect(() => {
    const openPopup = () => setPopupOpen(true);

    window.addEventListener("open-global-popup", openPopup);

    return () => {
      window.removeEventListener("open-global-popup", openPopup);
    };
  }, []);

  useEffect(() => {
    const clearAutoTimer = () => {
      if (autoOpenTimer.current) {
        window.clearTimeout(autoOpenTimer.current);
        autoOpenTimer.current = null;
      }
    };

    const maybeOpenSmartPopup = (summary?: VisitorInterestSummary) => {
      if (
        popupOpen ||
        hasVisitorInterestSubmitted() ||
        isVisitorInterestDismissed()
      ) {
        return;
      }

      const currentSummary = summary || getVisitorInterestSummary();

      if (!shouldTriggerSmartPopup(currentSummary)) {
        return;
      }

      clearAutoTimer();
      autoOpenTimer.current = window.setTimeout(() => {
        if (
          !hasVisitorInterestSubmitted() &&
          !isVisitorInterestDismissed()
        ) {
          setPopupOpen(true);
        }
      }, SMART_POPUP_TRIGGER.autoOpenDelayMs);
    };

    const handleHistoryChanged = (event: Event) => {
      const summary = (event as CustomEvent<VisitorInterestSummary>).detail;
      maybeOpenSmartPopup(summary);
    };

    maybeOpenSmartPopup();
    window.addEventListener(
      VISITOR_INTEREST_CHANGED_EVENT,
      handleHistoryChanged
    );

    return () => {
      clearAutoTimer();
      window.removeEventListener(
        VISITOR_INTEREST_CHANGED_EVENT,
        handleHistoryChanged
      );
    };
  }, [popupOpen]);

  return (
    
    <>
      <FloatingContact setPopupOpen={setPopupOpen} />

      <LeadPopup
        isOpen={popupOpen}
        setIsOpen={setPopupOpen}
        onDismiss={() => dismissVisitorInterestPopup()}
      />
    </>
  );
}
