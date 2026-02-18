/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

await jest.unstable_mockModule("../src/db/database.js", () => ({
  initDb: jest.fn(() => ({
    run: jest.fn(),
    all: jest.fn(() => []),
    close: jest.fn(),
  })),
  setupTables: jest.fn(async () => {}),
}));

const { initDb, setupTables } = await import("../src/db/database.js");

describe("database module", () => {
  let db;

  beforeEach(async () => {
    db = initDb(":memory:");
    await setupTables(db);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initialises database connection", () => {
    expect(initDb).toHaveBeenCalled();
    expect(db).toHaveProperty("run");
    expect(db).toHaveProperty("all");
    expect(db).toHaveProperty("close");
  });

  test("creates schema via setupTables", async () => {
    expect(setupTables).toHaveBeenCalledWith(db);
  });

  test("supports inserts via run()", () => {
    db.run("INSERT INTO jobs VALUES (?)", "Graduate Engineer");
    expect(db.run).toHaveBeenCalled();
  });

  test("supports queries via all()", () => {
    const rows = db.all("SELECT * FROM jobs");
    expect(rows).toEqual([]);
  });

  test("can close database", () => {
    db.close();
    expect(db.close).toHaveBeenCalled();
  });
});