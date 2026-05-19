"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatGBP } from "@/lib/utils";

interface Point {
  date: string;
  bookings: number;
  revenue: number;
}

export function OverviewChart({ data }: { data: Point[] }) {
  const fmtDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF0000" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#FF0000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#26262C" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            stroke="#7A7A82"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="#7A7A82" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "#141417",
              border: "1px solid #26262C",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "#B7B7BD" }}
            itemStyle={{ color: "#F5F5F6" }}
            labelFormatter={fmtDate}
            formatter={(value: number, name: string) =>
              name === "revenue" ? [formatGBP(value), "Revenue"] : [value, "Bookings"]
            }
          />
          <Area
            type="monotone"
            dataKey="bookings"
            stroke="#FF0000"
            strokeWidth={2}
            fill="url(#gradBookings)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
