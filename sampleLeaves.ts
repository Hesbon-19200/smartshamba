import { CropType } from '../types/index.ts';

export interface SampleLeaf {
  id: string;
  crop: CropType;
  title: string;
  conditionName: string;
  previewUrl: string;
  description: string;
}

// Clean inline SVG previews representing typical diseased and healthy leaves for instant demoing
export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-tomato-blight',
    crop: 'Tomatoes',
    title: 'Tomato Leaf with Target Spots',
    conditionName: 'Early Blight (Alternaria solani)',
    description: 'Concentric dark brown rings with chlorotic yellow halo on lower leaf',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231E293B"/><path d="M150 20 C90 60 50 120 150 180 C250 120 210 60 150 20 Z" fill="%234D7C0F"/><circle cx="130" cy="90" r="18" fill="%23713F12"/><circle cx="130" cy="90" r="12" fill="%23451A03"/><circle cx="130" cy="90" r="5" fill="%231E293B"/><circle cx="130" cy="90" r="24" stroke="%23CA8A04" stroke-width="3" fill="none"/><circle cx="170" cy="130" r="14" fill="%23713F12"/><circle cx="170" cy="130" r="19" stroke="%23CA8A04" stroke-width="2.5" fill="none"/><path d="M150 20 L150 180" stroke="%2365A30D" stroke-width="4"/><path d="M150 70 Q110 80 80 90" stroke="%2365A30D" stroke-width="2"/><path d="M150 110 Q190 120 220 130" stroke="%2365A30D" stroke-width="2"/></svg>',
  },
  {
    id: 'sample-maize-rust',
    crop: 'Maize',
    title: 'Maize Leaf with Rust Pustules',
    conditionName: 'Common Rust (Puccinia sorghi)',
    description: 'Cinnamon-brown powdery pustules clustered along leaf blade',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231E293B"/><path d="M40 180 Q150 100 280 40 Q250 140 40 180 Z" fill="%2365A30D"/><ellipse cx="140" cy="120" rx="6" ry="12" fill="%239A3412" transform="rotate(30 140 120)"/><ellipse cx="160" cy="105" rx="5" ry="10" fill="%239A3412" transform="rotate(30 160 105)"/><ellipse cx="180" cy="90" rx="7" ry="14" fill="%237C2D12" transform="rotate(30 180 90)"/><ellipse cx="205" cy="75" rx="5" ry="11" fill="%239A3412" transform="rotate(30 205 75)"/><ellipse cx="120" cy="135" rx="5" ry="9" fill="%239A3412" transform="rotate(30 120 135)"/><path d="M40 180 Q150 110 280 40" stroke="%2384CC16" stroke-width="4"/></svg>',
  },
  {
    id: 'sample-potato-blight',
    crop: 'Potatoes',
    title: 'Potato Leaf with Dark Lesions',
    conditionName: 'Late Blight (Phytophthora infestans)',
    description: 'Water-soaked dark lesions spreading rapidly with light mold underside',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231E293B"/><path d="M150 25 C100 55 65 110 150 175 C235 110 200 55 150 25 Z" fill="%233F6212"/><path d="M85 85 Q110 75 125 105 Q95 130 85 85 Z" fill="%231C1917"/><path d="M175 60 Q215 80 205 120 Q165 110 175 60 Z" fill="%23292524"/><circle cx="195" cy="95" r="16" fill="%231C1917"/><path d="M150 25 L150 175" stroke="%234D7C0F" stroke-width="3"/></svg>',
  },
  {
    id: 'sample-beans-anthracnose',
    crop: 'Beans',
    title: 'Bean Leaf with Vein Browning',
    conditionName: 'Anthracnose (Colletotrichum)',
    description: 'Angular reddish-brown vein lesions on lower leaf surfaces',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231E293B"/><path d="M150 30 C80 70 70 140 150 170 C230 140 220 70 150 30 Z" fill="%2315803D"/><path d="M150 30 L150 170" stroke="%237F1D1D" stroke-width="5"/><path d="M150 70 L105 100" stroke="%23991B1B" stroke-width="3.5"/><path d="M150 110 L195 140" stroke="%23991B1B" stroke-width="3.5"/><circle cx="105" cy="100" r="9" fill="%23450A0A"/><circle cx="195" cy="140" r="8" fill="%23450A0A"/></svg>',
  }
];
