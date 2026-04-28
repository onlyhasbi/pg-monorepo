interface PhoneMockupProps {
  imageSrc?: string;
  className?: string;
}

export function PhoneMockup({ imageSrc, className = "" }: PhoneMockupProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 280 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl"
      >
        <defs>
          <linearGradient
            id="phoneBodyGrad"
            x1="0"
            y1="0"
            x2="280"
            y2="560"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1e1e2e" />
            <stop offset="100%" stopColor="#0f0f1a" />
          </linearGradient>
          <linearGradient
            id="phoneBorderGrad"
            x1="0"
            y1="0"
            x2="280"
            y2="560"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4a4a5e" />
            <stop offset="50%" stopColor="#2a2a3e" />
            <stop offset="100%" stopColor="#4a4a5e" />
          </linearGradient>
          <linearGradient
            id="notchGrad"
            x1="100"
            y1="12"
            x2="180"
            y2="12"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0a0a14" />
            <stop offset="100%" stopColor="#12121e" />
          </linearGradient>
          <clipPath id="screenClip">
            <rect x="16" y="16" width="248" height="528" rx="24" />
          </clipPath>
          <filter id="screenGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#ffffff" floodOpacity="0.05" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer body */}
        <rect
          x="2"
          y="2"
          width="276"
          height="556"
          rx="40"
          fill="url(#phoneBodyGrad)"
          stroke="url(#phoneBorderGrad)"
          strokeWidth="2.5"
        />

        {/* Side buttons - volume */}
        <rect x="-1" y="110" width="3" height="32" rx="1.5" fill="#3a3a4e" />
        <rect x="-1" y="156" width="3" height="32" rx="1.5" fill="#3a3a4e" />

        {/* Side button - power */}
        <rect x="278" y="140" width="3" height="44" rx="1.5" fill="#3a3a4e" />

        {/* Screen area */}
        <rect x="16" y="16" width="248" height="528" rx="24" fill="#0a0a14" />

        {/* Screen content — image or placeholder */}
        <g clipPath="url(#screenClip)">
          {imageSrc ? (
            <image
              href={imageSrc}
              x="16"
              y="16"
              width="248"
              height="528"
              preserveAspectRatio="none"
            />
          ) : (
            <>
              {/* Placeholder gradient */}
              <rect x="16" y="16" width="248" height="528" fill="#111827" />
              <rect
                x="16"
                y="16"
                width="248"
                height="528"
                fill="url(#placeholderPattern)"
                opacity="0.3"
              />

              {/* Placeholder icon */}
              <g transform="translate(104, 230)">
                <rect
                  x="12"
                  y="12"
                  width="48"
                  height="48"
                  rx="12"
                  fill="#1f2937"
                  stroke="#374151"
                  strokeWidth="1.5"
                />
                <path
                  d="M26 46l8-10 6 7h12l-10-13-6 7.5L30 30l-10 12.5V46h6z"
                  fill="#4b5563"
                />
                <circle cx="52" cy="24" r="4" fill="#4b5563" />
              </g>

              {/* Placeholder text */}
              <text
                x="140"
                y="310"
                textAnchor="middle"
                fill="#4b5563"
                fontSize="12"
                fontFamily="system-ui, sans-serif"
              >
                Screenshot
              </text>
            </>
          )}
        </g>

        {/* Screen edge highlight (subtle) */}
        <rect
          x="16"
          y="16"
          width="248"
          height="528"
          rx="24"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.08"
        />
      </svg>
    </div>
  );
}
