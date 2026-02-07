import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeJobSalary(jobUrl) {
  const { data } = await axios.get(jobUrl, {
    headers: {
      "User-Agent": process.env.USER_AGENT,
      "Accept": "text/html",
      "Accept-Language": "en-GB,en;q=0.9",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(data);

  const salary = $('span[data-at="metadata-salary"] span')
    .last()
    .text()
    .trim();

  return salary || "";
}
