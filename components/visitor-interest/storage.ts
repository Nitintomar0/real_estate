import {
  MAX_TEMP_VISITS,
  MINIMUM_MEANINGFUL_VIEW_SECONDS,
  SMART_POPUP_TRIGGER,
  VISITOR_INTEREST_STORAGE_VERSION,
} from "./config";

const HISTORY_KEY = "paramshiv:property-interest:v1";
const SUBMITTED_KEY = "paramshiv:property-interest-submitted:v1";
const DISMISSED_UNTIL_KEY = "paramshiv:property-interest-dismissed-until:v1";

export const VISITOR_INTEREST_CHANGED_EVENT =
  "paramshiv:visitor-interest-changed";
export const VISITOR_INTEREST_FLUSH_EVENT =
  "paramshiv:visitor-interest-flush";

export type TrackableProperty = {
  id: string;
  title: string;
  location?: string;
};

export type StoredVisit = {
  visitId: string;
  activeDurationSeconds: number;
  visitedAt: string;
};

export type StoredPropertyInterest = {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyUrl: string;
  visitCount: number;
  totalActiveTimeSeconds: number;
  visits: StoredVisit[];
};

export type StoredInterestHistory = {
  version: number;
  updatedAt: string;
  properties: StoredPropertyInterest[];
};

export type VisitorInterestSummary = {
  uniqueProperties: number;
  visitCount: number;
  totalActiveTimeSeconds: number;
};

export type VisitorInterestSubmissionProperty = Omit<
  StoredPropertyInterest,
  "visits"
