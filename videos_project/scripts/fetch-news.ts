import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';

const parser = new Parser({
  timeout: 15000,
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
  }
});

const FEEDS = [
  { name: 'EDN Design Ideas', url: 'https://www.edn.com/design-ideas/feed/', limit: 8 },
  { name: 'Electronic Design', url: 'https://www.electronicdesign.com/rss', limit: 8 },
  { name: 'Microwave Journal', url: 'https://www.microwavejournal.com/rss/articles', limit: 6 },
  { name: 'Hackaday Electronics', url: 'https://hackaday.com/blog/feed/', limit: 10 },
  { name: 'EE Times', url: 'https://www.eetimes.com/feed/', limit: 8 }
];

async function fetchNews() {
  console.log('Fetching engineering RSS feeds...');
  let allNews: any[] = [];

  for (const feed of FEEDS) {
    try {
      console.log(`Fetching feed: ${feed.name}...`);
      const data = await parser.parseURL(feed.url);
      
      const items = data.items.slice(0, feed.limit).map(i => {
        const snippet = i.contentSnippet || i.summary || i.content || '';
        return {
          title: i.title || 'Untitled Article',
          summary: snippet.replace(/<[^>]*>/g, '').slice(0, 200).trim() + '...',
          link: i.link,
          source: feed.name,
          pubDate: i.pubDate || new Date().toISOString(),
          lang: 'en'
        };
      });
      
      allNews = [...allNews, ...items];
      console.log(`  Added ${items.length} items from ${feed.name}`);
    } catch (e) {
      console.error(`  Error parsing feed ${feed.name}:`, (e as Error).message);
    }
  }

  // Sort by publication date (newest first)
  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const dataDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dataPath = path.join(dataDir, 'news.json');
  fs.writeFileSync(dataPath, JSON.stringify(allNews.slice(0, 50), null, 2), 'utf-8');
  
  console.log(`Successfully synced ${allNews.length} news items to src/data/news.json`);
  process.exit(0);
}

fetchNews().catch((err) => {
  console.error('Fatal fetch-news error:', err);
  process.exit(1);
});
