import { Router } from "express";
import Event from "../models/Event.js";

const router = Router();

const validUrl = (value) => {
  try {
    const u = new URL(value);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
};

router.post("/events", async (req, res, next) => {
  try {
    const {
      session_id,
      event_type,
      page_url,
      timestamp,
      x,
      y,
      viewport_width,
      viewport_height
    } = req.body || {};

    if (
      typeof session_id !== "string" ||
      !session_id.trim() ||
      session_id.length > 200
    ) {
      return res.status(400).json({ message: "Valid session_id required." });
    }

    if (!["page_view", "click"].includes(event_type)) {
      return res
        .status(400)
        .json({ message: "event_type must be page_view or click." });
    }

    if (typeof page_url !== "string" || !validUrl(page_url)) {
      return res
        .status(400)
        .json({ message: "Valid HTTP(S) page_url required." });
    }

    const date = timestamp ? new Date(timestamp) : new Date();
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid timestamp." });
    }

    const doc = {
      session_id: session_id.trim(),
      event_type,
      page_url,
      timestamp: date
    };

    if (Number.isFinite(viewport_width) && viewport_width > 0) {
      doc.viewport_width = viewport_width;
    }
    if (Number.isFinite(viewport_height) && viewport_height > 0) {
      doc.viewport_height = viewport_height;
    }

    if (event_type === "click") {
      if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0) {
        return res
          .status(400)
          .json({ message: "Click events require non-negative x/y." });
      }
      doc.x = x;
      doc.y = y;
    }

    const saved = await Event.create(doc);
    res.status(201).json({ message: "Event stored", event_id: saved._id });
  } catch (e) {
    next(e);
  }
});

router.get("/sessions", async (req, res, next) => {
  try {
    const rows = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          total_events: { $sum: 1 },
          page_views: {
            $sum: { $cond: [{ $eq: ["$event_type", "page_view"] }, 1, 0] }
          },
          clicks: {
            $sum: { $cond: [{ $eq: ["$event_type", "click"] }, 1, 0] }
          },
          first_seen: { $min: "$timestamp" },
          last_seen: { $max: "$timestamp" }
        }
      },
      { $sort: { last_seen: -1 } },
      { $limit: 500 }
    ]);

    res.json(rows.map(({ _id, ...r }) => ({ session_id: _id, ...r })));
  } catch (e) {
    next(e);
  }
});

router.get("/sessions/:sessionId/events", async (req, res, next) => {
  try {
    res.json(
      await Event.find({ session_id: req.params.sessionId })
        .sort({ timestamp: 1, _id: 1 })
        .limit(2000)
        .lean()
    );
  } catch (e) {
    next(e);
  }
});

router.get("/pages", async (req, res, next) => {
  try {
    res.json((await Event.distinct("page_url")).sort());
  } catch (e) {
    next(e);
  }
});

router.get("/heatmap", async (req, res, next) => {
  try {
    const url = req.query.url;

    if (typeof url !== "string" || !validUrl(url)) {
      return res
        .status(400)
        .json({ message: "Valid url query parameter required." });
    }

    res.json(
      await Event.find({ page_url: url, event_type: "click" })
        .select("session_id page_url timestamp x y viewport_width viewport_height")
        .sort({ timestamp: -1 })
        .limit(5000)
        .lean()
    );
  } catch (e) {
    next(e);
  }
});

router.get("/health", (req, res) => res.json({ status: "ok" }));

export default router;