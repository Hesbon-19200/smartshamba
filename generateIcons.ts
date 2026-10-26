import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width: number, height: number, r: number, g: number, b: number, iconType: 'standard' | 'maskable' = 'standard'): Buffer {
  // Generate RGBA pixel buffer
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (iconType === 'maskable' ? 0.32 : 0.42);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background emerald green: #059669 (5, 150, 105)
      let pr = r;
      let pg = g;
      let pb = b;
      let pa = 255;

      // Inner icon emblem: stylized leaf / sprout shape
      if (dist < radius) {
        // Golden accent or light sprout center
        const innerDist = Math.sqrt(dx * dx + (dy + radius * 0.1) * (dy + radius * 0.1));
        if (innerDist < radius * 0.55 && (x >= cx - radius * 0.35 && x <= cx + radius * 0.35)) {
          // White emblem with emerald gradient
          pr = 255;
          pg = 255;
          pb = 255;
        } else if (dist < radius * 0.95) {
          // Emerald highlight
          pr = Math.min(255, r + 40);
          pg = Math.min(255, g + 35);
          pb = Math.min(255, b + 40);
        }
      }

      rawData[pixelOffset] = pr;
      rawData[pixelOffset + 1] = pg;
      rawData[pixelOffset + 2] = pb;
      rawData[pixelOffset + 3] = pa;
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);

  // PNG structure
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, 'ascii');
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lengthBuf, typeBuf, data, crcBuf]);
}

// Standard CRC32 implementation
function crc32(buf: Buffer): number {
  let table = (crc32 as any).table;
  if (!table) {
    table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c >>> 0;
    }
    (crc32 as any).table = table;
  }

  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 5, 150, 105, 'standard'));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 5, 150, 105, 'standard'));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 5, 150, 105, 'maskable'));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 5, 150, 105, 'standard'));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(32, 32, 5, 150, 105, 'standard'));

// Generate crisp SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#059669"/>
  <circle cx="256" cy="256" r="180" fill="#047857" opacity="0.4"/>
  <path d="M256 110C256 110 170 170 170 270C170 330 210 380 256 380C302 380 342 330 342 270C342 170 256 110 256 110Z" fill="#FFFFFF"/>
  <path d="M256 160V350" stroke="#059669" stroke-width="14" stroke-linecap="round"/>
  <path d="M256 240C230 220 210 230 200 245" stroke="#059669" stroke-width="12" stroke-linecap="round"/>
  <path d="M256 280C285 260 305 270 315 285" stroke="#059669" stroke-width="12" stroke-linecap="round"/>
  <circle cx="360" cy="150" r="28" fill="#F59E0B"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Successfully generated PWA icon assets in public directory!');
