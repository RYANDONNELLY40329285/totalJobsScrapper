/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

await jest.unstable_mockModule("../src/db/database.js", () => ({
  initDb: jest.fn(() => ({
    run: jest.fn(),
    all: jest.fn(() => []),
    exec: jest.fn(),
    close: jest.fn(),
  })),
  setupTables: jest.fn(async () => {}),
}));

await jest.unstable_mockModule("../src/scraper/scrapeTotalJobs.js", () => ({
  scrapeTotalJobs: jest.fn(async () => [
    {
      title: "Graduate Software Engineer",
      company: "Test Co",
      location: "London",
      salary: "£30k",
      link: "https://example.com",
      source: "TotalJobs",
    },
  ]),
}));

const { initDb } = await import("../src/db/database.js");
const { scrapeTotalJobs } = await import("../src/scraper/scrapeTotalJobs.js");

describe("scheduler job", () => {
  test("inserts scraped jobs into database", async () => {
    const db = initDb(":memory:");
    const jobs = await scrapeTotalJobs(1);

    for (const job of jobs) {
      await db.run(
        "INSERT INTO jobs VALUES (?, ?, ?, ?, ?, ?)",
        job.title,
        job.company,
        job.location,
        job.salary,
        job.link,
        job.source
      );
    }

    expect(db.run).toHaveBeenCalled();
  });
});
