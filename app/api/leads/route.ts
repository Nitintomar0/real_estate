import { NextResponse } from "next/server";
import { connectDB } from "@/components/lib/mongodb";
import Lead from "@/components/lib/models/Lead";
import {
  getVisitorInterestSafeError,
  getVisitorInterestStatus,
  linkVisitorInterestToContact,
} from "@/components/visitor-interest/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

// GET → fetch all leads
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let query: Record<string, unknown> = {};

if (type && type !== "All") {
  query = {
    $or: [
      { type: type },                 // normal data
      { type: { $exists: false } }    // old data (no type)
    ]
  };
}

    const leads = await Lead.find(query).sort({ _id: -1 });

    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Fetch failed" });
  }
}
// POST → add new lead
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);

    if (!isRecord(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // 🔥 FORCE TYPE ALWAYS
    let finalType = "Lead";

    if (body.type === "Visit") finalType = "Visit";
    if (body.type === "Contact") finalType = "Contact";

    const newLead = await Lead.create({
      name: getString(body.name),
      phone: getString(body.phone),
      city: getString(body.city),
      property: getString(body.property),
      email: getString(body.email),
      message: getString(body.message),
      type: finalType, // 🔥 ALWAYS SET
      date: new Date().toLocaleString(),
    });

    const visitorInterest = isRecord(body.visitorInterest)
      ? body.visitorInterest
      : null;
    let visitorInterestRecorded = false;
    let visitorInterestLinked = false;

    if (visitorInterest) {
      const propertyHistory = visitorInterest.propertyHistory;
      const hasPropertyHistory =
        Array.isArray(propertyHistory) && propertyHistory.length > 0;

      try {
        const result = await linkVisitorInterestToContact({
          name: body.name,
          phone: body.phone,
          propertyHistory,
          activity: {
            source: visitorInterest.source,
            sourceLabel: visitorInterest.sourceLabel,
            relatedPropertyId: isRecord(visitorInterest.relatedProperty)
              ? visitorInterest.relatedProperty.id
              : "",
            relatedPropertyTitle: isRecord(visitorInterest.relatedProperty)
              ? visitorInterest.relatedProperty.title
              : getString(body.property),
            details: {
              ...(isRecord(visitorInterest.details)
                ? visitorInterest.details
                : {}),
              city: body.city,
              email: body.email,
              message: body.message,
              preferredDate: body.date,
              leadType: finalType,
            },
          },
        });

        visitorInterestRecorded = result.contactActivityRecorded;
        visitorInterestLinked = result.propertyHistoryLinked;
      } catch (error) {
        if (hasPropertyHistory) {
          return NextResponse.json(
            {
              success: false,
              error: getVisitorInterestSafeError(error),
              leadSaved: true,
            },
            { status: getVisitorInterestStatus(error) }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: newLead,
      visitorInterestRecorded,
      visitorInterestLinked,
    });

  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save" },
      { status: 500 }
    );
  }
}
// DELETE → remove lead
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    await Lead.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" });
  }
}
