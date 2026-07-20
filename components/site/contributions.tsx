import { site } from "@/content";

import { GithubGraph, type Week } from "./github-graph";

type ApiDay = { date: string; count: number; level: number };

// A day parses at UTC midnight so the weekday/label never shift with the build
// machine's timezone.
const at = (iso: string) => new Date(`${iso}T00:00:00Z`);
const dayLabel = (iso: string) =>
  at(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
const monthName = (iso: string) =>
  at(iso).toLocaleString("en-US", { month: "short", timeZone: "UTC" });

/**
 * Reads GitHub's own trailing-year contribution calendar at build time
 * (`output: export`), so the real graph is baked into the static HTML and
 * refreshes on every deploy — no client fetch, no third-party service in the
 * mix. This is the same data GitHub shows on the profile, so it includes
 * private-repo counts when "Include private contributions" is on (dates and
 * repo names stay hidden — only daily totals). Parsed from the HTML: each day
 * cell carries data-date and data-level, and its count lives in the paired
 * accessibility tooltip. If GitHub can't be reached we render nothing rather
 * than a misleading empty year.
 */
async function getContributions(
  user: string
): Promise<{ total: number; days: ApiDay[] } | null> {
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { "User-Agent": "portfolio-build" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return null;
    }
    const html = await res.text();

    // id → count, from the tooltip text ("No contributions on …" / "N … on …").
    const counts = new Map<string, number>();
    const tip =
      /<tool-tip[^>]*\bfor="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g;
    for (const m of html.matchAll(tip)) {
      const n = m[2].match(/^(\d+)/);
      counts.set(m[1], n ? Number(n[1]) : 0);
    }

    // One entry per day cell. Attributes read individually so a reordering of
    // them in GitHub's markup doesn't silently drop days.
    const days: ApiDay[] = [];
    for (const td of html.split("<td").slice(1)) {
      if (!td.includes("ContributionCalendar-day")) {
        continue;
      }
      const date = td.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
      if (!date) {
        continue;
      }
      const id =
        td.match(/id="(contribution-day-component-\d+-\d+)"/)?.[1] ?? "";
      const level = Number(td.match(/data-level="(\d)"/)?.[1] ?? "0");
      days.push({ date, count: counts.get(id) ?? 0, level });
    }
    if (!days.length) {
      return null;
    }

    days.sort((a, b) => a.date.localeCompare(b.date));
    const total = days.reduce((sum, d) => sum + d.count, 0);
    return { total, days };
  } catch {
    return null;
  }
}

function toWeeks(days: ApiDay[]): Week[] {
  // Pad the leading days of the first week so column 0 starts on a Sunday,
  // matching GitHub's grid.
  const lead = days.length ? at(days[0].date).getUTCDay() : 0;
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...days.map((d) => ({
      level: d.level,
      count: d.count,
      label: dayLabel(d.date),
      date: d.date,
    })),
  ];
  const weeks: Week[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// One label per week slot, set only on the first week a month appears in.
function toMonthLabels(weeks: Week[]): (string | null)[] {
  let last = "";
  return weeks.map((week) => {
    const first = week.find(Boolean);
    if (!first) {
      return null;
    }
    const m = monthName(first.date);
    if (m === last) {
      return null;
    }
    last = m;
    return m;
  });
}

export async function Contributions() {
  const data = await getContributions(site.socials.githubHandle);
  if (!data) {
    return null;
  }

  const weeks = toWeeks(data.days);
  const total = data.total;

  return (
    <div>
      <p className="mb-1.5 text-[0.6rem] text-muted-fg uppercase tracking-[0.25em]">
        Activity
      </p>
      <GithubGraph monthLabels={toMonthLabels(weeks)} weeks={weeks} />
      <p className="mt-2.5 text-muted-fg text-xs">
        <span className="text-fg tabular-nums">{total}</span> contributions on
        GitHub in the last year
      </p>
    </div>
  );
}
