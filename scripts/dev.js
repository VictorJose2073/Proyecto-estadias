// Levanta Strapi y Vite a la vez sin depender de paquetes extra.
const { spawn, execSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const apps = [
  { name: 'back', dir: 'backend', color: '\x1b[35m' },
  { name: 'front', dir: 'frontend', color: '\x1b[36m' },
];

const children = apps.map(({ name, dir, color }) => {
  const child = spawn('npm', ['run', 'dev'], {
    cwd: path.join(root, dir),
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });
  const prefix = `${color}[${name}]\x1b[0m `;
  const pipe = (stream, out) => {
    let pending = '';
    stream.on('data', (chunk) => {
      const lines = (pending + chunk).split(/\r?\n/);
      pending = lines.pop();
      for (const line of lines) out.write(prefix + line + '\n');
    });
  };
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  child.on('exit', (code) => {
    console.log(`${prefix}terminó con código ${code}`);
    shutdown();
  });
  return child;
});

let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  for (const child of children) {
    if (child.exitCode !== null) continue;
    // En Windows hay que matar el árbol completo o Strapi/Vite quedan vivos.
    if (process.platform === 'win32') {
      try { execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' }); } catch {}
    } else {
      child.kill('SIGTERM');
    }
  }
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
