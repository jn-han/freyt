"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataPoint = {
  name: string;
  value: number;
};

type ChartProps = {
  data: DataPoint[];
  metricType: "sales" | "uph";
};

const Chart = ({ data, metricType }: ChartProps) => {
  const renderCustomTick = ({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: string };
  }) => {
    const [line1, line2] = payload.value.split("\n");
    return (
      <text x={x} y={y + 10} textAnchor="middle" fill="#999" fontSize={12}>
        <tspan x={x} dy="0">
          {line1}
        </tspan>
        <tspan x={x} dy="15">
          {line2}
        </tspan>
      </text>
    );
  };
  return (
    <div className="">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="30%" stopColor="#4A709C" stopOpacity={0.2} />
              <stop offset="60%" stopColor="#4A709C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            interval={0}
            minTickGap={0}
            padding={{ left: 10, right: 10 }}
            axisLine={false}
            tickLine={false}
            tick={renderCustomTick}
          />
          <YAxis hide={true} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#4A709C" }}
            cursor={{ stroke: "#4A709C", strokeDasharray: "3 3" }}
            formatter={(value: number) => [
              `${metricType === "sales" ? "$" + value : value + "UPH"}`,
              "Performance",
            ]}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#4A709C"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
