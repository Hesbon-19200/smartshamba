import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Sprout,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  RotateCcw,
  Printer,
  Info,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  County,
  SoilType,
  WaterAvailability,
  FarmingExperience,
  CropType,
  FarmAnalysisInput,
  FarmAnalysisResult,
  FarmerProfile,
} from '../types/index.ts';
import { CROP_BENCHMARKS, calculateFarmAnalysis } from '../services/decisionEngine.ts';
import { useApp } from '../context/AppContext.tsx';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { offlineStorageService } from '../services/offlineStorageService.ts';

interface FarmAnalysisWizardProps {
  farmer: FarmerProfile;
  onAnalysisComplete: (result: FarmAnalysisResult) => void;
  initialData?: FarmAnalysisResult | null;
}

const COUNTIES: County[] = [
  'Kisii',
  'Nakuru',
  'Uasin Gishu',
  'Kiambu',
  'Machakos',
  'Meru',
  'Trans Nzoia',
  'Nyeri',
  'Kilifi',
  'Kakamega',
  'Bungoma',
  'Migori',
];

const SOIL_TYPES: SoilType[] = [
  'Volcanic Red Loam',
  'Loam',
  'Clay Loam',
  'Sandy Loam',
  'Black Cotton Soil',
];

const WATER_SOURCES: WaterAvailability[] = [
  'Rainfed (Seasonal)',
  'Borehole / Well',
  'River / Stream Gravity',
  'Drip Irrigation Installed',
  'Limited / Erratic',
];

const EXPERIENCES: FarmingExperience[] = [
  'Beginner (< 2 years)',
  'Intermediate (2 - 5 years)',
  'Experienced (> 5 years)',
];

const CROPS: CropType[] = [
  'Tomatoes',
  'Maize',
  'Beans',
  'Potatoes',
  'Bananas',
  'Cabbages / Vegetables',
  'Onions',
  'Watermelon',
];

