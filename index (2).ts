export type County =
  | 'Kisii'
  | 'Nakuru'
  | 'Uasin Gishu'
  | 'Kiambu'
  | 'Machakos'
  | 'Meru'
  | 'Trans Nzoia'
  | 'Nyeri'
  | 'Kilifi'
  | 'Kakamega'
  | 'Bungoma'
  | 'Migori';

export type CropType =
  | 'Tomatoes'
  | 'Maize'
  | 'Beans'
  | 'Potatoes'
  | 'Bananas'
  | 'Cabbages / Vegetables'
  | 'Onions'
  | 'Watermelon';

export type SoilType =
  | 'Volcanic Red Loam'
  | 'Loam'
  | 'Clay Loam'
  | 'Sandy Loam'
  | 'Black Cotton Soil';

export type WaterAvailability =
  | 'Rainfed (Seasonal)'
  | 'Borehole / Well'
  | 'River / Stream Gravity'
  | 'Drip Irrigation Installed'
  | 'Limited / Erratic';

export type FarmingExperience =
  | 'Beginner (< 2 years)'
  | 'Intermediate (2 - 5 years)'
  | 'Experienced (> 5 years)';

export interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  county: County;
  subCounty: string;
  town: string;
  farmSizeAcres: number;
  currentCrop: CropType;
  experience: FarmingExperience;
  createdAt: string;
}

export interface FarmAnalysisInput {
  county: County;
  subCounty: string;
  town?: string;
  latitude?: number;
  longitude?: number;
  farmSizeAcres: number;
  soilType: SoilType;
  waterAvailability: WaterAvailability;
  experience: FarmingExperience;
  availableBudget: number; // KES
  cropType: CropType;
  seedCost: number; // KES
  fertilizerCost: number; // KES
  labourCost: number; // KES
  pestCost: number; // KES
  otherCosts: number; // KES
  plantingSeason: 'Long Rains (Mar-Jun)' | 'Short Rains (Oct-Dec)' | 'Irrigated Year-round';
}

export interface FarmFinancials {
  seedCost: number;
  fertilizerCost: number;
  labourCost: number;
  pestCost: number;
  otherCosts: number;
  totalCost: number;
  estimatedYield: number;
  yieldUnit: string; // e.g. "crates (64kg)", "90kg bags", "tonnes"
  estimatedSellingPrice: number; // KES per unit
  estimatedRevenue: number;
  estimatedProfit: number;
  roiPercent: number;
  breakEvenYield: number;
}

export interface RiskBreakdown {
  weatherRisk: 'Low' | 'Medium' | 'High';
  weatherRiskScore: number; // 0-100
  diseaseRisk: 'Low' | 'Medium' | 'High';
  diseaseRiskScore: number;
  marketRisk: 'Low' | 'Medium' | 'High';
  marketRiskScore: number;
  costRisk: 'Low' | 'Medium' | 'High';
  costRiskScore: number;
  overallRiskLevel: 'Low' | 'Medium' | 'High';
  overallRiskScore: number;
  summary: string;
}

export interface ExplainableAiFactors {
  whyRecommended: string[];
  positiveFactors: string[];
  cautionFactors: string[];
  costBreakdownFormula: string;
  suitabilityEquation: string;
}

export interface FarmAnalysisResult {
  id: string;
  farmerId: string;
  timestamp: string;
  input: FarmAnalysisInput;
  recommendedCrop: CropType;
  cropSuitabilityScore: number; // 0-100
  profitPotentialScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  financials: FarmFinancials;
  risks: RiskBreakdown;
  explainableAi: ExplainableAiFactors;
  modelType: string;
  isDemo: boolean;
  disclaimer: string;
}

export interface CropDiseaseResult {
  id: string;
  timestamp: string;
  cropType: CropType;
  imageUrl?: string;
  possibleCondition: string;
  confidencePercent: number; // e.g. 88%
  severity: 'Low' | 'Moderate' | 'Severe';
  observedIndicators: string[];
  recommendedNextSteps: string[];
  preventionSuggestions: string[];
  provider: 'gemini-3.8-flash-vision' | 'gemini-flash-latest-vision' | 'gemini-3.1-flash-lite-vision' | 'local-cv-model' | 'demo-provider' | string;
  isDemo: boolean;
  safetyDisclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  isDemo?: boolean;
}

