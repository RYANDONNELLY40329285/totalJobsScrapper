import express from "express";
import dotenv from "dotenv";
import { initDb, setupTables } from "../db/database.js";
import { startScheduler } from "../scheduler/job.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/jobs/latest", async (req, res) => {
  try {
    const db = await initDb();
    const jobs = await db.all(
      `SELECT * FROM jobs
       ORDER BY scraped_at DESC
       LIMIT 50`
    );
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/jobs/stats", async (req, res) => {
  try {
    const db = await initDb();

    const total = await db.get(
      `SELECT COUNT(*) as count FROM jobs`
    );

    const locations = await db.all(
      `SELECT location, COUNT(*) as count
       FROM jobs
       GROUP BY location
       ORDER BY count DESC
       `
    );

    res.json({
      totalJobs: total.count,
      topLocations: locations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, async () => {
  const db = await initDb();
  await setupTables(db);
  await startScheduler();

  console.log(`API running on http://localhost:${PORT}`);
});
