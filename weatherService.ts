import { County, WeatherSnapshot, DailyAgroForecast, WeeklyAgroOutlook } from '../types/index.ts';

const COUNTY_COORDINATES: Record<
  County,
  { lat: number; lon: number; defaultTemp: number; defaultRainProb: number; defaultRainfallMm: number }
> = {
  'Kisii': { lat: -0.6817, lon: 34.7667, defaultTemp: 22, defaultRainProb: 65, defaultRainfallMm: 12 },
  'Nakuru': { lat: -0.3031, lon: 36.08, defaultTemp: 24, defaultRainProb: 35, defaultRainfallMm: 4 },
  'Uasin Gishu': { lat: 0.5143, lon: 35.2698, defaultTemp: 21, defaultRainProb: 40, defaultRainfallMm: 6 },
  'Kiambu': { lat: -1.1714, lon: 36.8356, defaultTemp: 20, defaultRainProb: 45, defaultRainfallMm: 7 },
  'Machakos': { lat: -1.5177, lon: 37.2634, defaultTemp: 26, defaultRainProb: 20, defaultRainfallMm: 2 },
  'Meru': { lat: 0.0463, lon: 37.6559, defaultTemp: 22, defaultRainProb: 50, defaultRainfallMm: 8 },
  'Trans Nzoia': { lat: 1.0167, lon: 35.0022, defaultTemp: 23, defaultRainProb: 45, defaultRainfallMm: 6 },
  'Nyeri': { lat: -0.4167, lon: 36.95, defaultTemp: 19, defaultRainProb: 40, defaultRainfallMm: 5 },
  'Kilifi': { lat: -3.6305, lon: 39.8499, defaultTemp: 29, defaultRainProb: 25, defaultRainfallMm: 3 },
  'Kakamega': { lat: 0.2827, lon: 34.7519, defaultTemp: 24, defaultRainProb: 60, defaultRainfallMm: 10 },
  'Bungoma': { lat: 0.5635, lon: 34.5606, defaultTemp: 24, defaultRainProb: 50, defaultRainfallMm: 7 },
  'Migori': { lat: -1.0634, lon: 34.4731, defaultTemp: 25, defaultRainProb: 55, defaultRainfallMm: 9 },
};

const WMO_CODE_INFO: Record<number, { condition: string; conditionSw: string; icon: string }> = {
  0: { condition: 'Clear sunny sky', conditionSw: 'Jua kali bila mawingu', icon: '☀️' },
  1: { condition: 'Mainly sunny', conditionSw: 'Jua na mawingu machache', icon: '🌤️' },
  2: { condition: 'Partly cloudy', conditionSw: 'Mawingu kiasi', icon: '⛅' },
  3: { condition: 'Overcast & cool', conditionSw: 'Mawingu mazito na ubaridi', icon: '☁️' },
  45: { condition: 'Foggy highland mist', conditionSw: 'Ukungu mzito wa asubuhi', icon: '🌫️' },
  51: { condition: 'Light drizzle', conditionSw: 'Mvua ndogo ya rasharasha', icon: '🌦️' },
  61: { condition: 'Slight scattered rain', conditionSw: 'Mvua kidogo ya kawaida', icon: '🌧️' },
  63: { condition: 'Moderate sustained rain', conditionSw: 'Mvua ya wastani', icon: '🌧️' },
  65: { condition: 'Heavy rainfall downpour', conditionSw: 'Mvua kubwa ya mafuriko', icon: '⛈️' },
  80: { condition: 'Localized rain showers', conditionSw: 'Mvua ya msimu ya vipindi', icon: '🌦️' },
  95: { condition: 'Thunderstorm & lightning', conditionSw: 'Mvua ya radi na radi kali', icon: '⚡' },
};

