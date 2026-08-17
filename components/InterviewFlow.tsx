import React from "react";

const FLOW_STEPS = [
  { id: "app", label: "Application", x: 210, y: 55 },
  { id: "ass", label: "Assessment", x: 160, y: 115 },
  { id: "tech", label: "Technical", x: 180, y: 170 },
  { id: "hr", label: "HR", x: 200, y: 225 },
  { id: "offer", label: "You're in.", x: 190, y: 275, isLast: true },
];

export function InterviewFlow() {
  return (
    <div
      aria-hidden="true"
      className="relative hidden h-[340px] w-[340px] shrink-0 overflow-hidden rounded-xl lg:block"
    >
      {/* Mind-map SVG Paths */}
      <svg
        className="absolute inset-0 h-full w-full"
        fill="none"
        viewBox="0 0 340 340"
      >
        {/* Faint decorative ambient lines */}
        <g
          stroke="#1c7b6d"
          strokeOpacity="0.08"
          strokeWidth="1"
        >
          <path d="M 280 170 C 310 170, 320 130, 340 100" />
          <path d="M -20 200 C 40 200, 60 250, 0 300" />
          <path d="M -10 260 C 40 260, 100 280, 100 340" />
        </g>

        {/* Main connecting lines */}
        <g
          stroke="#1c7b6d"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Entry line to main trunk (T1) */}
          <path d="M 10 30 C 50 30, 80 60, 80 115" />
          {/* T1 branching */}
          <path d="M 80 115 Q 80 55, 140 55 L 210 55" /> {/* To Application */}
          <path d="M 80 115 L 160 115" /> {/* To Assessment */}
          {/* T1 to T2 (Second trunk dot) */}
          <path d="M 80 115 Q 80 170, 120 170" />
          {/* T2 branching */}
          <path d="M 120 170 L 180 170" /> {/* To Technical */}
          {/* T2 down towards HR / T3 */}
          <path d="M 120 170 Q 120 225, 150 225" />
          {/* Junction branching */}
          <path d="M 150 225 L 200 225" /> {/* To HR */}
          {/* Junction to T3 and "You're in." */}
          <path d="M 150 225 L 150 275 L 190 275" />
        </g>

        {/* Node Connection Dots */}
        <circle
          cx="10"
          cy="30"
          r="2.5"
          fill="#1c7b6d"
          fillOpacity="0.25"
        />
        <circle
          cx="80"
          cy="115"
          r="3"
          fill="#1c7b6d"
        />
        <circle
          cx="120"
          cy="170"
          r="3"
          fill="#1c7b6d"
        />
        <circle
          cx="150"
          cy="275"
          r="3"
          fill="#1c7b6d"
        />
      </svg>

      {/* HTML Overlay for Text Pills */}
      {FLOW_STEPS.map((step) => (
        <div
          key={step.id}
          className={`absolute flex items-center gap-2.5 rounded-full border bg-white/80 px-3.5 py-1.5 text-[0.8rem] font-medium shadow-[0_2px_8px_rgb(0,0,0,0.02)] backdrop-blur-sm transition-colors ${
            step.isLast ? "border-[#1c7b6d]/20 text-gray-900" : "border-gray-200/80 text-gray-600"
          }`}
          style={{
            left: step.x,
            top: step.y,
            transform: "translateY(-50%)",
          }}
        >
          {step.isLast ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1c7b6d"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <span className="size-1.5 shrink-0 rounded-full bg-[#1c7b6d]" />
          )}
          {step.label}
        </div>
      ))}
    </div>
  );
}
