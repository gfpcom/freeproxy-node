const fs = require('fs');
const path = require('path');

// Copy compiled CJS files from temp directory
function copyCjs() {
  const tempDir = path.join(__dirname, '../dist/cjs-temp');
  const cjsDir = path.join(__dirname, '../dist/cjs');

  // Create cjs directory if it doesn't exist
  if (!fs.existsSync(cjsDir)) {
    fs.mkdirSync(cjsDir, { recursive: true });
  }

  // Copy all files
  const files = fs.readdirSync(tempDir);
  files.forEach(file => {
    const src = path.join(tempDir, file);
    const dest = path.join(cjsDir, file);
    fs.copyFileSync(src, dest);
  });

  // Remove temp directory
  fs.rmSync(tempDir, { recursive: true });

  console.log('✓ CommonJS build complete');
}

copyCjs();

