import "reflect-metadata";
import compression from "compression";
import cors from "cors";
import express from "express";
import { config } from "./config";
import logRoutes from "./routes/logRoutes";
import jobCardRoutes from "./routes/jobCardRoutes";
import jobCardDbRoutes from "./routes/jobCardDbRoutes";
import serviceHistoryRoutes from "./routes/serviceHistoryRoutes";
import appDynamicsRoutes from "./routes/appDynamicsRoutes";
import { db_connection_instane, initializeModels } from "../models";

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", dataFolder: config.dataFolder });
});

app.use("/api/logs", logRoutes);
// DB-backed job card & service history APIs (Postgres)
app.use("/api/job-cards", jobCardDbRoutes);
app.use("/api/service-history", serviceHistoryRoutes);
// Legacy file-based job card API (kept for reference)
app.use("/api/job-cards-file", jobCardRoutes);
app.use("/api/appdynamics", appDynamicsRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.listen(config.port, async () => {
  console.log(`Log API running at http://localhost:${config.port}`);
  console.log(`Reading .log files from: ${config.dataFolder}`);
  try {
    initializeModels();
    await db_connection_instane.createDBConnection();
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Postgres connection failed (DB APIs will be unavailable): ${message}`);
  }
});
