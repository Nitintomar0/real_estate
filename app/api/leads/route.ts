import { NextResponse } from "next/server";
import { connectDB } from "@/components/lib/mongodb";
import Lead from "@/components/lib/models/Lead";

// GET → fetch all leads
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let query: any = {};

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
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" });
  }
}
// POST → add new lead
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // 🔥 FORCE TYPE ALWAYS
    let finalType = "Lead";

    if (body.type === "Visit") finalType = "Visit";
    if (body.type === "Contact") finalType = "Contact";

    const newLead = await Lead.create({
      name: body.name,
      phone: body.phone,
      city: body.city || "",
      property: body.property || "",
      email: body.email || "",
      message: body.message || "",
      type: finalType, // 🔥 ALWAYS SET
      date: new Date().toLocaleString(),
    });

    return NextResponse.json({ success: true, data: newLead });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to save" });
  }
}
// DELETE → remove lead
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    await Lead.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" });
  }
}