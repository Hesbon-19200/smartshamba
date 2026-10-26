export type Language = 'en' | 'sw';

export interface Translations {
  // Brand & General
  brandTitle: string;
  brandSubtitle: string;
  tagline: string;
  engine: string;
  online: string;
  offline: string;
  savedLocally: string;
  lastSavedAt: string;
  offlineBannerTitle: string;
  offlineBannerDesc: string;
  retrySync: string;
  syncSuccess: string;
  installApp: string;
  appInstalled: string;
  demoMode: string;
  loadDemoScenario: string;
  loading: string;
  editProfile: string;
  save: string;
  cancel: string;
  close: string;
  actionRequired: string;
  viewDetails: string;
  back: string;
  next: string;
  step: string;
  of: string;
  currency: string;

  // Accessibility & Inclusivity
  a11yTitle: string;
  a11ySubtitle: string;
  a11yTextSize: string;
  a11yNormal: string;
  a11yLarge: string;
  a11yXLarge: string;
  a11yContrast: string;
  a11yContrastNormal: string;
  a11yContrastHigh: string;
  a11yVoice: string;
  a11yListen: string;
  a11yListening: string;
  a11yStopAudio: string;
  a11yVisionAids: string;
  a11yVoiceDisclaimer: string;

  // Navigation
  navDashboard: string;
  navFarmAnalysis: string;
  navCropDoctor: string;
  navAgronomist: string;
  navHistory: string;
  navMetrics: string;
  navAbout: string;
  navMore: string;

  // Header Titles & Subtitles
  headerDashboardTitle: string;
  headerDashboardSubtitle: string;
  headerAnalysisTitle: string;
  headerAnalysisSubtitle: string;
  headerDoctorTitle: string;
  headerDoctorSubtitle: string;
  headerAgronomistTitle: string;
  headerAgronomistSubtitle: string;
  headerHistoryTitle: string;
  headerHistorySubtitle: string;
  headerMetricsTitle: string;
  headerMetricsSubtitle: string;
  headerAboutTitle: string;
  headerAboutSubtitle: string;

  // Dashboard Metrics
  metricProfit: string;
  metricProfitRoi: string;
  metricHealth: string;
  metricHealthDesc: string;
  metricRisk: string;
  metricRiskDesc: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;

  // Dashboard Sections
  dashCropWizardTitle: string;
  dashAiPredictionTitle: string;
  dashAiPredictionDesc: string;
  dashConfigureInputs: string;
  dashRecentScanTitle: string;
  dashOpenScanner: string;
  dashWeatherTitle: string;
  dashWeatherSubtitle: string;
  dashRainProb: string;
  dashHumidity: string;
  dashWind: string;
  dashMarketTitle: string;
  dashMarketSubtitle: string;
  dashPerUnit: string;
  dashAgronomistCardTitle: string;
  dashExpand: string;
  dashAskPlaceholder: string;
  dashQuickShortcuts: string;
  dashShortcutsAnalysis: string;
  dashShortcutsDoctor: string;
  dashShortcutsHistory: string;
  dashShortcutsDemo: string;

  // Farm Analysis Wizard
  wizardTitle: string;
  wizardSubtitle: string;
  stepLocation: string;
  stepSoilAndSize: string;
  stepCosts: string;
  stepResults: string;
  selectCounty: string;
  subCounty: string;
  wardOrTown: string;
  useGps: string;
  farmSizeAcres: string;
  soilType: string;
  waterSource: string;
  experienceLevel: string;
  availableBudget: string;
  selectCropToAnalyze: string;
  plantingSeason: string;
  seedsCost: string;
  fertilizerCost: string;
  labourCost: string;
  pestProtectionCost: string;
  otherExpenses: string;
  btnRunAnalysis: string;
  calculatingAnalysis: string;
  analysisResultsTitle: string;
  estimatedYield: string;
  projectedRevenue: string;
  totalCost: string;
  netProfit: string;
  breakEvenYield: string;
  whyRecommended: string;
  favorableFactors: string;
  cautionRisks: string;
  formulaExplainer: string;
  btnNewAnalysis: string;
  btnPrintReport: string;

