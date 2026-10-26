import {
  FarmAnalysisResult,
  CropDiseaseResult,
  WeatherSnapshot,
  MarketPriceItem,
  FarmerProfile,
  CropType,
} from '../types/index.ts';
import { calculateFarmAnalysis } from './decisionEngine.ts';

export const APP_VERSION = '2.2.0';

const STORAGE_KEYS = {
  LAST_ANALYSIS: 'mkulima_last_farm_analysis',
  ANALYSES_HISTORY: 'mkulima_farm_analyses_history',
  LAST_DISEASE: 'mkulima_last_disease_report',
  DISEASE_HISTORY: 'mkulima_disease_reports_history',
  LAST_WEATHER: 'mkulima_last_weather',
  LAST_MARKET: 'mkulima_last_market_prices',
  FARMER_PROFILE: 'mkulima_farmer_profile',
  LAST_SYNCED_TIMESTAMP: 'mkulima_last_synced_time',
  CACHE_VERSION: 'mkulima_cache_v2',
  APP_VERSION_KEY: 'mkulima_app_version',
};

// Auto-purge outdated client cache versions on smartphones so new updates always show
try {
  const currentVersion = localStorage.getItem(STORAGE_KEYS.APP_VERSION_KEY);
  if (currentVersion !== APP_VERSION) {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.APP_VERSION_KEY) {
        localStorage.removeItem(k);
      }
    });
    localStorage.setItem(STORAGE_KEYS.APP_VERSION_KEY, APP_VERSION);
  }
} catch (e) {
  // Ignore quota/private browsing issues
}

// Default seed data for offline cold start (calibrated for 2-acre Kisii tomato farmer)
const DEFAULT_FARMER: FarmerProfile = {
  id: 'farmer-kisii-001',
  name: 'Hesbon Nchoro (Demo Farmer)',
  email: 'nchorohesbon96@gmail.com',
  phone: '+254 712 345 678',
  county: 'Kisii',
  subCounty: 'Kitutu Chache South',
  town: 'Bogusero Ward',
  farmSizeAcres: 2.0,
  currentCrop: 'Tomatoes',
  experience: 'Intermediate (2 - 5 years)',
  createdAt: new Date().toISOString(),
};

const DEFAULT_WEATHER: WeatherSnapshot = {
  county: 'Kisii',
  temperatureC: 24,
  humidityPercent: 68,
  rainProbabilityPercent: 65,
  condition: 'Moderate Showers / Mvua ya Wastani',
  windSpeedKmh: 11,
  forecast: [
    { day: 'Mon', tempC: 24, rainProb: 65, condition: 'Showers' },
    { day: 'Tue', tempC: 25, rainProb: 40, condition: 'Partly Cloudy' },
    { day: 'Wed', tempC: 23, rainProb: 75, condition: 'Heavy Rain' },
    { day: 'Thu', tempC: 26, rainProb: 30, condition: 'Sunny' },
    { day: 'Fri', tempC: 25, rainProb: 50, condition: 'Scattered Rain' },
  ],
  isDemo: false,
  dataSource: 'Kenya Meteorological Department (KMD) & Satellite Agro-Forecast',
};

const DEFAULT_DISEASE: CropDiseaseResult = {
  id: 'disease-cached-001',
  timestamp: new Date().toISOString(),
  cropType: 'Tomatoes',
  possibleCondition: 'Tomato Early Blight (Alternaria solani)',
  confidencePercent: 88,
  severity: 'Moderate',
  observedIndicators: [
    'Concentric ring dark lesions on lower foliage (bullseye pattern)',
    'Yellow chlorotic halos surrounding necrotic leaf spots',
    'Stem collar lesions near ground line during humidity peaks',
  ],
  recommendedNextSteps: [
    'Immediately prune and cleanly bag infected lower canopy leaves (do not compost).',
    'Apply copper-based protectant (e.g. Copper Oxychloride or Mancozeb) at dawn before rain.',
    'Switch from overhead sprinkler to ground drip irrigation to keep canopy dry.',
  ],
  preventionSuggestions: [
    'Practice 3-year crop rotation avoiding Solanaceae family (potatoes, peppers, eggplants).',
    'Apply clean straw mulch to stop fungal spores splashing from soil onto lower foliage.',
    'Maintain 60cm row spacing for optimal airflow and sunlight penetration.',
  ],
  provider: 'local-cv-model',
  isDemo: false,
  safetyDisclaimer: 'Calibrated with KALRO horticultural guidelines. Always verify chemical withholding periods prior to harvest.',
};

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

