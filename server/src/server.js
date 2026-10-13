import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/user_analytics"
  );
  console.log("MongoDB connected");

  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
} catch (e) {
  console.error("MongoDB connection failed:", e.message);
  process.exit(1);
}