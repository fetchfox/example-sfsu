import {
  Crawler,
  SinglePromptExtractor,
  Workflow,
  DiskCache,

  getExtractor,
  getFetcher,
  getAI,

  CrawlStep,
  ConstStep,
  FetchStep,
  ExportStep,
  ExtractStep,
} from 'fetchfox';

const cache = new DiskCache('/tmp/ff_cache_1', { ttls: 10 * 24 * 3600 });

const ai = 'openai:gpt-4o-mini';

// const ai = getAI(
//   'openai:gpt-4o-mini',
//   {
//     apiKey: '...' });

// const ai = 'groq:llama3-70b-8192';

// const ai = getAI(
//   'groq:llama3-70b-8192',
//   { apiKey: '...' });

const crawler = new Crawler({ ai, cache });
const extractor = new SinglePromptExtractor({ ai, cache });
const fetcher = getFetcher('fetch', { cache });

const url = 'https://sfsu.academicworks.com/';
const crawlFor = 'Scholarship awards: Find links to individual scholarship pages. Ignore main navigation and external links.';
const questions = [
  'What are the eligibility Criteria for this scolarship?',
  'What is the class level for this scholarship?'
];

async function run() {
  const steps = [
    new ConstStep(url),
    new CrawlStep({ crawler, query: crawlFor, limit: 5 }),
    new FetchStep(fetcher),
    new ExtractStep({ questions, extractor }),
    new ExportStep({ filename: './out.jsonl', format: 'jsonl' }),
  ];

  const flow = new Workflow(steps);

  console.log('flow', flow);

  const stream = flow.stream();
  for await (const { cursor, delta, index } of stream) {
    console.log(`Step ${index} delta: ${delta}`);
  }
}

run();
