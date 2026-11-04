import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2">
      <p className="text-xs text-text-faint mb-0.5">Week of {point.week}</p>
      <p className="text-sm font-semibold text-text">{point.value}% engagement</p>
    </div>
  );
}

export default function EngagementTrendCard({ points }) {
  if (!points.length) return null;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max(5, Math.round((max - min) * 0.15));
  const domain = [Math.max(0, min - pad), Math.min(100, max + pad)];

  return (
    <div className="bg-card border border-border rounded-md p-5">
      <h3 className="text-base font-bold text-text mb-4">LMS engagement — last 6 weeks</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12, fill: "var(--color-text-faint)" }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
          />
          <YAxis domain={domain} hide />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, stroke: "var(--color-accent)", strokeWidth: 2, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