// Generate intelligent explanation of what is happening that day in the atmosphere
function generateWhatIsHappening(rainProb: number, rainMm: number, tempC: number, windKmh: number) {
  if (rainMm >= 20 || rainProb >= 75) {
    return {
      en: `Heavy rainfall and saturated cloud cover expected (${rainMm}mm predicted). Soil will reach full saturation with potential waterlogging in lower terraces. High humidity (${Math.min(95, 60 + rainProb / 3)}%) increases foliar fungal spores.`,
      sw: `Mvua kubwa na mawingu mazito yanatarajiwa (${rainMm}mm). Udongo utajaa maji kwa wingi, na sehemu za mabondeni zinaweza kutuama maji. Unyevu mwingi huongeza hatari ya fangasi kwenye majani.`,
    };
  }

  if (rainMm >= 5 || rainProb >= 45) {
    return {
      en: `Moderate scattered afternoon showers (${rainMm}mm) with pleasant daytime temperatures around ${tempC}°C. Ideal natural moisture replenishment without soil erosion risks. Moderate breeze at ${windKmh} km/h.`,
      sw: `Mvua ya wastani ya alasiri (${rainMm}mm) na hali ya hewa ya kupendeza ya nyuzi ${tempC}°C. Udongo utapata unyevu mzuri wa asili bila mmomonyoko wa udongo. Upepo ni wa wastani wa ${windKmh} km/h.`,
    };
  }

  if (tempC >= 27 && rainProb < 25) {
    return {
      en: `Dry, hot sunshine with low cloud cover and high evapotranspiration rate. Topsoil moisture will evaporate quickly; shallow root crops will experience mid-afternoon heat stress without mulch or water.`,
      sw: `Jua kali, joto la juu (${tempC}°C) na kukausha udongo haraka. Mazao yenye mizizi mifupi (kama mboga na nyanya) yatahitaji unyevu ili kuzuia majani kunyauka mchana.`,
    };
  }

  return {
    en: `Partly cloudy with mild sunshine, stable atmospheric pressure, and comfortable temperature (${tempC}°C). Low precipitation probability (${rainProb}%); optimal field micro-climate for growth.`,
    sw: `Hali tulivu ya mawingu kiasi na jua la wastani (${tempC}°C). Uwezekano mdogo wa mvua (${rainProb}%); mazingira mazuri sana ya shambani kwa mimea kukua vizuri.`,
  };
}

