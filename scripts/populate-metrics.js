const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '..', 'results');
const SLIDES_FILE = path.join(__dirname, '..', 'data', 'slides.json');

const MODELS = [
  'resnet18',
  'resnet50',
  'densenet121',
  'efficientnet_b3',
  'mobilenet_v2',
  'scnn'
];

function getLatestRunId(modelDir) {
  if (!fs.existsSync(modelDir)) return null;
  const runDirs = fs.readdirSync(modelDir)
    .filter(item => {
      const itemPath = path.join(modelDir, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .sort()
    .reverse();
  return runDirs.length > 0 ? runDirs[0] : null;
}

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.warn(`Failed to load ${filePath}:`, error.message);
    return null;
  }
}

function formatAccuracy(acc) {
  if (acc === null || acc === undefined) return '';
  return `${(acc * 100).toFixed(2)}%`;
}

function formatF1(f1) {
  if (f1 === null || f1 === undefined) return '';
  return f1.toFixed(3);
}

function formatParams(paramsM) {
  if (paramsM === null || paramsM === undefined) return '';
  return `${paramsM.toFixed(2)}M`;
}

// Load slides
const slides = JSON.parse(fs.readFileSync(SLIDES_FILE, 'utf-8'));

// Process each model
MODELS.forEach(modelId => {
  const modelDir = path.join(RESULTS_DIR, modelId);
  const latestRunId = getLatestRunId(modelDir);
  
  if (!latestRunId) {
    console.warn(`No run found for model: ${modelId}`);
    return;
  }

  const runDir = path.join(modelDir, latestRunId);
  
  // Load scalars
  const scalars7s = loadJSON(path.join(runDir, 'scalars_7s.json'));
  const scalars3sCenter = loadJSON(path.join(runDir, 'scalars_3s_center.json'));
  const scalars3s5crop = loadJSON(path.join(runDir, 'scalars_3s_5crop.json'));
  const efficiency = loadJSON(path.join(runDir, 'efficiency.json'));

  // Find model name mapping
  const modelNameMap = {
    'resnet18': 'ResNet-18',
    'resnet50': 'ResNet-50',
    'densenet121': 'DenseNet-121',
    'efficientnet_b3': 'EfficientNet-B3',
    'mobilenet_v2': 'MobileNet-V2',
    'scnn': 'SCNN'
  };
  const displayName = modelNameMap[modelId] || modelId;

  // Update results summary table (slide 10)
  const summarySlide = slides.find(s => s.id === 'slide-10');
  if (summarySlide && summarySlide.table) {
    const rowIndex = summarySlide.table.rows.findIndex(row => row[0] === displayName);
    if (rowIndex !== -1) {
      summarySlide.table.rows[rowIndex] = [
        displayName,
        formatAccuracy(scalars7s?.accuracy),
        formatF1(scalars7s?.f1_macro),
        formatAccuracy(scalars3sCenter?.accuracy),
        formatAccuracy(scalars3s5crop?.accuracy),
        formatParams(efficiency?.params_m)
      ];
    }
  }

  // Update model results slide
  const modelSlide = slides.find(s => s.modelName === modelId);
  if (modelSlide) {
    modelSlide.metrics = {
      'Accuracy (7s)': formatAccuracy(scalars7s?.accuracy),
      'Macro-F1 (7s)': formatF1(scalars7s?.f1_macro),
      'Accuracy (3s center)': formatAccuracy(scalars3sCenter?.accuracy),
      'Macro-F1 (3s center)': formatF1(scalars3sCenter?.f1_macro),
      'Accuracy (3s 5-crop)': formatAccuracy(scalars3s5crop?.accuracy),
      'Macro-F1 (3s 5-crop)': formatF1(scalars3s5crop?.f1_macro),
      'Params (M)': formatParams(efficiency?.params_m)
    };
  }
});

// Write updated slides
fs.writeFileSync(SLIDES_FILE, JSON.stringify(slides, null, 2));
console.log('✓ Metrics populated in slides.json');

