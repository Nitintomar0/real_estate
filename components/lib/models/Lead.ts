import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  city: String,
  property: String,
  email: String,     // ⭐ add
  message: String,   // ⭐ add
  date: String,
  type: String,
});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);