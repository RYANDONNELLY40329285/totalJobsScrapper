import axios from "axios";
import * as cheerio from "cheerio";
import { scrapeJobSalary } from "./scrapeJobDetail.js";

const BASE_URL =
  "https://www.totaljobs.com/jobs/graduate-software-engineer/in-united-kingdom";

const BASE_HOST = "https://www.totaljobs.com";

function isValidTitle(title) {
  return (
    title &&
    title.length > 10 &&
    /[a-zA-Z]/.test(title) &&
    !title.includes("{") &&
    !title.startsWith(".res-")
  );
}

export async function scrapeTotalJobs(page = 1) {
  const url = page === 1 ? BASE_URL : `${BASE_URL}?page=${page}`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": process.env.USER_AGENT,
      "Accept": "text/html",
      "Accept-Language": "en-GB,en;q=0.9",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(data);
  const jobs = [];

  const articles = $("article").toArray(); 

  for (const el of articles) {
    const title = $(el)
      .find('a[data-at="job-item-title"]')
      .text()
      .trim();

    const href = $(el)
      .find('a[data-at="job-item-title"]')
      .attr("href");

    if (!isValidTitle(title)) continue;
    if (!href || !href.startsWith("/job/")) continue;

    const company = $(el)
      .find('[data-at="job-item-company-name"]')
      .text()
      .trim();

    const location = $(el)
      .find('[data-at="job-item-location"]')
      .text()
      .trim();

   
    const salary = await scrapeJobSalary(`${BASE_HOST}${href}`);

    jobs.push({
      title,
      company,
      location,
      salary,
      link: `${BASE_HOST}${href}`,
      source: "TotalJobs",
    });

  
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`Jobs found on page ${page}: ${jobs.length}`);
  return jobs;
}
