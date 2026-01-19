import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/gocode-shop";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected: gocode-shop");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

