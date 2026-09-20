import {
  clearVisitorInterestHistory,
  getVisitorInterestSubmissionPayload,
  markVisitorInterestSubmitted,
  requestActiveVisitorInterestFlush,
} from "@/components/visitor-interest/storage";
import {
  normalizeIndianMobileNumber,
  sanitizeVisitorName,
} from "@/components/visitor-interest/validation";

type LeadPayload = {
  name: string;
  phone: string;
  city?: string;
  property?: string;
  email?: string;
  message?: string;
  date?: string;
  type?: string;
};

type RelatedProperty = {
  id?: string;
  title?: string;
};

type VisitorInterestActivity = {
  source: string;
  sourceLabel: string;
  relatedProperty?: RelatedProperty;
  details?: {
    city?: string;
    email?: string;
    message?: string;
    preferredDate?: string;
    leadType?: string;
  };
};

type SubmitLeadOptions = {
  lead: LeadPayload;
  activity: VisitorInterestActivity;
  endpoint?: string;
};

export class VisitorInterestSubmitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VisitorInterestSubmitError";
  }
}

export async function submitLeadWithVisitorInterest({
  lead,
  activity,
  endpoint = "/api/leads",
}: SubmitLeadOptions) {
  const name = sanitizeVisitorName(lead.name);
  const normalizedPhone = normalizeIndianMobileNumber(lead.phone);

  if (name.length < 2) {
    throw new VisitorInterestSubmitError("Please enter a valid name.");
  }

  if (!normalizedPhone) {
    throw new VisitorInterestSubmitError(
      "Please enter a valid Indian mobile number."
    );
  }

  requestActiveVisitorInterestFlush();

  const propertyHistory = getVisitorInterestSubmissionPayload();
  const hasPropertyHistory = propertyHistory.length > 0;
  const payload = {
    ...lead,
    name,
    phone: normalizedPhone,
    visitorInterest: {
      ...activity,
      propertyHistory,
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);

  if (!res.ok || data?.success === false) {
    throw new VisitorInterestSubmitError(
      data?.error || "Unable to submit your details."
    );
  }

  if (data?.visitorInterestRecorded) {
    markVisitorInterestSubmitted();
  }

  if (hasPropertyHistory && data?.visitorInterestLinked) {
    clearVisitorInterestHistory();
  }

  return data;
}
