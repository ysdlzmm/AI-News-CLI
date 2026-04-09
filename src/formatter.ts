import type { Article } from './types.js';

export function formatDailyReport(articles: Article[]): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const title = `# AI News Daily - ${dateStr}\n\n`;

  const stats = `> Aggregated from TechCrunch AI, The Verge AI, Hacker News\n> Total articles: ${articles.length}\n\n`;

  const list = articles
    .map((article, index) => {
      const time = article.pubDate.toISOString().replace('T', ' ').substring(0, 19);
      return `${index + 1}. **[${article.title}](${article.link})**\n   - Source: ${article.source} | Published: ${time}\n`;
    })
    .join('\n');

  return title + stats + list;
}