export interface DailyAgroForecast {
  day: string; // e.g. "Monday", "Jumatatu"
  date: string; // "Oct 5"
  tempC: number;
  tempMinC?: number;
  rainProb: number;
  rainfallMm: number;
  condition: string;
  conditionSw?: string;
  icon: string;
  humidityPercent: number;
  windSpeedKmh: number;
  whatIsHappening: {
    en: string;
    sw: string;
  };
  actionPlan: {
    canSpray: boolean;
    sprayAdviceEn: string;
    sprayAdviceSw: string;
    canFertilize: boolean;
    fertilizerAdviceEn: string;
    fertilizerAdviceSw: string;
    canHarvestDry: boolean;
    harvestAdviceEn: string;
    harvestAdviceSw: string;
    irrigationAdviceEn: string;
    irrigationAdviceSw: string;
    priorityTaskEn: string;
    priorityTaskSw: string;
  };
}

export interface WeeklyAgroOutlook {
  weeklySummaryEn: string;
  weeklySummarySw: string;
  totalRainfallMm: number;
  highRiskDays: string[];
  bestFieldworkDays: string[];
  seasonalAdviceEn: string;
  seasonalAdviceSw: string;
}

export interface WeatherSnapshot {
  county: County;
  temperatureC: number;
  humidityPercent: number;
  rainProbabilityPercent: number;
  condition: string;
  windSpeedKmh: number;
  rainfallTodayMm?: number;
  forecast: Array<{
    day: string;
    tempC: number;
    rainProb: number;
    condition: string;
  }>;
  dailyForecasts?: DailyAgroForecast[];
  weeklyOutlook?: WeeklyAgroOutlook;
  isDemo: boolean;
  dataSource: string;
}

export interface MarketPriceItem {
  id: string;
  crop: CropType;
  location: string;
  pricePerUnitKes: number;
  unit: string;
  changePercent: number;
  trend: 'rising' | 'stable' | 'falling';
  date: string;
  isDemo: boolean;
  source: string;
}

export interface ProduceListing {
  id: string;
  farmerName: string;
  farmerPhone: string;
  county: string;
  subCounty: string;
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  pricePerUnitKes: number;
  fairMarketPriceKes: number;
  harvestStatus: 'ready_now' | 'harvesting_this_week' | 'ready_in_2_weeks';
  description: string;
  isOrganic?: boolean;
  verifiedSeller: boolean;
  createdAt: string;
  viewsCount?: number;
  inquiriesCount?: number;
}

export interface BuyerRequest {
  id: string;
  buyerName: string;
  buyerType: 'Supermarket / Retailer' | 'School / Institution' | 'Export Processor' | 'Wholesaler / Aggregator';
  targetCrop: string;
  quantityRequired: string;
  buyingPriceKes: number;
  unit: string;
  preferredCounty: string;
  deadline: string;
  buyerPhone: string;
  status: 'active' | 'partially_fulfilled';
  description: string;
}

export interface HarvestCluster {
  id: string;
  title: string;
  crop: string;
  county: string;
  totalPooled: string;
  farmersCount: number;
  targetBuyer: string;
  negotiatedPriceKes: number;
  unit: string;
  status: 'open' | 'locked';
  progressPercent: number;
}

export interface LocalBuyerContact {
  id: string;
  businessName: string;
  contactPerson: string;
  category: 'Supermarket' | 'School / College' | 'Food Processor / Miller' | 'Wholesaler / Aggregator' | 'Hotel / Restaurant' | 'Export House';
  county: string;
  subCounty: string;
  physicalLocation: string;
  phone: string;
  whatsapp: string;
  email?: string;
  cropsPurchased: string[];
  buyingFrequency: 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Seasonal Contracts';
  paymentTerms: 'Instant M-PESA on Delivery' | 'Cash on Collection' | 'Bank Transfer (24 Hours)' | 'Weekly Net';
  minimumVolume: string;
  verified: boolean;
  rating: number;
  transactionsCompleted: number;
}

export interface PriceAlert {
  id: string;
  crop: string;
  targetMarket: string;
  thresholdPriceKes: number;
  unit: string;
  enabled: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  lastTriggeredPrice?: number;
  isTriggered?: boolean;
}

export interface ModelMetrics {
  models: {
    randomForest: {
      name: string;
      r2Score: number;
      rmseKes: number;
      maeKes: number;
      trainingSamples: number;
      status: string;
    };
    gradientBoosting: {
      name: string;
      r2Score: number;
      rmseKes: number;
      maeKes: number;
      trainingSamples: number;
      status: string;
    };
  };
  visionModel: {
    name: string;
    architecture: string;
    classesCount: number;
    validationAccuracy: number;
    inferenceLatencyMs: number;
    status: string;
  };
  lastTrainedDate: string;
  datasetInfo: {
    totalRecords: number;
    geographiesCovered: string[];
    source: string;
    isDemoDataset: boolean;
  };
}
