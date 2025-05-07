import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Start dev server
const devServer = spawn('npx', ['vite'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

// Handle server startup
devServer.on('spawn', () => {
  console.log('Starting NBA Fan Journal...');
  
  setTimeout(() => {
    open('http://localhost:3000');
    console.log('\nNBA Fan Journal is running');
    console.log('To close the application, close this window or press Ctrl+C\n');
  }, 2000);
});

// Handle exit
process.on('SIGINT', () => {
  devServer.kill();
  process.exit();
});

process.stdin.resume();