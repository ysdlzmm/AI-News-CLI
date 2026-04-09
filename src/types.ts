export interface Article {
  title: string;
  link: string;
  pubDate: Date;
  source: string;
  category: string;
  description?: string;
  summary?: string;
}

export interface RSSSource {
  name: string;
  url: string;
  category: string;
  count: number;
}
