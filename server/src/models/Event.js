import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    session_id: { type: String, required: true, index: true, trim: true },
    event_type: {
      type: String,
      required: true,
      enum: ["page_view", "click"],
      index: true
    },
    page_url: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, default: Date.now, index: true },
    x: { type: Number, min: 0 },
    y: { type: Number, min: 0 },
    viewport_width: { type: Number, min: 1 },
    viewport_height: { type: Number, min: 1 }
  },
  { versionKey: false }
);

schema.index({ session_id: 1, timestamp: 1 });
schema.index({ page_url: 1, event_type: 1 });

export default mongoose.model("Event", schema);