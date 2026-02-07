import { initDb } from "../src/db/database.js";

test("creates jobs table and inserts a row", async () => {
  const db = await initDb(":memory:");

  await db.exec(`
    CREATE TABLE jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      company TEXT,
      link TEXT UNIQUE
    )
  `);

  await db.run(
    "INSERT INTO jobs (title, company, link) VALUES (?, ?, ?)",
    "Graduate Software Engineer",
    "Test Corp",
    "https://example.com/job/1"
  );

  const rows = await db.all("SELECT * FROM jobs");
  expect(rows.length).toBe(1);
});
