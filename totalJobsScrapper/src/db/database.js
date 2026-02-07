import Database from "better-sqlite3";

export function initDb(dbPath = "./jobs.db") {
  const db = new Database(dbPath);
  return {
    run: (sql, ...params) => db.prepare(sql).run(...params),
    all: (sql, ...params) => db.prepare(sql).all(...params),
    close: () => db.close(),
  };
}


export async function setupTables(db) {
  await db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      company TEXT,
      location TEXT,
      salary TEXT,
      link TEXT UNIQUE,
      source TEXT,
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
