const fs = require('fs');
const path = require('path');

// Create necessary directories
const dirs = [
  'app/components',
  'app/services',
  'app/views',
  'app/assets',
  'app/styles'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Create empty .env if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, '');
}

console.log('Post-install setup completed successfully!');