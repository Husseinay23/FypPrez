const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '..', 'results');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

// Models to process (matching slides.json)
const MODELS = [
  'resnet18',
  'resnet50',
  'densenet121',
  'efficientnet_b3',
  'mobilenet_v2',
  'scnn'
];

// Ensure public/images directory exists
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

function getLatestRunId(modelDir) {
  if (!fs.existsSync(modelDir)) {
    console.warn(`Model directory not found: ${modelDir}`);
    return null;
  }

  const runDirs = fs.readdirSync(modelDir)
    .filter(item => {
      const itemPath = path.join(modelDir, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .sort()
    .reverse(); // Most recent first (lexicographically)

  return runDirs.length > 0 ? runDirs[0] : null;
}

function copyImage(source, dest) {
  if (!fs.existsSync(source)) {
    console.warn(`Source image not found: ${source}`);
    return false;
  }

  try {
    fs.copyFileSync(source, dest);
    console.log(`✓ Copied: ${path.basename(source)} → ${path.basename(dest)}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to copy ${source}:`, error.message);
    return false;
  }
}

function processModel(modelName) {
  const modelDir = path.join(RESULTS_DIR, modelName);
  const latestRunId = getLatestRunId(modelDir);

  if (!latestRunId) {
    console.warn(`No run found for model: ${modelName}`);
    return;
  }

  const figuresDir = path.join(modelDir, latestRunId, 'figures');

  if (!fs.existsSync(figuresDir)) {
    console.warn(`Figures directory not found: ${figuresDir}`);
    return;
  }

  console.log(`\nProcessing ${modelName} (run: ${latestRunId})...`);

  // Copy images with renaming
  const mappings = [
    { source: 'confusion_matrix_7s.png', dest: `${modelName}_confusion.png` },
    { source: 'accuracy_curves.png', dest: `${modelName}_accuracy.png` },
    { source: 'loss_curves.png', dest: `${modelName}_loss.png` }
  ];

  mappings.forEach(({ source, dest }) => {
    const sourcePath = path.join(figuresDir, source);
    const destPath = path.join(PUBLIC_IMAGES_DIR, dest);
    copyImage(sourcePath, destPath);
  });
}

// Main execution
console.log('Starting image copy process...\n');
console.log(`Results directory: ${RESULTS_DIR}`);
console.log(`Target directory: ${PUBLIC_IMAGES_DIR}\n`);

if (!fs.existsSync(RESULTS_DIR)) {
  console.warn(`Results directory not found: ${RESULTS_DIR}`);
  console.log('Creating placeholder structure. Add your results/ folder when ready.');
} else {
  MODELS.forEach(processModel);
}

// Note about logo
console.log('\n---');
console.log('Note: Add university logo manually as /public/images/uni-logo.png');
console.log('---\n');

console.log('Image copy process completed.');

