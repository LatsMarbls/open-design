#!/usr/bin/env node
import { spawn, execFileSync, execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createConnection } from 'net';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);
const DAEMON_DIR = resolve(ROOT, 'apps/daemon');
const DAEMON_CMD = resolve(DAEMON_DIR, 'dist/cli.js');
const PORT = process.env.PORT || '7456';

console.log('');
console.log('  \u26a1 Open Design');
console.log('');

const nodeVer = process.version;
if (!nodeVer.startsWith('v24')) {
  console.log(`  \u26a0 WARNING: Expected Node ~24, got ${nodeVer}`);
}
console.log(`  Node ${nodeVer}`);

// Build daemon if needed
if (!existsSync(DAEMON_CMD)) {
  console.log('  Building daemon...');
  execSync('pnpm --filter @open-design/daemon build', { cwd: ROOT, stdio: 'inherit' });
  if (!existsSync(DAEMON_CMD)) {
    console.error('  \u2716 Daemon build failed');
    process.exit(1);
  }
}

// Kill old daemon on our port — execFileSync (no shell, no window flash)
try {
  execFileSync('taskkill', ['/F', '/FI', `PID ne 0`, '/FI', `WINDOWTITLE eq node`], { stdio: 'ignore', windowsHide: true, timeout: 3000 });
} catch {}
// Kill any process listening on our port
try {
  execFileSync('powershell', [
    '-NoProfile', '-NonInteractive', '-Command',
    `Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force`
  ], { stdio: 'ignore', windowsHide: true, timeout: 3000 });
} catch {}
// Kill any old cli.js daemon processes
try {
  execFileSync('powershell', [
    '-NoProfile', '-NonInteractive', '-Command',
    `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*cli.js*' -and $_.Name -eq 'node.exe' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }`
  ], { stdio: 'ignore', windowsHide: true, timeout: 3000 });
} catch {}
await new Promise(r => setTimeout(r, 1500));

// Start daemon fully headless — no shell, no window
console.log('  Starting daemon...');
const daemon = spawn(process.execPath, [DAEMON_CMD, '--port', PORT, '--no-open'], {
  cwd: DAEMON_DIR,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env },
  detached: true,
  windowsHide: true,
});
daemon.unref();

let stderrBuf = '';
daemon.stderr.on('data', d => { stderrBuf += d.toString(); });

// Wait for health check
const deadline = Date.now() + 12000;
let healthy = false;
while (Date.now() < deadline) {
  await new Promise(r => setTimeout(r, 400));
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/api/health`);
    if (res.ok) { healthy = true; break; }
  } catch {}
}

if (!healthy) {
  console.error(`  \u2716 Daemon didn't start on port ${PORT}`);
  if (stderrBuf) console.error('  stderr:', stderrBuf.slice(0, 500));
  process.exit(1);
}

console.log(`  \u2705 Daemon running on http://127.0.0.1:${PORT}`);

console.log('');
console.log(`  \u2728 Daemon running at http://127.0.0.1:${PORT}`);
console.log('');
