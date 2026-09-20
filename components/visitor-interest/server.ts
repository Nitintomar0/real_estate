import VisitorInterest, {
  VisitorContactActivity,
  VisitorInterestDocument,
  VisitorInterestProperty,
  VisitorInterestVisit,
} from "@/components/lib/models/VisitorInterest";
import {
  MAX_ACTIVE_SECONDS_PER_VISIT,
  MAX_PROPERTIES_PER_SUBMISSION,
  MAX_VISITS_PER_SUBMISSION,
  MINIMUM_MEANINGFUL_VIEW_SECONDS,
} from "@/components/visitor-interest/config";
import {
  normalizeIndianMobileNumber,
  sanitizeVisitorName,
} from "@/components/visitor-interest/validation";

type IncomingPropertyHistory = {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyUrl: string;
  visitCount: number;
  totalActiveTimeSeconds: number;
  visits: VisitorInterestVisit[];
};

export type VisitorInterestActivityInput = {
  source?: unknown;
  sourceLabel?: unknown;
  relatedPropertyId?: unknown;
  relatedPropertyTitle?: unknown;
  details?: unknown;
};

export type LinkVisitorInterestInput = {
  name: unknown;
  phone: unknown;
  propertyHistory?: unknown;
  activity?: VisitorInterestActivityInput;
};

export class VisitorInterestValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "VisitorInterestValidationError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";

  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function sanitizePropertyHistory(value: unknown): IncomingPropertyHistory[] {
  if (!Array.isArray(value)) return [];

  const grouped = new Map<string, IncomingPropertyHistory>();
  const seenVisits = new Set<string>();
  let acceptedVisitCount = 0;

  for (const rawProperty of value.slice(0, MAX_PROPERTIES_PER_SUBMISSION)) {
    if (!isRecord(rawProperty)) continue;

    const propertyId = sanitizeString(rawProperty.propertyId, 120);
    const propertyTitle = sanitizeString(rawProperty.propertyTitle, 160);

    if (!propertyId || !propertyTitle) continue;

    const rawVisits = Array.isArray(rawProperty.visits)
      ? rawProperty.visits
      : [];

    for (const rawVisit of rawVisits) {
      if (!isRecord(rawVisit)) continue;
      if (acceptedVisitCount >= MAX_VISITS_PER_SUBMISSION) break;

      const activeDurationSeconds = Math.min(
        Math.floor(Number(rawVisit.activeDurationSeconds)),
        MAX_ACTIVE_SECONDS_PER_VISIT
      );

      if (
        !Number.isFinite(activeDurationSeconds) ||
        activeDurationSeconds < MINIMUM_MEANINGFUL_VIEW_SECONDS
      ) {
        continue;
      }

      const visitedAt = new Date(String(rawVisit.visitedAt || ""));
      const safeVisitedAt = Number.isNaN(visitedAt.getTime())
        ? new Date()
        : visitedAt;
      const clientVisitId = sanitizeString(rawVisit.visitId, 180);
      const visitKey =
        clientVisitId ||
        `${propertyId}:${safeVisitedAt.toISOString()}:${activeDurationSeconds}`;

      if (seenVisits.has(visitKey)) continue;

      seenVisits.add(visitKey);
      acceptedVisitCount += 1;

      const existing = grouped.get(propertyId);
      const propertyLocation = sanitizeString(
        rawProperty.propertyLocation,
        160
      );
      const propertyUrl = sanitizeString(rawProperty.propertyUrl, 220);
      const visit = {
        clientVisitId,
        activeDurationSeconds,
        visitedAt: safeVisitedAt,
      };

      if (existing) {
        existing.visits.push(visit);
        existing.visitCount = existing.visits.length;
        existing.totalActiveTimeSeconds += activeDurationSeconds;
      } else {
        grouped.set(propertyId, {
          propertyId,
          propertyTitle,
          propertyLocation,
          propertyUrl,
          visitCount: 1,
          totalActiveTimeSeconds: activeDurationSeconds,
          visits: [visit],
        });
      }
    }
  }

  return Array.from(grouped.values());
}

function sanitizeActivity(
  value: VisitorInterestActivityInput | undefined
): VisitorContactActivity {
  const details = isRecord(value?.details) ? value?.details : {};
  const source = sanitizeString(value?.source, 80) || "unknown_form";

  return {
    source,
    sourceLabel: sanitizeString(value?.sourceLabel, 120) || source,
    submittedAt: new Date(),
    relatedPropertyId: sanitizeString(value?.relatedPropertyId, 120),
    relatedPropertyTitle: sanitizeString(value?.relatedPropertyTitle, 160),
    details: {
      city: sanitizeString(details.city, 120),
      email: sanitizeString(details.email, 160),
      message: sanitizeString(details.message, 500),
      preferredDate: sanitizeString(details.preferredDate, 80),
      leadType: sanitizeString(details.leadType, 80),
    },
  };
}

