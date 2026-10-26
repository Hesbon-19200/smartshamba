import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const BRAND_GREEN = '#15532E'; // Forest green from user logo
const TEXT_GREEN = '#134E2C';

// 1. Standalone Emblem SVG (512 x 512, centered leaf emblem)
export const emblemSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!-- Rounded White / Transparent Canvas -->
  <defs>
    <style>
      .circuit-line {
        stroke: #ffffff;
        stroke-width: 7;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .circuit-node {
        fill: ${BRAND_GREEN};
        stroke: #ffffff;
        stroke-width: 5;
      }
    </style>
  </defs>

  <!-- Green Leaf Body -->
  <path
    d="M 256,44
       C 202,106 142,185 142,274
       C 142,364 198,426 256,468
       C 314,426 370,364 370,274
       C 370,185 310,106 256,44 Z"
    fill="${BRAND_GREEN}"
  />

  <!-- Central Trunk Line with notch at bottom -->
  <line x1="256" y1="452" x2="256" y2="132" class="circuit-line" />

  <!-- Central Top Node -->
  <circle cx="256" cy="132" r="9.5" class="circuit-node" />

  <!-- Pair 1: Top Diagonals -->
  <line x1="256" y1="184" x2="222" y2="150" class="circuit-line" />
  <circle cx="222" cy="150" r="8.5" class="circuit-node" />
  <line x1="256" y1="184" x2="290" y2="150" class="circuit-line" />
  <circle cx="290" cy="150" r="8.5" class="circuit-node" />

  <!-- Pair 2: Upper Mid Diagonals -->
  <line x1="256" y1="228" x2="200" y2="172" class="circuit-line" />
  <circle cx="200" cy="172" r="8.5" class="circuit-node" />
  <line x1="256" y1="228" x2="312" y2="172" class="circuit-line" />
  <circle cx="312" cy="172" r="8.5" class="circuit-node" />

  <!-- Pair 3: Middle stepped circuit branches -->
  <!-- Left branch 3 -->
  <path d="M 256,270 L 222,236 L 222,208 L 180,208" class="circuit-line" />
  <circle cx="180" cy="208" r="8.5" class="circuit-node" />
  <!-- Right branch 3 -->
  <path d="M 256,270 L 290,236 L 290,208 L 332,208" class="circuit-line" />
  <circle cx="332" cy="208" r="8.5" class="circuit-node" />

  <!-- Pair 4: Wide Middle branches -->
  <!-- Left branch 4 -->
  <path d="M 256,312 L 230,286 L 230,250 L 168,250" class="circuit-line" />
  <circle cx="168" cy="250" r="8.5" class="circuit-node" />
  <!-- Right branch 4 -->
  <path d="M 256,312 L 282,286 L 282,250 L 344,250" class="circuit-line" />
  <circle cx="344" cy="250" r="8.5" class="circuit-node" />

  <!-- Pair 5: Lower stepped branches -->
  <!-- Left branch 5 -->
  <path d="M 256,356 L 224,324 L 202,324 L 180,302 L 160,302" class="circuit-line" />
  <circle cx="160" cy="302" r="8.5" class="circuit-node" />
  <!-- Right branch 5 -->
  <path d="M 256,356 L 288,324 L 310,324 L 332,302 L 352,302" class="circuit-line" />
  <circle cx="352" cy="302" r="8.5" class="circuit-node" />

  <!-- Pair 6: Lower downward diagonal branches -->
  <!-- Left branch 6 -->
  <path d="M 256,396 L 218,358 L 184,358" class="circuit-line" />
  <circle cx="184" cy="358" r="8.5" class="circuit-node" />
  <!-- Right branch 6 -->
  <path d="M 256,396 L 294,358 L 328,358" class="circuit-line" />
  <circle cx="328" cy="358" r="8.5" class="circuit-node" />

  <!-- Pair 7: Bottom outer contour tracks -->
  <!-- Left bottom trace -->
  <path d="M 244,450 L 210,416 L 210,392 L 176,392" class="circuit-line" />
  <circle cx="176" cy="392" r="8.5" class="circuit-node" />
  <!-- Right bottom trace -->
  <path d="M 268,450 L 302,416 L 302,392 L 336,392" class="circuit-line" />
  <circle cx="336" cy="392" r="8.5" class="circuit-node" />
</svg>
`.trim();

// 2. Full Vertical Logo with "Mkulima AI" Wordmark (matching user uploaded image exactly)
export const fullVerticalLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" fill="none">
  <!-- Clean White Background -->
  <rect width="600" height="900" fill="#ffffff" />

  <defs>
    <style>
      .circuit-line {
        stroke: #ffffff;
        stroke-width: 8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .circuit-node {
        fill: ${BRAND_GREEN};
        stroke: #ffffff;
        stroke-width: 5.5;
      }
      .brand-title {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 64px;
        font-weight: 700;
        fill: ${TEXT_GREEN};
        letter-spacing: -0.5px;
        text-anchor: middle;
      }
    </style>
  </defs>

  <!-- Green Leaf Body (Centered in upper area) -->
  <g transform="translate(0, 40)">
    <path
      d="M 300,120
         C 230,200 156,305 156,420
         C 156,535 228,615 300,670
         C 372,615 444,535 444,420
         C 444,305 370,200 300,120 Z"
      fill="${BRAND_GREEN}"
    />

    <!-- Central Trunk Line -->
    <line x1="300" y1="650" x2="300" y2="234" class="circuit-line" />

    <!-- Central Top Node -->
    <circle cx="300" cy="234" r="12" class="circuit-node" />

    <!-- Pair 1: Top Diagonals -->
    <line x1="300" y1="300" x2="258" y2="258" class="circuit-line" />
    <circle cx="258" cy="258" r="11" class="circuit-node" />
    <line x1="300" y1="300" x2="342" y2="258" class="circuit-line" />
    <circle cx="342" cy="258" r="11" class="circuit-node" />

    <!-- Pair 2: Upper Mid Diagonals -->
    <line x1="300" y1="358" x2="230" y2="288" class="circuit-line" />
    <circle cx="230" cy="288" r="11" class="circuit-node" />
    <line x1="300" y1="358" x2="370" y2="288" class="circuit-line" />
    <circle cx="370" cy="288" r="11" class="circuit-node" />

    <!-- Pair 3: Middle stepped circuit branches -->
    <path d="M 300,412 L 258,370 L 258,335 L 205,335" class="circuit-line" />
    <circle cx="205" cy="335" r="11" class="circuit-node" />
    <path d="M 300,412 L 342,370 L 342,335 L 395,335" class="circuit-line" />
    <circle cx="395" cy="335" r="11" class="circuit-node" />

    <!-- Pair 4: Wide Middle branches -->
    <path d="M 300,466 L 268,434 L 268,390 L 190,390" class="circuit-line" />
    <circle cx="190" cy="390" r="11" class="circuit-node" />
    <path d="M 300,466 L 332,434 L 332,390 L 410,390" class="circuit-line" />
    <circle cx="410" cy="390" r="11" class="circuit-node" />

    <!-- Pair 5: Lower stepped branches -->
    <path d="M 300,522 L 260,482 L 232,482 L 205,455 L 180,455" class="circuit-line" />
    <circle cx="180" cy="455" r="11" class="circuit-node" />
    <path d="M 300,522 L 340,482 L 368,482 L 395,455 L 420,455" class="circuit-line" />
    <circle cx="420" cy="455" r="11" class="circuit-node" />

    <!-- Pair 6: Lower diagonal branches -->
    <path d="M 300,574 L 252,526 L 210,526" class="circuit-line" />
    <circle cx="210" cy="526" r="11" class="circuit-node" />
    <path d="M 300,574 L 348,526 L 390,526" class="circuit-line" />
    <circle cx="390" cy="526" r="11" class="circuit-node" />

    <!-- Pair 7: Bottom outer contour tracks -->
    <path d="M 285,648 L 242,605 L 242,572 L 200,572" class="circuit-line" />
    <circle cx="200" cy="572" r="11" class="circuit-node" />
    <path d="M 315,648 L 358,605 L 358,572 L 400,572" class="circuit-line" />
    <circle cx="400" cy="572" r="11" class="circuit-node" />
  </g>

  <!-- "Mkulima AI" Wordmark -->
  <text x="300" y="785" class="brand-title">Mkulima AI</text>
</svg>
`.trim();

// 3. Horizontal Header Logo (for Top Navigation / Header: Leaf icon + Mkulima AI)
export const horizontalLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" fill="none">
  <defs>
    <style>
      .circuit-line {
        stroke: #ffffff;
        stroke-width: 2.2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .circuit-node {
        fill: ${BRAND_GREEN};
        stroke: #ffffff;
        stroke-width: 1.6;
      }
      .brand-text {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 38px;
        font-weight: 800;
        fill: #ffffff;
        letter-spacing: -0.5px;
      }
    </style>
  </defs>

  <!-- Emblem on the left (Scale and translate) -->
  <g transform="translate(10, 5) scale(0.18)">
    <path
      d="M 256,44
         C 202,106 142,185 142,274
         C 142,364 198,426 256,468
         C 314,426 370,364 370,274
         C 370,185 310,106 256,44 Z"
      fill="${BRAND_GREEN}"
    />
    <line x1="256" y1="452" x2="256" y2="132" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="256" cy="132" r="14" class="circuit-node" style="stroke-width: 7;" />

    <line x1="256" y1="184" x2="222" y2="150" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="222" cy="150" r="12" class="circuit-node" style="stroke-width: 7;" />
    <line x1="256" y1="184" x2="290" y2="150" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="290" cy="150" r="12" class="circuit-node" style="stroke-width: 7;" />

    <line x1="256" y1="228" x2="200" y2="172" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="200" cy="172" r="12" class="circuit-node" style="stroke-width: 7;" />
    <line x1="256" y1="228" x2="312" y2="172" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="312" cy="172" r="12" class="circuit-node" style="stroke-width: 7;" />

    <path d="M 256,270 L 222,236 L 222,208 L 180,208" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="180" cy="208" r="12" class="circuit-node" style="stroke-width: 7;" />
    <path d="M 256,270 L 290,236 L 290,208 L 332,208" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="332" cy="208" r="12" class="circuit-node" style="stroke-width: 7;" />

    <path d="M 256,312 L 230,286 L 230,250 L 168,250" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="168" cy="250" r="12" class="circuit-node" style="stroke-width: 7;" />
    <path d="M 256,312 L 282,286 L 282,250 L 344,250" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="344" cy="250" r="12" class="circuit-node" style="stroke-width: 7;" />

    <path d="M 256,356 L 224,324 L 202,324 L 180,302 L 160,302" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="160" cy="302" r="12" class="circuit-node" style="stroke-width: 7;" />
    <path d="M 256,356 L 288,324 L 310,324 L 332,302 L 352,302" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="352" cy="302" r="12" class="circuit-node" style="stroke-width: 7;" />

    <path d="M 256,396 L 218,358 L 184,358" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="184" cy="358" r="12" class="circuit-node" style="stroke-width: 7;" />
    <path d="M 256,396 L 294,358 L 328,358" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="328" cy="358" r="12" class="circuit-node" style="stroke-width: 7;" />

    <path d="M 244,450 L 210,416 L 210,392 L 176,392" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="176" cy="392" r="12" class="circuit-node" style="stroke-width: 7;" />
    <path d="M 268,450 L 302,416 L 302,392 L 336,392" class="circuit-line" style="stroke-width: 10;" />
    <circle cx="336" cy="392" r="12" class="circuit-node" style="stroke-width: 7;" />
  </g>

  <!-- Typography -->
  <text x="108" y="63" class="brand-text">Mkulima AI</text>
</svg>
`.trim();

// 4. Square App Icon with White Rounded Card (For PWA & mobile home screen)
export const appIconSquareSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!-- Rounded White Squircle Container -->
  <rect width="512" height="512" rx="112" fill="#ffffff" />
  
  <defs>
    <style>
      .circuit-line {
        stroke: #ffffff;
        stroke-width: 7;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .circuit-node {
        fill: ${BRAND_GREEN};
        stroke: #ffffff;
        stroke-width: 5;
      }
    </style>
  </defs>

  <!-- Green Leaf Body (Centered with breathing room) -->
  <g transform="translate(0, 0)">
    <path
      d="M 256,54
         C 206,112 150,188 150,270
         C 150,354 202,414 256,454
         C 310,414 362,354 362,270
         C 362,188 306,112 256,54 Z"
      fill="${BRAND_GREEN}"
    />

    <!-- Central Trunk Line with notch at bottom -->
    <line x1="256" y1="440" x2="256" y2="136" class="circuit-line" />

    <!-- Central Top Node -->
    <circle cx="256" cy="136" r="9" class="circuit-node" />

    <!-- Pair 1: Top Diagonals -->
    <line x1="256" y1="184" x2="224" y2="152" class="circuit-line" />
    <circle cx="224" cy="152" r="8" class="circuit-node" />
    <line x1="256" y1="184" x2="288" y2="152" class="circuit-line" />
    <circle cx="288" cy="152" r="8" class="circuit-node" />

    <!-- Pair 2: Upper Mid Diagonals -->
    <line x1="256" y1="226" x2="204" y2="174" class="circuit-line" />
    <circle cx="204" cy="174" r="8" class="circuit-node" />
    <line x1="256" y1="226" x2="308" y2="174" class="circuit-line" />
    <circle cx="308" cy="174" r="8" class="circuit-node" />

    <!-- Pair 3: Middle stepped circuit branches -->
    <path d="M 256,266 L 224,234 L 224,208 L 186,208" class="circuit-line" />
    <circle cx="186" cy="208" r="8" class="circuit-node" />
    <path d="M 256,266 L 288,234 L 288,208 L 326,208" class="circuit-line" />
    <circle cx="326" cy="208" r="8" class="circuit-node" />

    <!-- Pair 4: Wide Middle branches -->
    <path d="M 256,306 L 232,282 L 232,248 L 174,248" class="circuit-line" />
    <circle cx="174" cy="248" r="8" class="circuit-node" />
    <path d="M 256,306 L 280,282 L 280,248 L 338,248" class="circuit-line" />
    <circle cx="338" cy="248" r="8" class="circuit-node" />

    <!-- Pair 5: Lower stepped branches -->
    <path d="M 256,348 L 226,318 L 206,318 L 186,298 L 166,298" class="circuit-line" />
    <circle cx="166" cy="298" r="8" class="circuit-node" />
    <path d="M 256,348 L 286,318 L 306,318 L 326,298 L 346,298" class="circuit-line" />
    <circle cx="346" cy="298" r="8" class="circuit-node" />

    <!-- Pair 6: Lower diagonal branches -->
    <path d="M 256,386 L 220,350 L 190,350" class="circuit-line" />
    <circle cx="190" cy="350" r="8" class="circuit-node" />
    <path d="M 256,386 L 292,350 L 322,350" class="circuit-line" />
    <circle cx="322" cy="350" r="8" class="circuit-node" />

    <!-- Pair 7: Bottom outer contour tracks -->
    <path d="M 245,436 L 214,405 L 214,382 L 182,382" class="circuit-line" />
    <circle cx="182" cy="382" r="8" class="circuit-node" />
    <path d="M 267,436 L 298,405 L 298,382 L 330,382" class="circuit-line" />
    <circle cx="330" cy="382" r="8" class="circuit-node" />
  </g>
</svg>
`.trim();

async function buildAllAssets() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), emblemSvg, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullVerticalLogoSvg, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'logo-horizontal.svg'), horizontalLogoSvg, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'app-icon.svg'), appIconSquareSvg, 'utf-8');

  // 2. Generate PNGs with sharp
  const iconBuffer = Buffer.from(appIconSquareSvg);
  const fullLogoBuffer = Buffer.from(fullVerticalLogoSvg);

  // PWA 192x192
  await sharp(iconBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // PWA 512x512
  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // PWA Maskable 512x512
  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Apple Touch Icon 180x180
  await sharp(iconBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicon 32x32 PNG and 64x64
  await sharp(iconBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  // Full Logo PNG 600x900 (High Resolution for sharing / splash screens)
  await sharp(fullLogoBuffer)
    .resize(600, 900)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));

  console.log('✅ All Mkulima AI brand assets, logo, and app icons successfully generated!');
}

buildAllAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
