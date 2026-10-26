/**
 * Unit tests for MkulimaAI Decision Engine and Profit Projections
 */
import { calculateFarmAnalysis, CROP_BENCHMARKS } from '../src/services/decisionEngine.ts';
import { FarmAnalysisInput } from '../src/types/index.ts';

export function runTests(): boolean {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      passed++;
      console.log(`✓ PASS: ${msg}`);
    } else {
      failed++;
      console.error(`✗ FAIL: ${msg}`);
    }
  }

  console.log('Running MkulimaAI Decision Engine Tests...');

  // Test 1: Kisii Tomato 2-Acre Baseline
  const testInput: FarmAnalysisInput = {
    county: 'Kisii',
    subCounty: 'Kitutu Chache South',
    town: 'Bogusero',
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
  };

  const result = calculateFarmAnalysis(testInput);

  assert(result.cropSuitabilityScore >= 80, 'Suitability score is favorable (>80) for volcanic loam & gravity irrigation');
  assert(result.financials.totalCost === 166000, `Total cost correctly calculated (Got ${result.financials.totalCost})`);
  assert(result.financials.estimatedRevenue > result.financials.totalCost, 'Tomato crop generates positive net margin');
  assert(result.financials.roiPercent > 50, `Projected ROI is significant for tomatoes (${result.financials.roiPercent}%)`);
  assert(result.explainableAi.positiveFactors.length >= 2, 'Explainable AI generates multiple positive factors');
  assert(Boolean(result.disclaimer), 'Mandatory safety disclaimer is present');

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  return failed === 0;
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('decisionEngine.test')) {
  const ok = runTests();
  process.exit(ok ? 0 : 1);
}
