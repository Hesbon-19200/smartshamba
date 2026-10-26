import { FarmAnalysisInput, FarmAnalysisResult, FarmFinancials, RiskBreakdown, ExplainableAiFactors, CropType } from '../types/index.ts';

interface CropBenchmark {
  baseYieldPerAcre: number;
  yieldUnit: string;
  basePriceKes: number;
  priceVolatility: 'Low' | 'Medium' | 'High';
  favoredSoils: string[];
  waterSensitivity: number; // 0.0 to 1.0 (higher means more sensitive to water deficit)
  diseaseSusceptibility: 'Low' | 'Medium' | 'High';
  defaultSeedCostPerAcre: number;
  defaultFertCostPerAcre: number;
  defaultLabourCostPerAcre: number;
  defaultPestCostPerAcre: number;
  defaultOtherCostPerAcre: number;
  recommendedCounties: string[];
}

export const CROP_BENCHMARKS: Record<CropType, CropBenchmark> = {
  'Tomatoes': {
    baseYieldPerAcre: 280,
    yieldUnit: 'crates (64kg)',
    basePriceKes: 3200,
    priceVolatility: 'High',
    favoredSoils: ['Volcanic Red Loam', 'Loam'],
    waterSensitivity: 0.85,
    diseaseSusceptibility: 'High',
    defaultSeedCostPerAcre: 14000,
    defaultFertCostPerAcre: 22000,
    defaultLabourCostPerAcre: 24000,
    defaultPestCostPerAcre: 17000,
    defaultOtherCostPerAcre: 6000,
    recommendedCounties: ['Kisii', 'Kiambu', 'Meru', 'Nakuru', 'Machakos', 'Kirinyaga'],
  },
  'Maize': {
    baseYieldPerAcre: 28,
    yieldUnit: '90kg bags',
    basePriceKes: 4200,
    priceVolatility: 'Medium',
    favoredSoils: ['Loam', 'Clay Loam', 'Volcanic Red Loam'],
    waterSensitivity: 0.60,
    diseaseSusceptibility: 'Medium',
    defaultSeedCostPerAcre: 5500,
    defaultFertCostPerAcre: 16000,
    defaultLabourCostPerAcre: 12000,
    defaultPestCostPerAcre: 4500,
    defaultOtherCostPerAcre: 3000,
    recommendedCounties: ['Trans Nzoia', 'Uasin Gishu', 'Nakuru', 'Bungoma', 'Kakamega', 'Kisii'],
  },
  'Beans': {
    baseYieldPerAcre: 10,
    yieldUnit: '90kg bags',
    basePriceKes: 9500,
    priceVolatility: 'Medium',
    favoredSoils: ['Loam', 'Clay Loam', 'Sandy Loam'],
    waterSensitivity: 0.45,
    diseaseSusceptibility: 'Medium',
    defaultSeedCostPerAcre: 4500,
    defaultFertCostPerAcre: 8000,
    defaultLabourCostPerAcre: 9000,
    defaultPestCostPerAcre: 3500,
    defaultOtherCostPerAcre: 2000,
    recommendedCounties: ['Machakos', 'Kisii', 'Nakuru', 'Meru', 'Kakamega', 'Nyeri'],
  },
  'Potatoes': {
    baseYieldPerAcre: 80,
    yieldUnit: '50kg bags',
    basePriceKes: 2800,
    priceVolatility: 'High',
    favoredSoils: ['Volcanic Red Loam', 'Loam'],
    waterSensitivity: 0.70,
    diseaseSusceptibility: 'High',
    defaultSeedCostPerAcre: 24000,
    defaultFertCostPerAcre: 18000,
    defaultLabourCostPerAcre: 16000,
    defaultPestCostPerAcre: 12000,
    defaultOtherCostPerAcre: 5000,
    recommendedCounties: ['Nyandarua', 'Nakuru', 'Meru', 'Kisii', 'Nyeri', 'Uasin Gishu'],
  },
  'Bananas': {
    baseYieldPerAcre: 450,
    yieldUnit: 'bunches',
    basePriceKes: 850,
    priceVolatility: 'Low',
    favoredSoils: ['Volcanic Red Loam', 'Clay Loam', 'Loam'],
    waterSensitivity: 0.70,
    diseaseSusceptibility: 'Medium',
    defaultSeedCostPerAcre: 20000,
    defaultFertCostPerAcre: 15000,
    defaultLabourCostPerAcre: 18000,
    defaultPestCostPerAcre: 6000,
    defaultOtherCostPerAcre: 4000,
    recommendedCounties: ['Kisii', 'Meru', 'Nyamira', 'Murang\'a', 'Kakamega'],
  },
  'Cabbages / Vegetables': {
    baseYieldPerAcre: 5500,
    yieldUnit: 'heads',
    basePriceKes: 45,
    priceVolatility: 'High',
    favoredSoils: ['Loam', 'Volcanic Red Loam', 'Clay Loam'],
    waterSensitivity: 0.75,
    diseaseSusceptibility: 'Medium',
    defaultSeedCostPerAcre: 7500,
    defaultFertCostPerAcre: 14000,
    defaultLabourCostPerAcre: 14000,
    defaultPestCostPerAcre: 8000,
    defaultOtherCostPerAcre: 3500,
    recommendedCounties: ['Nyandarua', 'Kiambu', 'Nakuru', 'Kisii', 'Meru'],
  },
  'Onions': {
    baseYieldPerAcre: 7000,
    yieldUnit: 'kg',
    basePriceKes: 80,
    priceVolatility: 'High',
    favoredSoils: ['Sandy Loam', 'Loam'],
    waterSensitivity: 0.65,
    diseaseSusceptibility: 'Medium',
    defaultSeedCostPerAcre: 16000,
    defaultFertCostPerAcre: 20000,
    defaultLabourCostPerAcre: 22000,
    defaultPestCostPerAcre: 14000,
    defaultOtherCostPerAcre: 6000,
    recommendedCounties: ['Kajiado', 'Nakuru', 'Machakos', 'Meru'],
  },
  'Watermelon': {
    baseYieldPerAcre: 8500,
    yieldUnit: 'kg',
    basePriceKes: 38,
    priceVolatility: 'Medium',
    favoredSoils: ['Sandy Loam', 'Loam'],
    waterSensitivity: 0.60,
    diseaseSusceptibility: 'Medium',
    defaultSeedCostPerAcre: 12000,
    defaultFertCostPerAcre: 18000,
    defaultLabourCostPerAcre: 16000,
    defaultPestCostPerAcre: 15000,
    defaultOtherCostPerAcre: 5000,
    recommendedCounties: ['Machakos', 'Kilifi', 'Embu', 'Kitui', 'Garissa'],
  }
};

