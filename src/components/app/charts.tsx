"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { compact, idr, idrShort } from "@/lib/app/format";

/** Format angka: fungsi (dari komponen client) atau nama format (dari komponen server) */
export type Fmt = ((n: number) => string) | "idr" | "idrShort" | "compact" | "number";
function fmt(f: Fmt): (n: number) => string {
  if (typeof f === "function") return f;
  if (f === "idr") return (n) => idr(n);
  if (f === "idrShort") return (n) => idrShort(n);
  if (f === "compact") return compact;
  return (n) => Math.round(n).toLocaleString("id-ID");
}

export const palette = ["#22D3EE", "#EC4899", "#A3E635", "#8B5CF6", "#F59E0B", "#3B82F6", "#14B8A6"];

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Lebar elemen (responsif) */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useIso(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(ref.current);
    setW(Math.floor(ref.current.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return r;
}

/** Angka yang naik pelan dari nilai sebelumnya ke nilai baru */
export function AnimatedNumber({ value, format: formatProp, duration = 1200 }: { value: number; format: Fmt; duration?: number }) {
  const format = fmt(formatProp);
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 4);
      setShown(a + (value - a) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);
  return <span className="tabular-nums">{format(shown)}</span>;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  const nice = m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10;
  return nice * p;
}

function linePath(points: [number, number][]) {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

function Tooltip({ x, y, w, children }: { x: number; y: number; w: number; children: React.ReactNode }) {
  const left = Math.min(Math.max(x, 70), w - 70);
  return (
    <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-line bg-raised px-3 py-2 text-xs shadow-[0_12px_30px_-12px_rgba(0,0,0,0.45)]" style={{ left, top: y - 8 }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Batang + garis (grafik utama penjualan)
// ---------------------------------------------------------------------------
export function ComboChart({
  data,
  height = 200,
  barColor = "#22D3EE",
  lineColor = "#EC4899",
  format: formatProp,
  barLabel = "Penjualan",
  lineLabel = "Rata-rata 7 hari",
}: {
  data: { label: string; value: number; line?: number }[];
  height?: number;
  barColor?: string;
  lineColor?: string;
  format: Fmt;
  barLabel?: string;
  lineLabel?: string;
}) {
  const format = fmt(formatProp);
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");
  const padL = 44, padB = 22, padT = 10;
  const iw = Math.max(0, w - padL - 4), ih = height - padB - padT;
  const max = niceMax(Math.max(1, ...data.map((d) => Math.max(d.value, d.line ?? 0))));
  const step = data.length ? iw / data.length : 0;
  const bw = Math.max(2, Math.min(18, step * 0.62));
  const y = (v: number) => padT + ih - (v / max) * ih;
  const pts = data.map((d, i) => [padL + i * step + step / 2, y(d.line ?? 0)] as [number, number]);
  const path = linePath(pts);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(iw / 56))));

  return (
    <div ref={ref} className="relative w-full" style={{ height }} onMouseLeave={() => setHover(null)}>
      {w > 0 && (
        <svg width={w} height={height} className="block overflow-visible">
          <defs>
            <linearGradient id={`b${gid}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={barColor} stopOpacity="0.95" />
              <stop offset="1" stopColor={barColor} stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={w - 4} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeDasharray={t === 0 ? undefined : "3 4"} />
              <text x={padL - 8} y={y(t) + 3} textAnchor="end" className="mono fill-[rgb(var(--muted))] text-[10px]">{format(t)}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = padL + i * step + (step - bw) / 2;
            const h = Math.max(d.value > 0 ? 2 : 0, ih - (y(d.value) - padT));
            const last = i === data.length - 1;
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                <rect x={padL + i * step} y={padT} width={step} height={ih} fill="transparent" />
                <rect
                  x={x}
                  y={padT + ih - h}
                  width={bw}
                  height={h}
                  rx={Math.min(4, bw / 2)}
                  fill={last ? barColor : `url(#b${gid})`}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                  className="anim-rise transition-opacity"
                  style={{ animationDelay: `${Math.min(i * 18, 900)}ms` }}
                />
                {i % labelEvery === 0 && (
                  <text x={padL + i * step + step / 2} y={height - 6} textAnchor="middle" className="mono fill-[rgb(var(--muted))] text-[10px]">{d.label}</text>
                )}
              </g>
            );
          })}
          {path && (
            <path d={path} fill="none" stroke={lineColor} strokeWidth={2.2} className="anim-draw" style={{ ["--len" as string]: 3000, animationDelay: "350ms" }} />
          )}
          {hover !== null && (
            <>
              <line x1={pts[hover][0]} x2={pts[hover][0]} y1={padT} y2={padT + ih} stroke="rgb(var(--fg) / 0.25)" strokeDasharray="3 3" />
              <circle cx={pts[hover][0]} cy={pts[hover][1]} r={4} fill={lineColor} stroke="rgb(var(--raised))" strokeWidth={2} />
            </>
          )}
          {data.length > 0 && (
            <g className="anim-fade" style={{ animationDelay: "900ms" }}>
              <rect x={Math.min(w - 92, pts[pts.length - 1][0] - 40)} y={Math.max(0, y(data[data.length - 1].value) - 26)} width={84} height={20} rx={10} fill="rgb(var(--raised))" stroke={barColor} />
              <text x={Math.min(w - 50, pts[pts.length - 1][0] + 2)} y={Math.max(0, y(data[data.length - 1].value) - 26) + 14} textAnchor="middle" className="mono text-[10px] font-semibold" fill={barColor}>
                {format(data[data.length - 1].value)}
              </text>
            </g>
          )}
        </svg>
      )}
      {hover !== null && data[hover] && (
        <Tooltip x={pts[hover][0]} y={Math.min(y(data[hover].value), pts[hover][1])} w={w}>
          <p className="font-semibold">{data[hover].label}</p>
          <p className="mt-1 flex items-center gap-2"><span className="h-2 w-2 rounded-sm" style={{ background: barColor }} />{barLabel}: <b className="tabular-nums">{format(data[hover].value)}</b></p>
          {data[hover].line !== undefined && (
            <p className="flex items-center gap-2"><span className="h-0.5 w-2.5" style={{ background: lineColor }} />{lineLabel}: <b className="tabular-nums">{format(data[hover].line!)}</b></p>
          )}
        </Tooltip>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Donut
// ---------------------------------------------------------------------------
export function Donut({
  segments,
  center,
  sub,
  size = 150,
  thickness = 16,
  format: formatProp,
}: {
  segments: { name: string; value: number; color?: string }[];
  center: React.ReactNode;
  sub?: string;
  size?: number;
  thickness?: number;
  format: Fmt;
}) {
  const format = fmt(formatProp);
  const [hover, setHover] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const total = segments.reduce((a, s) => a + Math.max(0, s.value), 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const gap = segments.length > 1 ? 4 : 0;
  let acc = 0;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--chart-grid)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (Math.max(0, s.value) / total) * c;
            const dash = Math.max(0, len - gap);
            const off = -acc;
            acc += len;
            return (
              <circle
                key={s.name}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color ?? palette[i % palette.length]}
                strokeWidth={hover === i ? thickness + 4 : thickness}
                strokeLinecap="round"
                strokeDasharray={`${mounted ? dash : 0} ${c}`}
                strokeDashoffset={off}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ transition: `stroke-dasharray 1.1s cubic-bezier(.2,.9,.2,1) ${i * 120}ms, stroke-width .2s` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-lg font-semibold tabular-nums leading-tight">{hover !== null ? format(segments[hover].value) : center}</p>
            <p className="mono mt-0.5 text-[10px] uppercase tracking-wider text-muted">{hover !== null ? segments[hover].name : sub}</p>
          </div>
        </div>
      </div>
      <ul className="grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-1 text-xs sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {segments.map((s, i) => (
          <li key={s.name} className={`flex items-center gap-2 rounded-lg px-1.5 py-1 transition ${hover === i ? "bg-fg/[0.05]" : ""}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color ?? palette[i % palette.length] }} />
            <span className="min-w-0 flex-1 truncate text-fg/85">{s.name}</span>
            <span className="mono tabular-nums text-muted">{((Math.max(0, s.value) / total) * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Batang horizontal (produk / pelanggan teratas)
// ---------------------------------------------------------------------------
export function HBars({ items, format: formatProp, color = "#22D3EE", target }: { items: { name: string; value: number; sub?: string }[]; format: Fmt; color?: string; target?: number }) {
  const format = fmt(formatProp);
  const max = Math.max(1, ...items.map((i) => i.value), target ?? 0);
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={it.name} className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 text-xs">
          <span className="truncate text-fg/85" title={it.name}>{it.name}</span>
          <span className="relative h-2.5 overflow-hidden rounded-full bg-fg/[0.06]">
            <span
              className="anim-grow-x absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${(it.value / max) * 100}%`, background: `linear-gradient(90deg, ${color}66, ${color})`, animationDelay: `${i * 90}ms` }}
            />
            {target !== undefined && <span className="absolute inset-y-[-3px] w-0.5 bg-fg/40" style={{ left: `${(target / max) * 100}%` }} />}
          </span>
          <span className="mono w-16 text-right tabular-nums text-fg/85">{format(it.value)}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Sparkline area
// ---------------------------------------------------------------------------
export function Sparkline({ values, color = "#8B5CF6", height = 44 }: { values: number[]; color?: string; height?: number }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const gid = useId().replace(/:/g, "");
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const pts = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * w, height - 4 - ((v - min) / (max - min || 1)) * (height - 8)] as [number, number]);
  const d = linePath(pts);
  return (
    <div ref={ref} className="w-full" style={{ height }}>
      {w > 0 && pts.length > 1 && (
        <svg width={w} height={height} className="block overflow-visible">
          <defs>
            <linearGradient id={`s${gid}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.35" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d} L${w},${height} L0,${height} Z`} fill={`url(#s${gid})`} className="anim-fade" style={{ animationDelay: "500ms" }} />
          <path d={d} fill="none" stroke={color} strokeWidth={1.8} className="anim-draw" style={{ ["--len" as string]: 1200 }} />
          <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3} fill={color} className="anim-fade" style={{ animationDelay: "1.2s" }} />
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gauge dengan jarum berayun
// ---------------------------------------------------------------------------
export function Gauge({ value, label, size = 180 }: { value: number; label: string; size?: number }) {
  const v = Math.max(0, Math.min(100, value));
  const [angle, setAngle] = useState(-120);
  useEffect(() => {
    const t = setTimeout(() => setAngle(-120 + (v / 100) * 240), 120);
    return () => clearTimeout(t);
  }, [v]);
  const cx = size / 2, cy = size / 2, r = size / 2 - 16;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [cx + r * Math.cos(((a - 90) * Math.PI) / 180), cy + r * Math.sin(((a - 90) * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`;
  };
  const gid = useId().replace(/:/g, "");
  return (
    <div className="relative" style={{ width: size, height: size * 0.82 }}>
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id={`g${gid}`} x1="0" x2="1">
            <stop offset="0" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#1B5BFF" />
          </linearGradient>
        </defs>
        <path d={arc(-120, 120)} stroke="var(--chart-grid)" strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d={arc(-120, -120 + (v / 100) * 240 || -119.9)} stroke={`url(#g${gid})`} strokeWidth={12} fill="none" strokeLinecap="round" className="anim-draw" style={{ ["--len" as string]: 600 }} />
        {Array.from({ length: 11 }).map((_, i) => {
          const a = -120 + i * 24;
          const rad = ((a - 90) * Math.PI) / 180;
          return <line key={i} x1={cx + (r - 14) * Math.cos(rad)} y1={cy + (r - 14) * Math.sin(rad)} x2={cx + (r - (i % 5 === 0 ? 22 : 18)) * Math.cos(rad)} y2={cy + (r - (i % 5 === 0 ? 22 : 18)) * Math.sin(rad)} stroke="rgb(var(--muted) / 0.6)" strokeWidth={i % 5 === 0 ? 1.6 : 1} />;
        })}
        {[0, 25, 50, 75, 100].map((t) => {
          const a = -120 + (t / 100) * 240;
          const rad = ((a - 90) * Math.PI) / 180;
          return <text key={t} x={cx + (r - 32) * Math.cos(rad)} y={cy + (r - 32) * Math.sin(rad) + 3} textAnchor="middle" className="mono fill-[rgb(var(--muted))] text-[9px]">{t}</text>;
        })}
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "transform 1.6s cubic-bezier(.34,1.56,.64,1)" }}>
          <path d={`M${cx - 3},${cy} L${cx},${cy - r + 22} L${cx + 3},${cy} Z`} fill="rgb(var(--fg))" />
        </g>
        <circle cx={cx} cy={cy} r={7} fill="rgb(var(--raised))" stroke="rgb(var(--fg))" strokeWidth={2.5} />
      </svg>
      <div className="absolute inset-x-0 text-center" style={{ top: cy + 16 }}>
        <p className="text-xl font-semibold tabular-nums"><AnimatedNumber value={v} format={(n) => `${n.toFixed(0)}%`} /></p>
        <p className="mono text-[10px] uppercase tracking-wider text-muted">{label}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kolom (bulanan) dengan sorotan bulan terakhir dan kurva tren
// ---------------------------------------------------------------------------
export function Columns({
  data,
  format: formatProp,
  color = "#84CC16",
  highlight = "#F97316",
  height = 150,
  trend = false,
}: {
  data: { label: string; value: number; sub?: string }[];
  format: Fmt;
  color?: string;
  highlight?: string;
  height?: number;
  trend?: boolean;
}) {
  const format = fmt(formatProp);
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const top = 20, bottom = 30;
  const ih = height - top - bottom;
  const maxAbs = Math.max(1, ...data.map((d) => Math.abs(d.value)));
  const hasNeg = data.some((d) => d.value < 0);
  const zero = hasNeg ? top + ih / 2 : top + ih;
  const scale = hasNeg ? ih / 2 / maxAbs : ih / maxAbs;
  const step = data.length ? w / data.length : 0;
  const bw = Math.min(34, step * 0.5);
  const pts = data.map((d, i) => [i * step + step / 2, zero - d.value * scale - 6] as [number, number]);
  return (
    <div ref={ref} className="relative w-full" style={{ height }} onMouseLeave={() => setHover(null)}>
      {w > 0 && (
        <svg width={w} height={height} className="block overflow-visible">
          <line x1={0} x2={w} y1={zero} y2={zero} stroke="var(--chart-grid)" />
          {data.map((d, i) => {
            const h = Math.abs(d.value) * scale;
            const last = i === data.length - 1;
            const fill = d.value < 0 ? "#F43F5E" : last ? highlight : color;
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                <rect x={i * step} y={0} width={step} height={height} fill="transparent" />
                <rect
                  x={i * step + (step - bw) / 2}
                  y={d.value >= 0 ? zero - h : zero}
                  width={bw}
                  height={Math.max(1, h)}
                  rx={6}
                  fill={fill}
                  fillOpacity={hover === null || hover === i ? 0.95 : 0.4}
                  className="anim-rise"
                  style={{ animationDelay: `${i * 110}ms`, transformOrigin: d.value >= 0 ? "bottom" : "top" }}
                />
                <text x={i * step + step / 2} y={height - 14} textAnchor="middle" className="mono fill-[rgb(var(--muted))] text-[10px]">{d.label}</text>
                {d.sub && <text x={i * step + step / 2} y={height - 2} textAnchor="middle" className="mono text-[9px]" fill={d.sub.startsWith("-") ? "#F43F5E" : "#10B981"}>{d.sub}</text>}
              </g>
            );
          })}
          {trend && pts.length > 1 && (
            <path d={linePath(pts)} fill="none" stroke={color} strokeWidth={1.6} strokeDasharray="0" className="anim-draw" style={{ ["--len" as string]: 1500, animationDelay: "600ms" }} />
          )}
        </svg>
      )}
      {hover !== null && data[hover] && (
        <Tooltip x={hover * step + step / 2} y={Math.min(zero - Math.max(0, data[hover].value) * scale, zero)} w={w}>
          <p className="font-semibold">{data[hover].label}</p>
          <p className="tabular-nums">{format(data[hover].value)}</p>
        </Tooltip>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Batang berpasangan (kas masuk vs keluar)
// ---------------------------------------------------------------------------
export function PairBars({
  data,
  format: formatProp,
  colors = ["#22D3EE", "#EC4899"],
  names = ["Masuk", "Keluar"],
  height = 150,
}: {
  data: { label: string; a: number; b: number }[];
  format: Fmt;
  colors?: [string, string];
  names?: [string, string];
  height?: number;
}) {
  const format = fmt(formatProp);
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const top = 8, bottom = 18, left = 40;
  const ih = height - top - bottom;
  const max = niceMax(Math.max(1, ...data.flatMap((d) => [d.a, d.b])));
  const step = data.length ? (w - left) / data.length : 0;
  const bw = Math.max(3, Math.min(12, step * 0.3));
  const y = (v: number) => top + ih - (v / max) * ih;
  return (
    <div ref={ref} className="relative w-full" style={{ height }} onMouseLeave={() => setHover(null)}>
      {w > 0 && (
        <svg width={w} height={height} className="block">
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={left} x2={w} y1={y(t * max)} y2={y(t * max)} stroke="var(--chart-grid)" strokeDasharray={t ? "3 4" : undefined} />
              <text x={left - 6} y={y(t * max) + 3} textAnchor="end" className="mono fill-[rgb(var(--muted))] text-[9px]">{format(t * max)}</text>
            </g>
          ))}
          {data.map((d, i) => (
            <g key={i} onMouseEnter={() => setHover(i)} opacity={hover === null || hover === i ? 1 : 0.45}>
              <rect x={left + i * step} y={0} width={step} height={height} fill="transparent" />
              <rect x={left + i * step + step / 2 - bw - 1} y={y(d.a)} width={bw} height={top + ih - y(d.a)} rx={3} fill={colors[0]} className="anim-rise" style={{ animationDelay: `${i * 40}ms` }} />
              <rect x={left + i * step + step / 2 + 1} y={y(d.b)} width={bw} height={top + ih - y(d.b)} rx={3} fill={colors[1]} className="anim-rise" style={{ animationDelay: `${i * 40 + 80}ms` }} />
              {(i % Math.max(1, Math.ceil(data.length / 7)) === 0) && (
                <text x={left + i * step + step / 2} y={height - 4} textAnchor="middle" className="mono fill-[rgb(var(--muted))] text-[9px]">{d.label}</text>
              )}
            </g>
          ))}
        </svg>
      )}
      {hover !== null && data[hover] && (
        <Tooltip x={left + hover * step + step / 2} y={y(Math.max(data[hover].a, data[hover].b))} w={w}>
          <p className="font-semibold">{data[hover].label}</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm" style={{ background: colors[0] }} />{names[0]}: <b className="tabular-nums">{format(data[hover].a)}</b></p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm" style={{ background: colors[1] }} />{names[1]}: <b className="tabular-nums">{format(data[hover].b)}</b></p>
        </Tooltip>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Garis ganda (arus kas kumulatif)
// ---------------------------------------------------------------------------
export function MultiLine({
  series,
  labels,
  format: formatProp,
  height = 170,
}: {
  series: { name: string; color: string; values: number[] }[];
  labels: string[];
  format: Fmt;
  height?: number;
}) {
  const format = fmt(formatProp);
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const left = 44, top = 10, bottom = 20;
  const ih = height - top - bottom;
  const all = series.flatMap((s) => s.values);
  const max = niceMax(Math.max(1, ...all));
  const min = Math.min(0, ...all);
  const range = max - min || 1;
  const n = labels.length;
  const x = (i: number) => left + (i / Math.max(1, n - 1)) * (w - left - 6);
  const y = (v: number) => top + ih - ((v - min) / range) * ih;
  const paths = useMemo(() => series.map((s) => linePath(s.values.map((v, i) => [x(i), y(v)]))), [series, w]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const i = Math.round(((e.clientX - rect.left - left) / (w - left - 6)) * (n - 1));
        setHover(i >= 0 && i < n ? i : null);
      }}
      onMouseLeave={() => setHover(null)}
    >
      {w > 0 && (
        <svg width={w} height={height} className="block">
          {[0, 0.5, 1].map((t) => {
            const v = min + t * range;
            return (
              <g key={t}>
                <line x1={left} x2={w} y1={y(v)} y2={y(v)} stroke="var(--chart-grid)" strokeDasharray="3 4" />
                <text x={left - 6} y={y(v) + 3} textAnchor="end" className="mono fill-[rgb(var(--muted))] text-[9px]">{format(v)}</text>
              </g>
            );
          })}
          {paths.map((d, i) => (
            <path key={series[i].name} d={d} fill="none" stroke={series[i].color} strokeWidth={1.9} className="anim-draw" style={{ ["--len" as string]: 3000, animationDelay: `${i * 200}ms` }} />
          ))}
          {labels.map((l, i) => (i % Math.max(1, Math.ceil(n / 7)) === 0 ? <text key={i} x={x(i)} y={height - 4} textAnchor="middle" className="mono fill-[rgb(var(--muted))] text-[9px]">{l}</text> : null))}
          {hover !== null && (
            <>
              <line x1={x(hover)} x2={x(hover)} y1={top} y2={top + ih} stroke="rgb(var(--fg) / 0.25)" strokeDasharray="3 3" />
              {series.map((s) => <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r={3.5} fill={s.color} stroke="rgb(var(--raised))" strokeWidth={1.5} />)}
            </>
          )}
        </svg>
      )}
      {hover !== null && (
        <Tooltip x={x(hover)} y={top + 20} w={w}>
          <p className="font-semibold">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.name} className="flex items-center gap-2"><span className="h-0.5 w-2.5" style={{ background: s.color }} />{s.name}: <b className="tabular-nums">{format(s.values[hover])}</b></p>
          ))}
        </Tooltip>
      )}
    </div>
  );
}