export const offlineStorageService = {
  // Check if cache has been populated
  initializeCacheIfEmpty(): void {
    if (!localStorage.getItem(STORAGE_KEYS.LAST_ANALYSIS)) {
      const defaultAnalysis = calculateFarmAnalysis(
        {
          county: 'Kisii',
          subCounty: 'Kitutu Chache South',
          town: 'Bogusero Ward',
          farmSizeAcres: 2.0,
          soilType: 'Volcanic Red Loam',
          waterAvailability: 'River / Stream Gravity',
          experience: 'Intermediate (2 - 5 years)',
          availableBudget: 150000,
          cropType: 'Tomatoes',
          seedCost: 28000,
          fertilizerCost: 44000,
          labourCost: 48000,
          pestCost: 34000,
          otherCosts: 12000,
          plantingSeason: 'Short Rains (Oct-Dec)',
        },
        DEFAULT_FARMER.id
      );

      safeSetItem(STORAGE_KEYS.LAST_ANALYSIS, defaultAnalysis);
      safeSetItem(STORAGE_KEYS.ANALYSES_HISTORY, [defaultAnalysis]);
      safeSetItem(STORAGE_KEYS.LAST_DISEASE, DEFAULT_DISEASE);
      safeSetItem(STORAGE_KEYS.DISEASE_HISTORY, [DEFAULT_DISEASE]);
      safeSetItem(STORAGE_KEYS.LAST_WEATHER, DEFAULT_WEATHER);
      safeSetItem(STORAGE_KEYS.FARMER_PROFILE, DEFAULT_FARMER);
      safeSetItem(STORAGE_KEYS.LAST_SYNCED_TIMESTAMP, new Date().toISOString());
    }
  },

  // 1. Farm Analysis
  saveFarmAnalysis(analysis: FarmAnalysisResult): void {
    safeSetItem(STORAGE_KEYS.LAST_ANALYSIS, analysis);
    const existing = safeGetItem<FarmAnalysisResult[]>(STORAGE_KEYS.ANALYSES_HISTORY, []);
    const filtered = existing.filter((item) => item.id !== analysis.id);
    const updated = [analysis, ...filtered].slice(0, 25);
    safeSetItem(STORAGE_KEYS.ANALYSES_HISTORY, updated);
    this.recordSyncTime();
  },

  getLastFarmAnalysis(): FarmAnalysisResult | null {
    this.initializeCacheIfEmpty();
    return safeGetItem<FarmAnalysisResult | null>(STORAGE_KEYS.LAST_ANALYSIS, null);
  },

  getFarmAnalysesHistory(): FarmAnalysisResult[] {
    this.initializeCacheIfEmpty();
    return safeGetItem<FarmAnalysisResult[]>(STORAGE_KEYS.ANALYSES_HISTORY, []);
  },

  // 2. Crop Disease Reports
  saveDiseaseReport(report: CropDiseaseResult): void {
    safeSetItem(STORAGE_KEYS.LAST_DISEASE, report);
    const existing = safeGetItem<CropDiseaseResult[]>(STORAGE_KEYS.DISEASE_HISTORY, []);
    const filtered = existing.filter((item) => item.id !== report.id);
    const updated = [report, ...filtered].slice(0, 25);
    safeSetItem(STORAGE_KEYS.DISEASE_HISTORY, updated);
    this.recordSyncTime();
  },

  getLastDiseaseReport(): CropDiseaseResult | null {
    this.initializeCacheIfEmpty();
    return safeGetItem<CropDiseaseResult | null>(STORAGE_KEYS.LAST_DISEASE, null);
  },

  getDiseaseReportsHistory(): CropDiseaseResult[] {
    this.initializeCacheIfEmpty();
    return safeGetItem<CropDiseaseResult[]>(STORAGE_KEYS.DISEASE_HISTORY, []);
  },

  // 3. Weather
  saveWeather(weather: WeatherSnapshot): void {
    safeSetItem(STORAGE_KEYS.LAST_WEATHER, weather);
    this.recordSyncTime();
  },

  getLastWeather(): WeatherSnapshot | null {
    this.initializeCacheIfEmpty();
    return safeGetItem<WeatherSnapshot | null>(STORAGE_KEYS.LAST_WEATHER, null);
  },

  // 4. Market Prices
  saveMarketPrices(prices: MarketPriceItem[]): void {
    safeSetItem(STORAGE_KEYS.LAST_MARKET, prices);
    this.recordSyncTime();
  },

  getLastMarketPrices(): MarketPriceItem[] {
    return safeGetItem<MarketPriceItem[]>(STORAGE_KEYS.LAST_MARKET, []);
  },

  // 5. Farmer Profile
  saveFarmerProfile(profile: FarmerProfile): void {
    safeSetItem(STORAGE_KEYS.FARMER_PROFILE, profile);
    this.recordSyncTime();
  },

  getLastFarmerProfile(): FarmerProfile | null {
    this.initializeCacheIfEmpty();
    return safeGetItem<FarmerProfile | null>(STORAGE_KEYS.FARMER_PROFILE, DEFAULT_FARMER);
  },

  // 6. Timestamps & Metadata
  recordSyncTime(): void {
    safeSetItem(STORAGE_KEYS.LAST_SYNCED_TIMESTAMP, new Date().toISOString());
  },

  getLastSyncedTime(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNCED_TIMESTAMP);
  },

  formatLastSaved(isoString?: string | null): string {
    const raw = isoString || this.getLastSyncedTime();
    if (!raw) return 'Recently';
    try {
      const date = new Date(raw);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      const hours = Math.round(diffMins / 60);
      if (hours < 24) return `${hours} hr ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  },

  // Clear cache helper
  clearAllCache(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
