"use client";

import { useId, useMemo, useState } from "react";

import { formatCents } from "@/lib/money";
import {
  REVENUE_RANGES,
  type RevenuePoint,
  type RevenueRangeId,
  sliceRevenueSeries,
} from "@/lib/revenue";

function axisLabel(cents: number) {
  if (cents === 0) {
    return "$0";
  }

  if (cents % 100 === 0) {
    return `$${cents / 100}`;
  }

  return formatCents(cents);
}

function monthName(day: string) {
  const month = Number(day.slice(5, 7));
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][month - 1];
}

function shouldLabel(point: RevenuePoint, index: number, total: number, range: RevenueRangeId) {
  if (index === 0 || index === total - 1) {
    return true;
  }

  if (range === "year") {
    return point.day.endsWith("-01");
  }

  return index % (range === "month" ? 5 : 3) === 0;
}

function xLabel(point: RevenuePoint, range: RevenueRangeId) {
  if (range === "year") {
    return monthName(point.day);
  }

  return point.label;
}

export function RevenueChart({ points }: { points: RevenuePoint[] }) {
  const [range, setRange] = useState<RevenueRangeId>("14d");
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const selected = REVENUE_RANGES.find((item) => item.id === range) ?? REVENUE_RANGES[0];
  const visible = useMemo(
    () => sliceRevenueSeries(points, selected.days),
    [points, selected.days],
  );
  const totalCents = visible.reduce((sum, point) => sum + point.cents, 0);

  const width = 640;
  const height = 220;
  const pad = { top: 16, right: 12, bottom: 32, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(...visible.map((point) => point.cents), 0);
  const peak = max === 0 ? 10_000 : max;
  const step = visible.length > 1 ? innerW / (visible.length - 1) : innerW;

  const coords = visible.map((point, index) => {
    const x = pad.left + index * step;
    const y = pad.top + innerH - (point.cents / peak) * innerH;
    return { x, y, ...point };
  });

  const line = coords
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const area = `${line} L ${coords.at(-1)?.x ?? pad.left} ${pad.top + innerH} L ${pad.left} ${pad.top + innerH} Z`;
  const ticks = [peak, Math.round(peak / 2), 0];
  const hovered = active != null ? coords[active] : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-sm font-semibold">Revenue</h2>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatCents(totalCents)}
          </p>
        </div>
        <div
          className="flex flex-wrap rounded-lg border border-line p-0.5"
          role="tablist"
          aria-label="Revenue range"
        >
          {REVENUE_RANGES.map((item) => {
            const selectedRange = item.id === range;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selectedRange}
                onClick={() => {
                  setRange(item.id);
                  setActive(null);
                }}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
                  selectedRange
                    ? "bg-moss text-ink"
                    : "text-mist hover:text-sand"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-2 pb-4 sm:px-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-52 w-full sm:h-60"
          role="img"
          aria-label={`${selected.label} revenue totaling ${formatCents(totalCents)}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a7b68a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a7b68a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => {
            const y = pad.top + innerH - (tick / peak) * innerH;
            return (
              <g key={tick}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={y}
                  y2={y}
                  stroke="#2c322c"
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#9aa394"
                  fontSize="10"
                >
                  {axisLabel(tick)}
                </text>
              </g>
            );
          })}

          <path d={area} fill={`url(#${gradientId})`} />
          <path
            d={line}
            fill="none"
            stroke="#a7b68a"
            strokeWidth="2.25"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {coords.map((point, index) => {
            const labeled = shouldLabel(point, index, coords.length, range);
            const showDot = range !== "year" || point.cents > 0 || active === index;
            return (
              <g key={point.day}>
                {showDot ? (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={active === index ? 4.5 : 3}
                    fill={
                      point.cents > 0 || active === index ? "#a7b68a" : "#151915"
                    }
                    stroke="#a7b68a"
                    strokeWidth="1.5"
                  />
                ) : null}
                {labeled ? (
                  <text
                    x={point.x}
                    y={height - 10}
                    textAnchor="middle"
                    fill="#9aa394"
                    fontSize="10"
                  >
                    {xLabel(point, range)}
                  </text>
                ) : null}
                <rect
                  x={point.x - step / 2}
                  y={pad.top}
                  width={Math.max(step, 4)}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                />
              </g>
            );
          })}

          {hovered ? (
            <g>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={pad.top}
                y2={pad.top + innerH}
                stroke="#a7b68a"
                strokeOpacity="0.35"
              />
              <rect
                x={Math.min(
                  Math.max(hovered.x - 52, pad.left),
                  width - pad.right - 104,
                )}
                y={Math.max(hovered.y - 36, 4)}
                width="104"
                height="28"
                rx="6"
                fill="#0c0f0c"
                stroke="#2c322c"
              />
              <text
                x={Math.min(
                  Math.max(hovered.x, pad.left + 52),
                  width - pad.right - 52,
                )}
                y={Math.max(hovered.y - 18, 22)}
                textAnchor="middle"
                fill="#e8ebe4"
                fontSize="11"
              >
                {hovered.label} · {formatCents(hovered.cents)}
              </text>
            </g>
          ) : null}
        </svg>
      </div>
    </section>
  );
}
