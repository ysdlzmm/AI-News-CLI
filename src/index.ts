#!/usr/bin/env node
import { fetchAllSources } from './fetcher.js';
import { filterRecentArticles, sortByDate, deduplicateByUrl } from './parser.js';
import { summarizeArticles } from './summarizer.js';
import { formatDailyReport, terminalReport } from './formatter.js';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const shouldSave = args.includes('-save') || args.includes('-s');

async function main() {
  console.log('Fetching AI news from RSS sources...');

  const allArticles = await fetchAllSources();
  console.log(`Fetched ${allArticles.length} total articles`);

  const deduplicatedArticles = deduplicateByUrl(allArticles);
  console.log(`Deduplicated to ${deduplicatedArticles.length} unique articles`);

  const recentArticles = filterRecentArticles(deduplicatedArticles, 24);
  console.log(`Filtered to ${recentArticles.length} articles from last 24 hours`);

  const sortedArticles = sortByDate(recentArticles);

  console.log('Generating AI summaries...');
  const summarizedArticles = await summarizeArticles(sortedArticles);

  if (shouldSave) {
    const report = formatDailyReport(summarizedArticles);
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const dateStr = new Date().toISOString().split('T')[0];
    const outputPath = path.join(outputDir, `ai-news-${dateStr}.md`);
    fs.writeFileSync(outputPath, report, 'utf-8');
    console.log(`Report saved to: ${outputPath}\n`);
  }

  await terminalReport(summarizedArticles);
}

main().catch(console.error);