> & {
  visits: StoredVisit[];
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

function emptyHistory(): StoredInterestHistory {
  return {
    version: VISITOR_INTEREST_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    properties: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStoredVisit(value: unknown): value is StoredVisit {
  return (
    isRecord(value) &&
    typeof value.visitId === "string" &&
    typeof value.activeDurationSeconds === "number" &&
    typeof value.visitedAt === "string"
  );
}

function normalizeHistory(value: unknown): StoredInterestHistory {
  if (!isRecord(value) || !Array.isArray(value.properties)) {
    return emptyHistory();
  }

  const properties = value.properties
    .filter(isRecord)
    .map((item) => {
      const visits = Array.isArray(item.visits)
        ? item.visits.filter(isStoredVisit)
        : [];

      return {
        propertyId: String(item.propertyId || "").slice(0, 120),
        propertyTitle: String(item.propertyTitle || "").slice(0, 160),
        propertyLocation: String(item.propertyLocation || "").slice(0, 160),
        propertyUrl: String(item.propertyUrl || "").slice(0, 220),
        visitCount: visits.length,
        totalActiveTimeSeconds: visits.reduce(
          (total, visit) => total + Math.max(0, visit.activeDurationSeconds),
          0
        ),
        visits,
      };
    })
    .filter((item) => item.propertyId && item.propertyTitle);

  return {
    version: VISITOR_INTEREST_STORAGE_VERSION,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date().toISOString(),
    properties,
  };
}

export function readVisitorInterestHistory(): StoredInterestHistory {
  if (!canUseStorage()) return emptyHistory();

  try {
    const rawValue = window.sessionStorage.getItem(HISTORY_KEY);

    if (!rawValue) return emptyHistory();

    return normalizeHistory(JSON.parse(rawValue));
  } catch {
    window.sessionStorage.removeItem(HISTORY_KEY);
    return emptyHistory();
  }
}

function writeVisitorInterestHistory(history: StoredInterestHistory) {
  if (!canUseStorage()) return;

  window.sessionStorage.setItem(
    HISTORY_KEY,
    JSON.stringify({
      ...history,
      updatedAt: new Date().toISOString(),
    })
  );
}

export function getVisitorInterestSummary(
  history = readVisitorInterestHistory()
): VisitorInterestSummary {
  return history.properties.reduce(
    (summary, property) => ({
      uniqueProperties: summary.uniqueProperties + 1,
      visitCount: summary.visitCount + property.visitCount,
      totalActiveTimeSeconds:
        summary.totalActiveTimeSeconds + property.totalActiveTimeSeconds,
    }),
    {
      uniqueProperties: 0,
      visitCount: 0,
      totalActiveTimeSeconds: 0,
    }
  );
}

export function shouldTriggerSmartPopup(summary: VisitorInterestSummary) {
  return (
    summary.visitCount >= SMART_POPUP_TRIGGER.minMeaningfulVisits &&
    summary.uniqueProperties >= SMART_POPUP_TRIGGER.minUniqueProperties &&
    summary.totalActiveTimeSeconds >=
      SMART_POPUP_TRIGGER.minTotalActiveTimeSeconds
  );
}

export function emitVisitorInterestChanged() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(VISITOR_INTEREST_CHANGED_EVENT, {
      detail: getVisitorInterestSummary(),
    })
  );
}

export function recordMeaningfulPropertyVisit({
  property,
  visit,
}: {
  property: TrackableProperty;
  visit: StoredVisit;
}) {
  const activeDurationSeconds = Math.floor(visit.activeDurationSeconds);

  if (activeDurationSeconds < MINIMUM_MEANINGFUL_VIEW_SECONDS) {
    return;
  }

  const history = readVisitorInterestHistory();
  const propertyUrl =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "";

  let propertyEntry = history.properties.find(
    (item) => item.propertyId === property.id
  );

  if (!propertyEntry) {
    propertyEntry = {
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location || "",
      propertyUrl,
      visitCount: 0,
      totalActiveTimeSeconds: 0,
      visits: [],
    };
    history.properties.push(propertyEntry);
  }

  propertyEntry.propertyTitle = property.title;
  propertyEntry.propertyLocation = property.location || "";
  propertyEntry.propertyUrl = propertyUrl;

  const existingVisit = propertyEntry.visits.find(
    (item) => item.visitId === visit.visitId
  );

  if (existingVisit) {
    existingVisit.activeDurationSeconds = activeDurationSeconds;
  } else {
    propertyEntry.visits.push({
      ...visit,
      activeDurationSeconds,
    });
  }

  const allVisits = history.properties
    .flatMap((item) =>
      item.visits.map((storedVisit) => ({
        propertyId: item.propertyId,
        visit: storedVisit,
      }))
    )
    .sort(
      (a, b) =>
        new Date(a.visit.visitedAt).getTime() -
        new Date(b.visit.visitedAt).getTime()
    );

  while (allVisits.length > MAX_TEMP_VISITS) {
    const oldest = allVisits.shift();
    const entry = history.properties.find(
      (item) => item.propertyId === oldest?.propertyId
    );

    if (entry && oldest) {
      entry.visits = entry.visits.filter(
        (storedVisit) => storedVisit.visitId !== oldest.visit.visitId
      );
    }
  }

  history.properties = history.properties
    .map((item) => {
      const totalActiveTimeSeconds = item.visits.reduce(
        (total, storedVisit) => total + storedVisit.activeDurationSeconds,
        0
      );

      return {
        ...item,
        visitCount: item.visits.length,
        totalActiveTimeSeconds,
      };
    })
    .filter((item) => item.visitCount > 0);

  writeVisitorInterestHistory(history);
  emitVisitorInterestChanged();
}

export function getVisitorInterestSubmissionPayload() {
  const history = readVisitorInterestHistory();

  return history.properties.map<VisitorInterestSubmissionProperty>((item) => ({
    propertyId: item.propertyId,
    propertyTitle: item.propertyTitle,
    propertyLocation: item.propertyLocation,
    propertyUrl: item.propertyUrl,
    visitCount: item.visitCount,
    totalActiveTimeSeconds: item.totalActiveTimeSeconds,
    visits: item.visits.map(({ visitId, activeDurationSeconds, visitedAt }) => ({
      visitId,
      activeDurationSeconds,
      visitedAt,
    })),
  }));
}

export function clearVisitorInterestHistory() {
  if (!canUseStorage()) return;

  window.sessionStorage.removeItem(HISTORY_KEY);
  emitVisitorInterestChanged();
}

export function requestActiveVisitorInterestFlush() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(VISITOR_INTEREST_FLUSH_EVENT));
}

export function hasVisitorInterestSubmitted() {
  if (typeof window === "undefined") return false;

  return Boolean(window.localStorage.getItem(SUBMITTED_KEY));
}

export function markVisitorInterestSubmitted() {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(SUBMITTED_KEY, new Date().toISOString());
}

export function isVisitorInterestDismissed() {
  if (typeof window === "undefined") return false;

  const dismissedUntil = Number(
    window.localStorage.getItem(DISMISSED_UNTIL_KEY)
  );

  if (!Number.isFinite(dismissedUntil)) {
    window.localStorage.removeItem(DISMISSED_UNTIL_KEY);
    return false;
  }

  if (dismissedUntil <= Date.now()) {
    window.localStorage.removeItem(DISMISSED_UNTIL_KEY);
    return false;
  }

  return true;
}

export function dismissVisitorInterestPopup(
  durationMs = SMART_POPUP_TRIGGER.dismissForMs
) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    DISMISSED_UNTIL_KEY,
    String(Date.now() + durationMs)
  );
}
