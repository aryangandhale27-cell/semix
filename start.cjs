const { execSync } = require('node:child_process');
const path = require('node:path');

execSync('npm run build', {
  cwd: __dirname,
  stdio: 'inherit',
});

require(path.join(__dirname, 'dist', 'server.cjs'));