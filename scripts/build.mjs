import { rm } from 'node:fs/promises';
import Eleventy from '@11ty/eleventy';
process.env.SITE_PREVIEW = '0';
process.env.ELEVENTY_RUN_MODE = 'build';
await rm('_site', { recursive: true, force: true });
const site = new Eleventy();
await site.write();
