# TotalJobs Graduate Software Engineer Scraper

A Dockerised Node.js backend service that automatically scrapes graduate software engineering jobs from TotalJobs UK, stores them in a SQLite database, exposes analytics via a REST API, and exports results to timestamped CSV files.

Built as a backend portfolio project to demonstrate:

- Web scraping
- API design
- Database integration
- Scheduled jobs (cron)
- CSV generation
- Docker containerisation
- CI with GitHub Actions
- Unit testing with Jest (ESM compatible)

---

## 🚀 Features

- 🔄 Scheduled scraping (every 6 hours)
- 🌐 REST API endpoints
- 📈 Job statistics aggregation
- 📁 Timestamped CSV exports
- 🐳 Docker support
- ✅ GitHub Actions CI
- 🧪 Jest unit tests (mocked DB for CI safety)

---

##  Tech Stack

- Node.js (ES Modules)
- Express
- SQLite
- Axios + Cheerio
- node-cron
- Jest
- Docker
- GitHub Actions

---

##  Installation (Local)

```bash
git clone <your-repo-url>
cd totalJobsScrapper
npm install
npm start