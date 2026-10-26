import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  Snowflake,
  CloudRain,
  Wind,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  ArrowRight,
  Droplets,
  Stethoscope,
  MessageSquare,
  RefreshCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { WeatherSnapshot } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { useAccessibility } from '../context/AccessibilityContext.tsx';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface WeatherWarning {
  id: string;
  type: 'frost' | 'heat' | 'flood' | 'wind' | 'blight' | 'favorable';
  severity: AlertSeverity;
  titleEn: string;
  titleSw: string;
  badgeEn: string;
  badgeSw: string;
  summaryEn: string;
  summarySw: string;
  metricLabelEn: string;
  metricLabelSw: string;
  metricValue: string;
  affectedCropsEn: string[];
  affectedCropsSw: string[];
  recommendationsEn: string[];
  recommendationsSw: string[];
  icon: 'snowflake' | 'flame' | 'rain' | 'wind' | 'blight' | 'shield';
  suggestedAction?: 'crop-doctor' | 'agronomist' | 'farm-analysis';
}

interface AlertBannerProps {
  weather: WeatherSnapshot | null;
  onNavigate?: (tab: string) => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  weather,
  onNavigate,
  className = '',
}) => {
  const { language } = useApp();
  const { isSpeaking, speakText, stopSpeaking } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [simulatedScenario, setSimulatedScenario] = useState<string | null>(null);

  const handleSpeakAlert = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (primaryWarning) {
      const textToSpeak = `${title}. ${summary}. ${language === 'sw' ? 'Miongozo ya haraka ya kujilinda:' : 'Immediate protective actions:'} ${recommendations.join('. ')}`;
      speakText(textToSpeak, language);
    }
  };

  // Compute active weather snapshot considering simulation overrides
  const effectiveWeather: WeatherSnapshot | null = useMemo(() => {
    if (!weather && !simulatedScenario) return null;

    const base = weather || {
      county: 'Kisii',
      temperatureC: 22,
      humidityPercent: 68,
      rainProbabilityPercent: 45,
      condition: 'Partly cloudy',
      windSpeedKmh: 14,
      forecast: [],
      isDemo: true,
      dataSource: 'Agro-Meteo',
    };

    if (simulatedScenario === 'frost-severe') {
      return {
        ...base,
        temperatureC: 3,
        humidityPercent: 92,
        rainProbabilityPercent: 15,
        condition: 'Freezing Fog & Frost',
        windSpeedKmh: 6,
      };
    }
    if (simulatedScenario === 'frost-moderate') {
      return {
        ...base,
        temperatureC: 7,
        humidityPercent: 88,
        rainProbabilityPercent: 20,
        condition: 'Cold Mist & Frost Watch',
        windSpeedKmh: 9,
      };
    }
    if (simulatedScenario === 'heat-extreme') {
      return {
        ...base,
        temperatureC: 35,
        humidityPercent: 28,
        rainProbabilityPercent: 5,
        condition: 'Scorching Heat & Clear Sky',
        windSpeedKmh: 18,
      };
    }
    if (simulatedScenario === 'heat-moderate') {
      return {
        ...base,
        temperatureC: 31,
        humidityPercent: 35,
        rainProbabilityPercent: 10,
        condition: 'High Solar Radiation & Heat',
        windSpeedKmh: 15,
      };
    }
    if (simulatedScenario === 'heavy-rain') {
      return {
        ...base,
        temperatureC: 19,
        humidityPercent: 94,
        rainProbabilityPercent: 88,
        condition: 'Severe Thunderstorm & Downpour',
        windSpeedKmh: 24,
      };
    }
    if (simulatedScenario === 'high-wind') {
      return {
        ...base,
        temperatureC: 23,
        humidityPercent: 50,
        rainProbabilityPercent: 25,
        condition: 'Gale Winds & Gusts',
        windSpeedKmh: 36,
      };
    }
    if (simulatedScenario === 'blight-humidity') {
      return {
        ...base,
        temperatureC: 19,
        humidityPercent: 92,
        rainProbabilityPercent: 65,
        condition: 'High Humidity & Continuous Drizzle',
        windSpeedKmh: 10,
      };
    }

    return base;
  }, [weather, simulatedScenario]);

  // Evaluate critical warnings from effective weather snapshot
  const warnings: WeatherWarning[] = useMemo(() => {
    if (!effectiveWeather) return [];

    const list: WeatherWarning[] = [];
    const { temperatureC, humidityPercent, rainProbabilityPercent, windSpeedKmh, county, condition } =
      effectiveWeather;
    const condLower = (condition || '').toLowerCase();

    // 1. Critical or Moderate Frost Warning
    if (temperatureC <= 4 || condLower.includes('frost') || condLower.includes('freeze')) {
      list.push({
        id: 'frost-critical',
        type: 'frost',
        severity: 'critical',
        titleEn: 'CRITICAL FROST WARNING: Sub-zero / Freezing Hazard',
        titleSw: 'TAHADHARI KALI YA THELUJI: Hatari Kubwa ya Kuganda Mazao',
        badgeEn: 'CRITICAL ALERT',
        badgeSw: 'HATARI KUBWA',
        summaryEn: `Current temperature dropped to ${temperatureC}°C in ${county}. High risk of rapid cell rupture, blackened leaves, and flower death on sensitive crops.`,
        summarySw: `Kiwango cha joto kimeshuka hadi nyuzi ${temperatureC}°C katika Kaunti ya ${county}. Hatari kubwa ya majani kupasuka, kuwa meusi, na maua kufa.`,
        metricLabelEn: 'Temperature',
        metricLabelSw: 'Joto',
        metricValue: `${temperatureC}°C (Freezing)`,
        affectedCropsEn: ['Tomatoes', 'Potatoes', 'Beans', 'Vegetables / Kales'],
        affectedCropsSw: ['Nyanya', 'Viazi Mviringo', 'Maharagwe', 'Sukuma Wiki'],
        recommendationsEn: [
          'Apply 5–10 cm of dry grass or straw mulch over root zones immediately to trap residual soil heat.',
          'Cover nursery beds and young tomato canopies with clear agro-polythene or burlap sheets before sunset.',
          'Perform light evening overhead irrigation: moist soil stores and releases significantly more nocturnal heat than dry soil.',
          'Halt nitrogen fertilizer applications until warmth returns to prevent tender vulnerable tissue growth.',
        ],
        recommendationsSw: [
          'Weka matandazo mazito ya nyasi kavu (sm 5-10) kwenye mashina ya mazao mara moja ili kutunza joto la ardhini.',
          'Funika vitalu vya miche na mashina machanga ya nyanya kwa nailoni au nyavu kabla ya jua kutua.',
          'Mwagilia shamba kidogo wakati wa jioni: udongo wenye unyevu hutunza joto usiku na kuzuia barafu.',
          'Sitisha kuweka mbolea ya nitrojeni hadi hali ya joto itakaporejea ili kuzuia mimea kuumia.',
        ],
        icon: 'snowflake',
        suggestedAction: 'agronomist',
      });
    } else if (temperatureC <= 9) {
      list.push({
        id: 'frost-advisory',
        type: 'frost',
        severity: 'warning',
        titleEn: 'Frost Advisory: Night Chilling & Cold Shock Watch',
        titleSw: 'Tahadhari ya Baridi Kali: Hatari ya Kudumaa kwa Mimea Usiku',
        badgeEn: 'COLD ADVISORY',
        badgeSw: 'TAHADHARI YA BARIDI',
        summaryEn: `Temperature is at ${temperatureC}°C in ${county}. Prolonged cold chills impede phosphorus uptake, stun root growth, and delay tomato flowering.`,
        summarySw: `Joto ni nyuzi ${temperatureC}°C katika Kaunti ya ${county}. Baridi kali inazuia mimea kufyonza madini ya phosphorus na kuchelewesha maua ya nyanya.`,
        metricLabelEn: 'Current Temp',
        metricLabelSw: 'Kiwango cha Joto',
        metricValue: `${temperatureC}°C (Cold Shock)`,
        affectedCropsEn: ['Tomatoes', 'Potatoes', 'Watermelon'],
        affectedCropsSw: ['Nyanya', 'Viazi Mviringo', 'Tikiti Maji'],
        recommendationsEn: [
          'Inspect sheltered seedbeds for leaf bronzing or purpling indicating cold-induced phosphorus block.',
          'Use organic mulch around plant bases to moderate soil root temperatures.',
          'Delay field transplanting until minimum nighttime temperatures exceed 12°C.',
        ],
        recommendationsSw: [
          'Kagua miche kwenye vitalu kuona kama majani yamebadilika rangi kuwa ya zambarau kutokana na baridi.',
          'Weka matandazo ya majani makavu kuzunguka shina ili kutunza joto la udongo.',
          'Ahirisha kuhamishia miche shambani hadi joto la usiku lifikie zaidi ya nyuzi 12°C.',
        ],
        icon: 'snowflake',
        suggestedAction: 'agronomist',
      });
    }

    // 2. Excessive Heat Warning
    if (temperatureC >= 33 || condLower.includes('heat wave')) {
      list.push({
        id: 'heat-critical',
        type: 'heat',
        severity: 'critical',
        titleEn: 'EXCESSIVE HEAT WARNING: Extreme Evapotranspiration & Scald Hazard',
        titleSw: 'TAHADHARI KALI YA JOTO: Hatari ya Kukauka na Kuungua kwa Mazao',
        badgeEn: 'CRITICAL ALERT',
        badgeSw: 'HATARI KUBWA',
        summaryEn: `Ambient temperature has spiked to ${temperatureC}°C in ${county}. Intense solar radiation causes blossom abortion, rapid leaf wilting, and fruit sunscald.`,
        summarySw: `Joto kali limefikia nyuzi ${temperatureC}°C katika Kaunti ya ${county}. Mionzi mikali inasababisha maua kupukutika, majani kunyauka, na matunda kuungua.`,
        metricLabelEn: 'Heat Index',
        metricLabelSw: 'Kiwango cha Joto',
        metricValue: `${temperatureC}°C (Severe Heat)`,
        affectedCropsEn: ['Tomatoes', 'Beans', 'Cabbages / Vegetables', 'Watermelon'],
        affectedCropsSw: ['Nyanya', 'Maharagwe', 'Mboga / Sukuma', 'Tikiti Maji'],
        recommendationsEn: [
          'Shift irrigation strictly to early dawn (5:00–7:00 AM) or dusk to minimize evaporative losses.',
          'Erect temporary 30–40% shade netting or palm/banana fronds over sensitive vegetables and seedlings.',
          'Avoid applying foliar fertilizers or agro-chemicals during peak sunlight hours (10:00 AM – 4:00 PM) to prevent severe chemical leaf burn.',
          'Maintain a minimum 5cm depth of organic mulch to keep root zone soil temperatures 4–6°C cooler.',
        ],
        recommendationsSw: [
          'Mwagilia maji alfajiri mapema (saa 11:00–1:00 asubuhi) au jioni ili maji yasipotee kwa mvuke.',
          'Weka vivuli vya nyavu au majani ya migomba juu ya miche ya mboga na nyanya.',
          'Usipulize mbolea ya majani au dawa za wadudu kati ya saa 4:00 asubuhi na 10:00 jioni ili majani yasiungue.',
          'Weka matandazo ya majani (kina cha sm 5) kupunguza joto la udongo kwa nyuzi 4–6°C.',
        ],
        icon: 'flame',
        suggestedAction: 'agronomist',
      });
    } else if (temperatureC >= 29) {
      list.push({
        id: 'heat-advisory',
        type: 'heat',
        severity: 'warning',
        titleEn: 'Heat Stress Advisory: High Soil Evaporation Rate',
        titleSw: 'Tahadhari ya Joto Kali: Upotevu wa Haraka wa Maji Ardhini',
        badgeEn: 'HEAT ADVISORY',
        badgeSw: 'TAHADHARI YA JOTO',
        summaryEn: `Elevated temperature (${temperatureC}°C) in ${county}. Accelerates soil moisture depletion and induces midday stomatal closure.`,
        summarySw: `Joto la juu (${temperatureC}°C) katika Kaunti ya ${county}. Linaongeza upotevu wa maji na kufanya mimea kulegea mchana.`,
        metricLabelEn: 'Current Temp',
        metricLabelSw: 'Kiwango cha Joto',
        metricValue: `${temperatureC}°C (High Heat)`,
        affectedCropsEn: ['Tomatoes', 'Vegetables', 'Beans'],
        affectedCropsSw: ['Nyanya', 'Mboga', 'Maharagwe'],
        recommendationsEn: [
          'Ensure drip irrigation reservoirs are primed for deep morning watering cycles.',
          'Check soil moisture at 10cm depth; top up mulch layer to reduce soil drying.',
          'Monitor tomato flowers for blossom drop and ensure adequate potassium nutrition.',
        ],
        recommendationsSw: [
          'Hakikisha mifumo ya umwagiliaji imejaa maji tayari kumwagilia asubuhi na mapema.',
          'Pima unyevu kwenye kina cha sm 10; ongeza matandazo ili kuzuia ardhi kupasuka.',
          'Kagua maua ya nyanya kama yanapukutika na uhakikishe mmea unapata virutubisho sahihi.',
        ],
        icon: 'flame',
        suggestedAction: 'farm-analysis',
      });
    }

    // 3. Heavy Downpour & Flash Flood Warning
    if (rainProbabilityPercent >= 75 || condLower.includes('heavy rain') || condLower.includes('thunderstorm')) {
      list.push({
        id: 'flood-warning',
        type: 'flood',
        severity: rainProbabilityPercent >= 85 ? 'critical' : 'warning',
        titleEn: 'Flash Flood & Waterlogging Warning: Heavy Downpour Forecast',
        titleSw: 'Tahadhari ya Mvua Kubwa na Mafuriko: Maji Kutuama Shambani',
        badgeEn: rainProbabilityPercent >= 85 ? 'FLASH FLOOD ALERT' : 'HEAVY RAIN ALERT',
        badgeSw: rainProbabilityPercent >= 85 ? 'HATARI YA MAFURIKO' : 'TAHADHARI YA MVUA',
        summaryEn: `${rainProbabilityPercent}% precipitation probability forecast with ${condition} in ${county}. Waterlogging asphyxiates root hairs and leaches nitrogen.`,
        summarySw: `Uwezekano wa mvua ni ${rainProbabilityPercent}% na ${condition} katika Kaunti ya ${county}. Maji kutuama yananyonga mizizi na kusomba mbolea.`,
        metricLabelEn: 'Rain Probability',
        metricLabelSw: 'Uwezekano wa Mvua',
        metricValue: `${rainProbabilityPercent}%`,
        affectedCropsEn: ['Tomatoes', 'Potatoes', 'Beans', 'Maize'],
        affectedCropsSw: ['Nyanya', 'Viazi Mviringo', 'Maharagwe', 'Mahindi'],
        recommendationsEn: [
          'Clear contour trenches and diversion ditches to evacuate standing surface water away from roots.',
          'Postpone nitrogen top-dressing until the cloudburst passes to avoid massive nutrient runoff loss.',
          'Harvest physiologically mature fruits and leafy vegetables today before heavy rains split and rot them.',
        ],
        recommendationsSw: [
          'Safisha mitaro na mifereji ya maji ili maji ya mafuriko yasituame kwenye mashina ya mazao.',
          'Ahirisha kuweka mbolea ya kukuzia ili isisombwe na maji ya mvua yanayotiririka.',
          'Vuna matunda yaliyokomaa na mboga leo kabla ya mvua kubwa kupasua na kuozesha mazao.',
        ],
        icon: 'rain',
        suggestedAction: 'farm-analysis',
      });
    }

    // 4. High Wind Warning
    if (windSpeedKmh >= 28 || condLower.includes('gale') || condLower.includes('storm')) {
      list.push({
        id: 'wind-warning',
        type: 'wind',
        severity: windSpeedKmh >= 35 ? 'critical' : 'warning',
        titleEn: 'Gale Wind Warning: Maize Lodging & Greenhouse Damage',
        titleSw: 'Tahadhari ya Upepo Mkubwa: Hatari ya Kuangusha Mazao na Vitaru',
        badgeEn: 'HIGH WIND ALERT',
        badgeSw: 'TAHADHARI YA UPEPO',
        summaryEn: `Wind speeds clocked at ${windSpeedKmh} km/h in ${county}. Strong gusts can snap mature maize stalks and tear greenhouse polythenes.`,
        summarySw: `Upepo umefikia kasi ya ${windSpeedKmh} km/h katika Kaunti ya ${county}. Upepo mkali unaweza kuangusha mahindi na kuchana nailoni za vitaru.`,
        metricLabelEn: 'Wind Speed',
        metricLabelSw: 'Kasi ya Upepo',
        metricValue: `${windSpeedKmh} km/h`,
        affectedCropsEn: ['Maize', 'Bananas', 'Tomatoes (Trellised)'],
        affectedCropsSw: ['Mahindi', 'Ndizi', 'Nyanya zilizo na miti'],
        recommendationsEn: [
          'Reinforce greenhouse exterior guide ropes and inspect corner polythene fastenings.',
          'Tighten tomato support lines and double-stake heavy fruiting indeterminate vines.',
          'Prop heavy fruiting banana trees with forked wooden poles to prevent blow-down.',
        ],
        recommendationsSw: [
          'Kagua na imarisha kamba za nje za greenhouses na uzifunge vizuri.',
          'Funga imara miti na kamba zinazoshikilia mashina ya nyanya.',
          'Weka nguzo na tegemezi kwenye migomba yenye mikungu mikubwa kuzuia kuanguka.',
        ],
        icon: 'wind',
        suggestedAction: 'agronomist',
      });
    }

    // 5. High Humidity & Fungal Blight Outbreak Alert
    if (humidityPercent >= 82 && temperatureC >= 16 && temperatureC <= 26) {
      list.push({
        id: 'blight-warning',
        type: 'blight',
        severity: 'warning',
        titleEn: 'Fungal Disease Surge: High Late Blight & Leaf Mold Threat',
        titleSw: 'Tahadhari ya Ugonjwa wa Ukungu: Hatari ya Blight na Madoa',
        badgeEn: 'PATHOLOGY WATCH',
        badgeSw: 'TAHADHARI YA UKUNGU',
        summaryEn: `Relative humidity at ${humidityPercent}% with ${temperatureC}°C in ${county}. Prime microclimate for rapid spore germination of Late Blight (*Phytophthora infestans*).`,
        summarySw: `Unyevu wa hewa ni ${humidityPercent}% na joto la ${temperatureC}°C katika Kaunti ya ${county}. Mazingira bora sana ya kuenea kwa ugonjwa wa blight kwenye nyanya na viazi.`,
        metricLabelEn: 'Air Humidity',
        metricLabelSw: 'Unyevu wa Hewa',
        metricValue: `${humidityPercent}%`,
        affectedCropsEn: ['Tomatoes', 'Potatoes', 'Cabbages'],
        affectedCropsSw: ['Nyanya', 'Viazi Mviringo', 'Kabichi'],
        recommendationsEn: [
          'Prune lower 30cm senescent leaves touching soil to enhance ventilation and eliminate moisture pockets.',
          'Scout underside of leaves daily at sunrise for pale green halos or white powdery spore growth.',
          'Prepare preventative copper-based or bio-fungicide protective sprays once foliage dries.',
        ],
        recommendationsSw: [
          'Kata majani ya chini yanayogusa ardhi ili kuongeza mzunguko wa hewa na kuzuia unyevu.',
          'Kagua sehemu ya chini ya majani kila asubuhi kuangalia madoa ya kijivu au ukungu mweupe.',
          'Andaa dawa salama ya kukinga ukungu (kama copper fungicide) ya kupuliza majani yakikauka.',
        ],
        icon: 'blight',
        suggestedAction: 'crop-doctor',
      });
    }

    // Fallback: If no critical or warning conditions exist
    if (list.length === 0) {
      list.push({
        id: 'favorable-weather',
        type: 'favorable',
        severity: 'info',
        titleEn: 'Favorable Agro-Weather: Optimal Crop Conditions',
        titleSw: 'Hali Nzuri ya Hewa: Mazingira Bora ya Kilimo Leo',
        badgeEn: 'FAVORABLE WEATHER',
        badgeSw: 'HALI NZURI',
        summaryEn: `Current weather in ${county} (${temperatureC}°C, ${humidityPercent}% humidity, ${rainProbabilityPercent}% rain probability) is within safe agronomic ranges. Ideal for weeding, land prep, and balanced growth.`,
        summarySw: `Hali ya hewa katika Kaunti ya ${county} (joto ${temperatureC}°C, unyevu ${humidityPercent}%, mvua ${rainProbabilityPercent}%) iko katika viwango salama vya kilimo. Ni wakati mzuri wa kupalilia na kutunza shamba.`,
        metricLabelEn: 'Temperature',
        metricLabelSw: 'Kiwango cha Joto',
        metricValue: `${temperatureC}°C (Optimal)`,
        affectedCropsEn: ['All Farm Crops'],
        affectedCropsSw: ['Mazao Yote ya Shambani'],
        recommendationsEn: [
          'Maintain regular irrigation schedules and scout for early insect pests.',
          'Take advantage of mild weather for weed suppression and field maintenance.',
        ],
        recommendationsSw: [
          'Endelea na ratiba ya kawaida ya umwagiliaji na ukague wadudu waharibifu.',
          'Tumia fursa ya hali hii shwari kupalilia na kusafisha shamba lako.',
        ],
        icon: 'shield',
        suggestedAction: 'farm-analysis',
      });
    }

    return list;
  }, [effectiveWeather]);

  // Primary active warning (highest severity first: critical > warning > info)
  const primaryWarning = useMemo(() => {
    if (warnings.length === 0) return null;
    return (
      warnings.find((w) => w.severity === 'critical') ||
      warnings.find((w) => w.severity === 'warning') ||
      warnings[0]
    );
  }, [warnings]);

  if (!primaryWarning) return null;

  const isCritical = primaryWarning.severity === 'critical';
  const isWarning = primaryWarning.severity === 'warning';
  const isFavorable = primaryWarning.severity === 'info';

  const title = language === 'sw' ? primaryWarning.titleSw : primaryWarning.titleEn;
  const badge = language === 'sw' ? primaryWarning.badgeSw : primaryWarning.badgeEn;
  const summary = language === 'sw' ? primaryWarning.summarySw : primaryWarning.summaryEn;
  const metricLabel = language === 'sw' ? primaryWarning.metricLabelSw : primaryWarning.metricLabelEn;
  const affectedCrops = language === 'sw' ? primaryWarning.affectedCropsSw : primaryWarning.affectedCropsEn;
  const recommendations = language === 'sw' ? primaryWarning.recommendationsSw : primaryWarning.recommendationsEn;

  // Render icon based on warning type
  const renderIcon = () => {
    switch (primaryWarning.icon) {
      case 'snowflake':
        return <Snowflake className={`h-6 w-6 ${isCritical ? 'text-rose-600 animate-pulse' : 'text-sky-600'}`} />;
      case 'flame':
        return <Flame className={`h-6 w-6 ${isCritical ? 'text-rose-600 animate-pulse' : 'text-amber-600'}`} />;
      case 'rain':
        return <CloudRain className={`h-6 w-6 ${isCritical ? 'text-rose-600' : 'text-blue-600'}`} />;
      case 'wind':
        return <Wind className={`h-6 w-6 ${isCritical ? 'text-rose-600' : 'text-indigo-600'}`} />;
      case 'blight':
        return <Droplets className="h-6 w-6 text-purple-600" />;
      default:
        return <ShieldCheck className="h-6 w-6 text-emerald-600" />;
    }
  };

  // If dismissed, render a subtle un-dismiss pill
  if (isDismissed) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isCritical ? 'bg-rose-500 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span className="font-semibold text-slate-800">
              {language === 'sw' ? 'Tahadhari ya Hali ya Hewa:' : 'Weather Alert:'}
            </span>
            <span className="text-slate-600 truncate max-w-[200px] sm:max-w-md font-medium">{title}</span>
          </div>
          <button
            onClick={() => setIsDismissed(false)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-2 shrink-0"
          >
            {language === 'sw' ? 'Fungua Tahadhari' : 'Show Alert'}
          </button>
        </div>
      </div>
    );
  }

  // Styles based on severity
  const containerClasses = isCritical
    ? 'border-rose-300 bg-rose-50/90 text-rose-950 shadow-sm'
    : isWarning
    ? 'border-amber-300 bg-amber-50/90 text-amber-950 shadow-sm'
    : 'border-emerald-200 bg-emerald-50/70 text-emerald-950';

  const badgeClasses = isCritical
    ? 'bg-rose-600 text-white shadow-xs'
    : isWarning
    ? 'bg-amber-600 text-white shadow-xs'
    : 'bg-emerald-600 text-white';

  const actionBtnClasses = isCritical
    ? 'bg-rose-600 hover:bg-rose-700 text-white'
    : isWarning
    ? 'bg-amber-700 hover:bg-amber-800 text-white'
    : 'bg-emerald-700 hover:bg-emerald-800 text-white';

  return (
    <div className={`w-full rounded-2xl border transition-all duration-200 overflow-hidden ${containerClasses} ${className}`}>
      {/* Main Header / Banner Summary */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Left: Icon, Severity Badge, Title, Summary */}
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <div className="rounded-xl p-2.5 bg-white/80 border border-black/5 shadow-2xs shrink-0 mt-0.5">
              {renderIcon()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClasses}`}>
                  {badge}
                </span>

                {/* Additional warnings count tag if multiple */}
                {warnings.length > 1 && (
                  <span className="text-[10px] font-bold text-slate-600 bg-white/70 px-2 py-0.5 rounded-full border border-black/5">
                    +{warnings.length - 1} {language === 'sw' ? 'zaidi' : 'more alerts'}
                  </span>
                )}

                <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <span>{metricLabel}:</span>
                  <span className="font-bold text-slate-900">{primaryWarning.metricValue}</span>
                </span>
              </div>

              <h3 className="mt-1.5 text-sm sm:text-base font-black tracking-tight leading-snug">
                {title}
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {summary}
              </p>

              {/* Affected Crops Pill Badges */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {language === 'sw' ? 'Mazao Yaliyo Hatarini:' : 'Affected Crops:'}
                </span>
                {affectedCrops.map((crop, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-slate-800 border border-black/5 shadow-2xs"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Audio Narration, Expand/Collapse & Dismiss controls */}
          <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
            {/* Audio Voice Narration Button for Low-Vision & Farmers */}
            <button
              onClick={handleSpeakAlert}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
                isSpeaking
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : 'bg-white/90 hover:bg-white text-slate-800 border-black/10'
              }`}
              title={isSpeaking ? (language === 'sw' ? 'Simamisha Sauti' : 'Stop Audio') : (language === 'sw' ? 'Sikiliza Tahadhari' : 'Listen to Alert')}
              aria-label={isSpeaking ? 'Stop speaking alert' : 'Speak alert aloud'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-white" />
                  <span className="font-extrabold">{language === 'sw' ? 'Simamisha' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>{language === 'sw' ? 'Sikiliza' : 'Listen'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
              aria-label={isExpanded ? 'Collapse protective steps' : 'Expand protective steps'}
            >
              <span>{isExpanded ? (language === 'sw' ? 'Funga Mwongozo' : 'Hide Steps') : (language === 'sw' ? 'Mwongozo wa Hatua' : 'View Steps')}</span>
              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-black/5 transition-colors cursor-pointer"
              title={language === 'sw' ? 'Funga' : 'Dismiss'}
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Actionable Protective Steps */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-black/10">
            <div className="flex items-center gap-2 mb-2.5">
              <ShieldAlert className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                {language === 'sw' ? 'Hatua za Kinga za Haraka (Mwongozo wa KALRO)' : 'Immediate Protective Farm Countermeasures'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
              {recommendations.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-white/90 p-2.5 sm:p-3 border border-black/5 shadow-2xs text-xs text-slate-800"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug font-medium">{step}</span>
                </div>
              ))}
            </div>

            {/* Quick Action Navigation Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {onNavigate && primaryWarning.suggestedAction === 'agronomist' && (
                  <button
                    onClick={() => onNavigate('agronomist')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer ${actionBtnClasses}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{language === 'sw' ? 'Ongea na Mtaalamu wa Kilimo' : 'Consult AI Agronomist on Frost/Heat'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {onNavigate && primaryWarning.suggestedAction === 'crop-doctor' && (
                  <button
                    onClick={() => onNavigate('crop-doctor')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer ${actionBtnClasses}`}
                  >
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>{language === 'sw' ? 'Kagua Magonjwa kwa Crop Doctor' : 'Scan Foliage with Crop Doctor'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {onNavigate && primaryWarning.suggestedAction === 'farm-analysis' && (
                  <button
                    onClick={() => onNavigate('farm-analysis')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer ${actionBtnClasses}`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{language === 'sw' ? 'Chunguza Upya Hatari ya Shamba' : 'Re-calculate Farm Risks'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Simulation Quick Bar for Demonstration */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                <span className="font-bold uppercase tracking-wider text-slate-400">
                  {language === 'sw' ? 'Jaribu Hali:' : 'Simulate:'}
                </span>

                <button
                  onClick={() => setSimulatedScenario('frost-severe')}
                  className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer border ${
                    simulatedScenario === 'frost-severe'
                      ? 'bg-rose-600 text-white border-rose-700'
                      : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                  title="Simulate 3°C Severe Frost"
                >
                  ❄️ {language === 'sw' ? 'Theluji (3°C)' : 'Frost (3°C)'}
                </button>

                <button
                  onClick={() => setSimulatedScenario('heat-extreme')}
                  className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer border ${
                    simulatedScenario === 'heat-extreme'
                      ? 'bg-rose-600 text-white border-rose-700'
                      : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                  title="Simulate 35°C Extreme Heat"
                >
                  🔥 {language === 'sw' ? 'Joto Kali (35°C)' : 'Heat (35°C)'}
                </button>

                <button
                  onClick={() => setSimulatedScenario('heavy-rain')}
                  className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer border ${
                    simulatedScenario === 'heavy-rain'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                  title="Simulate Heavy Rain & Flood Watch"
                >
                  ⛈️ {language === 'sw' ? 'Mvua (88%)' : 'Rain (88%)'}
                </button>

                {simulatedScenario && (
                  <button
                    onClick={() => setSimulatedScenario(null)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Reset to Live Weather"
                  >
                    <RefreshCw className="h-2.5 w-2.5" />
                    <span>{language === 'sw' ? 'Hali Halisi' : 'Live Weather'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
