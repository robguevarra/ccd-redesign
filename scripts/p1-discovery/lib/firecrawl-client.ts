import FirecrawlApp from '@mendable/firecrawl-js';
import { env } from './env';

export const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });
