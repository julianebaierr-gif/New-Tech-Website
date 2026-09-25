import React, { useId } from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  showTagline = false,
  className = "",
}: BrandLogoProps) {
  const id = useId();

  const sizeClasses = {
    sm: {
      emblem: "w-7 h-7",
      title: "text-base",
      tagline: "text-[10px]",
    },
    md: {
      emblem: "w-9 h-9",
      title: "text-lg",
      tagline: "text-[11px]",
    },
    lg: {
      emblem: "w-11 h-11",
      title: "text-xl",
      tagline: "text-xs",
    },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Precision Vector Emblem fusing T, W, and Circuit Pulse */}
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses.emblem} shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105`}
        aria-label="TechOps Wire Logo"
        role="img"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#080C17" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.7" />
          </linearGradient>

          <radialGradient id={`${id}-halo`} cx="50%" cy="48%" r="58%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.32" />
            <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.16" />
            <stop offset="80%" stopColor="#6366F1" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#080C17" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`${id}-t`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="35%" stopColor="#06B6D4" />
            <stop offset="70%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id={`${id}-stem`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          <linearGradient id={`${id}-wLeft`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>

          <linearGradient id={`${id}-wRight`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id={`${id}-wire`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          <linearGradient id={`${id}-glass`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Squircle Housing */}
        <rect x="12" y="12" width="488" height="488" rx="108" fill={`url(#${id}-bg)`} />
        <rect
          x="12"
          y="12"
          width="488"
          height="488"
          rx="108"
          stroke={`url(#${id}-rim)`}
          strokeWidth="6"
          strokeOpacity="0.8"
        />

        {/* Ambient Halo */}
        <circle cx="256" cy="256" r="220" fill={`url(#${id}-halo)`} />

        {/* W Foundation */}
        <path
          d="M 118 190 L 196 380 L 256 270"
          stroke={`url(#${id}-wLeft)`}
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 256 270 L 316 380 L 394 190"
          stroke={`url(#${id}-wRight)`}
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* T-Bar Architecture */}
        <path
          d="M 112 138 C 104 138 98 144 100 152 L 108 178 C 110 184 116 188 122 188 L 390 188 C 396 188 402 184 404 178 L 412 152 C 414 144 408 138 400 138 Z"
          fill={`url(#${id}-t)`}
        />
        <path d="M 114 142 L 398 142 L 392 152 L 120 152 Z" fill={`url(#${id}-glass)`} />

        {/* T Central Stem linking to W Apex */}
        <path
          d="M 240 184 L 272 184 L 272 258 L 256 272 L 240 258 Z"
          fill={`url(#${id}-stem)`}
        />

        {/* Optical Conductor Wires */}
        <path
          d="M 132 163 L 380 163"
          stroke={`url(#${id}-wire)`}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="256"
          y1="163"
          x2="256"
          y2="270"
          stroke={`url(#${id}-wire)`}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 142 216 L 196 348 L 256 244 L 316 348 L 370 216"
          stroke={`url(#${id}-wire)`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Optical Pulse Terminals */}
        <circle cx="132" cy="163" r="6" fill="#FFFFFF" />
        <circle cx="380" cy="163" r="6" fill="#FFFFFF" />

        {/* Central Quantum Nexus */}
        <circle cx="256" cy="270" r="15" fill="#0F172A" stroke="#00F2FE" strokeWidth="4" />
        <circle cx="256" cy="270" r="7" fill="#00F2FE" />
        <circle cx="256" cy="270" r="3.5" fill="#FFFFFF" />

        {/* Left & Right W Signal Nodes */}
        <circle cx="196" cy="380" r="12" fill="#080C17" stroke="#2563EB" strokeWidth="3.5" />
        <circle cx="196" cy="380" r="5" fill="#38BDF8" />
        <circle cx="196" cy="380" r="2.5" fill="#FFFFFF" />

        <circle cx="316" cy="380" r="12" fill="#080C17" stroke="#7C3AED" strokeWidth="3.5" />
        <circle cx="316" cy="380" r="5" fill="#C084FC" />
        <circle cx="316" cy="380" r="2.5" fill="#FFFFFF" />

        {/* Upper Terminal Nodes */}
        <circle cx="118" cy="190" r="7" fill="#00F2FE" />
        <circle cx="118" cy="190" r="2.5" fill="#FFFFFF" />

        <circle cx="394" cy="190" r="7" fill="#A855F7" />
        <circle cx="394" cy="190" r="2.5" fill="#FFFFFF" />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-center">
            <span
              className={`font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors ${sizeClasses.title}`}
            >
              TechOps
            </span>
            <span
              className={`font-black tracking-tight bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent ml-1 ${sizeClasses.title}`}
            >
              Wire
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-1.5 mb-0.5 animate-pulse" />
          </div>
          {showTagline && (
            <span
              className={`text-slate-500 font-sans tracking-normal -mt-0.5 ${sizeClasses.tagline}`}
            >
              Cloud, Automation &amp; Systems
            </span>
          )}
        </div>
      )}
    </div>
  );
}
