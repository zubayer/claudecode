/** Original hand-built SVG illustrations (no external images). */
export function Hero() {
  return (
    <svg viewBox="0 0 360 176" className="w-full h-auto rounded-md border bg-card" role="img" aria-label="A path climbing from a terminal prompt to a summit flag">
      <defs>
        <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="hsl(var(--border))" />
        </pattern>
      </defs>
      <rect width="360" height="176" fill="url(#dots)" />
      <g transform="translate(0 26)">
      {/* mountains */}
      <path d="M0 150 L70 88 L110 112 L175 42 L235 98 L280 70 L360 130 L360 150 Z" fill="hsl(var(--secondary))" />
      <path d="M175 42 L192 58 L182 56 L175 66 L168 55 L160 59 Z" fill="hsl(var(--background))" opacity=".8" />
      {/* trail */}
      <path
        d="M28 138 C 70 132, 80 118, 110 116 S 150 96, 160 80 S 172 58, 175 46"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        strokeDasharray="5 5"
        strokeLinecap="round"
      />
      {[
        [28, 138, "0"],
        [72, 128, "1"],
        [110, 116, "2"],
        [140, 101, "3"],
        [160, 80, "4"],
        [170, 62, "5"],
      ].map(([x, y, n]) => (
        <g key={n as string}>
          <circle cx={x as number} cy={y as number} r="7" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x={x as number} y={(y as number) + 3} textAnchor="middle" fontSize="8" fontFamily="ui-monospace,monospace" fill="hsl(var(--foreground))">
            {n}
          </text>
        </g>
      ))}
      {/* flag */}
      <line x1="175" y1="46" x2="175" y2="20" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <path d="M175 20 L196 26 L175 32 Z" fill="hsl(var(--sage))" />
      <text x="168" y="18" textAnchor="end" fontSize="9" fontFamily="ui-monospace,monospace" fill="hsl(var(--muted-foreground))">6 · pro</text>
      </g>
      {/* terminal window */}
      <g transform="translate(232 14)">
        <rect width="116" height="62" rx="4" fill="hsl(var(--term-bg))" />
        <circle cx="8" cy="7" r="2" fill="#e06c5a" />
        <circle cx="15" cy="7" r="2" fill="#e8b04b" />
        <circle cx="22" cy="7" r="2" fill="#8fb996" />
        <text x="8" y="25" fontSize="8" fontFamily="ui-monospace,monospace" fill="#e8b04b">$ claude</text>
        <text x="8" y="37" fontSize="7" fontFamily="ui-monospace,monospace" fill="#ddd">› plan, then build</text>
        <text x="8" y="49" fontSize="7" fontFamily="ui-monospace,monospace" fill="#8fb996">✓ tests pass</text>
      </g>
      <text x="12" y="20" fontSize="15" fontFamily="'Iowan Old Style',Georgia,serif" fill="hsl(var(--foreground))">Claude Code Academy</text>
      <text x="12" y="34" fontSize="8.5" fontFamily="ui-monospace,monospace" fill="hsl(var(--muted-foreground))">zero → pro, one lesson at a time</text>
    </svg>
  )
}

/** The agentic loop diagram used in lessons */
export function LoopDiagram() {
  const nodes = [
    { x: 180, y: 28, t: "Gather context", s: "read files, search" },
    { x: 320, y: 110, t: "Take action", s: "edit, run commands" },
    { x: 180, y: 192, t: "Verify", s: "tests, builds, diffs" },
    { x: 40, y: 110, t: "You steer", s: "approve, redirect" },
  ]
  return (
    <svg viewBox="0 0 360 220" className="w-full h-auto my-3" role="img" aria-label="Agentic loop: gather context, take action, verify, you steer">
      <circle cx="180" cy="110" r="78" fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 6" />
      <text x="180" y="106" textAnchor="middle" fontSize="12" fontFamily="'Iowan Old Style',Georgia,serif" fill="hsl(var(--foreground))">agentic</text>
      <text x="180" y="121" textAnchor="middle" fontSize="12" fontFamily="'Iowan Old Style',Georgia,serif" fill="hsl(var(--foreground))">loop</text>
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x - 52} y={n.y - 18} width="104" height="36" rx="4" fill="hsl(var(--card))" stroke={i === 3 ? "hsl(var(--sage))" : "hsl(var(--primary))"} strokeWidth="1.5" />
          <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize="10" fontWeight="600" fill="hsl(var(--foreground))">{n.t}</text>
          <text x={n.x} y={n.y + 10} textAnchor="middle" fontSize="8" fontFamily="ui-monospace,monospace" fill="hsl(var(--muted-foreground))">{n.s}</text>
        </g>
      ))}
    </svg>
  )
}
