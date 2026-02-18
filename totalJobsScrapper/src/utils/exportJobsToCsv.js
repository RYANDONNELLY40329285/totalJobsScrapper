import fs from "fs";
import path from "path";

function formatTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}_` +
    `${pad(date.getHours())}-` +
    `${pad(date.getMinutes())}-` +
    `${pad(date.getSeconds())}`
  );
}

export async function exportJobsToCsv(db) {
  const rows = await db.all(`
    SELECT
      title,
      company,
      location,
      salary,
      link,
      source,
      scraped_at
    FROM jobs
    ORDER BY scraped_at DESC
  `);

  if (!rows.length) {
    console.log("No jobs found to export");
    return;
  }

  const headers = Object.keys(rows[0]).join(",");

  const csvRows = rows.map((row) =>
    Object.values(row)
      .map((value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`
      )
      .join(",")
  );

  const csv = [headers, ...csvRows].join("\n");

  const exportDir = path.resolve("exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  const timestamp = formatTimestamp();
  const filename = `jobs_${timestamp}.csv`;
  const filePath = path.join(exportDir, filename);

fs.writeFileSync(filePath, "\uFEFF" + csv, "utf8");

  console.log(`Jobs exported → ${filePath}`);

  return filename;
}
