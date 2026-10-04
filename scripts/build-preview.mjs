import { spawnSync } from 'node:child_process';
const env = { ...process.env, CONTEXT: 'deploy-preview' };
for (const args of [['scripts/prepare-content.mjs'], ['node_modules/next/dist/bin/next', 'build', '--webpack']]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (result.status !== 0) process.exit(result.status || 1);
}
