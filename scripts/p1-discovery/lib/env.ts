import { config } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';
import { sourcePaths } from './paths';

config({ path: resolve(sourcePaths().root, '.env.local') });

const schema = z.object({
  FIRECRAWL_API_KEY: z.string().startsWith('fc-', 'FIRECRAWL_API_KEY must start with "fc-"'),
});

export const env = schema.parse(process.env);
