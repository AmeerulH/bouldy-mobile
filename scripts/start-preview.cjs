const { spawn } = require('node:child_process');

const mode = process.argv[2];
if (!['live', 'fixture'].includes(mode)) {
  console.error('Choose live or fixture preview mode.');
  process.exit(1);
}

const env = {
  ...process.env,
  // Explicit values also prevent stale shell/dotenv overrides from selecting fixtures.
  BOULDY_LOCAL_API: mode === 'fixture' ? 'http://127.0.0.1:4010' : '',
  EXPO_PUBLIC_FIXTURE_PREVIEW: mode === 'fixture' ? '1' : '0',
  EXPO_PUBLIC_ADAPTER_ORIGIN: process.env.EXPO_PUBLIC_ADAPTER_ORIGIN || 'http://127.0.0.1:8081',
  EXPO_NO_DEV_MENU: '1',
  NODE_OPTIONS: [process.env.NODE_OPTIONS, '--dns-result-order=ipv4first'].filter(Boolean).join(' '),
};

console.log(mode === 'live' ? 'Bouldy: real API https://bouldy-api.onrender.com' : 'Bouldy: isolated fixture API http://127.0.0.1:4010');
const child = spawn(process.execPath, [require.resolve('expo/bin/cli'), 'start', '--localhost', '--port', '8081', ...process.argv.slice(3)], { env, stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 0; });