function dedupeVisitKey(propertyId: string, visit: VisitorInterestVisit) {
  return (
    visit.clientVisitId ||
    `${propertyId}:${visit.visitedAt.toISOString()}:${visit.activeDurationSeconds}`
  );
}

function mergePropertyHistory(
  visitor: VisitorInterestDocument,
  incomingHistory: IncomingPropertyHistory[]
) {
  for (const incomingProperty of incomingHistory) {
    const existingProperty = visitor.propertyHistory.find(
      (item) => item.propertyId === incomingProperty.propertyId
    );

    if (existingProperty) {
      const existingVisitKeys = new Set(
        existingProperty.visits.map((visit) =>
          dedupeVisitKey(existingProperty.propertyId, visit)
        )
      );
      const freshVisits = incomingProperty.visits.filter((visit) => {
        const visitKey = dedupeVisitKey(incomingProperty.propertyId, visit);

        if (existingVisitKeys.has(visitKey)) return false;

        existingVisitKeys.add(visitKey);
        return true;
      });

      existingProperty.propertyTitle =
        incomingProperty.propertyTitle || existingProperty.propertyTitle;
      existingProperty.propertyLocation =
        incomingProperty.propertyLocation ||
        existingProperty.propertyLocation ||
        "";
      existingProperty.propertyUrl =
        incomingProperty.propertyUrl || existingProperty.propertyUrl || "";
      existingProperty.visits.push(...freshVisits);
      existingProperty.visits.sort(
        (a, b) => a.visitedAt.getTime() - b.visitedAt.getTime()
      );
      existingProperty.visitCount = existingProperty.visits.length;
      existingProperty.totalActiveTimeSeconds =
        existingProperty.visits.reduce(
          (total, visit) => total + visit.activeDurationSeconds,
          0
        );
    } else {
      visitor.propertyHistory.push(incomingProperty as VisitorInterestProperty);
    }
  }

  visitor.markModified("propertyHistory");
}

function isDuplicateKeyError(error: unknown) {
  return isRecord(error) && error.code === 11000;
}

async function createOrMergeVisitor({
  name,
  normalizedPhone,
  propertyHistory,
  activity,
}: {
  name: string;
  normalizedPhone: string;
  propertyHistory: IncomingPropertyHistory[];
  activity: VisitorContactActivity;
}) {
  const existingVisitor = await VisitorInterest.findOne({
    normalizedPhone,
  });

  if (existingVisitor) {
    existingVisitor.propertyHistory = existingVisitor.propertyHistory || [];
    existingVisitor.contactActivities = existingVisitor.contactActivities || [];
    existingVisitor.name = name;
    existingVisitor.phone = normalizedPhone;
    mergePropertyHistory(existingVisitor, propertyHistory);
    existingVisitor.contactActivities.push(activity);
    existingVisitor.markModified("contactActivities");
    await existingVisitor.save();
    return existingVisitor;
  }

  return VisitorInterest.create({
    name,
    phone: normalizedPhone,
    normalizedPhone,
    firstCapturedAt: new Date(),
    propertyHistory,
    contactActivities: [activity],
  });
}

export async function linkVisitorInterestToContact({
  name: rawName,
  phone: rawPhone,
  propertyHistory: rawPropertyHistory,
  activity: rawActivity,
}: LinkVisitorInterestInput) {
  const name = sanitizeVisitorName(rawName);
  const normalizedPhone = normalizeIndianMobileNumber(rawPhone);
  const propertyHistory = sanitizePropertyHistory(rawPropertyHistory);
  const activity = sanitizeActivity(rawActivity);

  if (name.length < 2) {
    throw new VisitorInterestValidationError(
      "Please enter a valid full name."
    );
  }

  if (!normalizedPhone) {
    throw new VisitorInterestValidationError(
      "Please enter a valid Indian mobile number."
    );
  }

  try {
    const visitor = await createOrMergeVisitor({
      name,
      normalizedPhone,
      propertyHistory,
      activity,
    });

    return {
      visitor,
      normalizedPhone,
      propertyHistoryLinked: propertyHistory.length > 0,
      contactActivityRecorded: true,
    };
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    const visitor = await createOrMergeVisitor({
      name,
      normalizedPhone,
      propertyHistory,
      activity,
    });

    return {
      visitor,
      normalizedPhone,
      propertyHistoryLinked: propertyHistory.length > 0,
      contactActivityRecorded: true,
    };
  }
}

export function getVisitorInterestStatus(error: unknown) {
  return error instanceof VisitorInterestValidationError ? error.status : 500;
}

export function getVisitorInterestSafeError(error: unknown) {
  if (error instanceof VisitorInterestValidationError) {
    return error.message;
  }

  if (error instanceof Error && error.message === "MONGODB_URI is not configured") {
    return "MongoDB is not configured.";
  }

  return "Unable to save visitor interest.";
}
