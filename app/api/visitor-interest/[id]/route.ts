import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/components/lib/mongodb";
import { isAdminRequest } from "@/components/lib/adminAuth";
import VisitorInterest from "@/components/lib/models/VisitorInterest";

export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Unauthorized." },
    { status: 401 }
  );
}

function invalidIdResponse() {
  return NextResponse.json(
    { success: false, error: "Invalid visitor id." },
    { status: 400 }
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorizedResponse();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();

    const visitor = await VisitorInterest.findById(id).lean();

    if (!visitor) {
      return NextResponse.json(
        { success: false, error: "Visitor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      visitor,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to fetch visitor details." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorizedResponse();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();

    const deletedVisitor = await VisitorInterest.findByIdAndDelete(id);

    if (!deletedVisitor) {
      return NextResponse.json(
        { success: false, error: "Visitor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to delete visitor." },
      { status: 500 }
    );
  }
}
