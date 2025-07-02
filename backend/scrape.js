// import dotenv from "dotenv";
// dotenv.config();

// import mongoose from "mongoose";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import fs from "fs";
// import { Page } from "./model.js"; // Import the Page model


// // Connect to MongoDB
// await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


// //we will scrape the urls that are stored in urls.txt
// const urls = fs.readFileSync("urls.txt", "utf-8").split("\n").map(url => url.trim()).filter(url => url.length > 0);


// const scrapeWebsite = async (url) => {
//   try {
//     const { data: html } = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0"
//       }
//     });

//     const $ = cheerio.load(html);
//     const title = $("title").text();

//     // Extract text from headings and paragraphs
//     let content = "";
//     $("h1, h2, h3, h4, h5, h6, p").each((_, el) => {
//       const text = $(el).text().trim();
//       if (text.length > 0) content += text + "\n";
//     });

//     const page = new Page({ title, url, content });
//     await page.save();
//     console.log(`✅ Saved: ${title}`);
//   } catch (err) {
//     console.error(`❌ Failed to scrape ${url}:`, err.message);
//   }
// };

// const scrapeAll = async () => {
//   for (const url of urls) {
//     await scrapeWebsite(url);
//   }
//   mongoose.disconnect();
// };

// scrapeAll();



import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { Page } from "./model.js";

await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read URLs from file
const urls = fs.readFileSync("urls.txt", "utf-8").split("\n").map(url => url.trim()).filter(url => url.length > 0);

// Helper to normalize URLs
const normalizeUrl = (base, relative) => new URL(relative, base).href;

// Function to clear the Page collection
const clearPages = async () => {
  await Page.deleteMany({});
  console.log("🧹 Cleared Page collection.");
};

// Scrape a single page and return found internal links
const scrapeWebsite = async (url, baseDomain, visited) => {
  if (visited.has(url)) return [];
  visited.add(url);

  try {
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(html);
    const title = $("title").text();

    // Extract meta description and keywords
    const metaDescription = $('meta[name="description"]').attr('content') || "";
    const metaKeywords = $('meta[name="keywords"]').attr('content') || "";

    // Extract text from headings, paragraphs, lists, tables, and alt text from images
    let content = "";
    $("h1, h2, h3, h4, h5, h6, p, li, td, th").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 0) content += text + "\n";
    });
    $("img[alt]").each((_, el) => {
      const alt = $(el).attr("alt");
      if (alt) content += `[Image: ${alt}]\n`;
    });

    // Save to DB
    const page = new Page({ title, url, content, metaDescription, metaKeywords });
    await page.save();
    console.log(`✅ Saved: ${title} (${url})`);

    // Find all internal links (navbar, footer, and in-page)
    const links = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;
      const absoluteUrl = normalizeUrl(url, href);
      if (
        absoluteUrl.startsWith(baseDomain) &&
        !visited.has(absoluteUrl) &&
        !absoluteUrl.includes("#") // skip anchor links
      ) {
        links.push(absoluteUrl);
      }
    });

    return links;
  } catch (err) {
    console.error(`❌ Failed to scrape ${url}:`, err.message);
    return [];
  }
};

// Crawl all pages starting from the seed URLs
const crawlWebsite = async (seedUrls) => {
  const visited = new Set();
  for (const seedUrl of seedUrls) {
    const baseDomain = new URL(seedUrl).origin;
    const queue = [seedUrl];
    while (queue.length > 0) {
      const currentUrl = queue.shift();
      const foundLinks = await scrapeWebsite(currentUrl, baseDomain, visited);
      for (const link of foundLinks) {
        if (!visited.has(link)) queue.push(link);
      }
    }
  }
  mongoose.disconnect();
};

// Main
const main = async () => {
  await clearPages();
  await crawlWebsite(urls);
};

main();