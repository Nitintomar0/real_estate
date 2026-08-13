import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://nitin:Nitin123@cluster0.40mrjhc.mongodb.net/?appName=Cluster0";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("Mongo Error ❌", error);
  }
};