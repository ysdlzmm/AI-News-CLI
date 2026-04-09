import Parser from 'rss-parser';
import type { Article, RSSSource } from './types.js';

const parser = new Parser();

export const RSS_SOURCES: RSSSource[] = [
  // AI/技术行业动态
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage?q=AI', category: 'AI/技术', count: 5 },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'AI/技术', count: 3 },
  { name: 'The Gradient', url: 'https://thegradient.pub/rss/', category: 'AI/技术', count: 3 },
  { name: 'AI Weekly', url: 'https://aiweekly.co/feed', category: 'AI/技术', count: 3 },

  // 科技创业者/社交媒体
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: '创业/社交', count: 5 },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/feed', category: '创业/社交', count: 5 },

  // 编程、产品
  { name: 'DEV Community', url: 'https://dev.to/feed', category: '编程/产品', count: 5 },
  { name: 'Lobsters', url: 'https://lobste.rs/rss', category: '编程/产品', count: 5 },

  // 国际新闻
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', category: '国际新闻', count: 3 },
  { name: 'BBC Technology', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: '国际新闻', count: 3 },

  // 国内新闻
  { name: '36kr', url: 'https://36kr.com/feed', category: '国内新闻', count: 5 },
  { name: 'OSCHINA', url: 'https://www.oschina.net/news/rss', category: '国内新闻', count: 5 },
  { name: '少数派', url: 'https://sspai.com/feed', category: '国内新闻', count: 3 },
];

export async function fetchSource(source: RSSSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.slice(0, source.count).map((item) => ({
      title: item.title || 'No Title',
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      source: source.name,
      category: source.category,
      description: item.contentSnippet || item.content || item.summary || '',
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
