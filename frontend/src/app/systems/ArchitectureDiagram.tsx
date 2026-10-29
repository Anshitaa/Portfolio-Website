'use client';

import { LAYER_STYLES, type System } from './data';

// Grid geometry (SVG user units)
const NODE_W = 212;
const NODE_H = 68;
const COL_GAP = 318;
const ROW_GAP = 124;
const PAD_X = 126; // room for lane labels on the left
const PAD_Y = 34;

const center = (col: number, row: number) => ({
  x: PAD_X + col * COL_GAP + NODE_W / 2,
  y: PAD_Y + row * ROW_GAP + NODE_H / 2,
});

// Point where the ray from a box centre towards (dx, dy) leaves the box
function exitPoint(cx: number, cy: number, dx: number, dy: number, gap = 4) {
  const hw = NODE_W / 2 + gap;
  const hh = NODE_H / 2 + gap;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  return { x: cx + dx * t, y: cy + dy * t };
}

interface Props {
  system: System;
  selected: string;
  cursor: number; // replay progress; -1 = idle
  running: boolean;
  onSelect: (id: string) => void;
}

export default function ArchitectureDiagram({ system, selected, cursor, running, onSelect }: Props) {
  const { lanes, pos, edges } = system.diagram;
  const maxCol = Math.max(...Object.values(pos).map(([c]) => c));
  const width = PAD_X + maxCol * COL_GAP + NODE_W + 24;
  const height = PAD_Y + (lanes.length - 1) * ROW_GAP + NODE_H + 30;
  const order = Object.fromEntries(system.nodes.map((n, i) => [n.id, i]));
  const reached = (id: string) => cursor >= order[id];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto min-w-[720px] select-none"
      role="img"
      aria-label={`${system.name} architecture diagram`}
    >
      <defs>
        <marker id={`arrow-${system.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
        </marker>
        <marker id={`arrow-on-${system.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#7c3aed" />
        </marker>
      </defs>

      {/* Lanes */}
      {lanes.map((lane, row) => {
        const y = PAD_Y + row * ROW_GAP - 20;
        return (
          <g key={lane}>
            <rect x={8} y={y} width={width - 16} height={ROW_GAP - 6} rx={12}
              fill={row % 2 ? '#ffffff' : '#f8f7fc'} />
            <text x={22} y={y + 20 + NODE_H / 2 + 5} fontSize={13} fontWeight={600}
              fill="#6b7280" letterSpacing="0.05em">
              {lane.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Edges */}
      {edges.map(e => {
        const [fc, fr] = pos[e.from];
        const [tc, tr] = pos[e.to];
        const a = center(fc, fr);
        const b = center(tc, tr);
        // Feedback (dashed) edges bow out so they don't sit on top of forward edges
        const bend = e.dashed ? (e.bend ?? 52) : 0;
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const ctrl = {
          x: (a.x + b.x) / 2 + (-(b.y - a.y) / len) * bend,
          y: (a.y + b.y) / 2 + ((b.x - a.x) / len) * bend,
        };
        const p1 = exitPoint(a.x, a.y, ctrl.x - a.x, ctrl.y - a.y);
        const p2 = exitPoint(b.x, b.y, ctrl.x - b.x, ctrl.y - b.y, 7);
        const d = bend
          ? `M${p1.x},${p1.y} Q${ctrl.x},${ctrl.y} ${p2.x},${p2.y}`
          : `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
        const lit = cursor >= 0 && reached(e.from) && reached(e.to);
        const mx = bend ? 0.25 * p1.x + 0.5 * ctrl.x + 0.25 * p2.x : (p1.x + p2.x) / 2;
        const my = bend ? 0.25 * p1.y + 0.5 * ctrl.y + 0.25 * p2.y : (p1.y + p2.y) / 2;
        const lw = e.label ? e.label.length * 7.1 + 14 : 0;
        return (
          <g key={`${e.from}-${e.to}`}>
            <path
              d={d}
              fill="none"
              stroke={lit ? '#7c3aed' : '#94a3b8'}
              strokeWidth={lit ? 2 : 1.5}
              strokeDasharray={e.dashed ? '5 5' : undefined}
              markerEnd={`url(#${lit ? 'arrow-on' : 'arrow'}-${system.id})`}
              className="transition-all duration-500"
            >
              {e.dashed && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.2s" repeatCount="indefinite" />}
            </path>
            {e.label && (
              <g>
                <rect x={mx - lw / 2} y={my - 11} width={lw} height={22} rx={11}
                  fill="#ffffff" stroke={e.dashed ? '#c4b5fd' : '#e5e7eb'} />
                <text x={mx} y={my + 4} fontSize={12} textAnchor="middle"
                  fill={e.dashed ? '#6d28d9' : '#374151'} fontFamily="var(--font-geist-mono), monospace">
                  {e.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {system.nodes.map((n, i) => {
        const [col, row] = pos[n.id];
        const x = PAD_X + col * COL_GAP;
        const y = PAD_Y + row * ROW_GAP;
        const s = LAYER_STYLES[n.layer];
        const isSel = n.id === selected;
        const active = running && cursor === i;
        const done = cursor >= i && cursor >= 0;
        return (
          <g
            key={n.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`${n.label}: ${n.tech}`}
            onClick={() => onSelect(n.id)}
            onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onSelect(n.id); } }}
            className="cursor-pointer outline-none"
          >
            {active && (
              <rect x={x - 5} y={y - 5} width={NODE_W + 10} height={NODE_H + 10} rx={14}
                fill="none" stroke={s.hex} strokeOpacity={0.35} strokeWidth={6}>
                <animate attributeName="stroke-opacity" values="0.45;0.1;0.45" dur="0.9s" repeatCount="indefinite" />
              </rect>
            )}
            <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={10}
              fill="#ffffff"
              stroke={isSel ? s.hex : '#e5e7eb'}
              strokeWidth={isSel ? 2.25 : 1.25}
              className="transition-all duration-300" />
            <rect x={x} y={y + 10} width={3.5} height={NODE_H - 20} rx={1.75} fill={s.hex} />
            <text x={x + 16} y={y + 28} fontSize={16} fontWeight={600} fill="#111827">{n.label}</text>
            <text x={x + 16} y={y + 50} fontSize={12.5} fill="#374151">
              {n.tech.length > 29 ? n.tech.slice(0, 28) + '…' : n.tech}
            </text>
            {done && (
              <g>
                <circle cx={x + NODE_W - 13} cy={y + 13} r={7} fill="#10b981" />
                <path d={`M${x + NODE_W - 16.5} ${y + 13} l2.5 2.5 l4.5 -5`} stroke="#fff" strokeWidth={1.6} fill="none" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
