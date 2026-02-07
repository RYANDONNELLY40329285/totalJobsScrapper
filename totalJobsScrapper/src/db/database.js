import Database from "better-sqlite3";

export async function initDb(dbPath = "./jobs.db") {
  const db = new Database(dbPath);
  return {
    run: (sql, ...params) => db.prepare(sql).run(...params),
    all: (sql, ...params) => db.prepare(sql).all(...params),
    exec: (sql) => db.exec(sql),
    close: () => db.close(),
  };
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
