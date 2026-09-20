export function sanitizeVisitorName(value: unknown) {
  if (typeof value !== "string") return "";

  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

export function validateVisitorName(value: unknown) {
  const name = sanitizeVisitorName(value);

  if (name.length < 2) {
    return {
      value: "",
      error: "Please enter your full name.",
    };
  }

  return {
    value: name,
    error: "",
  };
}

export function normalizeIndianMobileNumber(value: unknown) {
  if (typeof value !== "string") return null;

  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("0091")) {
    digits = digits.slice(4);
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return null;
  }

  return digits;
}

export function formatIndianMobileNumber(value: string) {
  return `+91 ${value}`;
}
