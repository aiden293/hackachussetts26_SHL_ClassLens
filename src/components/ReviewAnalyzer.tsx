"use client";

import { useMemo, useState } from "react";
import {
  analyzeReviews,
  type ReviewAnalysis,
} from "@/lib/analyzer/reviewAnalyzer";
import {
  getReviewsByCourse,
  getReviewsBySemester,
} from "@/lib/data/reviews";

const sentimentColor: Record<string, string> = {
  positive: "text-positive",
  neutral: "text-neutral",
  negative: "text-negative",
};

const sentimentBg: Record<string, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-amber-500",
  negative: "bg-red-500",
};

const OVERALL = "__overall__";

type SemesterAnalysis = {
  semester: string;
  analysis: ReviewAnalysis;
};

export default function ReviewAnalyzer({ courseId }: { courseId: string }) {
  // Overall analysis across all semesters.
  const overall = useMemo(
    () => analyzeReviews(getReviewsByCourse(courseId)),
    [courseId]
  );

  // Per-semester analyses, newest first.
  const semesters = useMemo<SemesterAnalysis[]>(() => {
    return getReviewsBySemester(courseId)
      .map((group) => {
        const analysis = analyzeReviews(group.reviews);
        return analysis ? { semester: group.semester, analysis } : null;
      })
      .filter((x): x is SemesterAnalysis => x !== null);
  }, [courseId]);

  const [selected, setSelected] = useState<string>(OVERALL);

  if (!overall) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        No reviews yet for this course — nothing to analyze.
      </div>
    );
  }

  const active =
    selected === OVERALL
      ? overall
      : semesters.find((s) => s.semester === selected)?.analysis ?? overall;

  return (
    <div className="space-y-6">
      {/* Semester selector */}
      <div className="flex flex-wrap gap-2">
        <SelectorChip
          active={selected === OVERALL}
          onClick={() => setSelected(OVERALL)}
          label="Overall"
          sublabel={`${overall.totalReviews} reviews`}
        />
        {semesters.map((s) => (
          <SelectorChip
            key={s.semester}
            active={selected === s.semester}
            onClick={() => setSelected(s.semester)}
            label={s.semester}
            sublabel={`${s.analysis.totalReviews} • ${s.analysis.averageRating.toFixed(1)}★`}
          />
        ))}
      </div>

      {/* Semester-over-semester trends (only meaningful with 2+ semesters) */}
      {semesters.length > 1 && (
        <SemesterTrends semesters={semesters} />
      )}

      {/* Active analysis panel */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-semibold">
            {selected === OVERALL
              ? "Overall analysis"
              : `${selected} analysis`}
          </h3>
          <span className="rounded-full bg-background px-2.5 py-0.5 text-xs text-muted">
            {active.totalReviews} review{active.totalReviews === 1 ? "" : "s"}
          </span>
        </div>
        <AnalysisPanel analysis={active} />
      </div>
    </div>
  );
}

/* ----------------------------- Semester trends ---------------------------- */

function SemesterTrends({ semesters }: { semesters: SemesterAnalysis[] }) {
  // Show oldest → newest so trends read left to right over time.
  const ordered = [...semesters].reverse();

  const metrics: {
    key: keyof ReviewAnalysis;
    label: string;
    format: (n: number) => string;
    /** Whether a higher value is "better" (green) for the delta badge. */
    higherIsBetter: boolean;
  }[] = [
    {
      key: "averageRating",
      label: "Avg rating",
      format: (n) => n.toFixed(1),
      higherIsBetter: true,
    },
    {
      key: "wouldTakeAgainPct",
      label: "Would retake",
      format: (n) => `${n}%`,
      higherIsBetter: true,
    },
    {
      key: "averageWorkloadHours",
      label: "Workload (h)",
      format: (n) => `${n}`,
      higherIsBetter: false,
    },
    {
      key: "averageDifficulty",
      label: "Difficulty",
      format: (n) => `${n}/5`,
      higherIsBetter: false,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <TrendIcon />
        Semester-over-semester trends
      </h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="pb-2 font-medium">Metric</th>
              {ordered.map((s) => (
                <th key={s.semester} className="pb-2 font-medium">
                  {s.semester}
                </th>
              ))}
              <th className="pb-2 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const values = ordered.map(
                (s) => s.analysis[metric.key] as number
              );
              const first = values[0];
              const last = values[values.length - 1];
              const delta = last - first;
              return (
                <tr key={metric.key} className="border-t border-border">
                  <td className="py-2 text-muted">{metric.label}</td>
                  {values.map((v, i) => (
                    <td key={i} className="py-2 font-medium">
                      {metric.format(v)}
                    </td>
                  ))}
                  <td className="py-2">
                    <DeltaBadge
                      delta={delta}
                      format={metric.format}
                      higherIsBetter={metric.higherIsBetter}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Trend compares the earliest shown semester to the most recent.
      </p>
    </div>
  );
}

function DeltaBadge({
  delta,
  format,
  higherIsBetter,
}: {
  delta: number;
  format: (n: number) => string;
  higherIsBetter: boolean;
}) {
  const rounded = Math.round(delta * 10) / 10;
  if (rounded === 0) {
    return <span className="text-xs text-muted">no change</span>;
  }
  const improved = higherIsBetter ? rounded > 0 : rounded < 0;
  const color = improved ? "text-positive" : "text-negative";
  const arrow = rounded > 0 ? "▲" : "▼";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      {arrow} {format(Math.abs(rounded))}
    </span>
  );
}

