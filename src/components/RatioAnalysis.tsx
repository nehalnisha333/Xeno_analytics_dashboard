import { Card } from "./ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { FinancialData, FinancialRatios } from "../types/financial";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { safeDivide, safePercentage, safeNumber } from "../lib/mathUtils";

interface RatioAnalysisProps {
  data: FinancialData;
}

export function RatioAnalysis({ data }: RatioAnalysisProps) {
  const { balanceSheet, incomeStatement } = data;

  // Calculate ratios with safe division
  const netProfit = incomeStatement.revenue - incomeStatement.cogs - incomeStatement.operatingExpenses - incomeStatement.interestExpense - incomeStatement.tax;
  const totalAssets = balanceSheet.assets.currentAssets + balanceSheet.assets.fixedAssets;
  
  const ratios: FinancialRatios = {
    currentRatio: safeDivide(balanceSheet.assets.currentAssets, balanceSheet.liabilities.currentLiabilities, 1),
    quickRatio: safeDivide(balanceSheet.assets.currentAssets - balanceSheet.assets.inventory, balanceSheet.liabilities.currentLiabilities, 1),
    debtToEquity: safeDivide(balanceSheet.liabilities.currentLiabilities + balanceSheet.liabilities.longTermDebt, balanceSheet.equity, 0),
    returnOnAssets: safePercentage(netProfit, totalAssets, 0),
    returnOnEquity: safePercentage(netProfit, balanceSheet.equity, 0),
    grossProfitMargin: safePercentage(incomeStatement.revenue - incomeStatement.cogs, incomeStatement.revenue, 0),
    netProfitMargin: safePercentage(netProfit, incomeStatement.revenue, 0),
    assetTurnover: safeDivide(incomeStatement.revenue, totalAssets, 0),
    inventoryTurnover: safeDivide(incomeStatement.cogs, balanceSheet.assets.inventory, 0),
  };

  const ratioCategories = [
    {
      title: "Liquidity Ratios",
      icon: <Activity className="w-5 h-5" />,
      ratios: [
        { name: "Current Ratio", value: ratios.currentRatio.toFixed(2), benchmark: 2.0, good: ratios.currentRatio >= 1.5 },
        { name: "Quick Ratio", value: ratios.quickRatio.toFixed(2), benchmark: 1.0, good: ratios.quickRatio >= 1.0 },
      ],
    },
    {
      title: "Profitability Ratios",
      icon: <TrendingUp className="w-5 h-5" />,
      ratios: [
        { name: "Gross Profit Margin", value: ratios.grossProfitMargin.toFixed(2) + "%", benchmark: 40, good: ratios.grossProfitMargin >= 30 },
        { name: "Net Profit Margin", value: ratios.netProfitMargin.toFixed(2) + "%", benchmark: 10, good: ratios.netProfitMargin >= 8 },
        { name: "Return on Assets", value: ratios.returnOnAssets.toFixed(2) + "%", benchmark: 10, good: ratios.returnOnAssets >= 8 },
        { name: "Return on Equity", value: ratios.returnOnEquity.toFixed(2) + "%", benchmark: 15, good: ratios.returnOnEquity >= 12 },
      ],
    },
    {
      title: "Efficiency Ratios",
      icon: <Activity className="w-5 h-5" />,
      ratios: [
        { name: "Asset Turnover", value: ratios.assetTurnover.toFixed(2), benchmark: 1.5, good: ratios.assetTurnover >= 1.0 },
        { name: "Inventory Turnover", value: ratios.inventoryTurnover.toFixed(2), benchmark: 8, good: ratios.inventoryTurnover >= 6 },
      ],
    },
    {
      title: "Leverage Ratios",
      icon: <TrendingDown className="w-5 h-5" />,
      ratios: [
        { name: "Debt to Equity", value: ratios.debtToEquity.toFixed(2), benchmark: 1.0, good: ratios.debtToEquity <= 1.5 },
      ],
    },
  ];

  // Chart data
  const profitabilityData = [
    { name: "Gross Margin", value: ratios.grossProfitMargin, benchmark: 40 },
    { name: "Net Margin", value: ratios.netProfitMargin, benchmark: 10 },
    { name: "ROA", value: ratios.returnOnAssets, benchmark: 10 },
    { name: "ROE", value: ratios.returnOnEquity, benchmark: 15 },
  ];

  const liquidityData = [
    { name: "Current Ratio", value: ratios.currentRatio, benchmark: 2.0 },
    { name: "Quick Ratio", value: ratios.quickRatio, benchmark: 1.0 },
  ];

  const radarData = [
    { metric: "Liquidity", value: safeNumber(Math.min(safeDivide(ratios.currentRatio, 2, 0.5) * 100, 100), 50), fullMark: 100 },
    { metric: "Profitability", value: safeNumber(Math.min(safeDivide(ratios.netProfitMargin, 15, 0.5) * 100, 100), 50), fullMark: 100 },
    { metric: "Efficiency", value: safeNumber(Math.min(safeDivide(ratios.assetTurnover, 2, 0.5) * 100, 100), 50), fullMark: 100 },
    { metric: "Returns", value: safeNumber(Math.min(safeDivide(ratios.returnOnEquity, 20, 0.5) * 100, 100), 50), fullMark: 100 },
    { metric: "Solvency", value: safeNumber(Math.min(safeDivide(1, ratios.debtToEquity || 1, 0.5) * 100, 100), 50), fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Financial Ratio Analysis</h2>
        <p className="text-muted-foreground">
          Comprehensive analysis of your company's financial health and performance
        </p>
      </div>

      {/* Ratio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ratioCategories.map((category) => (
          <Card key={category.title} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {category.icon}
              <h3>{category.title}</h3>
            </div>
            <div className="space-y-3">
              {category.ratios.map((ratio) => (
                <div key={ratio.name} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{ratio.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{ratio.value}</span>
                    {ratio.good ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="mb-4">Profitability Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Actual %" />
              <Bar dataKey="benchmark" fill="#94a3b8" name="Benchmark %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="mb-4">Liquidity Position</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={liquidityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" name="Actual Ratio" />
              <Bar dataKey="benchmark" fill="#94a3b8" name="Benchmark" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Overall Health Radar */}
      <Card className="p-4">
        <h3 className="mb-4">Overall Financial Health Score</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Trend Analysis */}
      <Card className="p-4">
        <h3 className="mb-4">Quarterly Performance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.periods}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" strokeWidth={2} />
            <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}