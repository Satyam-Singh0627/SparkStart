// launch-electron.cjs
// Ensure Electron runs with full API (not as node)
delete process.env.ELECTRON_RUN_AS_NODE;
const { execSync } = require('child_process');
console.log('Building SparkBuddy...');
execSync('npm run build', { stdio: 'inherit' });
console.log('Starting Electron...');
execSync('npx electron .', { stdio: 'inherit' });