  // Crop Doctor
  doctorTitle: string;
  doctorSubtitle: string;
  doctorPipelineBadge: string;
  doctorUploadPrompt: string;
  doctorUploadSubtext: string;
  doctorSelectSamplePrompt: string;
  doctorBtnScan: string;
  doctorScanning: string;
  doctorCondition: string;
  doctorConfidence: string;
  doctorSeverity: string;
  doctorIndicators: string;
  doctorNextSteps: string;
  doctorPrevention: string;
  doctorDisclaimer: string;
  doctorOfflineCachedNote: string;
  severityLow: string;
  severityModerate: string;
  severitySevere: string;

  // AI Agronomist
  agronomistTitle: string;
  agronomistSubtitle: string;
  agronomistInputPlaceholder: string;
  agronomistSend: string;
  agronomistDisclaimer: string;

  // History & Records
  historyTitle: string;
  historySubtitle: string;
  tabAnalyses: string;
  tabScans: string;
  noAnalysesFound: string;
  noScansFound: string;
  viewAnalysisBtn: string;
  cachedBadge: string;

  // Language names
  langEnglish: string;
  langSwahili: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandTitle: 'MKULIMAAI',
    brandSubtitle: 'Decision Engine',
    tagline: 'Turning agricultural uncertainty into informed decisions',
    engine: 'Engine',
    online: 'Online',
    offline: 'Offline Mode',
    savedLocally: 'Saved locally on device',
    lastSavedAt: 'Last saved',
    offlineBannerTitle: 'Operating Offline',
    offlineBannerDesc: 'You are currently offline. Accessing your last saved farm analysis, crop disease reports, and weather data cached on this device.',
    retrySync: 'Retry Sync',
    syncSuccess: 'Live connection restored! Farm data synchronized.',
    installApp: 'Install App',
    appInstalled: 'Installed',
    demoMode: 'Demo',
    loadDemoScenario: 'Load Kisii Tomato Demo',
    loading: 'Loading...',
    editProfile: 'Edit Farmer Profile',
    save: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    actionRequired: 'Action Required',
    viewDetails: 'View Details',
    back: 'Back',
    next: 'Next',
    step: 'Step',
    of: 'of',
    currency: 'KES',

    a11yTitle: 'Vision & Accessibility',
    a11ySubtitle: 'Adjust display contrast, text sizing, and voice narration for easier reading.',
    a11yTextSize: 'Text Size',
    a11yNormal: 'Regular',
    a11yLarge: 'Large (+15%)',
    a11yXLarge: 'Extra Large (+30%)',
    a11yContrast: 'Display Contrast',
    a11yContrastNormal: 'Standard',
    a11yContrastHigh: 'High Contrast (WCAG AAA)',
    a11yVoice: 'Voice Assistant (Read Aloud)',
    a11yListen: 'Listen to Summary',
    a11yListening: 'Speaking Audio...',
    a11yStopAudio: 'Stop Speaking',
    a11yVisionAids: 'Low-Vision & Senior Friendly',
    a11yVoiceDisclaimer: 'Reads farm intelligence, diagnoses, and weather alerts aloud in clear audio.',

    navDashboard: 'Dashboard',
    navFarmAnalysis: 'Farm Analysis',
    navCropDoctor: 'Crop Doctor',
    navAgronomist: 'AI Agronomist',
    navHistory: 'Farm Records',
    navMetrics: 'ML Benchmarks',
    navAbout: 'Pitch & Impact',
    navMore: 'More Tools',

