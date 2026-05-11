#!/usr/bin/env node

/**
 * Build and copy frontend assets to Spring Boot static folder
 * Ensures the frontend is served by the backend when running/building the JAR
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.resolve(__dirname, '..');
const BACKEND_STATIC = path.resolve(FRONTEND_DIR, '..', 'src', 'main', 'resources', 'static');
const DIST_DIR = path.resolve(FRONTEND_DIR, 'dist');

console.log('📦 Building frontend...');
try {
  execSync('npm run build', { cwd: FRONTEND_DIR, stdio: 'inherit' });
  console.log('✓ Frontend build complete');
} catch (err) {
  console.error('✗ Frontend build failed');
  process.exit(1);
}

console.log(`\n📂 Copying dist/ to ${BACKEND_STATIC}`);

// Ensure backend static folder exists
if (!fs.existsSync(BACKEND_STATIC)) {
  fs.mkdirSync(BACKEND_STATIC, { recursive: true });
  console.log(`✓ Created ${BACKEND_STATIC}`);
}

// Clear existing static assets
if (fs.existsSync(BACKEND_STATIC)) {
  const files = fs.readdirSync(BACKEND_STATIC);
  for (const file of files) {
    const filePath = path.join(BACKEND_STATIC, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
  console.log('✓ Cleared old static files');
}

// Copy dist contents to backend static
function copyDir(src, dest) {
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.lstatSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(DIST_DIR, BACKEND_STATIC);
console.log(`✓ Copied ${DIST_DIR} → ${BACKEND_STATIC}`);

// Output summary
console.log('\n✓ Build and copy complete!');
console.log('Frontend is now ready to be served by Spring Boot.');
console.log('Next: run "mvn spring-boot:run" or "mvn clean package" to build the JAR.');
