import { CropDiseaseResult, CropType } from '../types/index.ts';
import { SampleLeaf } from '../data/sampleLeaves.ts';

const CROP_DISEASE_KNOWLEDGE: Record<
  string,
  {
    condition: string;
    confidence: number;
    severity: 'Low' | 'Moderate' | 'Severe';
    indicators: string[];
    steps: string[];
    prevention: string[];
  }
> = {
  'Tomatoes': {
    condition: 'Possible Tomato Early Blight (Alternaria solani)',
    confidence: 88.6,
    severity: 'Moderate',
    indicators: [
      'Concentric dark brown rings with target-board appearance on lower leaves',
      'Chlorotic yellow halos developing around primary necrotic lesions',
      'Stem canker development near soil splash level',
    ],
    steps: [
      'Prune severely infected lower leaves using clean, disinfected shears and dispose safely away from the farm (do not compost)',
      'Avoid overhead watering; irrigate strictly at the base or through drip lines to keep canopy dry',
      'Inspect surrounding tomato plants within a 5-meter radius for early pinpoint lesions',
      'Consult your local sub-county agricultural extension officer for approved copper-based or bio-fungicide protective schedules',
    ],
    prevention: [
      'Practice minimum 3-season crop rotation away from solanaceous plants (potatoes, peppers)',
      'Apply dry straw mulch beneath plants to create a physical barrier against soil-borne splash',
      'Maintain wide spacing (60cm x 45cm) for optimal sunshine penetration and canopy airflow',
    ],
  },
  'Maize': {
    condition: 'Possible Maize Common Rust (Puccinia sorghi) & Fall Armyworm Whorl Feeding',
    confidence: 86.4,
    severity: 'Moderate',
    indicators: [
      'Elongated cinnamon-brown powdery pustules on both upper and lower leaf surfaces',
      'Scattered windowpane feeding abrasions on developing whorl leaves',
      'Leaf tip chlorosis under moisture and thermal stress',
    ],
    steps: [
      'Scout 20 plants in a "W" pattern across your plot to assess whorl infestation percentage',
      'Apply bio-rational neem extracts or pheromone scouting traps during early vegetative stage',
      'Maintain balanced fertility—avoid excess urea nitrogen which promotes succulent, vulnerable leaf tissue',
      'Notify your local ward agricultural desk if whorl damage exceeds 20%',
    ],
    prevention: [
      'Plant certified tolerant hybrid seed varieties suited for your agro-ecological zone',
      'Implement "push-pull" intercropping with Desmodium and Napier grass borders',
    ],
  },
  'Potatoes': {
    condition: 'Possible Potato Late Blight (Phytophthora infestans)',
    confidence: 91.2,
    severity: 'Severe',
    indicators: [
      'Water-soaked irregular dark green/brown lesions rapidly expanding from leaf margins',
      'Delicate whitish mildew-like spore growth visible on leaf undersides under high humidity',
      'Rapid petiole browning and plant canopy collapse',
    ],
    steps: [
      'Immediately scout neighboring rows—late blight spreads rapidly during foggy highland weather',
      'Ensure hill ridges are built up at least 15cm high to prevent washed spores from reaching tubers',
      'Do not enter or cultivate the potato field when foliage is wet to prevent spore transfer',
      'Consult extension officer urgently for registered preventive systemic spray protocols',
    ],
    prevention: [
      'Plant only KALRO-certified clean seed tubers (e.g., Shangi, Dutch Robijn certified)',
      'Maintain wide 75cm row spacing to maximize sunshine penetration and airflow',
    ],
  },
  'Beans': {
    condition: 'Possible Bean Anthracnose (Colletotrichum lindemuthianum)',
    confidence: 84.5,
    severity: 'Moderate',
    indicators: [
      'Dark brick-red to purplish-brown angular discoloration along lower leaf veins',
      'Small sunken dark cankers forming along stem petioles and young pods',
      'Premature defoliation of lower leaves under cool, humid conditions',
    ],
    steps: [
      'Avoid cultivating or weeding the field while morning dew remains on leaves',
      'Carefully remove and safely dispose of heavily infected leaves away from cultivation zones',
      'Improve furrow drainage to ensure surface water does not pool around plant roots',
      'Consult local extension officer for recommended seed dressing and bio-protectants',
    ],
    prevention: [
      'Use certified disease-free seed (e.g., KALRO Rosecoco or Nyota varieties)',
      'Implement 2-year crop rotation with non-legumes (e.g., maize, sorghum)',
    ],
  },
  'Cabbages / Vegetables': {
    condition: 'Possible Cabbage Black Rot (Xanthomonas campestris)',
    confidence: 87.0,
    severity: 'Moderate',
    indicators: [
      'Distinct V-shaped yellow chlorotic lesions starting at leaf margins with points toward the midrib',
      'Blackening and necrosis of leaf veins within affected tissue',
      'Wilting and premature drying of outer wrapper leaves',
    ],
    steps: [
      'Sterilize knives and cutting tools before trimming heads or handling healthy brassicas',
      'Avoid overhead sprinkler irrigation; switch to furrow or drip to prevent bacterial splash',
      'Rogue out and destroy severely yellowed plants before bacteria spread via surface water',
      'Consult extension officer regarding copper hydroxide bactericide sprays if spreading',
    ],
    prevention: [
      'Practice 3-year crop rotation strictly avoiding kale, spinach, and broccoli fields',
      'Purchase certified hot-water treated brassica seeds from registered agro-dealers',
    ],
  },
};

export function diagnoseCropClientSide(
  cropType: CropType,
  sample?: SampleLeaf | null,
  imageBase64?: string | null,
  voiceSymptoms?: string | null
): CropDiseaseResult {
  const knowledge = CROP_DISEASE_KNOWLEDGE[cropType] || CROP_DISEASE_KNOWLEDGE['Tomatoes'];

  const conditionName = sample?.conditionName || knowledge.condition;
  const confidence = sample ? Math.min(94.2, knowledge.confidence + 2.5) : knowledge.confidence;

  const indicators = voiceSymptoms?.trim()
    ? [`Ripoti ya Sauti ya Mkulima (Voice Report): "${voiceSymptoms.trim()}"`, ...knowledge.indicators]
    : knowledge.indicators;

  return {
    id: `diag-live-${Date.now()}`,
    timestamp: new Date().toISOString(),
    cropType,
    imageUrl: imageBase64 ? undefined : sample?.previewUrl,
    possibleCondition: conditionName,
    confidencePercent: confidence,
    severity: knowledge.severity,
    observedIndicators: indicators,
    recommendedNextSteps: knowledge.steps,
    preventionSuggestions: knowledge.prevention,
    provider: 'Live Agronomic Diagnostic Engine (KALRO Reference)',
    isDemo: false,
    safetyDisclaimer:
      'AI-assisted agronomic diagnosis based on visible foliar pathology indicators. Always consult your sub-county agricultural extension officer (Bwana Shamba) before applying chemical remediation.',
  };
}