    headerDashboardTitle: 'Farmer Dashboard',
    headerDashboardSubtitle: 'Welcome back. Here is your farm summary for today.',
    headerAnalysisTitle: 'Farm Decision Engine',
    headerAnalysisSubtitle: 'Predict crop yield, profitability, and climate risks with mathematical explainability.',
    headerDoctorTitle: 'Crop Doctor Diagnostics',
    headerDoctorSubtitle: 'Multimodal computer vision for early crop leaf pathology and cultural remediation.',
    headerAgronomistTitle: 'AI Agronomist Chat',
    headerAgronomistSubtitle: 'Context-aware agronomy guidance calibrated for your county agro-ecology.',
    headerHistoryTitle: 'Farm Records & History',
    headerHistorySubtitle: 'Multi-season farm analyses, historical scans, and economic projections.',
    headerMetricsTitle: 'Machine Learning Insights',
    headerMetricsSubtitle: 'Benchmarking regression models (RandomForest vs GBR) and KALRO calibration data.',
    headerAboutTitle: 'Hackathon Pitch Deck',
    headerAboutSubtitle: 'MkulimaAI mission: Turning agricultural uncertainty into informed decisions.',

    metricProfit: 'Est. Potential Profit',
    metricProfitRoi: 'ROI',
    metricHealth: 'Farm Health Index',
    metricHealthDesc: 'Optimal Volcanic Soil & Water',
    metricRisk: 'Current Risk Level',
    metricRiskDesc: 'Blight season watch',
    riskLow: 'Low Risk',
    riskMedium: 'Medium Risk',
    riskHigh: 'High Risk',

    dashCropWizardTitle: 'Crop Analysis Wizard',
    dashAiPredictionTitle: 'AI Prediction Insight',
    dashAiPredictionDesc: 'Favorable ROI this season due to current wholesale market demand and rainfall forecast.',
    dashConfigureInputs: 'Configure Inputs',
    dashRecentScanTitle: 'Recent Crop Doctor Scan',
    dashOpenScanner: 'Open Scanner →',
    dashWeatherTitle: 'Weather Intelligence',
    dashWeatherSubtitle: 'County Agro-Meteo',
    dashRainProb: 'Rain Prob',
    dashHumidity: 'Humidity',
    dashWind: 'Wind Speed',
    dashMarketTitle: 'Wholesale Commodity Desk',
    dashMarketSubtitle: 'National Wholesale Hubs',
    dashPerUnit: 'KES / Unit',
    dashAgronomistCardTitle: 'AI Agronomist Chat',
    dashExpand: 'Expand',
    dashAskPlaceholder: 'Ask about your farm...',
    dashQuickShortcuts: 'Quick Shortcuts',
    dashShortcutsAnalysis: 'Run financial model',
    dashShortcutsDoctor: 'Scan diseased leaf',
    dashShortcutsHistory: 'Seasonal records',
    dashShortcutsDemo: 'Kisii 2-acre tomato',

    wizardTitle: 'Farm Profit & Risk Analysis',
    wizardSubtitle: 'Evaluating agro-ecological parameters and market pricing across 47 Kenyan counties',
    stepLocation: 'Location & Geography',
    stepSoilAndSize: 'Soil & Farm Size',
    stepCosts: 'Production Budget',
    stepResults: 'Decision Analysis',
    selectCounty: 'County',
    subCounty: 'Sub-County',
    wardOrTown: 'Town / Ward',
    useGps: 'Use GPS coordinates',
    farmSizeAcres: 'Farm Size (Acres)',
    soilType: 'Soil Type',
    waterSource: 'Water Availability',
    experienceLevel: 'Farming Experience',
    availableBudget: 'Available Working Budget (KES)',
    selectCropToAnalyze: 'Select Crop to Analyze',
    plantingSeason: 'Planting Season',
    seedsCost: 'Seeds / Seedlings (KES)',
    fertilizerCost: 'Fertilizer & Lime (KES)',
    labourCost: 'Field Labour (KES)',
    pestProtectionCost: 'Crop Protection & Spray (KES)',
    otherExpenses: 'Other Operational Costs (KES)',
    btnRunAnalysis: 'Calculate Farm Economics',
    calculatingAnalysis: 'Running Decision Engine...',
    analysisResultsTitle: 'Farm Economic & Risk Decision Plan',
    estimatedYield: 'Estimated Total Yield',
    projectedRevenue: 'Gross Revenue',
    totalCost: 'Total Investment',
    netProfit: 'Estimated Net Profit',
    breakEvenYield: 'Break-even Yield',
    whyRecommended: 'Why this recommendation?',
    favorableFactors: 'Key Favorable Factors',
    cautionRisks: 'Ecological & Market Risks',
    formulaExplainer: 'Mathematical Formulas & Calibration',
    btnNewAnalysis: 'New Farm Analysis',
    btnPrintReport: 'Print / Save PDF',

