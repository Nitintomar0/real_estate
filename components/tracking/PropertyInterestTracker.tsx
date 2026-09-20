"use client";

import { useEffect, useRef } from "react";
import {
  MINIMUM_MEANINGFUL_VIEW_SECONDS,
  SMART_POPUP_TRIGGER,
} from "@/components/visitor-interest/config";
import {
  recordMeaningfulPropertyVisit,
  TrackableProperty,
  VISITOR_INTEREST_FLUSH_EVENT,
} from "@/components/visitor-interest/storage";

function isDocumentActive() {
  if (typeof document === "undefined") return false;

  return document.visibilityState === "visible" && document.hasFocus();
}

export default function PropertyInterestTracker({
  property,
}: {
  property: TrackableProperty;
}) {
  const propertyId = property.id;
  const propertyTitle = property.title;
  const propertyLocation = property.location || "";
  const visitedAtRef = useRef(new Date().toISOString());
  const activeStartedAtRef = useRef<number | null>(null);
  const activeMsRef = useRef(0);
  const checkpointTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const trackedProperty = {
      id: propertyId,
      title: propertyTitle,
      location: propertyLocation,
    };
    const visitId = `${propertyId}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;

    visitedAtRef.current = new Date().toISOString();
    activeStartedAtRef.current = null;
    activeMsRef.current = 0;

    const clearCheckpointTimer = () => {
      if (checkpointTimerRef.current) {
        window.clearTimeout(checkpointTimerRef.current);
        checkpointTimerRef.current = null;
      }
    };

    const getActiveSeconds = () => {
      const activeStartedAt = activeStartedAtRef.current;
      const activeMs =
        activeMsRef.current +
        (activeStartedAt !== null ? performance.now() - activeStartedAt : 0);

      return Math.floor(activeMs / 1000);
    };

    const flushVisit = () => {
      const activeDurationSeconds = getActiveSeconds();

      recordMeaningfulPropertyVisit({
        property: trackedProperty,
        visit: {
          visitId,
          activeDurationSeconds,
          visitedAt: visitedAtRef.current,
        },
      });
    };

    const scheduleCheckpoint = () => {
      clearCheckpointTimer();

      if (activeStartedAtRef.current === null) return;

      const activeSeconds = getActiveSeconds();
      const nextCheckpoint = [
        MINIMUM_MEANINGFUL_VIEW_SECONDS,
        SMART_POPUP_TRIGGER.minTotalActiveTimeSeconds,
      ]
        .filter((checkpoint) => checkpoint > activeSeconds)
        .sort((a, b) => a - b)[0];

      if (!nextCheckpoint) return;

      checkpointTimerRef.current = window.setTimeout(() => {
        flushVisit();
        scheduleCheckpoint();
      }, Math.max(250, (nextCheckpoint - activeSeconds) * 1000));
    };

    const startActiveTimer = () => {
      if (activeStartedAtRef.current !== null) return;

      activeStartedAtRef.current = performance.now();
      scheduleCheckpoint();
    };

    const pauseActiveTimer = () => {
      if (activeStartedAtRef.current === null) return;

      activeMsRef.current += performance.now() - activeStartedAtRef.current;
      activeStartedAtRef.current = null;
      clearCheckpointTimer();
      flushVisit();
    };

    const syncActiveState = () => {
      if (isDocumentActive()) {
        startActiveTimer();
      } else {
        pauseActiveTimer();
      }
    };

    syncActiveState();

    document.addEventListener("visibilitychange", syncActiveState);
    window.addEventListener("focus", syncActiveState);
    window.addEventListener("blur", syncActiveState);
    window.addEventListener("pagehide", pauseActiveTimer);
    window.addEventListener(VISITOR_INTEREST_FLUSH_EVENT, flushVisit);

    return () => {
      pauseActiveTimer();
      clearCheckpointTimer();
      document.removeEventListener("visibilitychange", syncActiveState);
      window.removeEventListener("focus", syncActiveState);
      window.removeEventListener("blur", syncActiveState);
      window.removeEventListener("pagehide", pauseActiveTimer);
      window.removeEventListener(VISITOR_INTEREST_FLUSH_EVENT, flushVisit);
    };
  }, [propertyId, propertyLocation, propertyTitle]);

  return null;
}