/* ----------------------------- Analysis panel ----------------------------- */

function AnalysisPanel({ analysis }: { analysis: ReviewAnalysis }) {
  const maxRatingCount = Math.max(...analysis.ratingDistribution, 1);
  const sentimentTotal =
    analysis.sentiment.positive +
    analysis.sentiment.neutral +
    analysis.sentiment.negative;

  return (
    <div className="space-y-6">
      {/* Headline stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Avg rating" value={analysis.averageRating.toFixed(1)} accent />
        <Stat label="Reviews" value={String(analysis.totalReviews)} />
        <Stat label="Avg workload" value={`${analysis.averageWorkloadHours}h`} />
        <Stat label="Would retake" value={`${analysis.wouldTakeAgainPct}%`} />
      </div>

      {/* Highlights */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <SparkIcon />
          Auto-generated insights
        </h4>
        <ul className="mt-3 space-y-2">
          {analysis.highlights.map((h, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {h}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Generated offline from review data. An AI-powered version can be
          swapped in later.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rating distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="text-sm font-semibold">Rating distribution</h4>
          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = analysis.ratingDistribution[star - 1];
              const pct = (count / maxRatingCount) * 100;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-muted">{star}★</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-muted">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sentiment */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="text-sm font-semibold">Sentiment breakdown</h4>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-background">
            {(["positive", "neutral", "negative"] as const).map((key) => {
              const value = analysis.sentiment[key];
              const pct = sentimentTotal ? (value / sentimentTotal) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={key}
                  className={sentimentBg[key]}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            {(["positive", "neutral", "negative"] as const).map((key) => (
              <div key={key}>
                <div className={`font-semibold ${sentimentColor[key]}`}>
                  {analysis.sentiment[key]}
                </div>
                <div className="text-xs capitalize text-muted">{key}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Themes */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="text-sm font-semibold">Common themes</h4>
        <div className="mt-4 flex flex-wrap gap-2">
          {analysis.themes.map((theme) => (
            <span
              key={theme.label}
              className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm ${sentimentColor[theme.sentiment]}`}
            >
              <span className={`h-2 w-2 rounded-full ${sentimentBg[theme.sentiment]}`} />
              {theme.label}
              <span className="text-muted">· {theme.count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Representative quotes */}
      {(analysis.representativeQuotes.positive ||
        analysis.representativeQuotes.critical) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {analysis.representativeQuotes.positive && (
            <blockquote className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide">
                Representative praise
              </p>
              “{analysis.representativeQuotes.positive}”
            </blockquote>
          )}
          {analysis.representativeQuotes.critical && (
            <blockquote className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide">
                Representative critique
              </p>
              “{analysis.representativeQuotes.critical}”
            </blockquote>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Bits ------------------------------------ */

function SelectorChip({
  active,
  onClick,
  label,
  sublabel,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-left transition-colors ${
        active
          ? "border-brand bg-brand/5"
          : "border-border bg-card hover:border-brand"
      }`}
    >
      <div className={`text-sm font-medium ${active ? "text-brand-ink" : ""}`}>
        {label}
      </div>
      <div className="text-xs text-muted">{sublabel}</div>
    </button>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className={`text-2xl font-bold ${accent ? "text-rating-ink" : ""}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-brand-ink"
    >
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="m5.6 5.6 2.1 2.1" />
      <path d="m16.3 16.3 2.1 2.1" />
      <path d="m18.4 5.6-2.1 2.1" />
      <path d="m7.7 16.3-2.1 2.1" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-brand-ink"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}
