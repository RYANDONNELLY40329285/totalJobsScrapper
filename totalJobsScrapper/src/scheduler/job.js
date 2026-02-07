import cron from "node-cron";
import { scrapeTotalJobs } from "../scraper/scrapeTotalJobs.js";
import { initDb, setupTables } from "../db/database.js";
import { exportJobsToCsv } from "../utils/exportJobsToCsv.js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function runScrape(db) {
  console.log("Running TotalJobs scrape...");

  for (let page = 1; page <= 3; page++) {
    const jobs = await scrapeTotalJobs(page);

    for (const job of jobs) {
      await db.run(
        `INSERT OR IGNORE INTO jobs (title, company, location, salary, link, source)
         VALUES (?, ?, ?, ?, ?, ?)`,
        job.title,
        job.company,
        job.location,
        job.salary,
        job.link,
        job.source
      );
    }

    await delay(Number(process.env.SCRAPE_DELAY_MS));
  }

  await exportJobsToCsv(db);

  console.log("TotalJobs scrape complete");
}

export async function startScheduler() {
  const db = await initDb();
  await setupTables(db);


  await runScrape(db);

  
  cron.schedule("0 */6 * * *", async () => {
    await runScrape(db);
  });
}
