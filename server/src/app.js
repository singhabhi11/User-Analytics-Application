import express from "express";
import cors from "cors";
import routes from "./routes/analytics.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",").map(x => x.trim())
      : true
  })
);

app.use(express.json({ limit: "100kb" }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;