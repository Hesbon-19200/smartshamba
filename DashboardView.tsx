import React, { useState } from 'react';
import {
  Sprout,
  Stethoscope,
  MessageSquare,
  History,
  TrendingUp,
  CloudRain,
  Droplets,
  Wind,
  ArrowRight,
  Send,
  Sparkles,
  Check,
  MapPin,
  CheckCircle2,
  Volume2,
  VolumeX,
  Compass,
  Recycle,
  X,
} from 'lucide-react';
import {
  FarmerProfile,
  FarmAnalysisResult,
  WeatherSnapshot,
  MarketPriceItem,
  CropDiseaseResult,
} from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { AlertBanner } from './AlertBanner.tsx';
import { DetailedWeatherView } from './DetailedWeatherView.tsx';
import { OrganicSolutionsView } from './OrganicSolutionsView.tsx';

interface DashboardViewProps {
  farmer: FarmerProfile;
  recentAnalysis: FarmAnalysisResult | null;
  recentDisease: CropDiseaseResult | null;
  weather: WeatherSnapshot | null;
  marketPrices: MarketPriceItem[];
  onNavigate: (tab: string) => void;
  onLoadScenario: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farmer,
  recentAnalysis,
  recentDisease,
  weather,
  marketPrices,
  onNavigate,
  onLoadScenario,
}) => {
  const { t, language } = useApp();
  const { isSpeaking, speakText, stopSpeaking } = useAccessibility();

  const [showDetailedWeather, setShowDetailedWeather] = useState(false);
  const [showOrganicModal, setShowOrganicModal] = useState(false);

  const [selectedCropPreview, setSelectedCropPreview] = useState<string>(
    recentAnalysis?.recommendedCrop || 'Tomatoes'
  );

  const handleSpeakPrediction = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const text =
        language === 'sw'
          ? `Utabiri wa Mazao: Kulingana na shamba lako la ekari ${farmer.farmSizeAcres} katika Kaunti ya ${farmer.county}, zao la ${selectedCropPreview} linatoa faida nzuri msimu huu kulingana na mahitaji ya soko la jumla na utabiri wa mvua.`
          : `Crop Prediction: Based on your ${farmer.farmSizeAcres}-acre plot in ${farmer.county}, ${selectedCropPreview.toLowerCase()} offer favorable return on investment this season due to current wholesale market demand and rainfall forecast.`;
      speakText(text, language);
    }
  };

  const [chatInput, setChatInput] = useState('');
  const [quickMessages, setQuickMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text:
        language === 'sw'
          ? `Habari ${farmer.name.split(' ')[0]}! Nimeona unyevu wa udongo wako Kaunti ya ${farmer.county} uko vizuri leo. Je, ungependa mwongozo maalum wa kilimo cha ${farmer.currentCrop}?`
          : `Hello ${farmer.name.split(' ')[0]}! I noticed your soil moisture in ${farmer.county} is optimal today. Would you like a refined planting guide for your ${farmer.currentCrop}?`,
    },
    {
      sender: 'user',
      text:
        language === 'sw'
          ? `Ndiyo tafadhali. Pia, nifanye nini kuhusu madoa ya majani niliyoyaona leo?`
          : `Yes, please. Also, what can I do about the leaf spots I found today?`,
    },
    {
      sender: 'ai',
      text:
        language === 'sw'
          ? `Kulingana na kipimo chako cha karibuni:\n1. Kata majani ya chini yaliyoathirika.\n2. Boresha mzunguko wa hewa.\n3. Wasiliana na afisa ugani kama maambukizi yanaendelea.`
          : `Based on your recent scan:\n1. Prune affected bottom leaves.\n2. Improve air circulation.\n3. Consult your extension officer if lesions spread.`,
    },
  ]);

  const handleSendQuickChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatInput('');
    setQuickMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'ai',
        text:
          language === 'sw'
            ? `Inakagua kanuni za kilimo za Kaunti ya ${farmer.county}... Kwa ushauri wa kina wa udongo na tiba ya magonjwa, hebu tuendelee kwenye kichupo cha Mtaalamu wa AI.`
            : `Consulting ${farmer.county} agronomic baseline... For in-depth soil and disease recommendations, let's continue in the AI Agronomist tab.`,
      },
    ]);
  };

  const crops = [
    {
      name: 'Tomatoes',
      displayName: language === 'sw' ? 'Nyanya' : 'Tomatoes',
      emoji: '🍅',
      suitability: '94%',
      note: language === 'sw' ? 'Soko Kubwa' : 'High Demand',
    },
    {
      name: 'Maize',
      displayName: language === 'sw' ? 'Mahindi' : 'Maize',
      emoji: '🌽',
      suitability: '68%',
      note: language === 'sw' ? 'Chakula Kikuu' : 'Staple',
    },
    {
      name: 'Potatoes',
      displayName: language === 'sw' ? 'Viazi Mviringo' : 'Potatoes',
      emoji: '🥔',
      suitability: '82%',
      note: language === 'sw' ? 'Bei Imara' : 'Stable Price',
    },
    {
      name: 'Kales (Sukuma)',
      displayName: language === 'sw' ? 'Sukuma Wiki' : 'Kales (Sukuma)',
      emoji: '🥬',
      suitability: '85%',
      note: language === 'sw' ? 'Uvunaji wa Haraka' : 'Quick Cycle',
    },
  ];

  const getRiskLabel = (level?: string) => {
    if (level === 'Low') return t('riskLow');
    if (level === 'High') return t('riskHigh');
    return t('riskMedium');
  };

  return (
    <div className="w-full space-y-6 pb-6">
      {/* Critical Weather Alert Banner */}
      <AlertBanner weather={weather} onNavigate={onNavigate} />

      {/* 1. TOP 3 GEOMETRIC METRIC BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1: Potential Profit */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 relative overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('metricProfit')}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-emerald-600">
              KSh {((recentAnalysis?.financials.estimatedProfit || 450000) / 1000).toFixed(0)}k
            </span>
            <span className="text-[10px] font-medium text-emerald-500">
              +{recentAnalysis?.financials.roiPercent || 118}% {t('metricProfitRoi')}
            </span>
          </div>
        </div>

        {/* Metric 2: Farm Health Index */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('metricHealth')}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-blue-600">
              {recentAnalysis?.cropSuitabilityScore || 88}%
            </span>
            <span className="text-[10px] font-medium text-blue-500">
              {t('metricHealthDesc')}
            </span>
          </div>
        </div>

        {/* Metric 3: Risk Level */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('metricRisk')}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-xl sm:text-2xl font-bold ${
                recentAnalysis?.riskLevel === 'Low'
                  ? 'text-emerald-600'
                  : recentAnalysis?.riskLevel === 'High'
                  ? 'text-rose-600'
                  : 'text-amber-500'
              }`}
            >
              {getRiskLabel(recentAnalysis?.riskLevel)}
            </span>
            <span className="text-[10px] font-medium text-amber-600">
              {t('metricRiskDesc')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN 12-COLUMN GEOMETRIC BALANCE GRID */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        {/* Left 8 Columns */}
        <div className="col-span-12 lg:col-span-8 space-y-5 sm:space-y-6">
          {/* Crop Analysis Wizard Preview Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                {t('dashCropWizardTitle')}
              </h2>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {t('step')} 3 {t('of')} 5
              </span>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {crops.map((c) => {
                const isSelected = selectedCropPreview === c.name;
                return (
                  <div
                    key={c.name}
                    onClick={() => setSelectedCropPreview(c.name)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'group relative rounded-xl border-2 border-emerald-500 bg-emerald-50 p-3.5 sm:p-4'
                        : 'rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 p-3.5 sm:p-4 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-2 top-2 rounded-full bg-emerald-500 p-1 text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="text-2xl">{c.emoji}</div>
                    <div
                      className={`mt-2 font-bold text-xs sm:text-sm ${
                        isSelected ? 'text-emerald-900' : 'text-slate-600'
                      }`}
                    >
                      {c.displayName}
                    </div>
                    <div
                      className={`text-[10px] ${
                        isSelected ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {c.suitability} • {c.note}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Prediction Insight Box */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl bg-slate-900 p-4 text-white">
              <div className="flex-1">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  {t('dashAiPredictionTitle')}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'sw'
                    ? `Kulingana na shamba lako la ekari ${farmer.farmSizeAcres} katika Kaunti ya ${farmer.county}, zao la ${selectedCropPreview} linatoa faida nzuri (ROI) msimu huu kulingana na mahitaji ya soko la jumla na utabiri wa mvua.`
                    : `Based on your ${farmer.farmSizeAcres}-acre plot in ${farmer.county}, ${selectedCropPreview.toLowerCase()} offer favorable ROI this season due to current wholesale market demand and rainfall forecast.`}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSpeakPrediction}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-all cursor-pointer min-h-[40px] flex items-center gap-1.5 border ${
                    isSpeaking
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700'
                  }`}
                  aria-label="Speak prediction insight aloud"
                  title={isSpeaking ? 'Stop speaking' : 'Read prediction aloud'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? (language === 'sw' ? 'Simamisha' : 'Stop') : (language === 'sw' ? 'Sikiliza' : 'Listen')}</span>
                </button>
                <button
                  onClick={() => onNavigate('farm-analysis')}
                  className="rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer shrink-0 min-h-[40px] flex items-center justify-center shadow-xs"
                >
                  {t('dashConfigureInputs')}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Crop Doctor Scan Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  {t('dashRecentScanTitle')}
                </h2>
              </div>
              <button
                onClick={() => onNavigate('crop-doctor')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer py-1"
              >
                {t('dashOpenScanner')}
              </button>
            </div>

            {recentDisease ? (
              <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Visual Leaf Pathology Preview */}
                <div className="h-36 sm:h-32 w-full sm:w-48 rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden shrink-0 flex items-center justify-center">
                  {recentDisease.imageUrl ? (
                    <img
                      src={recentDisease.imageUrl}
                      alt="Diagnosed Leaf"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      <Stethoscope className="w-8 h-8 text-emerald-600 mb-1" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {recentDisease.cropType} Leaf
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-slate-900/90 text-[8px] text-white px-2 py-0.5 font-bold rounded-md">
                    {recentDisease.severity.toUpperCase()}
                  </div>
                </div>

                {/* Scan Diagnosis Details */}
                <div className="flex flex-1 flex-col justify-center">
                  <div className="text-sm sm:text-base font-bold text-slate-900">
                    {recentDisease.possibleCondition}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                    <span>{t('doctorConfidence')}: {recentDisease.confidencePercent.toFixed(0)}%</span>
                    <span>•</span>
                    <span>{language === 'sw' ? 'Ilikaguliwa Leo' : 'Live Today'}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 border border-red-100">
                      {t('actionRequired')}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {recentDisease.severity === 'Severe'
                        ? t('severitySevere')
                        : recentDisease.severity === 'Low'
                        ? t('severityLow')
                        : t('severityModerate')}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                      {language === 'sw' ? 'Mwongozo Upo Tayari' : 'Sanitation Advice Ready'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 sm:p-5 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {language === 'sw' ? 'Hakuna Uchunguzi wa Leo Bado' : 'No Crop Scan Run Today'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'sw'
                        ? 'Tumia kamera au pakia picha ya jani kupata uchunguzi wa magonjwa papo hapo.'
                        : 'Snap a smartphone photo or upload a leaf to get instant multimodal pathology diagnostics.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('crop-doctor')}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap min-h-[40px] flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'sw' ? 'Pima Jani Leo' : 'Scan Leaf Today'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Dual Weather and Market Prices Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Weather Intelligence Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm">{t('dashWeatherTitle')}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {farmer.county} • {weather?.condition || 'Mawingu kiasi'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">
                    {weather?.temperatureC || 24}°C
                  </span>
                  {weather?.rainfallTodayMm !== undefined && (
                    <span className="text-[10px] text-blue-600 block font-bold">
                      {weather.rainfallTodayMm} mm rain
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {t('dashRainProb')}
                  </span>
                  <p className="font-bold text-blue-700 mt-0.5">
                    {weather?.rainProbabilityPercent || 60}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {t('dashHumidity')}
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {weather?.humidityPercent || 68}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {t('dashWind')}
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {weather?.windSpeedKmh || 12} km/h
                  </p>
                </div>
              </div>

              {/* Today's Farm Action Preview Badges */}
              {weather?.dailyForecasts?.[0] && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">
                      {language === 'sw' ? 'Kazi ya Leo:' : "Today's Task:"}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold">
                      {weather.dailyForecasts[0].actionPlan.canSpray
                        ? language === 'sw' ? '🟢 Ruhusa ya Dawa' : '🟢 Safe to Spray'
                        : language === 'sw' ? '🔴 Usinyunyizie Dawa' : '🔴 Do Not Spray'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {language === 'sw'
                      ? weather.dailyForecasts[0].actionPlan.priorityTaskSw
                      : weather.dailyForecasts[0].actionPlan.priorityTaskEn}
                  </p>
                </div>
              )}

              {/* View 7-Day Precision Forecast CTA Button */}
              <button
                type="button"
                onClick={() => setShowDetailedWeather(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0288D1] hover:text-[#01579B] text-xs font-black flex items-center justify-center gap-1.5 transition-all border border-sky-200 cursor-pointer active:scale-95 shadow-xs"
              >
                <Compass className="w-3.5 h-3.5 text-[#0288D1]" />
                <span>
                  {language === 'sw'
                    ? 'Utabiri wa Siku 7 & Mwongozo wa Kazi za Kila Siku'
                    : '7-Day Forecast & Daily Farm Action Plan'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Market Prices Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{t('dashMarketTitle')}</h3>
                  <p className="text-[11px] text-slate-400">{t('dashMarketSubtitle')}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {t('dashPerUnit')}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {marketPrices.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0"
                  >
                    <span className="font-medium text-slate-700">{m.crop}</span>
                    <span className="font-bold text-slate-900">
                      KES {m.pricePerUnitKes.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('marketplace')}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{language === 'sw' ? '🛒 Fungua Soko & Wanunuzi' : '🛒 View Marketplace & Buyers'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Geometric AI Agronomist Chat Widget & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-5 sm:space-y-6">
          {/* AI Agronomist Chat Card */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white h-[420px] sm:h-[530px] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  {t('dashAgronomistCardTitle')}
                </h2>
              </div>
              <button
                onClick={() => onNavigate('agronomist')}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                {t('dashExpand')}
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {quickMessages.map((msg, idx) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div key={idx} className={`flex gap-2 ${isAi ? '' : 'justify-end'}`}>
                    {isAi && (
                      <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                        AI
                      </div>
                    )}
                    <div
                      className={`p-3 text-xs leading-relaxed ${
                        isAi
                          ? 'rounded-lg bg-slate-100 text-slate-700 font-medium whitespace-pre-line'
                          : 'rounded-lg bg-emerald-600 text-white max-w-[80%]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <div className="border-t border-slate-100 p-3 sm:p-4 shrink-0">
              <form
                onSubmit={handleSendQuickChat}
                className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t('dashAskPlaceholder')}
                  className="flex-1 bg-transparent px-2 text-base sm:text-xs outline-none text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('dashQuickShortcuts')}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('farm-analysis')}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-colors cursor-pointer min-h-[64px]"
              >
                <Sprout className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-bold text-slate-900 block">{t('navFarmAnalysis')}</span>
                <span className="text-[10px] text-slate-400">{t('dashShortcutsAnalysis')}</span>
              </button>
              <button
                onClick={() => onNavigate('crop-doctor')}
                className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 text-left transition-colors cursor-pointer min-h-[64px]"
              >
                <Stethoscope className="w-4 h-4 text-sky-600 mb-1" />
                <span className="font-bold text-slate-900 block">{t('navCropDoctor')}</span>
                <span className="text-[10px] text-slate-400">{t('dashShortcutsDoctor')}</span>
              </button>
              <button
                onClick={() => onNavigate('history')}
                className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-colors cursor-pointer min-h-[64px]"
              >
                <History className="w-4 h-4 text-purple-600 mb-1" />
                <span className="font-bold text-slate-900 block">{t('navHistory')}</span>
                <span className="text-[10px] text-slate-400">{t('dashShortcutsHistory')}</span>
              </button>
              <button
                onClick={onLoadScenario}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-left transition-colors cursor-pointer min-h-[64px]"
              >
                <Sparkles className="w-4 h-4 text-amber-600 mb-1" />
                <span className="font-bold text-amber-950 block">{t('demoMode')}</span>
                <span className="text-[10px] text-amber-700">{t('dashShortcutsDemo')}</span>
              </button>

              {/* Organic Waste to Fertilizer Hub Shortcut */}
              <button
                type="button"
                onClick={() => setShowOrganicModal(true)}
                className="col-span-2 p-3 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100/80 text-left transition-all cursor-pointer flex items-center justify-between min-h-[54px] shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#15532E] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-950 block text-xs">
                      {language === 'sw' ? 'Mbolea Asilia & Usafishaji wa Taka' : 'Farm Waste to Organic Fertilizer'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      {language === 'sw' ? 'Compost, Mbolea ya Maji, Biochar & Okoa Pesa' : 'Compost, Liquid Foliar Teas & Save Money'}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7-DAY DETAILED AGRO-WEATHER FORECAST MODAL */}
      {showDetailedWeather && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-100 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-3 sm:p-6 shadow-2xl relative">
            <DetailedWeatherView
              weather={weather}
              onClose={() => setShowDetailedWeather(false)}
            />
          </div>
        </div>
      )}

      {/* ORGANIC FERTILIZER & WASTE RECYCLING MODAL */}
      {showOrganicModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-100 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-3 sm:p-6 shadow-2xl relative">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowOrganicModal(false)}
                className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <OrganicSolutionsView />
          </div>
        </div>
      )}
    </div>
  );
};
