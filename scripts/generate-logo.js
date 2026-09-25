const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Design Master SVG for TechOps Wire
// Dimensions: 512 x 512
// Aesthetic: Futuristic, High-End Enterprise Tech Monogram fusing 'T', 'W', and 'Wire/Circuit Pipeline'
const svgMaster = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080C17"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Outer Rim Gradient -->
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F2FE" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#3B82F6" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.7"/>
    </linearGradient>

    <!-- Radial Core Halo -->
    <radialGradient id="coreHalo" cx="50%" cy="48%" r="58%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.32"/>
      <stop offset="40%" stop-color="#3B82F6" stop-opacity="0.16"/>
      <stop offset="80%" stop-color="#6366F1" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#080C17" stop-opacity="0"/>
    </radialGradient>

    <!-- T-Bar Top Gradient (Electric Cyan to Royal Blue) -->
    <linearGradient id="tGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00F2FE"/>
      <stop offset="35%" stop-color="#06B6D4"/>
      <stop offset="70%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>

    <!-- T-Stem Gradient -->
    <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>

    <!-- W-Left Wing Gradient -->
    <linearGradient id="wLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F2FE"/>
      <stop offset="50%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>

    <!-- W-Right Wing Gradient -->
    <linearGradient id="wRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>

    <!-- Glowing Signal Wire Gradient -->
    <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>

    <!-- Glass Reflection Highlight -->
    <linearGradient id="glassReflect" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>

    <!-- Filters for Bloom Glow -->
    <filter id="bloomSoft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="bloomIntense" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="14" result="blur1"/>
      <feGaussianBlur stdDeviation="4" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- 1. Background Rounded Squircle with Precision Border -->
  <rect x="12" y="12" width="488" height="488" rx="108" fill="url(#bgGrad)"/>
  <rect x="12" y="12" width="488" height="488" rx="108" stroke="url(#rimGrad)" stroke-width="2.5" stroke-opacity="0.75"/>

  <!-- 2. Ambient Core Halo Glow -->
  <circle cx="256" cy="256" r="220" fill="url(#coreHalo)"/>

  <!-- 3. Micro Architectural Grid Accents (Subtle DevOps / Cloud Circuit feel) -->
  <g opacity="0.22" stroke="#38BDF8" stroke-width="1.2" stroke-dasharray="3 6">
    <!-- Top-left telemetry lines -->
    <line x1="68" y1="120" x2="132" y2="120"/>
    <line x1="68" y1="120" x2="68" y2="184"/>
    <circle cx="68" cy="120" r="3" fill="#38BDF8"/>

    <!-- Bottom-right telemetry lines -->
    <line x1="444" y1="392" x2="380" y2="392"/>
    <line x1="444" y1="392" x2="444" y2="328"/>
    <circle cx="444" cy="392" r="3" fill="#38BDF8"/>

    <!-- Concentric Target Arc in Background -->
    <path d="M 120 256 A 136 136 0 0 1 256 120" fill="none" stroke="#60A5FA" stroke-width="1.2" stroke-dasharray="4 8" opacity="0.35"/>
    <path d="M 392 256 A 136 136 0 0 1 256 392" fill="none" stroke="#A855F7" stroke-width="1.2" stroke-dasharray="4 8" opacity="0.35"/>
  </g>

  <!-- 4. Outer Hexagonal Shield Matrix (TechOps Perimeter) -->
  <polygon points="256,64 428,164 428,348 256,448 84,348 84,164"
           fill="none"
           stroke="#1E293B"
           stroke-width="1.5"
           stroke-dasharray="6 10"
           opacity="0.45"/>

  <!-- 5. The EMBLEM: The Interlocking T-W Waveguide Structure -->
  <!-- Layer A: Shadow / Depth Occlusion Underlay -->
  <g filter="url(#bloomSoft)" opacity="0.45" transform="translate(0, 6)">
    <path d="M 112 144 L 400 144 L 380 186 L 132 186 Z" fill="#000000"/>
    <path d="M 116 196 L 192 376 L 256 264 L 320 376 L 396 196" stroke="#000000" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Layer B: The 'W' Foundation Architecture (Bold Geometric Dynamic Wave) -->
  <!-- Left Wing of W: From outer signal port -> Deep Valley -> Central Intersection -->
  <path d="M 118 190 L 196 380 L 256 270"
        stroke="url(#wLeftGrad)"
        stroke-width="34"
        stroke-linecap="round"
        stroke-linejoin="round"/>

  <!-- Right Wing of W: From Central Intersection -> Deep Valley -> Right Signal Port -->
  <path d="M 256 270 L 316 380 L 394 190"
        stroke="url(#wRightGrad)"
        stroke-width="34"
        stroke-linecap="round"
        stroke-linejoin="round"/>

  <!-- Layer C: The 'T' Structure (Crown & Central Conductor Stem) -->
  <!-- Top Horizontal Bar of the T with aerodynamic precision facets -->
  <path d="M 112 138 C 104 138 98 144 100 152 L 108 178 C 110 184 116 188 122 188 L 390 188 C 396 188 402 184 404 178 L 412 152 C 414 144 408 138 400 138 Z"
        fill="url(#tGrad)"/>

  <!-- Top Bar High-Gloss Facet Highlight -->
  <path d="M 114 142 L 398 142 L 392 152 L 120 152 Z"
        fill="url(#glassReflect)"/>

  <!-- The T Central Stem (Explicit Polygon with width so gradients render cleanly) -->
  <path d="M 240 184 L 272 184 L 272 258 L 256 272 L 240 258 Z"
        fill="url(#stemGrad)"/>

  <!-- Layer D: The Optical "WIRE" Data Conduits (High-Velocity Energy Pulses) -->
  <!-- Integrated Core Optical Waveguide Wire -->
  <g filter="url(#bloomIntense)">
    <!-- Horizontal Core Pulse Wire -->
    <path d="M 132 163 L 380 163"
          stroke="url(#wireGrad)"
          stroke-width="6"
          stroke-linecap="round"/>

    <!-- Vertical Trunk Pulse Wire linking T to W -->
    <line x1="256" y1="163" x2="256" y2="270"
          stroke="url(#wireGrad)"
          stroke-width="5"
          stroke-linecap="round"/>

    <!-- V-Path Pulse Wave Wires following the W channels -->
    <path d="M 142 216 L 196 348 L 256 244 L 316 348 L 370 216"
          stroke="url(#wireGrad)"
          stroke-width="4.5"
          stroke-linecap="round"
          stroke-linejoin="round"/>
  </g>

  <!-- Layer E: Precision Telemetry Quantum Nodes (Glowing Signal Points) -->
  <!-- T-Bar Left & Right Signal Terminals -->
  <circle cx="132" cy="163" r="5" fill="#FFFFFF"/>
  <circle cx="132" cy="163" r="10" stroke="#00F2FE" stroke-width="2.5" fill="none" opacity="0.85"/>

  <circle cx="380" cy="163" r="5" fill="#FFFFFF"/>
  <circle cx="380" cy="163" r="10" stroke="#38BDF8" stroke-width="2.5" fill="none" opacity="0.85"/>

  <!-- Central Nexus Core (Where T meets W - Heart of TechOps Wire) -->
  <circle cx="256" cy="270" r="14" fill="#0F172A" stroke="#00F2FE" stroke-width="4"/>
  <circle cx="256" cy="270" r="7" fill="#00F2FE"/>
  <circle cx="256" cy="270" r="3" fill="#FFFFFF"/>

  <!-- W-Left Valley Pulse Node -->
  <circle cx="196" cy="380" r="11" fill="#080C17" stroke="#2563EB" stroke-width="3"/>
  <circle cx="196" cy="380" r="5" fill="#38BDF8"/>
  <circle cx="196" cy="380" r="2" fill="#FFFFFF"/>

  <!-- W-Right Valley Pulse Node -->
  <circle cx="316" cy="380" r="11" fill="#080C17" stroke="#7C3AED" stroke-width="3"/>
  <circle cx="316" cy="380" r="5" fill="#C084FC"/>
  <circle cx="316" cy="380" r="2" fill="#FFFFFF"/>

  <!-- W-Left Top Terminal -->
  <circle cx="118" cy="190" r="6" fill="#00F2FE"/>
  <circle cx="118" cy="190" r="2" fill="#FFFFFF"/>

  <!-- W-Right Top Terminal -->
  <circle cx="394" cy="190" r="6" fill="#A855F7"/>
  <circle cx="394" cy="190" r="2" fill="#FFFFFF"/>

  <!-- 6. Floating Data Packets (Active Wire Telemetry) -->
  <circle cx="166" cy="278" r="3" fill="#38BDF8" opacity="0.9"/>
  <circle cx="346" cy="278" r="3" fill="#C084FC" opacity="0.9"/>
  <circle cx="226" cy="308" r="2.5" fill="#E0F2FE" opacity="0.8"/>
  <circle cx="286" cy="308" r="2.5" fill="#E0F2FE" opacity="0.8"/>

  <!-- Micro Brand Sub-Script Badge at bottom -->
  <g opacity="0.7">
    <rect x="206" y="420" width="100" height="20" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <circle cx="218" cy="430" r="3" fill="#10B981"/>
    <text x="230" y="434" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="#94A3B8" letter-spacing="1.5">ONLINE</text>
  </g>
