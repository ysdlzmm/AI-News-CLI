import { fetchAllSources } from './fetcher.js';
import { filterRecentArticles, sortByDate } from './parser.js';
import { formatDailyReport } from './formatter.js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('Fetching AI news from RSS sources...');

  const allArticles = await fetchAllSources();
  console.log(`Fetched ${allArticles.length} total articles`);

  const recentArticles = filterRecentArticles(allArticles, 24);
  console.log(`Filtered to ${recentArticles.length} articles from last 24 hours`);

  const sortedArticles = sortByDate(recentArticles);

  const report = formatDailyReport(sortedArticles);

  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const outputPath = path.join(outputDir, `ai-news-${dateStr}.md`);

  fs.writeFileSync(outputPath, report, 'utf-8');
  console.log(`Report saved to: ${outputPath}`);
}

main().catch(console.error);
