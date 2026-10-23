import { rm } from 'node:fs/promises';
import Eleventy from '@11ty/eleventy';
process.env.SITE_PREVIEW = '0';
process.env.ELEVENTY_RUN_MODE = 'build';
// Retry transient directory-removal errors before generating fresh output.
await rm('_site', { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
const site = new Eleventy();
await site.write();
