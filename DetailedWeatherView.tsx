import React, { useState } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Compass,
  FileText,
  X,
} from 'lucide-react';
import { WeatherSnapshot, DailyAgroForecast, County } from '../types/index.ts';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { useApp } from '../context/AppContext.tsx';

interface DetailedWeatherViewProps {
  weather: WeatherSnapshot | null;
  onClose?: () => void;
  onCountyChange?: (county: County) => void;
}

export const DetailedWeatherView: React.FC<DetailedWeatherViewProps> = ({
  weather,
  onClose,
  onCountyChange,
}) => {
  const { language } = useApp();
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  // Selected Day Index (0 = Today, 1 = Tomorrow, ..., 6 = Day 7)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const dailyForecasts = weather?.dailyForecasts || [];
  const selectedForecast: DailyAgroForecast | undefined = dailyForecasts[selectedDayIndex] || dailyForecasts[0];
  const weeklyOutlook = weather?.weeklyOutlook;

  // Speak the selected day's advisory
  const handleListenDayAdvisory = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (!selectedForecast) return;

    const dayName = selectedForecast.day;
    const happening =
      language === 'sw' ? selectedForecast.whatIsHappening.sw : selectedForecast.whatIsHappening.en;
    const spray =
      language === 'sw'
        ? selectedForecast.actionPlan.sprayAdviceSw
        : selectedForecast.actionPlan.sprayAdviceEn;
    const fertilizer =
      language === 'sw'
        ? selectedForecast.actionPlan.fertilizerAdviceSw
        : selectedForecast.actionPlan.fertilizerAdviceEn;
    const priority =
      language === 'sw'
        ? selectedForecast.actionPlan.priorityTaskSw
        : selectedForecast.actionPlan.priorityTaskEn;

    const fullSpeech =
      language === 'sw'
        ? `Mwongozo wa Hali ya Hewa na Kazi za Shambani kwa siku ya ${dayName}. Hali ya Hewa: ${happening}. Kunyunyiza Dawa: ${spray}. Mbolea: ${fertilizer}. Kazi Kuu ya Leo: ${priority}.`
        : `Weather and Field Action Plan for ${dayName}. Atmospheric conditions: ${happening}. Chemical Spraying advice: ${spray}. Fertilizer guidance: ${fertilizer}. Priority Farm Task: ${priority}.`;

    speakText(fullSpeech, language);
  };

  // Speak full weekly strategic outlook
  const handleListenWeeklyOutlook = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (!weeklyOutlook) return;

    const text =
      language === 'sw'
        ? `Mwongozo wa Mkakati wa Wiki Nzima katika Kaunti ya ${weather?.county}. ${weeklyOutlook.weeklySummarySw}. Ushauri wa msimu: ${weeklyOutlook.seasonalAdviceSw}. Siku bora za kazi za shambani ni: ${weeklyOutlook.bestFieldworkDays.join(', ')}.`
        : `Weekly Strategic Outlook for ${weather?.county} County. ${weeklyOutlook.weeklySummaryEn}. Seasonal recommendation: ${weeklyOutlook.seasonalAdviceEn}. Best fieldwork days are: ${weeklyOutlook.bestFieldworkDays.join(', ')}.`;

    speakText(text, language);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0288D1]/85 via-[#0277BD]/85 to-[#01579B]/85 backdrop-blur-xl border border-white/30 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-sky-200 text-xs font-bold border border-white/20">
              <Compass className="w-4 h-4 text-sky-300" />
              <span>{language === 'sw' ? 'Utabiri wa Kina wa Kilimo' : '7-Day Precision Agro-Meteorology'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleListenWeeklyOutlook}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                title={language === 'sw' ? 'Sikiliza utabiri wa wiki' : 'Listen to weekly forecast'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4" />}
                <span>{language === 'sw' ? 'Sikiliza Mkakati wa Wiki' : 'Listen to Week'}</span>
              </button>

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-200 text-xs sm:text-sm font-semibold">
                <MapPin className="w-4 h-4 text-sky-300" />
                <span>{weather?.county} County, Kenya</span>
                <span>•</span>
                <span>{weather?.dataSource.split('(')[0]}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
                {language === 'sw'
                  ? 'Hali ya Hewa & Mpangilio wa Kazi za Kila Siku'
                  : 'Daily Weather & Farm Action Advisory'}
              </h1>
            </div>

            {/* Quick Live Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center gap-4 shrink-0">
              <div>
                <span className="text-[10px] text-sky-200 uppercase font-bold block">
                  {language === 'sw' ? 'Joto la Sasa' : 'Current Temp'}
                </span>
                <span className="text-2xl font-black text-white">{weather?.temperatureC || 24}°C</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="text-[10px] text-sky-200 uppercase font-bold block">
                  {language === 'sw' ? 'Mvua ya Leo' : 'Rain Volume'}
                </span>
                <span className="text-2xl font-black text-yellow-300">
                  {weather?.rainfallTodayMm || 0} mm
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed font-medium">
            {language === 'sw'
              ? 'Pata maelezo kamili ya kila siku: Nini kinatokea angani na ardhini, na mpango kazi wa kilimo—kama unaweza kunyunyizia dawa, kuweka mbolea, au kuvuna bila kupata hasara.'
              : 'Actionable day-by-day agronomic decisions: Understand exactly what is happening in the soil and sky, and receive precise daily guidance on spraying, fertilizer topdressing, and harvest drying.'}
          </p>
        </div>
      </div>

      {/* 2. 7-DAY INTERACTIVE DAY SELECTOR CAROUSEL */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/50 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0288D1]" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {language === 'sw' ? 'Chagua Siku ya Kutazama (Siku 7)' : 'Select Day of the Week (7-Day Forecast)'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {language === 'sw' ? 'Bofya siku kupata mpango kazi' : 'Tap any day for daily action plan'}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5">
          {dailyForecasts.map((f, idx) => {
            const isSelected = idx === selectedDayIndex;
            const isRainy = f.rainProb >= 50;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-3 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[110px] ${
                  isSelected
                    ? 'bg-[#0288D1] text-white shadow-md ring-2 ring-sky-400/50 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-sky-50/60 text-slate-700 border border-slate-200/80'
                }`}
              >
                <div>
                  <div className={`text-xs font-black uppercase ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {idx === 0 ? (language === 'sw' ? 'Leo' : 'Today') : f.day}
                  </div>
                  <div className={`text-[10px] ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                    {f.date}
                  </div>
                </div>

                <div className="text-3xl my-1">{f.icon}</div>

                <div>
                  <div className="text-sm font-black">
                    {f.tempC}°
                    <span className={`text-[10px] font-normal ml-0.5 ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                      / {f.tempMinC || f.tempC - 5}°
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <Droplets className={`w-3 h-3 ${isSelected ? 'text-yellow-300' : isRainy ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-yellow-300' : isRainy ? 'text-blue-700' : 'text-slate-500'}`}>
                      {f.rainProb}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SELECTED DAY: IN-DEPTH BREAKDOWN & ACTION PLAN */}
      {selectedForecast && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Card A: What Is Happening on This Day */}
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/50 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedForecast.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-[10px] uppercase">
                      {selectedForecast.day} • {selectedForecast.date}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {language === 'sw' ? selectedForecast.conditionSw : selectedForecast.condition}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {language === 'sw' ? 'Nini Kinachotokea Siku Hii?' : 'Atmospheric & Soil Dynamics'}
                  </h2>
                </div>
              </div>

              {/* Read Aloud Button for Selected Day */}
              <button
                type="button"
                onClick={handleListenDayAdvisory}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#15532E] font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition-all cursor-pointer self-start sm:self-auto active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>{language === 'sw' ? 'Sikiliza Maelezo ya Siku' : 'Listen to Day Plan'}</span>
              </button>
            </div>

            {/* Explanation text */}
            <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 text-xs sm:text-sm text-sky-950 leading-relaxed font-medium">
              {language === 'sw' ? selectedForecast.whatIsHappening.sw : selectedForecast.whatIsHappening.en}
            </div>

            {/* 4 Micro-climate Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'sw' ? 'Kiwango cha Joto' : 'Temperature'}</span>
                </div>
                <div className="text-lg font-black text-slate-800">
                  {selectedForecast.tempC}°C
                  <span className="text-xs text-slate-400 font-normal ml-1">
                    (Min {selectedForecast.tempMinC || selectedForecast.tempC - 5}°)
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  <span>{language === 'sw' ? 'Kiasi cha Mvua' : 'Precipitation'}</span>
                </div>
                <div className="text-lg font-black text-blue-700">
                  {selectedForecast.rainfallMm} mm
                  <span className="text-xs text-slate-400 font-normal ml-1">
                    ({selectedForecast.rainProb}%)
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <Droplets className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{language === 'sw' ? 'Unyevu Hewani' : 'Humidity'}</span>
                </div>
                <div className="text-lg font-black text-slate-800">
                  {selectedForecast.humidityPercent}%
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <Wind className="w-3.5 h-3.5 text-teal-500" />
                  <span>{language === 'sw' ? 'Kasi ya Upepo' : 'Wind Speed'}</span>
                </div>
                <div className="text-lg font-black text-slate-800">
                  {selectedForecast.windSpeedKmh} km/h
                </div>
              </div>
            </div>
          </div>

          {/* Card B: What Should Be Done Today (Action Plan) */}
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/50 shadow-2xl space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'sw' ? 'Mwongozo wa Kazi za Shambani' : 'Daily Agronomic Action Plan'}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {language === 'sw'
                  ? `Mambo ya Kufanya Shambani Siku ya ${selectedForecast.day}:`
                  : `What Should You Do on ${selectedForecast.day}?`}
              </h3>
            </div>

            {/* Daily Priority Task Spotlight */}
            <div className="bg-gradient-to-r from-emerald-800 to-[#15532E] text-white p-4 sm:p-5 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 bg-white/20 px-2 py-0.5 rounded-full inline-block">
                {language === 'sw' ? '🎯 KAZI KUU YA SIKU HII' : '🎯 PRIORITY TASK OF THE DAY'}
              </span>
              <p className="text-sm sm:text-base font-extrabold text-white">
                {language === 'sw'
                  ? selectedForecast.actionPlan.priorityTaskSw
                  : selectedForecast.actionPlan.priorityTaskEn}
              </p>
            </div>

            {/* 4 Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Chemical Spraying Safety Window */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  selectedForecast.actionPlan.canSpray
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧴</span>
                    <h4 className="font-extrabold text-xs sm:text-sm">
                      {language === 'sw' ? 'Kunyunyizia Dawa & Virutubisho' : 'Chemical & Foliar Spraying'}
                    </h4>
                  </div>
                  {selectedForecast.actionPlan.canSpray ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{language === 'sw' ? 'Ruhusa Kunyunyiza' : 'Safe to Spray'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs">
                      <ShieldAlert className="w-3 h-3" />
                      <span>{language === 'sw' ? 'Usinyunyize Leo' : 'Do Not Spray'}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {language === 'sw'
                    ? selectedForecast.actionPlan.sprayAdviceSw
                    : selectedForecast.actionPlan.sprayAdviceEn}
                </p>
              </div>

              {/* 2. Fertilizer / Topdressing Window */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  selectedForecast.actionPlan.canFertilize
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <h4 className="font-extrabold text-xs sm:text-sm">
                      {language === 'sw' ? 'Mbolea ya Kukuzia (CAN / Urea)' : 'Fertilizer & Topdressing'}
                    </h4>
                  </div>
                  {selectedForecast.actionPlan.canFertilize ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'sw' ? 'Siku Nzuri ya Mbolea' : 'Ideal Timing'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold shadow-xs">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{language === 'sw' ? 'Subiri Mvua' : 'Hold Off'}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {language === 'sw'
                    ? selectedForecast.actionPlan.fertilizerAdviceSw
                    : selectedForecast.actionPlan.fertilizerAdviceEn}
                </p>
              </div>

              {/* 3. Harvesting & Sun Drying */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  selectedForecast.actionPlan.canHarvestDry
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌾</span>
                    <h4 className="font-extrabold text-xs sm:text-sm">
                      {language === 'sw' ? 'Uvunaji & Kuanika Nafaka Juani' : 'Harvesting & Sun Drying'}
                    </h4>
                  </div>
                  {selectedForecast.actionPlan.canHarvestDry ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                      <Sun className="w-3 h-3" />
                      <span>{language === 'sw' ? 'Kavu kwa Kuanika' : 'Ideal Drying Sun'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold shadow-xs">
                      <span>{language === 'sw' ? 'Funika Mazao' : 'Keep Covered'}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {language === 'sw'
                    ? selectedForecast.actionPlan.harvestAdviceSw
                    : selectedForecast.actionPlan.harvestAdviceEn}
                </p>
              </div>

              {/* 4. Irrigation Guidance */}
              <div className="p-4 rounded-2xl border bg-sky-50/70 border-sky-200 text-sky-950">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚰</span>
                    <h4 className="font-extrabold text-xs sm:text-sm">
                      {language === 'sw' ? 'Umwagiliaji Maji Shambani' : 'Irrigation Scheduling'}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold shadow-xs">
                    {language === 'sw' ? 'Mpango wa Maji' : 'Water Plan'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {language === 'sw'
                    ? selectedForecast.actionPlan.irrigationAdviceSw
                    : selectedForecast.actionPlan.irrigationAdviceEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FULL 7-DAY WEEKLY STRATEGIC OUTLOOK CARD */}
      {weeklyOutlook && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400 border border-white/15">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300">
                  {language === 'sw' ? 'Mkakati wa Wiki Nzima' : '7-Day Strategic Agro-Outlook'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {language === 'sw' ? `Mwelekeo wa Wiki: Kaunti ya ${weather?.county}` : `Weekly Outlook: ${weather?.county} County`}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 text-center">
                <span className="text-[10px] text-emerald-200 block uppercase font-bold">
                  {language === 'sw' ? 'Jumla ya Mvua Wiki' : 'Total 7-Day Rain'}
                </span>
                <span className="text-xl font-black text-yellow-300">
                  {weeklyOutlook.totalRainfallMm} mm
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {language === 'sw' ? weeklyOutlook.weeklySummarySw : weeklyOutlook.weeklySummaryEn}
          </p>

          {/* High risk vs Best fieldwork tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{language === 'sw' ? 'Siku za Hatari (Mvua Kubwa / Fangasi):' : 'High Risk Days (Heavy Rain / Blight):'}</span>
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {weeklyOutlook.highRiskDays.length > 0
                  ? weeklyOutlook.highRiskDays.join(', ')
                  : language === 'sw' ? 'Hakuna siku za dhoruba kali wiki hii' : 'No severe storm days this week'}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{language === 'sw' ? 'Siku Bora za Kazi (Palizi / Dawa / Kuvuna):' : 'Best Fieldwork Days (Weeding / Spraying):'}</span>
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {weeklyOutlook.bestFieldworkDays.join(', ')}
              </div>
            </div>
          </div>

          {/* Seasonal Advisory Advice */}
          <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 text-xs sm:text-sm text-emerald-100 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-white block mb-0.5">
                {language === 'sw' ? 'Ushauri Mahususi wa Msimu wa Sasa:' : 'Actionable Seasonal Takeaway:'}
              </span>
              <span>
                {language === 'sw' ? weeklyOutlook.seasonalAdviceSw : weeklyOutlook.seasonalAdviceEn}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