    doctorTitle: 'Crop Doctor Diagnostics',
    doctorSubtitle: 'Early detection of foliar blight, rusts, and nutrient stress with non-chemical remediation.',
    doctorPipelineBadge: 'Multimodal Vision • 16 Classes',
    doctorUploadPrompt: 'Take a photo or upload leaf image',
    doctorUploadSubtext: 'JPG, PNG up to 10MB (optimized client-side for rapid transmission)',
    doctorSelectSamplePrompt: 'Or test with a sample diseased leaf:',
    doctorBtnScan: 'Run Diagnostic Scan',
    doctorScanning: 'Analyzing leaf pathology...',
    doctorCondition: 'Suspected Condition',
    doctorConfidence: 'AI Diagnostic Confidence',
    doctorSeverity: 'Pathology Severity',
    doctorIndicators: 'Observed Indicators & Symptoms',
    doctorNextSteps: 'Recommended Remediation Steps',
    doctorPrevention: 'Preventative Cultural Practices',
    doctorDisclaimer: 'Diagnostic predictions are AI-assisted estimates calibrated against KALRO guidelines. Consult local extension officers for severe infestations.',
    doctorOfflineCachedNote: 'Offline Mode: You are viewing cached diagnostic reports. All remediation steps and cultural protocols are stored locally on your device.',
    severityLow: 'Mild',
    severityModerate: 'Moderate',
    severitySevere: 'Severe',

    agronomistTitle: 'AI Agronomist Support',
    agronomistSubtitle: 'Ask real-time questions regarding crop health, seed varieties, spraying schedules, and weather resilience.',
    agronomistInputPlaceholder: 'Ask a question in English or Kiswahili...',
    agronomistSend: 'Send',
    agronomistDisclaimer: 'AI advice is calibrated for Kenyan agro-ecological zones. Always confirm chemical dosage on official product labels.',

    historyTitle: 'Farm Decision & Diagnostic History',
    historySubtitle: 'Track multi-season farm evaluations, historical disease scans, and economic projections.',
    tabAnalyses: 'Farm Analyses',
    tabScans: 'Crop Scans',
    noAnalysesFound: 'No farm analyses recorded yet. Use the Farm Analysis Wizard to generate one!',
    noScansFound: 'No crop disease scans recorded yet. Use Crop Doctor to diagnose a leaf!',
    viewAnalysisBtn: 'View Full Analysis →',
    cachedBadge: 'Cached Locally',