// Generate actionable daily agronomic plan: what the farmer should do today
function generateDailyActionPlan(rainProb: number, rainMm: number, tempC: number, windKmh: number) {
  const canSpray = rainProb < 35 && rainMm < 2 && windKmh < 18;
  const canHarvestDry = rainProb < 30 && rainMm < 1;
  const canFertilize = (rainMm >= 3 && rainMm <= 20) || (rainProb >= 40 && rainProb <= 70);

  // Spray advice
  const sprayAdviceEn = canSpray
    ? `Optimal spray window: Early morning (6:30 AM - 9:30 AM). Low wind (${windKmh} km/h) minimizes chemical drift and guaranteed rain-free duration ensures foliar absorption.`
    : `DO NOT SPRAY pesticides or foliar feed today. Rain/drizzle (${rainProb}% prob) will wash away active chemicals within hours, wasting your money.`;
  const sprayAdviceSw = canSpray
    ? `Wakati mwafaka wa kunyunyiza dawa: Asubuhi na mapema (saa 12:30 - 3:30 asubuhi). Upepo mdogo unazuia dawa kupotea, na hakuna mvua ya kuosha dawa.`
    : `USINYUNYIZIE dawa leo. Mvua/rasharasha (${rainProb}%) itaosha dawa kabla haijafanya kazi, ukipoteza gharama na muda wako.`;

  // Fertilizer advice
  const fertilizerAdviceEn =
    rainMm > 25
      ? `Hold off topdressing. Heavy runoff will wash fertilizer granules into ditches.`
      : canFertilize
      ? `EXCELLENT day for topdressing (CAN or Urea). Light/moderate rainfall will dissolve granules into root depth without nutrient leaching.`
      : `Apply fertilizer only if you have irrigation to water immediately; dry fertilizer under hot sun can burn tender stems.`;
  const fertilizerAdviceSw =
    rainMm > 25
      ? `Subiri kuweka mbolea. Mvua kubwa inaweza kusomba mbolea yako yote kwenye mifereji.`
      : canFertilize
      ? `SIKU BORA KABISA ya kuweka mbolea ya kukuzia (CAN/Urea). Mvua ya wastani itayeyusha mbolea moja kwa moja kwenye mizizi bila hasara.`
      : `Weka mbolea ikiwa tu utamwagilia maji mara moja; mbolea ikiachwa kwenye jua kali inaweza kuunguza shina la mmea.`;

  // Harvest & drying advice
  const harvestAdviceEn = canHarvestDry
    ? `Great day for harvesting, pod picking, and spreading maize, beans, or coffee cherries on drying mats.`
    : `Keep harvested produce safely covered in the store or under waterproof tarpaulins. Wet humidity causes fungal mold and aflatoxin.`;
  const harvestAdviceSw = canHarvestDry
    ? `Siku nzuri sana ya kuvuna, kuchuma na kuanika mahindi, maharage au kahawa kwenye maturubai juani.`
    : `Funika mazao yaliyovunwa vizuri ndani ya ghala au kwa maturubai yasiyoingiza maji. Unyevu unaleta ukungu na sumukuvu (aflatoxin).`;

  // Irrigation advice
  const irrigationAdviceEn =
    rainMm >= 8
      ? `No irrigation needed today. Natural rain provides ${rainMm}mm of water, saving diesel pump fuel and electricity.`
      : rainMm >= 3
      ? `Reduce irrigation runtime by 50%. The soil retains moisture from afternoon showers.`
      : `Irrigate deeply at root base early morning or sunset (45-60 mins drip cycle) to prepare for high midday evaporation.`;
  const irrigationAdviceSw =
    rainMm >= 8
      ? `Hakuna haja ya kumwagilia maji leo. Mvua ya asili inatosha (${rainMm}mm), utaokoa mafuta ya pampu na umeme.`
      : rainMm >= 3
      ? `Punguza muda wa kumwagilia kwa nusu. Udongo bado unashikilia unyevu kutokana na rasharasha za alasiri.`
      : `Mwagilia vizuri kwenye shina asubuhi au jioni (dakika 45-60 kwa drip) ili kuzuia maji kupotea kwa joto la mchana.`;

  // Priority task of the day
  let priorityTaskEn = 'Inspect crops for early pest emergence and check field drainage trenches.';
  let priorityTaskSw = 'Kagua wadudu shambani na usafishe mitaro ya kutoa maji yasituame.';

  if (rainMm >= 15) {
    priorityTaskEn = 'Clear drainage trenches and dig contour ditches to prevent soil erosion and root rotting.';
    priorityTaskSw = 'Chimba mitaro ya kuzuia mmomonyoko wa udongo na kuzuia maji kutuama kwenye mizizi.';
  } else if (canFertilize) {
    priorityTaskEn = 'Topdress actively growing crops with CAN or compost before afternoon showers arrive.';
    priorityTaskSw = 'Weka mbolea ya kukuzia (CAN) au mbolea ya samadi kabla ya mvua ya alasiri kunyesha.';
  } else if (canSpray) {
    priorityTaskEn = 'Apply protective organic foliar spray or preventive copper fungicide in early morning calm.';
    priorityTaskSw = 'Nyunyiza dawa asilia au kinga ya ukungu mapema asubuhi upepo ukiwa bado tulivu.';
  } else if (canHarvestDry) {
    priorityTaskEn = 'Take advantage of dry sunshine for weeding between rows and sun-drying harvested grains.';
    priorityTaskSw = 'Tumia jua la leo kupalilia magugu kati ya mistari na kuanika nafaka zilizovunwa.';
  }

  return {
    canSpray,
    sprayAdviceEn,
    sprayAdviceSw,
    canFertilize,
    fertilizerAdviceEn,
    fertilizerAdviceSw,
    canHarvestDry,
    harvestAdviceEn,
    harvestAdviceSw,
    irrigationAdviceEn,
    irrigationAdviceSw,
    priorityTaskEn,
    priorityTaskSw,
  };
}

