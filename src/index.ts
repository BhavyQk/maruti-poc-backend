import cors from "cors";
import express from "express";
import { config } from "./config";
import logRoutes from "./routes/logRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", dataFolder: config.dataFolder });
});

app.use("/api/logs", logRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.listen(config.port, () => {
  console.log(`Log API running at http://localhost:${config.port}`);
  console.log(`Reading .log files from: ${config.dataFolder}`);
});
