export const VISITOR_INTEREST_STORAGE_VERSION = 1;

export const MINIMUM_MEANINGFUL_VIEW_SECONDS = 10;

export const SMART_POPUP_TRIGGER = {
  minMeaningfulVisits: 1,
  minUniqueProperties: 1,
  minTotalActiveTimeSeconds: 20,
  autoOpenDelayMs: 1200,
  dismissForMs: 6 * 60 * 60 * 1000,
};

export const MAX_TEMP_VISITS = 50;
export const MAX_PROPERTIES_PER_SUBMISSION = 20;
export const MAX_VISITS_PER_SUBMISSION = 50;
export const MAX_ACTIVE_SECONDS_PER_VISIT = 8 * 60 * 60;