// Generate the 7-day Weekly Strategic Outlook
function generateWeeklyOutlook(dailyForecasts: DailyAgroForecast[], county: County): WeeklyAgroOutlook {
  const totalRainfallMm = dailyForecasts.reduce((sum, d) => sum + d.rainfallMm, 0);
  const highRiskDays = dailyForecasts
    .filter((d) => d.rainfallMm >= 15 || d.rainProb >= 70 || d.windSpeedKmh >= 24)
    .map((d) => d.day);
  const bestFieldworkDays = dailyForecasts
    .filter((d) => d.rainProb <= 35 && d.rainfallMm <= 2)
    .map((d) => d.day);

  let weeklySummaryEn = '';
  let weeklySummarySw = '';
  let seasonalAdviceEn = '';
  let seasonalAdviceSw = '';

  if (totalRainfallMm >= 50) {
    weeklySummaryEn = `Wet, high-precipitation week ahead across ${county} with an estimated ${totalRainfallMm}mm total rainfall. High moisture creates substantial foliar disease risks (early/late blight and downy mildew).`;
    weeklySummarySw = `Wiki hii itakuwa na mvua nyingi sana katika Kaunti ya ${county} (jumla ya takriban ${totalRainfallMm}mm). Unyevu huu mwingi huleta hatari kubwa ya magonjwa ya ukungu na koga kwenye majani.`;
    seasonalAdviceEn = `Prioritize digging stormwater diversion furrows. Delay soil tillage until ground dries. Apply preventative copper fungicide as soon as a dry morning window appears.`;
    seasonalAdviceSw = `Kipaumbele kikubwa ni kuchimba mitaro ya maji kuzuia mizizi kuoza. Usilime udongo ukiwa tope. Panga kunyunyiza kinga ya ukungu asubuhi ya siku itakayokosa mvua.`;
  } else if (totalRainfallMm >= 15) {
    weeklySummaryEn = `Balanced agronomic weather in ${county} with ${totalRainfallMm}mm expected across the 7 days. Great balance between warm growing sunshine and natural soil hydration.`;
    weeklySummarySw = `Hali ya hewa nzuri na yenye uwiano bora katika Kaunti ya ${county} (mvua ya wastani ya ${totalRainfallMm}mm kwa wiki nzima). Mimea itapata jua la kutosha na unyevu wa asili.`;
    seasonalAdviceEn = `Excellent week for crop maintenance. Schedule topdressing on rainy days and weeding or foliar spraying on the ${bestFieldworkDays.join(', ') || 'dry days'}.`;
    seasonalAdviceSw = `Wiki nzuri sana ya kazi za shambani. Weka mbolea siku za mvua ya wastani, na ufanye palizi na kunyunyiza dawa siku za jua (${bestFieldworkDays.join(', ') || 'siku kavu'}).`;
  } else {
    weeklySummaryEn = `Predominantly dry and sunny 7-day pattern in ${county} with only ${totalRainfallMm}mm rain. Moisture conservation is critical this week.`;
    weeklySummarySw = `Hali ya hewa kavu na jua jingi kwa siku 7 zijazo katika Kaunti ya ${county} (mvua kidogo sana ya ${totalRainfallMm}mm). Utunzaji wa unyevu ndio jambo muhimu zaidi.`;
    seasonalAdviceEn = `Apply grass or straw mulch around plant bases to reduce soil evaporation by up to 70%. Run drip irrigation in early mornings or evenings. Best week for harvesting and grain drying.`;
    seasonalAdviceSw = `Tandaza nyasi kavu (mulch) kwenye mashina kuzuia maji kukauka. Mwagilia maji asubuhi na mapema au jioni. Wiki nzuri kabisa ya kuvuna na kuanika nafaka.`;
  }

  return {
    weeklySummaryEn,
    weeklySummarySw,
    totalRainfallMm,
    highRiskDays,
    bestFieldworkDays: bestFieldworkDays.length > 0 ? bestFieldworkDays : ['Midweek'],
    seasonalAdviceEn,
    seasonalAdviceSw,
  };
}

