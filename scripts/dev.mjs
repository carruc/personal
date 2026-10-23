import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Normal development shows published content only.
const cli = fileURLToPath(new URL('../node_modules/@11ty/eleventy/cmd.cjs', import.meta.url));
const child = spawn(process.execPath, [cli, '--serve', ...process.argv.slice(2)], {
  env: { ...process.env, SITE_PREVIEW: '0' },
  stdio: 'inherit'
});
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
