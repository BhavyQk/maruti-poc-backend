import compression from "compression";
import cors from "cors";
import express from "express";
import { config } from "./config";
import logRoutes from "./routes/logRoutes";
import jobCardRoutes from "./routes/jobCardRoutes";
import appDynamicsRoutes from "./routes/appDynamicsRoutes";

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", dataFolder: config.dataFolder });
});

app.use("/api/logs", logRoutes);
app.use("/api/job-cards", jobCardRoutes);
app.use("/api/appdynamics", appDynamicsRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.listen(config.port, () => {
  console.log(`Log API running at http://localhost:${config.port}`);
  console.log(`Reading .log files from: ${config.dataFolder}`);
});
