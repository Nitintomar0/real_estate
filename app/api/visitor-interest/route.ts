import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/components/lib/mongodb";
import { isAdminRequest } from "@/components/lib/adminAuth";
import VisitorInterest from "@/components/lib/models/VisitorInterest";
import {
  getVisitorInterestSafeError,
  getVisitorInterestStatus,
  linkVisitorInterestToContact,
} from "@/components/visitor-interest/server";

export const dynamic = "force-dynamic";

type VisitorListItem = {
  _id: string;
  name: string;
  phone: string;
  firstCapturedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  propertyCount: number;
  totalVisitCount: number;
  totalActiveTimeSeconds: number;
  contactActivityCount: number;
  propertyPreview: string[];
};

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";

  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) return fallback;

  return parsed;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    const result = await linkVisitorInterestToContact({
      name: body?.name,
      phone: body?.phone,
      propertyHistory: body?.propertyHistory,
      activity: {
        source: body?.source || "smart_visitor_interest",
        sourceLabel: body?.sourceLabel || "Smart Visitor Interest",
        relatedPropertyId: body?.relatedProperty?.id,
        relatedPropertyTitle: body?.relatedProperty?.title,
        details: body?.details,
      },
    });

    return NextResponse.json({
      success: true,
      visitor: {
        id: String(result.visitor._id),
        name: result.visitor.name,
      },
      visitorInterestLinked: result.propertyHistoryLinked,
      visitorInterestRecorded: result.contactActivityRecorded,
      contactActivityRecorded: result.contactActivityRecorded,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getVisitorInterestSafeError(error) },
      { status: getVisitorInterestStatus(error) }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const search = sanitizeString(searchParams.get("search"), 80);
    const property = sanitizeString(searchParams.get("property"), 80);
    const page = parsePositiveInteger(searchParams.get("page"), 1);
    const limit = Math.min(
      parsePositiveInteger(searchParams.get("limit"), 12),
      50
    );
    const skip = (page - 1) * limit;
    const andQuery: Record<string, unknown>[] = [];

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");

      andQuery.push({
        $or: [{ name: regex }, { phone: regex }, { normalizedPhone: regex }],
      });
    }

    if (property) {
      const regex = new RegExp(escapeRegex(property), "i");

      andQuery.push({
        $or: [
          { "propertyHistory.propertyId": regex },
          { "propertyHistory.propertyTitle": regex },
          { "propertyHistory.propertyLocation": regex },
        ],
      });
    }

    const query = andQuery.length ? { $and: andQuery } : {};
    const propertyHistoryExpression = { $ifNull: ["$propertyHistory", []] };
    const contactActivitiesExpression = {
      $ifNull: ["$contactActivities", []],
    };
    const totalVisitExpression = {
      $sum: {
        $map: {
          input: propertyHistoryExpression,
          as: "property",
          in: { $ifNull: ["$$property.visitCount", 0] },
        },
      },
    };
    const totalActiveExpression = {
      $sum: {
        $map: {
          input: propertyHistoryExpression,
          as: "property",
          in: { $ifNull: ["$$property.totalActiveTimeSeconds", 0] },
        },
      },
    };

    const [visitors, total, statsResult] = await Promise.all([
      VisitorInterest.aggregate<VisitorListItem>([
        { $match: query },
        { $sort: { firstCapturedAt: -1, _id: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: { $toString: "$_id" },
            name: 1,
            phone: 1,
            firstCapturedAt: 1,
            createdAt: 1,
            updatedAt: 1,
            propertyCount: { $size: propertyHistoryExpression },
            contactActivityCount: { $size: contactActivitiesExpression },
            totalVisitCount: totalVisitExpression,
            totalActiveTimeSeconds: totalActiveExpression,
            propertyPreview: {
              $slice: [
                {
                  $map: {
                    input: propertyHistoryExpression,
                    as: "property",
                    in: "$$property.propertyTitle",
                  },
                },
                3,
              ],
            },
          },
        },
      ]),
      VisitorInterest.countDocuments(query),
      VisitorInterest.aggregate([
        { $match: query },
        {
          $facet: {
            totals: [
              {
                $project: {
                  totalVisitCount: totalVisitExpression,
                  totalActiveTimeSeconds: totalActiveExpression,
                  contactActivityCount: { $size: contactActivitiesExpression },
                },
              },
              {
                $group: {
                  _id: null,
                  totalVisitors: { $sum: 1 },
                  totalMeaningfulPropertyViews: { $sum: "$totalVisitCount" },
                  totalActiveTimeSeconds: { $sum: "$totalActiveTimeSeconds" },
                  totalContactActivities: { $sum: "$contactActivityCount" },
                },
              },
            ],
            mostViewedProperties: [
              { $unwind: "$propertyHistory" },
              {
                $group: {
                  _id: "$propertyHistory.propertyId",
                  propertyTitle: { $first: "$propertyHistory.propertyTitle" },
                  propertyLocation: {
                    $first: "$propertyHistory.propertyLocation",
                  },
                  totalVisits: { $sum: "$propertyHistory.visitCount" },
                  totalActiveTimeSeconds: {
                    $sum: "$propertyHistory.totalActiveTimeSeconds",
                  },
                },
              },
              { $sort: { totalVisits: -1, totalActiveTimeSeconds: -1 } },
              { $limit: 3 },
            ],
          },
        },
      ]),
    ]);

    const stats = statsResult[0] || {
      totals: [],
      mostViewedProperties: [],
    };
    const totals = stats.totals[0] || {
      totalVisitors: 0,
      totalMeaningfulPropertyViews: 0,
      totalActiveTimeSeconds: 0,
      totalContactActivities: 0,
    };

    return NextResponse.json({
      success: true,
      visitors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      stats: {
        ...totals,
        mostViewedProperties: stats.mostViewedProperties,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to fetch visitor insights." },
      { status: 500 }
    );
  }
}