export const FarmAnalysisWizard: React.FC<FarmAnalysisWizardProps> = ({
  farmer,
  onAnalysisComplete,
  initialData,
}) => {
  const { t, language } = useApp();
  const { isSpeaking, speakText, stopSpeaking } = useAccessibility();

  const handleSpeakFinancials = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (result) {
      const fin = result.financials;
      const text =
        language === 'sw'
          ? `Ripoti ya Fedha za Shamba: Zao lililopendekezwa ni ${result.recommendedCrop} kwa ekari ${result.input.farmSizeAcres}. Makadirio ya mavuno ni ${fin.estimatedYield} ${fin.yieldUnit}. Mapato yanayotarajiwa ni shilingi ${fin.estimatedRevenue.toLocaleString()}. Gharama yote ni shilingi ${fin.totalCost.toLocaleString()}. Faida halisi inayokadiriwa ni shilingi ${fin.estimatedProfit.toLocaleString()}, na faida ya uwekezaji ni asilimia ${fin.roiPercent}%.`
          : `Farm Financial Report: Recommended crop is ${result.recommendedCrop} on ${result.input.farmSizeAcres} acres. Estimated yield is ${fin.estimatedYield} ${fin.yieldUnit}. Projected revenue is ${fin.estimatedRevenue.toLocaleString()} Kenyan Shillings. Total cost is ${fin.totalCost.toLocaleString()} shillings. Estimated net profit is ${fin.estimatedProfit.toLocaleString()} shillings with an ROI of ${fin.roiPercent} percent.`;
      speakText(text, language);
    }
  };

  const [step, setStep] = useState<number>(() => (initialData ? 5 : 1));
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FarmAnalysisResult | null>(() => {
    return initialData || null;
  });

  // Form State
  const [county, setCounty] = useState<County>(farmer.county || 'Kisii');
  const [subCounty, setSubCounty] = useState<string>(farmer.subCounty || 'Kitutu Chache South');
  const [town, setTown] = useState<string>(farmer.town || 'Bogusero Ward');
  const [gpsEnabled, setGpsEnabled] = useState<boolean>(false);

  const [farmSizeAcres, setFarmSizeAcres] = useState<number>(farmer.farmSizeAcres || 2.0);
  const [soilType, setSoilType] = useState<SoilType>('Volcanic Red Loam');
  const [waterAvailability, setWaterAvailability] = useState<WaterAvailability>('River / Stream Gravity');
  const [experience, setExperience] = useState<FarmingExperience>(farmer.experience || 'Intermediate (2 - 5 years)');
  const [availableBudget, setAvailableBudget] = useState<number>(150000);

  const [cropType, setCropType] = useState<CropType>('Tomatoes');
  const [plantingSeason, setPlantingSeason] = useState<'Long Rains (Mar-Jun)' | 'Short Rains (Oct-Dec)' | 'Irrigated Year-round'>('Short Rains (Oct-Dec)');

  // Production Inputs (KES)
  const [seedCost, setSeedCost] = useState<number>(28000);
  const [fertilizerCost, setFertilizerCost] = useState<number>(44000);
  const [labourCost, setLabourCost] = useState<number>(48000);
  const [pestCost, setPestCost] = useState<number>(34000);
  const [otherCosts, setOtherCosts] = useState<number>(12000);

  // Apply benchmarks automatically
  const applyBenchmarks = (targetCrop: CropType, targetAcres: number) => {
    const b = CROP_BENCHMARKS[targetCrop] || CROP_BENCHMARKS['Tomatoes'];
    setSeedCost(Math.round(b.defaultSeedCostPerAcre * targetAcres));
    setFertilizerCost(Math.round(b.defaultFertCostPerAcre * targetAcres));
    setLabourCost(Math.round(b.defaultLabourCostPerAcre * targetAcres));
    setPestCost(Math.round(b.defaultPestCostPerAcre * targetAcres));
    setOtherCosts(Math.round(b.defaultOtherCostPerAcre * targetAcres));
  };

  useEffect(() => {
    if (initialData) {
      setResult(initialData);
      setStep(5);
    }
  }, [initialData]);

  const handleCropChange = (c: CropType) => {
    setCropType(c);
    applyBenchmarks(c, farmSizeAcres);
  };

  const handleAcresChange = (val: number) => {
    const acres = Math.max(0.2, val);
    setFarmSizeAcres(acres);
    applyBenchmarks(cropType, acres);
  };

  const handleSubmitAnalysis = async () => {
    setIsLoading(true);
    const payload: FarmAnalysisInput = {
      county,
      subCounty,
      town,
      latitude: gpsEnabled ? -0.6817 : undefined,
      longitude: gpsEnabled ? 34.7667 : undefined,
      farmSizeAcres,
      soilType,
      waterAvailability,
      experience,
      availableBudget,
      cropType,
      seedCost,
      fertilizerCost,
      labourCost,
      pestCost,
      otherCosts,
      plantingSeason,
    };

    try {
      const res = await fetch('/api/farm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        offlineStorageService.saveFarmAnalysis(data.data);
        onAnalysisComplete(data.data);
        setStep(5);
      } else {
        // Fallback to client calculation
        const localResult = calculateFarmAnalysis(payload, farmer.id);
        setResult(localResult);
        offlineStorageService.saveFarmAnalysis(localResult);
        onAnalysisComplete(localResult);
        setStep(5);
      }
    } catch (err) {
      // Offline fallback
      const localResult = calculateFarmAnalysis(payload, farmer.id);
      setResult(localResult);
      offlineStorageService.saveFarmAnalysis(localResult);
      onAnalysisComplete(localResult);
      setStep(5);
    } finally {
      setIsLoading(false);
    }
  };

  const totalInputCost = seedCost + fertilizerCost + labourCost + pestCost + otherCosts;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                {t('brandTitle')} • {t('wizardTitle')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{t('wizardTitle')}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{t('wizardSubtitle')}</p>
          </div>

          {step < 5 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span>
                {t('step')} {step} {t('of')} 4
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`w-5 h-1.5 rounded-full transition-colors ${
                      s === step ? 'bg-emerald-600' : s < step ? 'bg-emerald-300' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <button
              onClick={() => {
                setResult(null);
                setStep(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t('btnNewAnalysis')}
            </button>
          )}
        </div>
      </div>

      {/* STEP 1: LOCATION */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('stepLocation')}</h2>
              <p className="text-xs text-slate-500">
                {language === 'sw'
                  ? 'Chagua kaunti na eneo ambalo shamba lako lipo'
                  : 'Select the region where your shamba is situated'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('selectCounty')}</label>
              <select
                id="select-county"
                value={county}
                onChange={(e) => setCounty(e.target.value as County)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c} {language === 'sw' ? 'Kaunti' : 'County'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('subCounty')}</label>
              <input
                id="input-subcounty"
                type="text"
                value={subCounty}
                onChange={(e) => setSubCounty(e.target.value)}
                placeholder="e.g. Kitutu Chache South, Naivasha, Moiben"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('wardOrTown')}</label>
              <input
                id="input-town"
                type="text"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="e.g. Bogusero Ward, Marigat, Njoro"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800">{t('useGps')}</span>
                  <p className="text-[11px] text-slate-500">
                    {language === 'sw' ? 'Hurekebisha kwa kituo cha hali ya hewa' : 'Pins local microclimate station'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={gpsEnabled}
                  onChange={(e) => setGpsEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              id="btn-step1-next"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {t('next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: FARM INFORMATION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('stepSoilAndSize')}</h2>
              <p className="text-xs text-slate-500">
                {language === 'sw'
                  ? 'Toa maelezo kuhusu ukubwa wa shamba, aina ya udongo na vyanzo vya maji'
                  : 'Provide details about your soil, water source, and budget'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">{t('farmSizeAcres')}</label>
                <span className="text-xs font-extrabold text-emerald-700">
                  {farmSizeAcres} {language === 'sw' ? 'Ekari' : 'Acres'}
                </span>
              </div>
              <input
                id="input-farm-size"
                type="number"
                step="0.5"
                min="0.2"
                max="50"
                value={farmSizeAcres}
                onChange={(e) => handleAcresChange(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('soilType')}</label>
              <select
                id="select-soil"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {SOIL_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('waterSource')}</label>
              <select
                id="select-water"
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value as WaterAvailability)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {WATER_SOURCES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('experienceLevel')}</label>
              <select
                id="select-experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value as FarmingExperience)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {EXPERIENCES.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">{t('availableBudget')}</label>
              <input
                id="input-budget"
                type="number"
                step="5000"
                value={availableBudget}
                onChange={(e) => setAvailableBudget(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {t('back')}
            </button>
            <button
              id="btn-step2-next"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {t('next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CROP SELECTION */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('selectCropToAnalyze')}</h2>
              <p className="text-xs text-slate-500">
                {language === 'sw'
                  ? 'Chagua zao na msimu wa kilimo kupata gharama za KALRO kiotomatiki'
                  : 'Select your crop and planting season to automatically apply KALRO cost baselines'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('selectCropToAnalyze')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CROPS.map((c) => {
                  const isCur = cropType === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleCropChange(c)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isCur
                          ? 'border-2 border-emerald-600 bg-emerald-50 font-bold text-emerald-950'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-sm font-semibold">{c}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {CROP_BENCHMARKS[c]?.yieldUnit || 'crates'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700">{t('plantingSeason')}</label>
              <select
                id="select-season"
                value={plantingSeason}
                onChange={(e) => setPlantingSeason(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Long Rains (Mar-Jun)">
                  {language === 'sw' ? 'Mvua Ndefu (Machi - Juni)' : 'Long Rains (Mar-Jun)'}
                </option>
                <option value="Short Rains (Oct-Dec)">
                  {language === 'sw' ? 'Mvua Fupi (Oktoba - Desemba)' : 'Short Rains (Oct-Dec)'}
                </option>
                <option value="Irrigated Year-round">
                  {language === 'sw' ? 'Umwagiliaji Mwaka Mzima' : 'Irrigated Year-round'}
                </option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {t('back')}
            </button>
            <button
              id="btn-step3-next"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {t('next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: BUDGET & COST BREAKDOWN */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('stepCosts')}</h2>
              <p className="text-xs text-slate-500">
                {language === 'sw'
                  ? 'Gharama za KALRO zimewekwa kiotomatiki kwa ekari zako lakini unaweza kuzirekebisha'
                  : 'Calibrated from KALRO production cost research. You can adjust each field'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('seedsCost')}</label>
              <input
                type="number"
                value={seedCost}
                onChange={(e) => setSeedCost(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('fertilizerCost')}</label>
              <input
                type="number"
                value={fertilizerCost}
                onChange={(e) => setFertilizerCost(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('labourCost')}</label>
              <input
                type="number"
                value={labourCost}
                onChange={(e) => setLabourCost(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('pestProtectionCost')}</label>
              <input
                type="number"
                value={pestCost}
                onChange={(e) => setPestCost(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">{t('otherExpenses')}</label>
              <input
                type="number"
                value={otherCosts}
                onChange={(e) => setOtherCosts(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">{t('totalCost')}:</span>
            <span className="text-base font-extrabold text-slate-900">
              KES {totalInputCost.toLocaleString()}
            </span>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {t('back')}
            </button>
            <button
              id="btn-submit-farm-analysis"
              onClick={handleSubmitAnalysis}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isLoading ? t('calculatingAnalysis') : t('btnRunAnalysis')}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: RESULTS & ECONOMIC EXPLAINABILITY */}
      {step === 5 && result && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t('analysisResultsTitle')}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {result.modelType}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {result.recommendedCrop} on {result.input.farmSizeAcres} {language === 'sw' ? 'Ekari' : 'Acres'}
                </h2>
                <p className="text-xs text-slate-500">
                  {result.input.county} County • {result.input.soilType} • {result.input.plantingSeason}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakFinancials}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isSpeaking
                      ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                      : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                  }`}
                  aria-label="Read financial report aloud"
                  title={isSpeaking ? 'Stop speaking' : 'Read financial report aloud'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-700" />}
                  <span>{isSpeaking ? (language === 'sw' ? 'Simamisha' : 'Stop') : (language === 'sw' ? 'Sikiliza Ripoti' : 'Listen')}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" /> {t('btnPrintReport')}
                </button>
              </div>
            </div>

            {/* Core Financial Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  {t('netProfit')}
                </span>
                <p className="text-xl font-extrabold text-emerald-900 mt-1">
                  KES {result.financials.estimatedProfit.toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold">
                  +{result.financials.roiPercent}% ROI
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t('projectedRevenue')}
                </span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  KES {result.financials.estimatedRevenue.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-500">
                  @ KES {result.financials.estimatedSellingPrice}/{result.financials.yieldUnit.split(' ')[0]}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t('totalCost')}
                </span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  KES {result.financials.totalCost.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-500">Production budget</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t('breakEvenYield')}
                </span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {result.financials.breakEvenYield}
                </p>
                <span className="text-[10px] text-slate-500">{result.financials.yieldUnit}</span>
              </div>
            </div>

            {/* Suitability & Risk Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t('metricHealth')}</span>
                  <span className="text-emerald-700">{result.cropSuitabilityScore}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${result.cropSuitabilityScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t('metricRisk')}</span>
                  <span
                    className={
                      result.riskLevel === 'Low'
                        ? 'text-emerald-700'
                        : result.riskLevel === 'High'
                        ? 'text-rose-600'
                        : 'text-amber-600'
                    }
                  >
                    {result.riskLevel} ({result.risks.overallRiskScore}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      result.riskLevel === 'Low'
                        ? 'bg-emerald-600'
                        : result.riskLevel === 'High'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${result.risks.overallRiskScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* EXPLAINABLE AI FACTORS */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  {t('whyRecommended')}
                </h3>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">{t('favorableFactors')}:</p>
                <div className="space-y-1.5">
                  {result.explainableAi.positiveFactors.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.explainableAi.cautionFactors.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-700">{t('cautionRisks')}:</p>
                  <div className="space-y-1.5">
                    {result.explainableAi.cautionFactors.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1 font-mono">
                <p>
                  <span className="font-bold">Formula:</span> {result.explainableAi.costBreakdownFormula}
                </p>
                <p>
                  <span className="font-bold">Equation:</span> {result.explainableAi.suitabilityEquation}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold">Important Notice:</span> {result.disclaimer} Always
                cross-reference with local agricultural extension officers (Bwana Shamba).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
