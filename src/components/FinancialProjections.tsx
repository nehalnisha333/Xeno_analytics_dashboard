import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { Target, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { safeDivide, safePercentage, safeNumber } from "../lib/mathUtils";

interface FinancialProjectionsProps {
  data: FinancialData;
}

export function FinancialProjections({ data }: FinancialProjectionsProps) {
  const [years, setYears] = useState(3);
  const [growthRate, setGrowthRate] = useState(15);

  // Calculate historical averages with safe division
  const historicalData = data.periods;
  const avgRevenue = safeDivide(historicalData.reduce((sum, p) => sum + p.revenue, 0), historicalData.length, 0);
  const avgProfit = safeDivide(historicalData.reduce((sum, p) => sum + p.profit, 0), historicalData.length, 0);
  const avgMargin = safePercentage(avgProfit, avgRevenue, 0);
  const lastPeriod = historicalData[historicalData.length - 1];

  // Generate projections
  const generateProjections = () => {
    const projections = [];
    
    for (let i = 1; i <= years * 4; i++) { // Quarterly projections
      const quarter = i;
      const year = Math.floor((i - 1) / 4) + 1;
      const q = ((i - 1) % 4) + 1;
      
      const projectedRevenue = lastPeriod.revenue * Math.pow(1 + growthRate / 100, i / 4);
      const projectedProfit = projectedRevenue * (avgMargin / 100);
      const projectedExpenses = projectedRevenue - projectedProfit;
      
      projections.push({
        period: `Q${q} ${2024 + year}`,
        revenue: Math.round(projectedRevenue),
        profit: Math.round(projectedProfit),
        expenses: Math.round(projectedExpenses),
        type: "projected",
      });
    }
    
    return projections;
  };

  const projectedData = generateProjections();
  
  // Combine historical and projected
  const combinedData = [
    ...historicalData.map(d => ({ ...d, type: "historical" })),
    ...projectedData,
  ];

  // Calculate key metrics for projections
  const finalYear = projectedData[projectedData.length - 1];
  const totalProjectedRevenue = projectedData.reduce((sum, p) => sum + p.revenue, 0);
  const totalProjectedProfit = projectedData.reduce((sum, p) => sum + p.profit, 0);

  // Scenario analysis
  const scenarios = [
    { name: "Conservative", rate: growthRate - 5 },
    { name: "Base Case", rate: growthRate },
    { name: "Optimistic", rate: growthRate + 5 },
  ];

  const scenarioData = Array.from({ length: years }, (_, i) => {
    const year = 2025 + i;
    const result: any = { year: year.toString() };
    
    scenarios.forEach((scenario) => {
      const revenue = avgRevenue * 4 * Math.pow(1 + scenario.rate / 100, i + 1);
      result[scenario.name] = Math.round(revenue);
    });
    
    return result;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2>Financial Projections & Forecasting</h2>
        <p className="text-muted-foreground">
          Project future performance based on historical data and growth assumptions
        </p>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <h3 className="mb-4">Projection Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Annual Growth Rate: {growthRate}%</label>
            <Slider
              value={[growthRate]}
              onValueChange={(value) => setGrowthRate(value[0])}
              min={-10}
              max={50}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Projection Period: {years} years</label>
            <Slider
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Key Projections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Year {years} Revenue</span>
          </div>
          <div className="text-3xl">${(finalYear.revenue / 1000000).toFixed(2)}M</div>
          <p className="text-sm text-muted-foreground mt-1">
            {((finalYear.revenue / lastPeriod.revenue - 1) * 100).toFixed(0)}% growth from current
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Projected Total Profit</span>
          </div>
          <div className="text-3xl">${(totalProjectedProfit / 1000000).toFixed(2)}M</div>
          <p className="text-sm text-muted-foreground mt-1">
            Over {years} years
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Avg Projected Margin</span>
          </div>
          <div className="text-3xl">{avgMargin.toFixed(1)}%</div>
          <p className="text-sm text-muted-foreground mt-1">
            Based on historical average
          </p>
        </Card>
      </div>

      {/* Revenue & Profit Projection */}
      <Card className="p-4">
        <h3 className="mb-4">Revenue & Profit Forecast</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
              name="Revenue" 
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.6}
              name="Profit" 
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-muted-foreground">Historical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 rounded"></div>
            <span className="text-muted-foreground">Projected</span>
          </div>
        </div>
      </Card>

      {/* Scenario Analysis */}
      <Card className="p-4">
        <h3 className="mb-4">Scenario Analysis</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={scenarioData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Conservative" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="Base Case" 
              stroke="#3b82f6" 
              strokeWidth={3}
            />
            <Line 
              type="monotone" 
              dataKey="Optimistic" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Quarterly Breakdown */}
      <Card className="p-4">
        <h3 className="mb-4">Quarterly Projection Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={projectedData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
            <Bar dataKey="profit" fill="#10b981" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Projection Table */}
      <Card className="p-4">
        <h3 className="mb-4">Detailed Annual Projections</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Year</th>
                <th className="text-right py-3 px-2">Revenue</th>
                <th className="text-right py-3 px-2">Expenses</th>
                <th className="text-right py-3 px-2">Profit</th>
                <th className="text-right py-3 px-2">Margin</th>
                <th className="text-right py-3 px-2">Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: years }, (_, i) => {
                const yearData = projectedData.slice(i * 4, (i + 1) * 4);
                const yearRevenue = yearData.reduce((sum, q) => sum + q.revenue, 0);
                const yearProfit = yearData.reduce((sum, q) => sum + q.profit, 0);
                const yearExpenses = yearData.reduce((sum, q) => sum + q.expenses, 0);
                const prevYearData = i === 0 
                  ? historicalData 
                  : projectedData.slice((i - 1) * 4, i * 4);
                const prevYearRevenue = prevYearData.reduce((sum, q) => sum + q.revenue, 0);
                const growth = ((yearRevenue / prevYearRevenue - 1) * 100);

                return (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-2">{2025 + i}</td>
                    <td className="text-right py-3 px-2 font-mono">
                      ${(yearRevenue / 1000000).toFixed(2)}M
                    </td>
                    <td className="text-right py-3 px-2 font-mono">
                      ${(yearExpenses / 1000000).toFixed(2)}M
                    </td>
                    <td className="text-right py-3 px-2 font-mono text-green-600">
                      ${(yearProfit / 1000000).toFixed(2)}M
                    </td>
                    <td className="text-right py-3 px-2 font-mono">
                      {((yearProfit / yearRevenue) * 100).toFixed(1)}%
                    </td>
                    <td className="text-right py-3 px-2 font-mono">
                      {growth.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assumptions */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <h3 className="mb-2">Projection Assumptions</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Annual revenue growth rate: {growthRate}%</li>
          <li>• Profit margin maintained at historical average: {avgMargin.toFixed(1)}%</li>
          <li>• No major market disruptions or operational changes</li>
          <li>• Consistent seasonal patterns based on historical data</li>
          <li>• These projections should be reviewed and updated quarterly</li>
        </ul>
      </Card>
    </div>
  );
}