    langEnglish: 'English',
    langSwahili: 'Kiswahili',
  },
  sw: {
    brandTitle: 'MKULIMAAI',
    brandSubtitle: 'Mfumo wa Maamuzi',
    tagline: 'Kugeuza mashaka ya kilimo kuwa maamuzi thabiti ya uzalishaji',
    engine: 'Mfumo',
    online: 'Mtandaoni',
    offline: 'Hali ya Nje ya Mtandao',
    savedLocally: 'Imehifadhiwa kwenye kifaa',
    lastSavedAt: 'Ilihifadhiwa mwisho',
    offlineBannerTitle: 'Unatumia Nje ya Mtandao',
    offlineBannerDesc: 'Haujaunganishwa kwenye mtandao. Unaweza kufikia tathmini ya mwisho ya shamba, ripoti za magonjwa, na taarifa za hali ya hewa zilizohifadhiwa kwenye kifaa hiki.',
    retrySync: 'Jaribu Kuunganisha',
    syncSuccess: 'Muunganisho umerejea! Data ya shamba imesasishwa.',
    installApp: 'Sakinisha Programu',
    appInstalled: 'Imesakinishwa',
    demoMode: 'Mfano',
    loadDemoScenario: 'Pakia Mfano wa Nyanya Kisii',
    loading: 'Inapakia...',
    editProfile: 'Hariri Wasifu wa Mkulima',
    save: 'Hifadhi Mabadiliko',
    cancel: 'Ghairi',
    close: 'Funga',
    actionRequired: 'Hatua Inahitajika',
    viewDetails: 'Angalia Maelezo',
    back: 'Rudi Nyuma',
    next: 'Mbele',
    step: 'Hatua',
    of: 'ya',
    currency: 'KES',

    a11yTitle: 'Uwezo wa Kuona & Urahisi wa Kutumia',
    a11ySubtitle: 'Rekebisha mng\'aro, ukubwa wa maandishi, na usomaji wa sauti ili kusoma vizuri.',
    a11yTextSize: 'Ukubwa wa Maandishi',
    a11yNormal: 'Kawaida',
    a11yLarge: 'Kubwa (+15%)',
    a11yXLarge: 'Kubwa Sana (+30%)',
    a11yContrast: 'Mng\'aro wa Skrini',
    a11yContrastNormal: 'Kawaida',
    a11yContrastHigh: 'Mng\'aro wa Juu (High Contrast)',
    a11yVoice: 'Msaidizi wa Sauti (Soma kwa Sauti)',
    a11yListen: 'Sikiliza Muhtasari',
    a11yListening: 'Inasoma kwa Sauti...',
    a11yStopAudio: 'Simamisha Sauti',
    a11yVisionAids: 'Inafaa Wazee & Wenye Changamoto za Kuona',
    a11yVoiceDisclaimer: 'Inasoma tahadhari za hali ya hewa na ripoti za shamba kwa sauti wazi.',

    navDashboard: 'Dashibodi',
    navFarmAnalysis: 'Tathmini ya Shamba',
    navCropDoctor: 'Daktari wa Mazao',
    navAgronomist: 'Mtaalamu wa AI',
    navHistory: 'Kumbukumbu za Shamba',
    navMetrics: 'Vipimo vya AI',
    navAbout: 'Maono na Athari',
    navMore: 'Zana Zaidi',

    headerDashboardTitle: 'Dashibodi ya Mkulima',
    headerDashboardSubtitle: 'Karibu tena. Hapa kuna muhtasari wa shamba lako kwa leo.',
    headerAnalysisTitle: 'Mfumo wa Maamuzi ya Shamba',
    headerAnalysisSubtitle: 'Kadiria mavuno ya mazao, faida halisi, na hatari za hali ya hewa kwa hesabu wazi.',
    headerDoctorTitle: 'Vipimo vya Daktari wa Mazao',
    headerDoctorSubtitle: 'Uchambuzi wa picha ya jani kwa kutumia AI kutambua magonjwa na mbinu salama za tiba.',
    headerAgronomistTitle: 'Mazungumzo ya Mtaalamu wa Kilimo',
    headerAgronomistSubtitle: 'Ushauri wa kilimo unaozingatia hali ya hewa na mazingira ya kaunti yako.',
    headerHistoryTitle: 'Kumbukumbu na Historia ya Shamba',
    headerHistorySubtitle: 'Tathmini za misimu tofauti, vipimo vya zamani vya magonjwa, na makadirio ya fedha.',
    headerMetricsTitle: 'Vipimo vya Miundo ya AI',
    headerMetricsSubtitle: 'Kulinganisha miundo ya takwimu (RandomForest dhidi ya GBR) na data ya KALRO.',
    headerAboutTitle: 'Uwasilishaji wa MkulimaAI',
    headerAboutSubtitle: 'Lengo la MkulimaAI: Kumuwezesha mkulima mdogo kufanya maamuzi yenye faida.',

    metricProfit: 'Makadirio ya Faida Halisi',
    metricProfitRoi: 'Faida ya Uwekezaji (ROI)',
    metricHealth: 'Kiwango cha Afya ya Shamba',
    metricHealthDesc: 'Udongo mzuri wa volcano na maji ya kutosha',
    metricRisk: 'Kiwango cha Hatari',
    metricRiskDesc: 'Tahadhari ya ugonjwa wa ukungu (blight)',
    riskLow: 'Hatari Ndogo',
    riskMedium: 'Hatari ya Wastani',
    riskHigh: 'Hatari Kubwa',

    dashCropWizardTitle: 'Mchawi wa Tathmini ya Mazao',
    dashAiPredictionTitle: 'Uchambuzi wa Utabiri wa AI',
    dashAiPredictionDesc: 'Faida kubwa inatarajiwa msimu huu kutokana na mahitaji ya soko la jumla na utabiri wa mvua.',
    dashConfigureInputs: 'Weka Taarifa za Shamba',
    dashRecentScanTitle: 'Kipimo cha Karibuni cha Daktari wa Mazao',
    dashOpenScanner: 'Fungua Kipima Magonjwa →',
    dashWeatherTitle: 'Taarifa za Hali ya Hewa',
    dashWeatherSubtitle: 'Hali ya Kilimo Kauntini',
    dashRainProb: 'Uwezekano wa Mvua',
    dashHumidity: 'Unyevu wa Hewa',
    dashWind: 'Kasi ya Upepo',
    dashMarketTitle: 'Soko la Jumla la Mazao',
    dashMarketSubtitle: 'Masoko Makuu ya Kitaifa',
    dashPerUnit: 'KES / Kipimo',
    dashAgronomistCardTitle: 'Mtaalamu wa Kilimo wa AI',
    dashExpand: 'Panua Mazungumzo',
    dashAskPlaceholder: 'Uliza swali kuhusu shamba lako...',
    dashQuickShortcuts: 'Njia za Mkato za Haraka',
    dashShortcutsAnalysis: 'Hesabu faida ya zao',
    dashShortcutsDoctor: 'Chunguza jani lenye ugonjwa',
    dashShortcutsHistory: 'Kumbukumbu za misimu',
    dashShortcutsDemo: 'Shamba la nyanya Kisii (ekari 2)',

    wizardTitle: 'Tathmini ya Faida na Hatari za Shamba',
    wizardSubtitle: 'Kutathmini mazingira ya kilimo na bei za masoko katika kaunti 47 za Kenya',
    stepLocation: 'Eneo na Jiografia',
    stepSoilAndSize: 'Udongo na Ukubwa wa Shamba',
    stepCosts: 'Bajeti ya Uzalishaji',
    stepResults: 'Maamuzi na Matokeo',
    selectCounty: 'Kaunti',
    subCounty: 'Kaunti Ndogo',
    wardOrTown: 'Mji / Kata',
    useGps: 'Tumia eneo la GPS',
    farmSizeAcres: 'Ukubwa wa Shamba (Ekari)',
    soilType: 'Aina ya Udongo',
    waterSource: 'Upatikanaji wa Maji',
    experienceLevel: 'Uzoefu katika Kilimo',
    availableBudget: 'Bajeti Uliyonayo (KES)',
    selectCropToAnalyze: 'Chagua Zao la Kuchambua',
    plantingSeason: 'Msimu wa Kupanda',
    seedsCost: 'Gharama ya Mbegu / Miche (KES)',
    fertilizerCost: 'Mbolea na Chokaa (KES)',
    labourCost: 'Gharama ya Vibarua (KES)',
    pestProtectionCost: 'Dawa za Wadudu na Magonjwa (KES)',
    otherExpenses: 'Gharama Nyinginezo (KES)',
    btnRunAnalysis: 'Kokotoa Hesabu za Shamba',
    calculatingAnalysis: 'Mfumo unakokotoa matokeo...',
    analysisResultsTitle: 'Mpango Kamili wa Kiuchumi na Hatari za Shamba',
    estimatedYield: 'Makadirio ya Jumla ya Mavuno',
    projectedRevenue: 'Mapato ya Mauzo',
    totalCost: 'Jumla ya Gharama',
    netProfit: 'Faida Halisi Inayotarajiwa',
    breakEvenYield: 'Mavuno ya Kurejesha Mtaji',
    whyRecommended: 'Kwa nini zao hili limependekezwa?',
    favorableFactors: 'Mambo Mazuri Yenye Faida',
    cautionRisks: 'Hatari za Mazingira na Masoko',
    formulaExplainer: 'Mifumo ya Hesabu na Uthibitishaji',
    btnNewAnalysis: 'Anza Tathmini Mpya',
    btnPrintReport: 'Chapisha / Hifadhi PDF',

    doctorTitle: 'Vipimo vya Daktari wa Mazao',
    doctorSubtitle: 'Utambuzi wa mapema wa ukungu, kutu ya majani, na upungufu wa virutubisho kwa mbinu salama.',
    doctorPipelineBadge: 'Uchambuzi wa Picha wa AI • Magonjwa 16',
    doctorUploadPrompt: 'Piga picha au pakia picha ya jani',
    doctorUploadSubtext: 'JPG, PNG hadi 10MB (inapunguzwa ukubwa kiotomatiki kwenye simu)',
    doctorSelectSamplePrompt: 'Au jaribu kwa mfano wa jani lenye ugonjwa:',
    doctorBtnScan: 'Anza Uchunguzi wa Jani',
    doctorScanning: 'Inachunguza maradhi ya jani...',
    doctorCondition: 'Ugonjwa Unaoshukiwa',
    doctorConfidence: 'Uhakika wa AI katika Kipimo',
    doctorSeverity: 'Ukali wa Ugonjwa',
    doctorIndicators: 'Dalili Zilizobainika Kwenye Jani',
    doctorNextSteps: 'Hatua Zinazopendekezwa za Haraka',
    doctorPrevention: 'Mbinu za Kuzuia Maradhi Shambani',
    doctorDisclaimer: 'Vipimo hivi ni makadirio ya kusaidiwa na AI kulingana na miongozo ya KALRO. Wasiliana na afisa ugani wa eneo lako kwa maambukizi makubwa.',
    doctorOfflineCachedNote: 'Hali ya Nje ya Mtandao: Unaangalia ripoti zilizohifadhiwa. Miongozo yote ya tiba na ushauri wa kilimo inafanya kazi bila mtandao.',
    severityLow: 'Hali ya Chini',
    severityModerate: 'Hali ya Wastani',
    severitySevere: 'Hali Mbaya / Hatari',

    agronomistTitle: 'Msaada wa Mtaalamu wa Kilimo wa AI',
    agronomistSubtitle: 'Uliza maswali ya kilimo kuhusu afya ya mazao, mbegu bora, ratiba ya kunyunyizia dawa, na kukabili mabadiliko ya tabianchi.',
    agronomistInputPlaceholder: 'Uliza swali kwa Kiswahili au Kiingereza...',
    agronomistSend: 'Tuma',
    agronomistDisclaimer: 'Ushauri wa AI unazingatia maeneo ya kilimo ya Kenya. Thibitisha kila wakati kiasi cha dawa kwenye lebo rasmi.',

    historyTitle: 'Kumbukumbu na Historia ya Shamba',
    historySubtitle: 'Fuatilia tathmini za misimu iliyopita, vipimo vya magonjwa, na makadirio ya kifedha.',
    tabAnalyses: 'Tathmini za Shamba',
    tabScans: 'Vipimo vya Mazao',
    noAnalysesFound: 'Hakuna tathmini zilizorekodiwa bado. Tumia Mchawi wa Shamba kuanza tathmini!',
    noScansFound: 'Hakuna vipimo vya majani vilivyorekodiwa bado. Tumia Daktari wa Mazao kupima jani!',
    viewAnalysisBtn: 'Angalia Tathmini Kamili →',
    cachedBadge: 'Imehifadhiwa Kwenye Kifaa',

    langEnglish: 'English',
    langSwahili: 'Kiswahili',
  },
};
