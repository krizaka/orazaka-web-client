/** Decorative local-sandbox boundary schema (presentational). */
export function PrivacySandboxSvg() {
  return (
    <svg
      className="w-full max-w-lg h-auto"
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
              @keyframes flow {
                to {
                  stroke-dashoffset: -20;
                }
              }
              @keyframes borderFlow {
                to {
                  stroke-dashoffset: -40;
                }
              }
              @keyframes pulseRing {
                0%, 100% { transform: scale(1); opacity: 0.15; }
                50% { transform: scale(1.2); opacity: 0.45; }
              }
              @keyframes pulseCross {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
              }
              .svg-node {
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                cursor: pointer;
              }
              .svg-node:hover {
                fill: var(--kz-surface-3) !important;
                stroke: var(--kz-accent) !important;
                filter: drop-shadow(0 0 8px var(--kz-accent-soft));
              }
              .flow-arrow-1 {
                stroke-dasharray: 6 6;
                animation: flow 1.5s linear infinite;
              }
              .flow-arrow-2 {
                stroke-dasharray: 6 6;
                animation: flow 1.0s linear infinite;
              }
              .sandbox-boundary {
                stroke-dasharray: 8 6;
                animation: borderFlow 3s linear infinite;
              }
              .pulse-cross-ring {
                transform-origin: 250px 170px;
                animation: pulseRing 2s ease-in-out infinite;
              }
              .pulse-cross {
                transform-origin: 250px 170px;
                animation: pulseCross 1.5s ease-in-out infinite;
              }
            `}</style>

      {/* SVG Grid Overlay */}
      <defs>
        <pattern id="grid-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" className="rounded-lg" />

      {/* Sandbox Boundary Ring */}
      <rect
        x="10"
        y="10"
        width="480"
        height="180"
        rx="16"
        stroke="url(#gradient-sandbox)"
        strokeWidth="2"
        className="sandbox-boundary"
      />

      <linearGradient id="gradient-sandbox" x1="0" y1="0" x2="500" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--kz-success)" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#047857" stopOpacity="0.15" />
        <stop offset="100%" stopColor="var(--kz-success)" stopOpacity="0.4" />
      </linearGradient>

      {/* Connecting Arrows - solid background lines */}
      <path d="M 140 100 L 200 100" stroke="var(--kz-border-subtle)" strokeWidth="1.5" />
      <path d="M 300 100 L 360 100" stroke="var(--kz-border-subtle)" strokeWidth="1.5" />
      <path d="M 300 100 C 330 100, 330 155, 360 155" stroke="var(--kz-border-subtle)" strokeWidth="1.5" fill="none" />

      {/* Connecting Arrows - flowing animation overlays */}
      <path d="M 140 100 L 200 100" stroke="var(--kz-success)" strokeWidth="2" className="flow-arrow-1" markerEnd="url(#arrow)" />
      <path d="M 300 100 L 360 100" stroke="var(--kz-success)" strokeWidth="2" className="flow-arrow-2" markerEnd="url(#arrow)" />
      <path d="M 300 100 C 330 100, 330 155, 360 155" stroke="var(--kz-success)" strokeWidth="2" className="flow-arrow-1" markerEnd="url(#arrow)" fill="none" />

      {/* Nodes */}
      {/* 1. Client Node */}
      <g className="svg-node">
        <rect x="40" y="70" width="100" height="60" rx="8" fill="var(--kz-surface-2)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
        <text x="90" y="100" fill="var(--kz-text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">User Interface</text>
        <text x="90" y="116" fill="var(--kz-text-muted)" fontSize="9" textAnchor="middle">Next.js UI / CLI</text>
      </g>

      {/* 2. Core Node */}
      <g className="svg-node">
        <rect x="200" y="70" width="100" height="60" rx="8" fill="var(--kz-surface-3)" stroke="var(--kz-accent)" strokeWidth="1.5" />
        <text x="250" y="98" fill="var(--kz-text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">Orazaka Core</text>
        <text x="250" y="114" fill="var(--kz-accent)" fontSize="9" fontWeight="semibold" textAnchor="middle">Spring AI runtime</text>
      </g>

      {/* 3. Inference Node */}
      <g className="svg-node">
        <rect x="360" y="70" width="100" height="60" rx="8" fill="var(--kz-surface-2)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
        <text x="410" y="98" fill="var(--kz-text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">Local Engine</text>
        <text x="410" y="114" fill="var(--kz-text-muted)" fontSize="9" textAnchor="middle">Ollama / MPS</text>
      </g>

      {/* 4. Video Worker Node */}
      <g className="svg-node">
        <rect x="360" y="135" width="100" height="45" rx="8" fill="var(--kz-surface-2)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
        <text x="410" y="152" fill="var(--kz-text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">Video Worker</text>
        <text x="410" y="165" fill="var(--kz-text-muted)" fontSize="7" textAnchor="middle">Port 8188 / MPS</text>
      </g>

      {/* Outgoing blocking cross */}
      <path d="M 250 130 L 250 170" stroke="var(--kz-danger)" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="250" cy="170" r="12" fill="rgba(239,68,68,0.15)" stroke="var(--kz-danger)" strokeWidth="1" className="pulse-cross-ring" />
      <text x="250" y="174" fill="var(--kz-danger)" fontSize="10" fontWeight="bold" textAnchor="middle" className="pulse-cross">✕</text>
      <text x="312" y="173" fill="var(--kz-text-muted)" fontSize="9" fontWeight="medium">Blocked Cloud Sync</text>

      {/* Arrow Marker Definition */}
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--kz-success)" />
        </marker>
      </defs>
    </svg>
  );
}
