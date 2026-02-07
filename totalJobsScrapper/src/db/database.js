import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDb() {
  return open({
    filename: "./jobs.db",
    driver: sqlite3.Database,
  });
}

export async function setupTables(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT,
      location TEXT,
      salary TEXT,
      link TEXT UNIQUE,
      source TEXT,
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
