# AI News CLI

AI 新闻聚合 CLI 工具，从多个 RSS 源抓取最近24小时的 AI 相关文章，生成 Markdown 日报。

## RSS 源

- TechCrunch AI
- The Verge AI
- Hacker News

## 使用方法

```bash
# 安装依赖
npm install

# 运行
npx tsx src/index.ts
```

## 输出

生成的日报保存在 `output/ai-news-YYYY-MM-DD.md`

## 项目结构

```
src/
├── index.ts      # CLI 入口
├── fetcher.ts    # RSS 抓取
├── parser.ts     # 过滤和排序
├── formatter.ts  # Markdown 格式化
└── types.ts      # 类型定义
```
