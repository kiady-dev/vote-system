#!/usr/bin/env node

/**
 * Image conversion script: Convert PNG/JPG images in public/images to WebP format
 * Maintains originals as fallbacks.
 * 
 * Usage: node scripts/convert-images.js
 * Or via npm: npm run images:convert
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.resolve(PROJECT_ROOT, 'public', 'images');
const PUBLIC_IMAGES_BACKUP = path.resolve(PROJECT_ROOT, 'public', 'images-original');

// Ensure WebP support is checked
function hasImagemagick() {
  try {
    execSync('identify -version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function hasSharp() {
  try {
    require.resolve('sharp');
    return true;
  } catch {
    return false;
  }
}

async function convertWithSharp(inputPath, outputPath) {
  try {
    const sharp = (await import('sharp')).default;
    await sharp(inputPath)
      .webp({ quality: 75 })
      .toFile(outputPath);
    console.log(`✓ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    return true;
  } catch (err) {
    console.error(`✗ Sharp conversion failed for ${inputPath}: ${err.message}`);
    return false;
  }
}

function convertWithImageMagick(inputPath, outputPath) {
  try {
    execSync(`convert "${inputPath}" -quality 75 -strip "${outputPath}"`);
    console.log(`✓ Converted (ImageMagick): ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    return true;
  } catch (err) {
    console.error(`✗ ImageMagick conversion failed for ${inputPath}: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.warn(`⚠ Images directory not found: ${IMAGES_DIR}`);
    console.log('Note: If using vite static assets, place images in "public/images/" folder.');
    return;
  }

  const files = fs.readdirSync(IMAGES_DIR);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  if (imageFiles.length === 0) {
    console.log('No images found to convert.');
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to convert.\n`);

  // Check for available tools
  const hasSharpLib = hasSharp();
  const hasMagick = hasImagemagick();

  if (!hasSharpLib && !hasMagick) {
    console.error('✗ No image conversion tool found.');
    console.log('Install one of:');
    console.log('  - npm install sharp (recommended for Node.js projects)');
    console.log('  - ImageMagick: https://imagemagick.org/script/download.php');
    process.exit(1);
  }

  let successCount = 0;
  let failedCount = 0;

  // Create backup directory to preserve originals
  if (!fs.existsSync(PUBLIC_IMAGES_BACKUP)) {
    fs.mkdirSync(PUBLIC_IMAGES_BACKUP, { recursive: true });
  }

  for (const file of imageFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(IMAGES_DIR, `${path.basename(file, path.extname(file))}.webp`);

    // Backup original
    const backupPath = path.join(PUBLIC_IMAGES_BACKUP, file);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
      console.log(`📦 Backed up original: ${file}`);
    }

    let converted = false;

    // Try sharp first (better for Node projects)
    if (hasSharpLib) {
      converted = await convertWithSharp(inputPath, outputPath);
    } else if (hasMagick) {
      converted = convertWithImageMagick(inputPath, outputPath);
    }

    if (converted) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  console.log(`\n✓ Conversion complete: ${successCount} succeeded, ${failedCount} failed`);
  
  if (successCount > 0) {
    console.log('\nNext steps:');
    console.log('1. Update image references to use WebP (with JPG/PNG fallback):');
    console.log('   <picture>');
    console.log('     <source srcset="/images/photo.webp" type="image/webp">');
    console.log('     <img src="/images/photo.jpg" alt="..." width="400" height="240">');
    console.log('   </picture>');
    console.log('\n2. Or use single WebP with fallback via srcset:');
    console.log('   <img src="/images/photo.jpg" srcset="/images/photo.webp" alt="...">');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