export function calculateFarmAnalysis(input: FarmAnalysisInput, farmerId = 'demo-farmer'): FarmAnalysisResult {
  const crop = input.cropType;
  const benchmark = CROP_BENCHMARKS[crop] || CROP_BENCHMARKS['Tomatoes'];
  const acres = Math.max(0.2, input.farmSizeAcres);

  // 1. Calculate Costs
  const seedCost = input.seedCost > 0 ? input.seedCost : benchmark.defaultSeedCostPerAcre * acres;
  const fertilizerCost = input.fertilizerCost > 0 ? input.fertilizerCost : benchmark.defaultFertCostPerAcre * acres;
  const labourCost = input.labourCost > 0 ? input.labourCost : benchmark.defaultLabourCostPerAcre * acres;
  const pestCost = input.pestCost > 0 ? input.pestCost : benchmark.defaultPestCostPerAcre * acres;
  const otherCosts = input.otherCosts > 0 ? input.otherCosts : benchmark.defaultOtherCostPerAcre * acres;
  const totalCost = seedCost + fertilizerCost + labourCost + pestCost + otherCosts;

  // 2. Multipliers based on agro-ecological conditions
  const isFavoredSoil = benchmark.favoredSoils.includes(input.soilType);
  const soilMultiplier = isFavoredSoil ? 1.08 : 0.90;

  let waterMultiplier = 1.0;
  let weatherRiskScore = 30;
  let weatherRisk: 'Low' | 'Medium' | 'High' = 'Low';

  if (input.waterAvailability.includes('Drip')) {
    waterMultiplier = 1.20;
    weatherRiskScore = 15;
    weatherRisk = 'Low';
  } else if (input.waterAvailability.includes('Borehole') || input.waterAvailability.includes('River')) {
    waterMultiplier = 1.10;
    weatherRiskScore = 25;
    weatherRisk = 'Low';
  } else if (input.waterAvailability.includes('Rainfed')) {
    // Rainfed depends on county agro-ecology
    const highRainfallCounties = ['Kisii', 'Kakamega', 'Meru', 'Trans Nzoia', 'Nyeri'];
    if (highRainfallCounties.includes(input.county)) {
      waterMultiplier = 0.98;
      weatherRiskScore = 40;
      weatherRisk = 'Medium';
    } else {
      waterMultiplier = 0.82;
      weatherRiskScore = 65;
      weatherRisk = 'High';
    }
  } else {
    waterMultiplier = 0.70;
    weatherRiskScore = 80;
    weatherRisk = 'High';
  }

  // 3. Yield, Revenue, Profit Projections
  const estimatedYield = Math.round(benchmark.baseYieldPerAcre * acres * soilMultiplier * waterMultiplier);
  const estimatedSellingPrice = benchmark.basePriceKes;
  const estimatedRevenue = Math.round(estimatedYield * estimatedSellingPrice);
  const estimatedProfit = estimatedRevenue - totalCost;
  const roiPercent = totalCost > 0 ? Math.round((estimatedProfit / totalCost) * 1000) / 10 : 0;
  const breakEvenYield = estimatedSellingPrice > 0 ? Math.round((totalCost / estimatedSellingPrice) * 10) / 10 : 0;

  const financials: FarmFinancials = {
    seedCost,
    fertilizerCost,
    labourCost,
    pestCost,
    otherCosts,
    totalCost,
    estimatedYield,
    yieldUnit: benchmark.yieldUnit,
    estimatedSellingPrice,
    estimatedRevenue,
    estimatedProfit,
    roiPercent,
    breakEvenYield,
  };

  // 4. Risk Analysis
  let diseaseRiskScore = benchmark.diseaseSusceptibility === 'High' ? 60 : (benchmark.diseaseSusceptibility === 'Medium' ? 40 : 20);
  if (input.plantingSeason.includes('Long Rains') && ['Tomatoes', 'Potatoes'].includes(crop)) {
    diseaseRiskScore += 15; // Higher fungal pressure during cold wet seasons in highland zones
  }
  const diseaseRisk: 'Low' | 'Medium' | 'High' = diseaseRiskScore > 50 ? 'High' : (diseaseRiskScore > 30 ? 'Medium' : 'Low');

  const marketRiskScore = benchmark.priceVolatility === 'High' ? 60 : (benchmark.priceVolatility === 'Medium' ? 40 : 20);
  const marketRisk: 'Low' | 'Medium' | 'High' = marketRiskScore > 50 ? 'High' : (marketRiskScore > 30 ? 'Medium' : 'Low');

  const budgetRatio = input.availableBudget > 0 ? totalCost / input.availableBudget : 1.0;
  let costRiskScore = 30;
  if (budgetRatio > 1.0) costRiskScore = 75;
  else if (budgetRatio > 0.85) costRiskScore = 50;
  const costRisk: 'Low' | 'Medium' | 'High' = costRiskScore > 50 ? 'High' : (costRiskScore > 30 ? 'Medium' : 'Low');

  const overallRiskScore = Math.round((weatherRiskScore * 0.3) + (diseaseRiskScore * 0.25) + (marketRiskScore * 0.25) + (costRiskScore * 0.2));
  const overallRiskLevel: 'Low' | 'Medium' | 'High' = overallRiskScore > 55 ? 'High' : (overallRiskScore > 35 ? 'Medium' : 'Low');

  const risks: RiskBreakdown = {
    weatherRisk,
    weatherRiskScore,
    diseaseRisk,
    diseaseRiskScore,
    marketRisk,
    marketRiskScore,
    costRisk,
    costRiskScore,
    overallRiskLevel,
    overallRiskScore,
    summary: `Risk profile is ${overallRiskLevel.toLowerCase()} primarily influenced by ${benchmark.priceVolatility === 'High' ? 'market price volatility at peak harvest' : 'seasonal weather variability'}.`,
  };

  // 5. Suitability & Profit Potential Scores (0-100)
  const soilScore = isFavoredSoil ? 95 : 65;
  const waterScore = input.waterAvailability.includes('Drip') ? 95 : (input.waterAvailability.includes('River') || input.waterAvailability.includes('Borehole') ? 88 : 70);
  const countyFitScore = benchmark.recommendedCounties.includes(input.county) ? 95 : 70;
  const budgetFitScore = budgetRatio <= 0.9 ? 90 : (budgetRatio <= 1.05 ? 75 : 50);

  const cropSuitabilityScore = Math.round(
    (soilScore * 0.30) + (waterScore * 0.25) + (countyFitScore * 0.25) + (budgetFitScore * 0.20)
  );

  const profitPotentialScore = Math.min(99, Math.max(15, Math.round(40 + (roiPercent * 0.35))));

  // 6. Explainable AI Factors
  const positiveFactors: string[] = [];
  const whyRecommended: string[] = [];
  const cautionFactors: string[] = [];

  if (isFavoredSoil) {
    positiveFactors.push(`Soil match: ${input.soilType} provides optimal drainage and nutrient exchange for ${crop}.`);
    whyRecommended.push(`Optimal soil compatibility with ${input.soilType}`);
  } else {
    cautionFactors.push(`Soil notice: ${input.soilType} may require organic manure or aeration for optimal ${crop} root growth.`);
  }

  if (input.waterAvailability.includes('Drip') || input.waterAvailability.includes('River') || input.waterAvailability.includes('Borehole')) {
    positiveFactors.push(`Water security: ${input.waterAvailability} insulates the crop from drought stress.`);
    whyRecommended.push(`Protected irrigation source reduces climate vulnerability`);
  } else {
    cautionFactors.push(`Rainfed reliance: Monitor rainfall forecast closely to avert moisture stress during flowering/fruiting.`);
  }

  if (benchmark.recommendedCounties.includes(input.county)) {
    positiveFactors.push(`Agro-ecological suitability: ${input.county} County has strong historical performance for ${crop}.`);
    whyRecommended.push(`Favorable altitude and climate in ${input.county} County`);
  }

  if (benchmark.priceVolatility === 'High') {
    cautionFactors.push(`Market timing: ${crop} prices fluctuate significantly between glut and off-season windows. Target staggered planting.`);
  }

  if (budgetRatio > 1.0) {
    cautionFactors.push(`Budget constraint: Estimated input requirements (KES ${totalCost.toLocaleString()}) exceed stated budget (KES ${input.availableBudget.toLocaleString()}). Consider phase planting.`);
  }

  const explainableAi: ExplainableAiFactors = {
    whyRecommended: whyRecommended.length > 0 ? whyRecommended : [`Solid projected return of ${roiPercent}% ROI under standard management`],
    positiveFactors,
    cautionFactors,
    costBreakdownFormula: `Total Cost (KES ${totalCost.toLocaleString()}) = Seeds (${seedCost.toLocaleString()}) + Fertilizer (${fertilizerCost.toLocaleString()}) + Labour (${labourCost.toLocaleString()}) + Pest Management (${pestCost.toLocaleString()}) + Other (${otherCosts.toLocaleString()})`,
    suitabilityEquation: `Suitability (${cropSuitabilityScore}/100) = [Soil: ${soilScore} × 30%] + [Water: ${waterScore} × 25%] + [County Fit: ${countyFitScore} × 25%] + [Budget: ${budgetFitScore} × 20%]`,
  };

  return {
    id: `fa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    farmerId,
    timestamp: new Date().toISOString(),
    input,
    recommendedCrop: crop,
    cropSuitabilityScore,
    profitPotentialScore,
    riskLevel: overallRiskLevel,
    financials,
    risks,
    explainableAi,
    modelType: 'Demo Model (RandomForest/GBR Baseline)',
    isDemo: true,
    disclaimer: 'Estimates generated for decision support based on regional KALRO agricultural reference data. Actual yield and market revenue vary with field management, microclimate, and commodity market fluctuations.',
  };
}
