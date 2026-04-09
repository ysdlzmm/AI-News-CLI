import type { Article } from './types.js';

export function filterRecentArticles(articles: Article[], hours: number = 24): Article[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);

  return articles.filter((article) => article.pubDate >= cutoff);
}

export function sortByDate(articles: Article[]): Article[] {
  return articles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export function deduplicateByUrl(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (seen.has(article.link)) {
      return false;
    }
    seen.add(article.link);
    return true;
  });
}
