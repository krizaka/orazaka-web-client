/** Decorative outbound-tunnel agent-topology schema (presentational). */
export function ReachTopologySvg() {
  return (
          <svg
            className="w-full max-w-2xl h-auto"
            viewBox="0 0 600 220"
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
              @keyframes pulseLine {
                0%, 100% { opacity: 0.25; }
                50% { opacity: 0.65; }
              }
              .svg-node {
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                cursor: pointer;
              }
              .svg-node:hover {
                filter: drop-shadow(0 0 8px var(--accent-soft));
              }
              .svg-node:hover rect {
                fill: var(--surface-3) !important;
                stroke: var(--accent) !important;
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
                animation: flow 1s linear infinite;
              }
              .flow-sync {
                stroke-dasharray: 5 5;
                animation: flowReverse 1.5s linear infinite;
              }
              .firewall-line {
                animation: pulseFirewall 2.5s ease-in-out infinite;
              }
              @keyframes pulseFirewall {
                0%, 100% { opacity: 0.25; }
                50% { opacity: 0.65; }
              }
            `}</style>

            {/* Grid overlay */}
            <defs>
              <pattern id="grid-pattern-infinite" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
              <marker id="arrow-infinite" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
              </marker>
              <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--status-error)" />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-infinite)" className="rounded-lg" />

            {/* Firewall barrier Line */}
            <line x1="180" y1="20" x2="180" y2="200" stroke="var(--status-error)" strokeWidth="2" strokeDasharray="4 2" className="firewall-line" />
            <text x="174" y="32" fill="var(--status-error)" fontSize="8" fontWeight="bold" textAnchor="end" className="firewall-line">Local Firewall</text>

            {/* Local Host Boundary box */}
            <rect x="210" y="15" width="375" height="190" rx="12" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.15" fill="rgba(255,255,255,0.005)" />
            <text x="575" y="28" fill="var(--text-muted)" fontSize="7" fontWeight="bold" textAnchor="end" letterSpacing="0.05em">LOCAL HOST BOUNDARY (SAFE SANDBOX)</text>

            {/* Connection Lines - Solid Background */}
            <path d="M 140 120 C 180 120, 180 65, 230 65" stroke="var(--border-subtle)" strokeWidth="1.5" fill="none" />
            <line x1="350" y1="65" x2="430" y2="65" stroke="var(--border-subtle)" strokeWidth="1.5" />
            <path d="M 290 95 C 290 120, 310 145, 340 145" stroke="var(--border-subtle)" strokeWidth="1.5" fill="none" />
            <path d="M 460 145 C 490 145, 490 95, 490 95" stroke="var(--border-subtle)" strokeWidth="1.5" fill="none" />

            {/* Connection Lines - Animated Flows */}
            {/* 1. Gateway to CLI (Job Dispatch) */}
            <path d="M 140 120 C 180 120, 180 65, 230 65" stroke="var(--accent)" strokeWidth="2" fill="none" className="flow-dispatch" markerEnd="url(#arrow-infinite)" />
            
            {/* 2. CLI to SQLite (Persist payload) */}
            <line x1="350" y1="65" x2="430" y2="65" stroke="var(--accent)" strokeWidth="2" className="flow-persist" markerEnd="url(#arrow-infinite)" />
            
            {/* 3. CLI to Sandbox Executor (Command dispatch upon [Y/n] consent) */}
            <path d="M 290 95 C 290 120, 310 145, 340 145" stroke="var(--accent)" strokeWidth="2" fill="none" className="flow-exec" markerEnd="url(#arrow-infinite)" />
            
            {/* 4. Sandbox Executor to SQLite (Record logs & exit code) */}
            <path d="M 460 145 C 490 145, 490 95, 490 95" stroke="var(--accent)" strokeWidth="2" fill="none" className="flow-persist" markerEnd="url(#arrow-infinite)" />

            {/* Nodes */}
            {/* Orazaka Gateway */}
            <g className="svg-node">
              <rect x="30" y="90" width="110" height="60" rx="8" fill="var(--surface-2)" stroke="var(--border-subtle)" strokeWidth="1" />
              <text x="85" y="118" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">Orazaka Gateway</text>
              <text x="85" y="132" fill="var(--text-muted)" fontSize="8" textAnchor="middle">BFF Cloud Instance</text>
            </g>

            {/* CLI Agent Listener */}
            <g className="svg-node">
              <rect x="230" y="38" width="120" height="54" rx="8" fill="var(--surface-3)" stroke="var(--accent)" strokeWidth="1.5" />
              <text x="290" y="60" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">CLI Agent</text>
              <text x="290" y="72" fill="var(--accent)" fontSize="8" fontWeight="bold" textAnchor="middle">`orazaka listen`</text>
              <text x="290" y="83" fill="var(--text-muted)" fontSize="7" textAnchor="middle">reverse SSE tunnel</text>
            </g>

            {/* Local SQLite DB */}
            <g className="svg-node">
              <rect x="430" y="38" width="120" height="54" rx="8" fill="var(--surface-2)" stroke="var(--border-subtle)" strokeWidth="1" />
              <text x="490" y="58" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">SQLite DB</text>
              <text x="490" y="70" fill="var(--text-muted)" fontSize="7" textAnchor="middle">~/.orazaka-tasks.db</text>
              <text x="490" y="81" fill="var(--status-success)" fontSize="7" fontWeight="bold" textAnchor="middle">resilient offline queue</text>
            </g>

            {/* Local Sandbox Executor */}
            <g className="svg-node">
              <rect x="320" y="140" width="140" height="54" rx="8" fill="var(--surface-2)" stroke="var(--border-subtle)" strokeWidth="1" />
              <text x="390" y="160" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">Sandbox Executor</text>
              <text x="390" y="172" fill="var(--text-muted)" fontSize="7" textAnchor="middle">Local scripts & bash commands</text>
              <text x="390" y="183" fill="var(--status-warning)" fontSize="7" fontWeight="bold" textAnchor="middle">timeout-bounded (300s)</text>
            </g>
          </svg>
  );
}
