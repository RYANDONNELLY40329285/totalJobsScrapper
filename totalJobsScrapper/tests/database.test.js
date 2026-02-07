/**
 * @jest-environment node
 */

// Mock the database layer BEFORE importing it
jest.mock("../src/db/database.js", () => {
  return {
    initDb: jest.fn(() => {
      return {
        run: jest.fn(),
        all: jest.fn(() => []),
        close: jest.fn(),
      };
    }),
    setupTables: jest.fn(async () => {}),
  };
});

import { initDb, setupTables } from "../src/db/database.js";

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

  test("setupTables is called to create schema", async () => {
    expect(setupTables).toHaveBeenCalledTimes(1);
    expect(setupTables).toHaveBeenCalledWith(db);
  });

  test("allows inserting data via run()", async () => {
    const sql = "INSERT INTO jobs (title) VALUES (?)";
    const params = ["Graduate Software Engineer"];

    db.run(sql, ...params);

    expect(db.run).toHaveBeenCalledTimes(1);
    expect(db.run).toHaveBeenCalledWith(sql, ...params);
  });

  test("allows querying data via all()", async () => {
    const rows = db.all("SELECT * FROM jobs");

    expect(db.all).toHaveBeenCalledTimes(1);
    expect(rows).toEqual([]);
  });

  test("database can be closed", () => {
    db.close();
    expect(db.close).toHaveBeenCalledTimes(1);
  });
});
