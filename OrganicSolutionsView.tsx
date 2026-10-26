import React, { useState } from 'react';
import {
  Recycle,
  Sprout,
  Sparkles,
  Droplets,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  ArrowRight,
  Layers,
  Calculator,
  Info,
  Calendar,
  DollarSign,
  Leaf,
  ChevronDown,
  ChevronUp,
  Clock,
  FlaskConical,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { VoiceInputButton } from './VoiceInputButton.tsx';

interface FarmWasteItem {
  id: string;
  nameEn: string;
  nameSw: string;
  icon: string;
  category: 'crop_residue' | 'animal' | 'kitchen_mineral';
}

const COMMON_FARM_WASTES: FarmWasteItem[] = [
  { id: 'maize_stalks', nameEn: 'Maize Stalks & Cobs', nameSw: 'Mashina na Masuke ya Mahindi', icon: '🌽', category: 'crop_residue' },
  { id: 'cow_dung', nameEn: 'Cow Dung & Slurry', nameSw: 'Samadi ya Ng\'ombe & Mkojo', icon: '🐄', category: 'animal' },
  { id: 'poultry_manure', nameEn: 'Chicken Droppings', nameSw: 'Kinyesi cha Kuku', icon: '🐔', category: 'animal' },
  { id: 'banana_stems', nameEn: 'Banana Stems & Peels', nameSw: 'Migomba na Maganda ya Ndizi', icon: '🍌', category: 'crop_residue' },
  { id: 'tithonia', nameEn: 'Tithonia / Wild Sunflower', nameSw: 'Majani ya Tithonia (Ihuruta)', icon: '🌻', category: 'crop_residue' },
  { id: 'coffee_husks', nameEn: 'Coffee Pulp & Husks', nameSw: 'Maganda ya Kahawa', icon: '☕', category: 'crop_residue' },
  { id: 'wood_ash', nameEn: 'Wood Ash & Charcoal Dust', nameSw: 'Majivu ya Kuni & Vumbi la Makaa', icon: '🪵', category: 'kitchen_mineral' },
  { id: 'eggshells', nameEn: 'Eggshells & Animal Bones', nameSw: 'Maganda ya Mayai na Mifupa', icon: '🥚', category: 'kitchen_mineral' },
  { id: 'vegetable_waste', nameEn: 'Rotten Cabbages & Weeds', nameSw: 'Mabaki ya Mboga & Magugu', icon: '🥬', category: 'crop_residue' },
];

export const OrganicSolutionsView: React.FC = () => {
  const { language } = useApp();
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'waste_converter' | 'solid_fertilizer' | 'liquid_fertilizer' | 'pest_controls'>('waste_converter');
  const [selectedWastes, setSelectedWastes] = useState<string[]>(['maize_stalks', 'cow_dung']);
  const [farmAcres, setFarmAcres] = useState<number>(1);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>('berkeley_compost');

  // Toggle waste selection
  const toggleWaste = (wasteId: string) => {
    setSelectedWastes((prev) =>
      prev.includes(wasteId) ? prev.filter((id) => id !== wasteId) : [...prev, wasteId]
    );
  };

  // Read aloud helper
  const handleReadAloud = (textEn: string, textSw: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(language === 'sw' ? textSw : textEn, language);
    }
  };

  // Estimate savings
  const bagsSaved = Math.round(farmAcres * 3);
  const moneySavedKes = bagsSaved * 5500; // Average commercial fertilizer bag (KSh 5,500)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. HERO BANNER */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1B5E20]/85 via-[#2E7D32]/85 to-[#15532E]/85 backdrop-blur-xl border border-white/25 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold border border-white/20">
              <Recycle className="w-4 h-4 text-emerald-300 animate-spin-slow" />
              <span>{language === 'sw' ? 'Uchumi wa Mzunguko Shambani' : 'Circular Farm Bio-Economy'}</span>
            </div>

            <button
              type="button"
              onClick={() =>
                handleReadAloud(
                  'Learn how to recycle your farm waste into valuable organic fertilizer, liquid foliar tea, and natural pest repellents, saving thousands of shillings on commercial chemicals.',
                  'Jifunze jinsi ya kutumia taka za shambani kama mashina ya mahindi, kinyesi cha wanyama, na majivu kutengeneza mbolea ya asili yenye virutubisho vingi, ukiokoa maelfu ya pesa.'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4" />}
              <span>{language === 'sw' ? 'Sikiliza Mwongozo' : 'Listen Guide'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {language === 'sw'
                  ? 'Kugeuza Taka za Shamba Kuwa Mbolea Asilia'
                  : 'Recycling Farm Waste into Bio-Fertilizer'}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed mt-2 font-medium">
                {language === 'sw'
                  ? 'Usiwahi kuchoma mashina ya mahindi au kuacha samadi ikaushwe na jua! Jifunze mbinu zilizothibitishwa za kutengeneza mbolea bora ya mimea (Compost, Biochar, na Mbolea ya Maji ya Tithonia) bure kabisa.'
                  : 'Stop burning maize stalks or leaving livestock manure uncovered to lose valuable nitrogen! Convert farm residues into nutrient-dense compost, biochar, and foliar bio-fertilizers at near-zero cost.'}
              </p>
            </div>

            {/* Savings Badge */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-center shrink-0">
              <span className="text-[10px] text-emerald-200 uppercase font-extrabold block">
                {language === 'sw' ? 'Makadirio ya Kuokoa' : 'Est. Savings / Acre'}
              </span>
              <span className="text-2xl font-black text-yellow-300">
                KSh {moneySavedKes.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-100 block">
                {language === 'sw' ? `(Mifuko ${bagsSaved} ya mbolea)` : `(${bagsSaved} commercial bags)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {[
          { id: 'waste_converter', icon: '♻️', labelSw: 'Mchambuzi wa Taka Zako', labelEn: 'My Farm Waste Matcher' },
          { id: 'solid_fertilizer', icon: '🍂', labelSw: 'Mbolea za Kijani & Compost', labelEn: 'Compost & Biochar' },
          { id: 'liquid_fertilizer', icon: '💧', labelSw: 'Mbolea ya Maji (Foliar Teas)', labelEn: 'Liquid Foliar Teas' },
          { id: 'pest_controls', icon: '🛡️', labelSw: 'Dawa Asilia za Wadudu', labelEn: 'Organic Botanical Sprays' },
        ].map((tab) => {
          const isCur = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isCur
                  ? 'bg-[#15532E] text-white shadow-md'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{language === 'sw' ? tab.labelSw : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: INTERACTIVE FARM WASTE TO VALUE CONVERTER */}
      {activeTab === 'waste_converter' && (
        <div className="space-y-6">
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/50 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'sw' ? 'Hatua ya 1: Chagua Taka Zilizopo Shambani' : 'Step 1: Select Your Available Waste'}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {language === 'sw'
                    ? 'Una Taka Gani Shambani Kwako Hivi Sasa?'
                    : 'What Farm Waste Do You Have Right Now?'}
                </h3>
              </div>

              {/* Voice-to-Text Input Button */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  {language === 'sw' ? 'Ongea taka uliyo nayo:' : 'Speak your waste:'}
                </span>
                <VoiceInputButton
                  lang={language}
                  size="sm"
                  label={language === 'sw' ? 'Sema Taka' : 'Speak Waste'}
                  onTranscript={(text) => {
                    const lower = text.toLowerCase();
                    const matched: string[] = [];
                    if (lower.includes('mahindi') || lower.includes('stalk') || lower.includes('cob')) matched.push('maize_stalks');
                    if (lower.includes('ng\'ombe') || lower.includes('cow') || lower.includes('dung') || lower.includes('samadi')) matched.push('cow_dung');
                    if (lower.includes('kuku') || lower.includes('chicken') || lower.includes('poultry')) matched.push('poultry_manure');
                    if (lower.includes('ndizi') || lower.includes('banana')) matched.push('banana_stems');
                    if (lower.includes('tithonia') || lower.includes('ihuruta') || lower.includes('maruru')) matched.push('tithonia');
                    if (lower.includes('jivu') || lower.includes('ash') || lower.includes('makaa')) matched.push('wood_ash');
                    if (lower.includes('yai') || lower.includes('egg') || lower.includes('mifupa')) matched.push('eggshells');

                    if (matched.length > 0) {
                      setSelectedWastes((prev) => Array.from(new Set([...prev, ...matched])));
                    }
                  }}
                />
              </div>
            </div>

            {/* Waste Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COMMON_FARM_WASTES.map((item) => {
                const isSelected = selectedWastes.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleWaste(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-2 border-emerald-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <span className={`text-xs font-black block truncate ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                        {language === 'sw' ? item.nameSw : item.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {item.category === 'crop_residue'
                          ? language === 'sw' ? 'Mabaki ya Mazao' : 'Crop Residue'
                          : item.category === 'animal'
                          ? language === 'sw' ? 'Mbolea ya Mifugo' : 'Animal Manure'
                          : language === 'sw' ? 'Madini ya Shambani' : 'Mineral Waste'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Matched Recipes Banner */}
            <div className="bg-emerald-950 text-white rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-black text-sm sm:text-base text-white">
                    {language === 'sw'
                      ? `Mapendekezo ya Mbolea Kulingana na Taka Zako (${selectedWastes.length} zilizochaguliwa)`
                      : `Recommended Value-Add Conversions (${selectedWastes.length} materials selected)`}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-emerald-200 font-bold">
                    {language === 'sw' ? 'Ukubwa wa Shamba:' : 'Farm Size:'}
                  </label>
                  <select
                    value={farmAcres}
                    onChange={(e) => setFarmAcres(Number(e.target.value))}
                    className="bg-emerald-900 border border-emerald-700 text-xs font-bold text-white rounded-xl px-2.5 py-1 focus:outline-none"
                  >
                    <option value={0.5}>0.5 Acre</option>
                    <option value={1}>1.0 Acre</option>
                    <option value={2}>2.0 Acres</option>
                    <option value={3}>3.0 Acres</option>
                    <option value={5}>5.0 Acres</option>
                  </select>
                </div>
              </div>

              {/* Matched solution cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. Quick Hot Compost */}
                <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-200 flex items-center gap-1.5">
                      <span>🍂</span>
                      <span>{language === 'sw' ? 'Mbolea ya Haraka ya Siku 18 (Hot Compost)' : 'Berkeley 18-Day Quick Compost'}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-700/70 text-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      N-P-K + Humus
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    {language === 'sw'
                      ? 'Changanya mashina ya mahindi yaliyokatwakatwa (Kaboni) na kinyesi cha wanyama pamoja na majani mabichi. Geuza kila siku 2 ili joto lifikie 60°C na kuua mbegu za magugu.'
                      : 'Combine shredded maize stalks (carbon) with fresh manure and green weeds. Turn every 2 days to maintain 60°C heat that eliminates pathogens and weed seeds.'}
                  </p>
                  <div className="text-[11px] font-bold text-yellow-300">
                    {language === 'sw'
                      ? `Makadirio ya Zao: Kilo ${farmAcres * 650} za mbolea safi nyeusi`
                      : `Yield Estimate: ${farmAcres * 650} kg of rich black compost`}
                  </div>
                </div>

                {/* 2. Liquid Tithonia Super Tea */}
                <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-200 flex items-center gap-1.5">
                      <span>💧</span>
                      <span>{language === 'sw' ? 'Mbolea ya Maji ya Tithonia (Liquid Gold)' : 'Tithonia N-P-K Liquid Booster'}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-700/70 text-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      3.5% N • 4.0% K
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    {language === 'sw'
                      ? 'Majani ya Tithonia (Maua ya porini ya njano) yana nitrojeni na potasiamu ya juu kuliko mbolea za dukani. Loweka kwenye pipa la lita 100 kwa siku 14 na unyunyize kwenye majani.'
                      : 'Tithonia leaves boast higher natural nitrogen and potassium than commercial foliar feeds. Ferment in a 100L water drum for 14 days, dilute 1:5, and spray on leaves.'}
                  </p>
                  <div className="text-[11px] font-bold text-yellow-300">
                    {language === 'sw'
                      ? 'Gharama: KSh 0 (Bure) • Huzuia unyaufu na kuongeza ukubwa wa matunda'
                      : 'Cost: KSh 0 (Free) • Prevents wilting and boosts fruit sizing'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOLID ORGANIC COMPOST & BIOCHAR RECIPES */}
      {activeTab === 'solid_fertilizer' && (
        <div className="space-y-4">
          {/* Recipe 1: Berkeley 18-Day Quick Hot Compost */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍂</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {language === 'sw' ? 'Mbolea ya Haraka ya Siku 18 (Berkeley Hot Compost)' : 'Berkeley 18-Day Rapid Hot Compost'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'sw' ? 'Muda: Siku 18 tu' : 'Duration: Exactly 18 days'}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{language === 'sw' ? 'Haina harufu mbaya' : 'Odorless & Pest-Free'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleReadAloud(
                    'Berkeley 18-Day compost requires 3 parts brown dry materials like maize stalks, 2 parts green materials like weeds and vegetable peelings, and 1 part animal manure. Build a 1-meter high pile, let it rest for 4 days, then turn every 2 days on day 6, 8, 10, 12, and 14. By day 18, it is ready black compost.',
                    'Mbolea ya Berkeley ya siku 18 inahitaji sehemu 3 za vitu vikavu kama mashina ya mahindi, sehemu 2 za majani mabichi, na sehemu 1 ya samadi ya mifugo. Weka tabaka hadi mita 1 kwenda juu. Iache siku 4, kisha geuza kila baada ya siku mbili siku ya 6, 8, 10, 12 na 14. Siku ya 18 mbolea inakuwa tayari kabisa.'
                  )
                }
                className="bg-emerald-50 hover:bg-emerald-100 text-[#15532E] font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>{language === 'sw' ? 'Sikiliza Hatua' : 'Listen Steps'}</span>
              </button>
            </div>

            {/* Ratio Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <span className="text-xs font-black text-amber-900 block mb-1">
                  1. {language === 'sw' ? 'Vitu vya Kahawia (Kaboni) - 50%' : 'Brown Materials (Carbon) - 50%'}
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  {language === 'sw'
                    ? 'Mashina ya mahindi yaliyokatwakatwa, majani makavu ya migomba, pumba za mpunga, nyasi kavu.'
                    : 'Chopped dry maize stalks, dried banana leaves, straw, coffee husks, sawdust.'}
                </p>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                <span className="text-xs font-black text-emerald-900 block mb-1">
                  2. {language === 'sw' ? 'Vitu vya Kijani (Nitrojeni) - 30%' : 'Green Materials (Nitrogen) - 30%'}
                </span>
                <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                  {language === 'sw'
                    ? 'Magugu mabichi, majani ya Tithonia, mabaki ya kabichi, maganda ya maharagwe.'
                    : 'Fresh green weeds, tithonia cuttings, kitchen vegetable peelings, green legume tops.'}
                </p>
              </div>

              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
                <span className="text-xs font-black text-blue-900 block mb-1">
                  3. {language === 'sw' ? 'Kianzilishi cha Bakteria - 20%' : 'Microbial Activator - 20%'}
                </span>
                <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                  {language === 'sw'
                    ? 'Samadi safi ya ng\'ombe au kuku, au udongo wenye rutuba ya msituni, pamoja na maji kidogo.'
                    : 'Fresh cattle or poultry manure, fertile forest topsoil, and moistening water.'}
                </p>
              </div>
            </div>

            {/* Turning Schedule Steps */}
            <div className="space-y-2 pt-2">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                {language === 'sw' ? 'Ratiba Kamili ya Kugeuza (Turning Schedule):' : 'Day-by-Day Turning Schedule:'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-800">Siku 1 - 4</div>
                  <div className="text-[10px] text-slate-500 mt-1">Usiiguse; joto linaongezeka hadi 60°C</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-emerald-900">Siku ya 6</div>
                  <div className="text-[10px] text-emerald-800 mt-1">Geuza ya nje iwe ndani</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-emerald-900">Siku ya 8</div>
                  <div className="text-[10px] text-emerald-800 mt-1">Geuza mara ya pili & ongeza maji</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-emerald-900">Siku ya 10</div>
                  <div className="text-[10px] text-emerald-800 mt-1">Geuza tena; joto linaanza kushuka</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-emerald-900">Siku ya 14</div>
                  <div className="text-[10px] text-emerald-800 mt-1">Geuza mara ya mwisho</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300">
                  <div className="font-black text-amber-950">Siku ya 18</div>
                  <div className="text-[10px] text-amber-900 font-bold mt-1">MBOLEA TAYARI KUTUMIA!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe 2: Enriched Livestock Manure Curing */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-3xl">🐄</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {language === 'sw' ? 'Kuboresha Samadi ya Ng\'ombe & Kuku (Enriched Manure Curing)' : 'Enriched Cattle & Poultry Manure Curing'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'sw'
                    ? 'Kuzuia nitrojeni kupotea hewani na kuongeza potasiamu kwa kutumia majivu ya kuni'
                    : 'Prevent 60% nitrogen ammonia loss and boost potassium with wood ash layering'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 text-rose-950">
                <span className="font-black block mb-1 text-rose-900">
                  ❌ {language === 'sw' ? 'Kosa Kubwa la Wakulima:' : 'Common Farmer Mistake:'}
                </span>
                <span>
                  {language === 'sw'
                    ? 'Kuacha rundo la samadi juani bila kufunika. Jua na hewa huvukiza nitrojeni yote kama gesi ya amonia (harufu kali), na mvua huosha virutubisho vyote.'
                    : 'Leaving manure in open outdoor heaps. Ultraviolet sunlight volatilizes active nitrogen as smelly ammonia gas, while rains leach water-soluble phosphorus.'}
                </span>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-emerald-950">
                <span className="font-black block mb-1 text-emerald-900">
                  ✅ {language === 'sw' ? 'Njia Sahihi ya Kuhifadhi:' : 'The Enriched Covering Method:'}
                </span>
                <span>
                  {language === 'sw'
                    ? 'Weka tabaka la samadi ya sentimita 30, nyunyizia kiganja cha majivu ya kuni (potasiamu), funika kwa turubai jeusi lisiingize hewa wala mvua kwa siku 30-45.'
                    : 'Stack manure in 30cm layers, dust with wood ash for potassium buffering, and cover tightly with an airtight black UV tarpaulin for 30–45 days.'}
                </span>
              </div>
            </div>
          </div>

          {/* Recipe 3: Biochar from Maize Cobs */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-3xl">🪵</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {language === 'sw' ? 'Makaa ya Mazao (Biochar) Kutoka Masuke ya Mahindi' : 'Maize Cob & Stalk Biochar (Permanent Carbon Sponge)'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'sw'
                    ? 'Hushikilia maji kwa 300% na hubaki ardhini kwa miaka 50 kuboresha udongo'
                    : 'Holds 300% more water and remains in the soil for decades preventing nutrient runoff'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {language === 'sw'
                ? 'Choma masuke ya mahindi na mashina makavu ndani ya shimo lenye oksijeni ndogo (pit kiln). Yakianza kuwa makaa meusi, zima moto kwa maji au mkojo wa ng\'ombe (ili kuweka nitrojeni). Changanya makaa hayo na mbolea ya samadi kabla ya kupanda.'
                : 'Smolder maize cobs in a low-oxygen trench. When they turn into crumbly black charcoal without turning to grey ash, quench with water or diluted cattle slurry. Mix the charged biochar directly with compost into planting holes.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: LIQUID FOLIAR TEAS & MICROBE FERMENTS */}
      {activeTab === 'liquid_fertilizer' && (
        <div className="space-y-4">
          {/* Liquid Tea 1: Tithonia & Comfrey N-P-K Super Foliar */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌻</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {language === 'sw' ? 'Mbolea ya Maji ya Tithonia (Green Gold Foliar Tea)' : 'Tithonia & Comfrey Foliar N-P-K Tea'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'sw' ? 'Inafaa sana kwa Nyanya, Mboga za Majani, Vitunguu na Mahindi' : 'Ideal for Tomatoes, Kales, Onions, and Maize'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleReadAloud(
                    'To make Tithonia liquid fertilizer: Chop 15 kilograms of green Tithonia leaves into a 100-liter plastic drum. Fill with clean water, cover loosely, and stir daily for 14 days. Filter through a cloth, dilute one part tea with five parts clean water, and spray on crop foliage every 10 days.',
                    'Kutengeneza mbolea ya maji ya Tithonia: Kata kilo 15 za majani mabichi ya Tithonia kwenye pipa la lita 100. Jaza maji safi, funika na koroga kila siku kwa siku 14. Chuja kwa kitambaa, changanya lita 1 ya mbolea na lita 5 za maji safi, kisha nyunyiza kwenye majani kila baada ya siku 10.'
                  )
                }
                className="bg-emerald-50 hover:bg-emerald-100 text-[#15532E] font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>{language === 'sw' ? 'Sikiliza Maelezo' : 'Listen Recipe'}</span>
              </button>
            </div>

            <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 text-xs sm:text-sm text-sky-950 space-y-2">
              <span className="font-extrabold text-sky-900 block">
                {language === 'sw' ? 'Kwa Nini Tithonia Ni ya Kipekee?' : 'Why Tithonia (Wild Sunflower) is Unique?'}
              </span>
              <p className="text-xs leading-relaxed font-medium">
                {language === 'sw'
                  ? 'Mti wa Tithonia (maarufu kama Ihuruta au Maruru) una mizizi inayovuta fosforasi na nitrojeni kutoka chini sana ya ardhi. Majani yake yana viwango vya juu vya Nitrojeni (3.5%), Fosforasi (0.4%), na Potasiamu (4.0%), pamoja na madini ya Zinki na Kalsiamu.'
                  : 'Tithonia diversifolia taps deep subsoil nutrients. Its leaf dry matter yields 3.5% Nitrogen, 0.4% Phosphorus, and 4.0% Potassium—readily absorbable by leaf stomata within 30 minutes of foliar spraying!'}
              </p>
            </div>

            {/* Preparation Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="font-black text-slate-800 block mb-1">1. {language === 'sw' ? 'Chuma & Kata' : 'Harvest & Chop'}</span>
                <span className="text-[11px] text-slate-600">Kata majani ya Tithonia kilo 15-20 vipande vidogo ili yaoze haraka.</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="font-black text-slate-800 block mb-1">2. {language === 'sw' ? 'Loweka & Koroga' : 'Steep in Drum'}</span>
                <span className="text-[11px] text-slate-600">Weka ndani ya pipa la lita 100 na maji. Koroga dakika 2 kila asubuhi kwa siku 14.</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="font-black text-slate-800 block mb-1">3. {language === 'sw' ? 'Chuja Vizuri' : 'Filter & Strain'}</span>
                <span className="text-[11px] text-slate-600">Siku ya 14 chuja kioevu kupitia gunia au kitambaa safi ili kisizibe pampu.</span>
              </div>
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-300">
                <span className="font-black text-emerald-950 block mb-1">4. {language === 'sw' ? 'Punguza 1:5 & Nyunyiza' : 'Dilute 1:5 & Spray'}</span>
                <span className="text-[11px] text-emerald-900 font-bold">Lita 1 ya chai + lita 5 za maji. Nyunyiza asubuhi kabla ya jua kali.</span>
              </div>
            </div>
          </div>

          {/* Liquid Tea 2: Eggshell Calcium Acetate */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-3xl">🥚</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {language === 'sw' ? 'Dawa Asilia ya Kalsiamu Kutoka Maganda ya Mayai (Blossom End Rot Cure)' : 'Water-Soluble Calcium (WCA) from Eggshells'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'sw' ? 'Huponya tatizo la nyanya kuwa nyeusi chini kabisa (Blossom End Rot)' : 'Completely cures black rot under developing tomatoes for KSh 0'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {language === 'sw'
                ? 'Kaanga maganda ya mayai kwenye kikaango bila mafuta hadi yawe ya kahawia. Yasage kuwa unga laini. Weka unga huo kwenye siki ya asili (vinegar) kwa uwiano wa 1:10. Mmenyuko utatoa hewa kwa siku 7. Chuja na unyunyize kijiko 1 kwa lita 1 ya maji. Huipa nyanya kalsiamu ya haraka na kuzuia kuoza!'
                : 'Pan-toast clean eggshells until golden brown, then crush finely. Combine 1 part crushed eggshells with 10 parts brown vinegar. Bubbling CO2 will release bioavailable calcium in 7 days. Dilute 1:1000 with water and spray on flowers/fruits to eliminate blossom end rot.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: BOTANICAL PEST & DISEASE CONTROLS */}
      {activeTab === 'pest_controls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Chili & Soap Spray */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🌶️</span>
                <div>
                  <h4 className="font-black text-base text-[#15532E]">
                    {language === 'sw' ? 'Dawa ya Pilipili Kali na Sabuni' : 'Hot Chili & Organic Soap Spray'}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {language === 'sw' ? 'Huuwadudu: Aphids, Thrips, Spider Mites' : 'Targets: Aphids, Thrips, Whiteflies'}
                  </span>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                ~KSh 50
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'sw'
                ? 'Saga pilipili kali vijiko 2, changanya na maji lita 1 na matone 3 ya sabuni ya kipande (bila marashi). Sabuni inashikiza dawa kwenye wadudu na pilipili huunguza ngozi zao. Nyunyiza asubuhi.'
                : 'Grind 2 tablespoons hot bird\'s eye chilies in 1 liter of warm water with 3 drops unscented bar soap. The soap breaks the insect waxy cuticle while capsaicin eliminates sucking pests.'}
            </p>
          </div>

          {/* 2. Neem Botanical Extract */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🌿</span>
                <div>
                  <h4 className="font-black text-base text-[#15532E]">
                    {language === 'sw' ? 'Dawa ya Mwarobaini (Neem Extract)' : 'Neem Leaf Botanical Antifeedant'}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {language === 'sw' ? 'Huuwadudu: Viwavi Jeshi, Minyoo ya Majani' : 'Targets: Fall Armyworm, Leafminers'}
                  </span>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {language === 'sw' ? 'Bure' : 'Free'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'sw'
                ? 'Saga kilo 1 ya majani safi ya mwarobaini kwenye maji lita 5, iache ilale masaa 24 gizani. Chuja na unyunyize kwenye masuke ya mahindi au nyanya. Kiambato cha Azadirachtin huzuia wadudu kula na kuzaana.'
                : 'Crush 1kg fresh neem leaves in 5 liters water. Steep overnight in shade. Strain and spray directly into maize whorls or tomato foliage. Natural Azadirachtin halts insect feeding within 4 hours.'}
            </p>
          </div>

          {/* 3. Wood Ash Mineral Barrier */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🪵</span>
                <div>
                  <h4 className="font-black text-base text-[#15532E]">
                    {language === 'sw' ? 'Kizuizi cha Majivu Safi ya Kuni' : 'Wood Ash Mineral Barrier'}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {language === 'sw' ? 'Huzuia: Viwavi Wakataji (Cutworms), Konokono' : 'Targets: Cutworms, Slugs, Snails'}
                  </span>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {language === 'sw' ? 'Bure' : 'Free'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'sw'
                ? 'Nyunyiza majivu safi ya kuni yaliyopozwa kwenye duara karibu na shina la mche (upana wa 5cm). Ukali na unga wa majivu unakata ngozi ya viwavi wakataji na konokono, huku yakiongeza potasiamu ardhini.'
                : 'Dust cool, dry wood ash in a 5cm ring around seedling bases. The desiccant alkalinity repels cutworms and slugs physically while leaching slow-release potassium into root zones.'}
            </p>
          </div>

          {/* 4. Milk Fungicide Spray */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🥛</span>
                <div>
                  <h4 className="font-black text-base text-[#15532E]">
                    {language === 'sw' ? 'Kinga ya Maziwa ya Unga / Poda (Powdery Mildew)' : 'Diluted Milk Foliar Bio-Fungicide'}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {language === 'sw' ? 'Hutibu: Ukungu mweupe (Powdery Mildew)' : 'Targets: Powdery Mildew, Rust Spores'}
                  </span>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                ~KSh 40
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'sw'
                ? 'Changanya maziwa lita 1 na maji lita 9 (uwiano wa 1:9). Nyunyiza kwenye majani wakati wa jua kali. Protini za maziwa zinapogusana na jua huzalisha antiseptiki ya asili inayoua chembechembe za fangasi.'
                : 'Mix 1 part fresh milk with 9 parts water. Spray in full midday sunshine. Sunlight reacts with milk lactoferrin proteins to produce natural antiseptics that destroy fungal powdery mildew spores without chemicals.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