</svg>
`;

// App Icon SVG (Optimized for small display: 16x16, 32x32, 64x64, 180x180)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" fill="none">
  <defs>
    <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080C17"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="iconRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F2FE"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
    <radialGradient id="iconGlow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#080C17" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="iconT" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00F2FE"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <linearGradient id="iconStem" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="iconWLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F2FE"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <linearGradient id="iconWRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
    <linearGradient id="iconWire" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E0F2FE"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
  </defs>

  <!-- Container -->
  <rect x="6" y="6" width="244" height="244" rx="54" fill="url(#iconBg)"/>
  <rect x="6" y="6" width="244" height="244" rx="54" stroke="url(#iconRim)" stroke-width="2.5" stroke-opacity="0.85"/>
  <circle cx="128" cy="128" r="100" fill="url(#iconGlow)"/>

  <!-- The W Waves (Thick, High Contrast for Small Sizes) -->
  <path d="M 58 98 L 98 192 L 128 138" stroke="url(#iconWLeft)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 128 138 L 158 192 L 198 98" stroke="url(#iconWRight)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- The T Bar -->
  <path d="M 54 72 C 50 72 47 75 48 79 L 52 92 C 53 95 56 97 59 97 L 197 97 C 200 97 203 95 204 92 L 208 79 C 209 75 206 72 202 72 Z" fill="url(#iconT)"/>

  <!-- The T Stem -->
  <path d="M 117 96 L 139 96 L 139 132 L 128 140 L 117 132 Z" fill="url(#iconStem)"/>

  <!-- Core Neon Pulse Conductor Lines -->
  <path d="M 68 84 L 188 84" stroke="url(#iconWire)" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="128" y1="84" x2="128" y2="138" stroke="url(#iconWire)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 72 110 L 98 174 L 128 126 L 158 174 L 184 110" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>

  <!-- Strategic Glow Nodes -->
  <circle cx="128" cy="138" r="9" fill="#080C17" stroke="#00F2FE" stroke-width="3"/>
  <circle cx="128" cy="138" r="4" fill="#FFFFFF"/>

  <circle cx="98" cy="192" r="7" fill="#38BDF8"/>
  <circle cx="98" cy="192" r="2.5" fill="#FFFFFF"/>

  <circle cx="158" cy="192" r="7" fill="#C084FC"/>
  <circle cx="158" cy="192" r="2.5" fill="#FFFFFF"/>
</svg>
`;

async function main() {
  const root = path.resolve(__dirname, '..');
  const publicDir = path.join(root, 'public');
  const appDir = path.join(root, 'src', 'app');

  // 1. Write public/logo.svg
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgMaster, 'utf-8');
  console.log('✓ Wrote public/logo.svg');

  // 2. Write src/app/icon.svg
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgIcon, 'utf-8');
  console.log('✓ Wrote src/app/icon.svg');

  // 3. Render high-res public/logo.png (512x512)
  await sharp(Buffer.from(svgMaster))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('✓ Rendered high-res 512x512 public/logo.png');

  // 4. Render apple-touch-icon.png (180x180)
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Rendered public/apple-touch-icon.png');

  // 5. Render favicon.png (32x32)
  await sharp(Buffer.from(svgIcon))
    .resize(32, 32)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ Rendered public/favicon.png');
}

main().catch(err => {
  console.error('Error rendering logos:', err);
  process.exit(1);
});
