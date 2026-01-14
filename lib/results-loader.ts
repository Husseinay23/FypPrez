import fs from 'fs';
import path from 'path';

interface ScalarsData {
  accuracy?: number;
  f1_macro?: number;
  f1_weighted?: number;
  [key: string]: any;
}

interface EfficiencyData {
  params_m?: number;
  latency_ms_per_forward?: number;
  [key: string]: any;
}

export interface ModelResults {
  modelId: string;
  accuracy7s: number | null;
  macroF17s: number | null;
  accuracy3s: number | null;
  macroF13s: number | null;
  accuracy5crop: number | null;
  macroF15crop: number | null;
  paramsM: number | null;
  latencyMs: number | null;
}

const RESULTS_DIR = path.join(process.cwd(), 'results');
const MODELS = [
  'resnet18',
  'resnet50',
  'densenet121',
  'efficientnet_b3',
  'mobilenet_v2',
  'scnn'
];

function getLatestRunId(modelDir: string): string | null {
  if (!fs.existsSync(modelDir)) {
    return null;
  }

  const runDirs = fs.readdirSync(modelDir)
    .filter(item => {
      const itemPath = path.join(modelDir, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .sort()
    .reverse(); // Most recent first

  return runDirs.length > 0 ? runDirs[0] : null;
}

function loadJSON<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.warn(`Failed to load ${filePath}:`, error);
    return null;
  }
}

export function loadAllResults(): ModelResults[] {
  const results: ModelResults[] = [];

  for (const modelId of MODELS) {
    const modelDir = path.join(RESULTS_DIR, modelId);
    const latestRunId = getLatestRunId(modelDir);

    if (!latestRunId) {
      console.warn(`No run found for model: ${modelId}`);
      results.push({
        modelId,
        accuracy7s: null,
        macroF17s: null,
        accuracy3s: null,
        macroF13s: null,
        accuracy5crop: null,
        macroF15crop: null,
        paramsM: null,
        latencyMs: null,
      });
      continue;
    }

    const runDir = path.join(modelDir, latestRunId);

    // Load scalars
    const scalars7s = loadJSON<ScalarsData>(path.join(runDir, 'scalars_7s.json'));
    const scalars3sCenter = loadJSON<ScalarsData>(path.join(runDir, 'scalars_3s_center.json'));
    const scalars3s5crop = loadJSON<ScalarsData>(path.join(runDir, 'scalars_3s_5crop.json'));

    // Load efficiency
    const efficiency = loadJSON<EfficiencyData>(path.join(runDir, 'efficiency.json'));

    results.push({
      modelId,
      accuracy7s: scalars7s?.accuracy ?? null,
      macroF17s: scalars7s?.f1_macro ?? null,
      accuracy3s: scalars3sCenter?.accuracy ?? null,
      macroF13s: scalars3sCenter?.f1_macro ?? null,
      accuracy5crop: scalars3s5crop?.accuracy ?? null,
      macroF15crop: scalars3s5crop?.f1_macro ?? null,
      paramsM: efficiency?.params_m ?? null,
      latencyMs: efficiency?.latency_ms_per_forward ?? null,
    });
  }

  return results;
}

// Format helpers for display
export function formatAccuracy(acc: number | null): string {
  if (acc === null) return '';
  return `${(acc * 100).toFixed(2)}%`;
}

export function formatF1(f1: number | null): string {
  if (f1 === null) return '';
  return f1.toFixed(3);
}

export function formatParams(paramsM: number | null): string {
  if (paramsM === null) return '';
  return `${paramsM.toFixed(2)}M`;
}

export function formatLatency(latencyMs: number | null): string {
  if (latencyMs === null) return '';
  return `${latencyMs.toFixed(1)}ms`;
}

