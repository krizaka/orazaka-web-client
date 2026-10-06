/** Decorative cognitive-pipeline schema (presentational, theme-token driven). */
export function EnginePipelineSvg() {
  return (
    <svg
      className="w-full max-w-2xl h-auto"
      viewBox="0 0 600 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes flowReverse {
          to {
            stroke-dashoffset: 20;
          }
        }
        @keyframes pulseCircle {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px var(--accent-soft)); }
          50% { transform: scale(1.04); filter: drop-shadow(0 0 6px var(--accent-soft)); }
        }
        .svg-node {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .svg-node:hover rect {
          fill: var(--surface-3) !important;
          stroke: var(--accent) !important;
          filter: drop-shadow(0 0 8px var(--accent-soft));
        }
        .svg-node:hover circle {
          fill: var(--surface-3) !important;
          stroke: var(--accent) !important;
          filter: drop-shadow(0 0 8px var(--accent-soft));
        }
        .svg-node-center {
          transform-origin: 415px 115px;
          animation: pulseCircle 3s ease-in-out infinite;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .svg-node-center:hover {
          filter: drop-shadow(0 0 12px var(--accent));
        }
        .flow-dispatch {
          stroke-dasharray: 5 5;
          animation: flow 1.5s linear infinite;
        }
        .flow-persist {
          stroke-dasharray: 4 4;
          animation: flow 1.2s linear infinite;
        }
        .flow-exec {
          stroke-dasharray: 5 5;
          animation: flow 1.5s linear infinite;
        }
      `}</style>

      {/* Grid background inside SVG */}
      <defs>
        <pattern id="grid-pattern-engine" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>
        <marker id="arrow-engine" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern-engine)" className="rounded-lg" />

      {/* Background solid lines */}
      <path d="M 110 115 C 130 115, 120 59, 142 59" stroke="var(--border-subtle)" strokeWidth="1.5" fill="none" />
      <line x1="237" y1="80" x2="237" y2="92" stroke="var(--border-subtle)" strokeWidth="1.5" />
      <line x1="237" y1="134" x2="237" y2="146" stroke="var(--border-subtle)" strokeWidth="1.5" />
      <path d="M 332 167 C 355 167, 355 115, 375 115" stroke="var(--border-subtle)" strokeWidth="1.5" fill="none" />
      <path d="M 455 105 L 507 48" stroke="var(--border-subtle)" strokeWidth="1.5" />
      <path d="M 455 112 L 505 92" stroke="var(--border-subtle)" strokeWidth="1.5" />
      <path d="M 455 122 L 505 142" stroke="var(--border-subtle)" strokeWidth="1.5" />
      <path d="M 455 129 L 507 182" stroke="var(--border-subtle)" strokeWidth="1.5" />

      {/* Active flowing animated lines */}
      <path d="M 110 115 C 130 115, 120 59, 142 59" stroke="var(--accent)" strokeWidth="2" fill="none" className="flow-dispatch" markerEnd="url(#arrow-engine)" />
      <line x1="237" y1="80" x2="237" y2="92" stroke="var(--accent)" strokeWidth="2" className="flow-persist" markerEnd="url(#arrow-engine)" />
      <line x1="237" y1="134" x2="237" y2="146" stroke="var(--accent)" strokeWidth="2" className="flow-persist" markerEnd="url(#arrow-engine)" />
      <path d="M 332 167 C 355 167, 355 115, 375 115" stroke="var(--accent)" strokeWidth="2" fill="none" className="flow-dispatch" markerEnd="url(#arrow-engine)" />
      <path d="M 455 105 L 507 48" stroke="var(--accent)" strokeWidth="2" className="flow-exec" markerEnd="url(#arrow-engine)" />
      <path d="M 455 112 L 505 92" stroke="var(--accent)" strokeWidth="2" className="flow-exec" markerEnd="url(#arrow-engine)" />
      <path d="M 455 122 L 505 142" stroke="var(--accent)" strokeWidth="2" className="flow-exec" markerEnd="url(#arrow-engine)" />
      <path d="M 455 129 L 507 182" stroke="var(--accent)" strokeWidth="2" className="flow-exec" markerEnd="url(#arrow-engine)" />

      {/* Inbound Gateway BFF */}
      <g className="svg-node">
        <rect x="15" y="87" width="95" height="56" rx="8" fill="var(--surface-2)" stroke="var(--border-subtle)" strokeWidth="1" />
        <text x="62" y="112" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">Gateway BFF</text>
        <text x="62" y="125" fill="var(--text-muted)" fontSize="7" textAnchor="middle">Inbound Request</text>
      </g>

      {/* Orazaka Core Pipeline Boundary */}
      <rect x="130" y="15" width="215" height="205" rx="12" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.15" fill="none" />
      <text x="237" y="28" fill="var(--text-muted)" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">COGNITIVE ORCHESTRATOR</text>

      {/* Pipeline Step 1: Interceptors */}
      <g className="svg-node">
        <rect x="142" y="38" width="190" height="42" rx="6" fill="var(--surface-2)" stroke="var(--border-subtle)" strokeWidth="1" />
        <text x="237" y="58" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">Cognitive Interceptors</text>
        <text x="237" y="70" fill="var(--text-muted)" fontSize="7" textAnchor="middle">Context, Memory, Translation</text>
      </g>

      {/* Pipeline Step 2: RAG PGVector */}
      <g className="svg-node">
        <rect x="142" y="92" width="190" height="42" rx="6" fill="var(--surface-2)" stroke="var(--border-subtle)" strokeWidth="1" />
        <text x="237" y="112" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">Hybrid RAG (PGVector)</text>
        <text x="237" y="124" fill="var(--text-muted)" fontSize="7" textAnchor="middle">Semantic Knowledge Retrieval</text>
      </g>

      {/* Pipeline Step 3: Tool Callbacks */}
      <g className="svg-node">
        <rect x="142" y="146" width="190" height="42" rx="6" fill="var(--surface-3)" stroke="var(--accent)" strokeWidth="1" />
        <text x="237" y="166" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">MCP Tool Registry</text>
        <text x="237" y="178" fill="var(--accent)" fontSize="7" fontWeight="bold" textAnchor="middle">Slack, Jira, SQL, FS Tools</text>
      </g>

      {/* Central Gateway Facade */}
      <g className="svg-node-center">
        <rect x="375" y="85" width="80" height="60" rx="8" fill="var(--surface-3)" stroke="var(--accent)" strokeWidth="1.5" />
        <text x="415" y="112" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">Unified</text>
        <text x="415" y="125" fill="var(--accent)" fontSize="10" fontWeight="bold" textAnchor="middle">Facade</text>
      </g>

      {/* Modalities (Surrounding Nodes) */}
      {/* TEXT */}
      <g className="svg-node">
        <circle cx="525" cy="40" r="18" fill="var(--surface-2)" stroke="var(--border-default)" strokeWidth="1" />
        <text x="525" y="43" fill="var(--text-primary)" fontSize="7" fontWeight="bold" textAnchor="middle">TXT</text>
      </g>

      {/* CODE */}
      <g className="svg-node">
        <circle cx="525" cy="90" r="18" fill="var(--surface-2)" stroke="var(--border-default)" strokeWidth="1" />
        <text x="525" y="93" fill="var(--text-primary)" fontSize="7" fontWeight="bold" textAnchor="middle">COD</text>
      </g>

      {/* MEDIA */}
      <g className="svg-node">
        <circle cx="525" cy="140" r="18" fill="var(--surface-2)" stroke="var(--border-default)" strokeWidth="1" />
        <text x="525" y="143" fill="var(--text-primary)" fontSize="7" fontWeight="bold" textAnchor="middle">MED</text>
      </g>

      {/* VISION */}
      <g className="svg-node">
        <circle cx="525" cy="190" r="18" fill="var(--surface-2)" stroke="var(--border-default)" strokeWidth="1" />
        <text x="525" y="193" fill="var(--text-primary)" fontSize="7" fontWeight="bold" textAnchor="middle">VIS</text>
      </g>
    </svg>
  );
}
