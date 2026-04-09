import Parser from 'rss-parser';
import type { Article, RSSSource } from './types.js';

const parser = new Parser();

export const RSS_SOURCES: RSSSource[] = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  },
  {
    name: 'Hacker News',
    url: 'https://hnrss.org/newest?q=AI&count=30',
  },
];

export async function fetchSource(source: RSSSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.map((item) => ({
      title: item.title || 'No Title',
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      source: source.name,
    }));
  } catch (error) {
    console.error(`Failed to fetch ${source.name}:`, error);
    return [];
  }
}

export async function fetchAllSources(): Promise<Article[]> {
  const results = await Promise.all(RSS_SOURCES.map(fetchSource));
  return results.flat();
}
