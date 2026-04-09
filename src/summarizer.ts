import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function generateSummary(title: string, description: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const prompt = `请用一句话总结以下文章，字数控制在20-40字以内。只需输出总结文字，不要其他内容。

标题：${title}
描述：${description}`;

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text.trim() : '';
}

export async function summarizeArticles(articles: Article[]): Promise<Article[]> {
  const results = await Promise.all(
    articles.map(async (article) => {
      try {
        const summary = await generateSummary(article.title, article.description || '');
        return { ...article, summary };
      } catch (error) {
        console.error(`Failed to summarize "${article.title}":`, error);
        return article;
      }
    })
  );
  return results;
}

import type { Article } from './types.js';