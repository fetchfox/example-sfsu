import { Crawler, SinglePromptExtractor, DiskCache } from 'fetchfox';

const cache = new DiskCache('/tmp/ff_cache_1', { ttls: 10 * 24 * 3600 });
// const ai = 'openai:gpt-4o-mini';
const ai = 'groq:llama3-70b-8192';
const crawler = new Crawler({ ai, cache });
const extractor = new SinglePromptExtractor({ ai, cache });

// const url = 'https://news.ycombinator.com';
// const questions = [
//   'what is the article title?',
//   'how many points does this submission have? only number',
//   'how many comments does this submission have? only number',
//   'when was this article submitted? convert to YYYY-MM-DD HH:mm{am/pm} format',
// ];

const url = 'https://sfsu.academicworks.com/';
const crawlFor = 'Scholarship awards: Find links to individual scholarship pages. Ignore main navigation and external links.';
const questions = [
  'What are the eligibility Criteria for this scolarship?',
  'What is the class level for this scholarship?'
]

for await (const link of crawler.stream(url, crawlFor)) {
  console.log('Extract from:', link.url);
  for await (const item of extractor.stream(link.url, questions)) {
    console.log('Result:', link.url, item);
  }
}
