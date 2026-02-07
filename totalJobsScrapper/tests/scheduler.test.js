import { initDb } from "../src/db/database.js";

test("inserts jobs from scraper output", async () => {
  const db = await initDb(":memory:");

  await db.exec(`
    CREATE TABLE jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      company TEXT,
      location TEXT,
      salary TEXT,
      link TEXT UNIQUE,
      source TEXT
    )
  `);

  const fakeJobs = [
    {
      title: "Graduate Software Engineer",
      company: "Fake Ltd",
      location: "London",
      salary: "£30k",
      link: "https://example.com/job/123",
      source: "TotalJobs",
    },
  ];

  for (const job of fakeJobs) {
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

  const rows = await db.all("SELECT * FROM jobs");
  expect(rows.length).toBe(1);
});
