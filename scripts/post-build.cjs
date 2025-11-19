const fs = require('fs');
const path = require('path');

/**
 * Post-build script to organize ESM and CJS outputs
 */

function main() {
  const distDir = path.join(__dirname, '../dist');
  const esmDir = path.join(distDir, 'esm');
  const cjsDir = path.join(distDir, 'cjs');

  // Create ESM and CJS directories
  if (!fs.existsSync(esmDir)) {
    fs.mkdirSync(esmDir, { recursive: true });
  }
  if (!fs.existsSync(cjsDir)) {
    fs.mkdirSync(cjsDir, { recursive: true });
  }

  // Get all files from dist root
  const files = fs.readdirSync(distDir);

  files.forEach(file => {
    if (file === 'esm' || file === 'cjs') return;

    const srcPath = path.join(distDir, file);
    const stats = fs.statSync(srcPath);

    if (stats.isFile()) {
      if (file.endsWith('.js')) {
        // Copy .js to both ESM (as .mjs) and CJS
        const mjsPath = path.join(esmDir, file.replace('.js', '.mjs'));
        const cjsPath = path.join(cjsDir, file);
        fs.copyFileSync(srcPath, mjsPath);
        fs.copyFileSync(srcPath, cjsPath);
        fs.unlinkSync(srcPath);
      } else if (file.endsWith('.d.ts')) {
        // Copy type definitions to both
        fs.copyFileSync(srcPath, path.join(esmDir, file));
        fs.copyFileSync(srcPath, path.join(cjsDir, file));
        // Keep one in root for package.json types field
      } else if (file.endsWith('.js.map')) {
        // Copy source maps
        const esmMap = path.join(esmDir, file.replace('.js.map', '.mjs.map'));
        const cjsMap = path.join(cjsDir, file);
        fs.copyFileSync(srcPath, esmMap);
        fs.copyFileSync(srcPath, cjsMap);
        fs.unlinkSync(srcPath);
      } else if (file.endsWith('.d.ts.map')) {
        // Copy declaration maps
        fs.copyFileSync(srcPath, path.join(esmDir, file));
        fs.copyFileSync(srcPath, path.join(cjsDir, file));
      }
    }
  });

  console.log('✓ Post-build complete - ESM and CJS outputs organized');
}

try {
  main();
} catch (error) {
  console.error('Post-build failed:', error);
  process.exit(1);
}
