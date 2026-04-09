import type { Article } from './types.js';
import pc from 'picocolors';

const CATEGORY_COLORS: Record<string, (s: string) => string> = {
  'AI/技术': pc.blue,
  '创业/社交': pc.magenta,
  '编程/产品': pc.green,
  '国际新闻': pc.cyan,
  '国内新闻': pc.yellow,
};

const CATEGORY_TAGS: Record<string, string> = {
  'AI/技术': '[AI]',
  '创业/社交': '[创业]',
  '编程/产品': '[编程]',
  '国际新闻': '[国际]',
  '国内新闻': '[国内]',
};

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

function clickableLink(url: string, text: string): string {
  return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
}

export function formatDailyReport(articles: Article[]): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const categories = [...new Set(articles.map(a => a.category))].join(', ');
  const title = `# AI News Daily - ${dateStr}\n\n`;
  const stats = `> Categories: ${categories}\n> Total articles: ${articles.length}\n\n`;

  const list = articles
    .map((article, index) => {
      const summary = article.summary ? `\n   - ${article.summary}` : '';
      return `${index + 1}. ${CATEGORY_TAGS[article.category] || ''} ${article.source} │ **[${article.title}](${article.link})**${summary}`;
    })
    .join('\n');

  return title + stats + list;
}

export async function terminalReport(articles: Article[]): Promise<void> {
  const PAGE_SIZE = 10;
  const dateStr = new Date().toISOString().split('T')[0];

  console.log(pc.bold(pc.cyan(`\n=== AI News Daily - ${dateStr} ===\n`)));
  console.log(pc.dim(`Total: ${articles.length} articles\n`));

  for (let i = 0; i < articles.length; i += PAGE_SIZE) {
    const page = articles.slice(i, i + PAGE_SIZE);
    page.forEach((article, idx) => {
      const idx2 = i + idx + 1;
      const catColor = CATEGORY_COLORS[article.category] || pc.white;
      const catTag = CATEGORY_TAGS[article.category] || article.category;
      const title = truncate(article.title, 50);
      const summary = article.summary ? truncate(article.summary, 70) : '';

      console.log(`${pc.bold(pc.white(idx2.toString()))}. ${catColor(catTag)} ${pc.dim(article.source)} │ ${clickableLink(article.link, title)}`);
      if (summary) {
        console.log(`   ${pc.dim(summary)}`);
      }
      console.log();
    });

    if (i + PAGE_SIZE < articles.length) {
      const readline = await import('readline');
      await new Promise<void>((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question(pc.dim('\nPress Enter to continue...\n'), () => {
          rl.close();
          resolve();
        });
      });
    }
  }
}
