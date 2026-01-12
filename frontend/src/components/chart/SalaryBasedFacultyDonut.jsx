"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = {
  net: "#16a34a",
  deduction: "#dc2626",
};

const SalaryBasedFacultyDonut = ({ data }) => {
  const chartData = [
    { name: "Net Salary", value: data.netSalary, color: COLORS.net },
    { name: "Leave Deduction", value: data.leaveDeduction, color: COLORS.deduction },
  ].filter(d => d.value > 0);

  const monthName = new Date(data.year, data.month - 1)
    .toLocaleString("en-IN", { month: "long" });

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">
        Salary – {monthName} {data.year}
      </h2>

      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((e, i) => (
            <Cell key={i} fill={e.color} />
          ))}
        </Pie>

        <Tooltip formatter={(v) => `₹${v}`} />
        <Legend />
      </PieChart>

      {/* Center Info */}
      <div className="text-center mt-3">
        <p className="text-sm text-gray-500">Monthly Salary</p>
        <p className="text-xl font-bold">₹{data.monthlySalary}</p>
      </div>
    </div>
  );
};

export default SalaryBasedFacultyDonut;