export async function getWeatherForCounty(county: County): Promise<WeatherSnapshot> {
  const coords = COUNTY_COORDINATES[county] || COUNTY_COORDINATES['Kisii'];

  try {
    // Open-Meteo 7-day comprehensive agro-meteorology query
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_mean&timezone=Africa%2FNairobi&forecast_days=7`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const current = data.current;
      const daily = data.daily;

      const daysOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const daysOfWeekSw = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const dailyForecasts: DailyAgroForecast[] = (daily.time || []).map((dateStr: string, idx: number) => {
        const d = new Date(dateStr);
        const dayName = daysOfWeekEn[d.getDay()];
        const dayNameSw = daysOfWeekSw[d.getDay()];
        const dateFormatted = `${monthNames[d.getMonth()]} ${d.getDate()}`;

        const code = daily.weather_code[idx] ?? 1;
        const codeInfo = WMO_CODE_INFO[code] || WMO_CODE_INFO[1];

        const tempMax = Math.round(daily.temperature_2m_max[idx] ?? coords.defaultTemp);
        const tempMin = Math.round(daily.temperature_2m_min?.[idx] ?? (tempMax - 5));
        const rainProb = Math.round(daily.precipitation_probability_max[idx] ?? coords.defaultRainProb);
        const rainfallMm = Math.round((daily.precipitation_sum?.[idx] ?? (rainProb > 40 ? 6 : 0)) * 10) / 10;
        const windSpeed = Math.round(daily.wind_speed_10m_max?.[idx] ?? 12);
        const humidity = Math.round(daily.relative_humidity_2m_mean?.[idx] ?? 68);

        const whatIsHappening = generateWhatIsHappening(rainProb, rainfallMm, tempMax, windSpeed);
        const actionPlan = generateDailyActionPlan(rainProb, rainfallMm, tempMax, windSpeed);

        return {
          day: idx === 0 ? 'Today' : dayName,
          date: dateFormatted,
          tempC: tempMax,
          tempMinC: tempMin,
          rainProb,
          rainfallMm,
          condition: codeInfo.condition,
          conditionSw: codeInfo.conditionSw,
          icon: codeInfo.icon,
          humidityPercent: humidity,
          windSpeedKmh: windSpeed,
          whatIsHappening,
          actionPlan,
        };
      });

      const weeklyOutlook = generateWeeklyOutlook(dailyForecasts, county);
      const currentCode = current.weather_code ?? 1;
      const currentInfo = WMO_CODE_INFO[currentCode] || WMO_CODE_INFO[1];

      return {
        county,
        temperatureC: Math.round(current.temperature_2m ?? coords.defaultTemp),
        humidityPercent: Math.round(current.relative_humidity_2m ?? 65),
        rainProbabilityPercent: Math.round(daily.precipitation_probability_max?.[0] ?? coords.defaultRainProb),
        rainfallTodayMm: Math.round((daily.precipitation_sum?.[0] ?? 0) * 10) / 10,
        condition: currentInfo.condition,
        windSpeedKmh: Math.round(current.wind_speed_10m ?? 12),
        forecast: dailyForecasts.slice(0, 5).map((d) => ({
          day: d.day,
          tempC: d.tempC,
          rainProb: d.rainProb,
          condition: d.condition,
        })),
        dailyForecasts,
        weeklyOutlook,
        isDemo: false,
        dataSource: 'Live Kenya Agro-Meteorology (Open-Meteo Satellite Feed)',
      };
    }
  } catch (err) {
    // Fall back to calibrated baseline if network timeout or offline
  }

  // Robust Calibrated Regional 7-Day Baseline
  const daysOfWeekEn = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  const fallbackForecasts: DailyAgroForecast[] = daysOfWeekEn.map((dayName, idx) => {
    const d = new Date(now.getTime() + idx * 86400000);
    const dateFormatted = `${monthNames[d.getMonth()]} ${d.getDate()}`;

    // Vary temperature and rainfall realistically
    const tempMax = coords.defaultTemp + (idx % 2 === 0 ? 1 : -1);
    const tempMin = tempMax - 6;
    const rainProb = Math.max(10, Math.min(90, coords.defaultRainProb + ((idx * 7) % 25) - 10));
    const rainfallMm = rainProb > 50 ? Math.round(coords.defaultRainfallMm * (1 + (idx % 3) * 0.4)) : Math.round(coords.defaultRainfallMm * 0.2);
    const windSpeed = 12 + (idx % 4) * 2;
    const humidity = rainProb > 50 ? 76 : 58;

    const icon = rainProb > 60 ? '🌧️' : rainProb > 35 ? '⛅' : '☀️';
    const condition = rainProb > 60 ? 'Scattered afternoon showers' : rainProb > 35 ? 'Partly cloudy' : 'Mainly sunny';
    const conditionSw = rainProb > 60 ? 'Mvua ya alasiri' : rainProb > 35 ? 'Mawingu kiasi' : 'Jua kali';

    const whatIsHappening = generateWhatIsHappening(rainProb, rainfallMm, tempMax, windSpeed);
    const actionPlan = generateDailyActionPlan(rainProb, rainfallMm, tempMax, windSpeed);

    return {
      day: dayName,
      date: dateFormatted,
      tempC: tempMax,
      tempMinC: tempMin,
      rainProb,
      rainfallMm,
      condition,
      conditionSw,
      icon,
      humidityPercent: humidity,
      windSpeedKmh: windSpeed,
      whatIsHappening,
      actionPlan,
    };
  });

  const fallbackWeekly = generateWeeklyOutlook(fallbackForecasts, county);

  return {
    county,
    temperatureC: coords.defaultTemp,
    humidityPercent: 68,
    rainProbabilityPercent: coords.defaultRainProb,
    rainfallTodayMm: coords.defaultRainfallMm,
    condition: coords.defaultRainProb > 50 ? 'Scattered afternoon showers' : 'Partly sunny with light breeze',
    windSpeedKmh: 14,
    forecast: fallbackForecasts.slice(0, 5).map((d) => ({
      day: d.day,
      tempC: d.tempC,
      rainProb: d.rainProb,
      condition: d.condition,
    })),
    dailyForecasts: fallbackForecasts,
    weeklyOutlook: fallbackWeekly,
    isDemo: true,
    dataSource: 'Demo Weather Mode (Calibrated Kenya Agro-Ecological Baseline)',
  };
}
