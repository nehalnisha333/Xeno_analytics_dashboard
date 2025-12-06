import { Card } from "./ui/card";
import { FinancialData, Product } from "../types/financial";
import { TrendingUp, TrendingDown, Info, Target, DollarSign, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart, BarChart, Bar } from "recharts";
import { Badge } from "./ui/badge";

interface GrowthMetricsProps {
  data: FinancialData;
  products: Product[];
}

export function GrowthMetrics({ data, products }: GrowthMetricsProps) {
  const { salesData, monthlyBurn, balanceSheet, incomeStatement, operationalData } = data;

  // D. Growth & Predictive KPIs

  // 1. Projected Revenue - Using Linear Regression on historical data
  // Simple linear regression: y = mx + b
  const calculateLinearRegression = (dataPoints: number[]) => {
    const n = dataPoints.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumY = dataPoints.reduce((sum, y) => sum + y, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * dataPoints[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  const revenueHistory = salesData.map(s => s.revenue);
  const { slope: revenueSlope, intercept: revenueIntercept } = calculateLinearRegression(revenueHistory);

  // Project next 6 months
  const projectedMonths = 6;
  const lastMonthIndex = revenueHistory.length - 1;
  const projectedRevenue = Array.from({ length: projectedMonths }, (_, i) => {
    const futureIndex = lastMonthIndex + i + 1;
    return revenueSlope * futureIndex + revenueIntercept;
  });

  // Calculate average monthly growth rate from historical data
  const growthRates = salesData.slice(1).map((s, i) => 
    ((s.revenue - salesData[i].revenue) / salesData[i].revenue) * 100
  );
  const avgGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;

  // Next month projection
  const nextMonthRevenue = projectedRevenue[0];
  const currentMonthRevenue = salesData[salesData.length - 1].revenue;
  const projectedGrowth = ((nextMonthRevenue - currentMonthRevenue) / currentMonthRevenue) * 100;

  // Create projection data for chart
  const projectionData = [
    ...salesData.map((s, i) => ({
      month: s.month,
      actual: s.revenue,
      projected: null,
      type: 'historical',
    })),
    ...Array.from({ length: projectedMonths }, (_, i) => ({
      month: `Month ${lastMonthIndex + i + 2}`,
      actual: null,
      projected: projectedRevenue[i],
      type: 'forecast',
    })),
  ];

  const totalProjected6Months = projectedRevenue.reduce((sum, rev) => sum + rev, 0);
  const projectionStatus = avgGrowthRate >= 5 ? "good" : avgGrowthRate >= 0 ? "warning" : "critical";

  // 2. Break-even Point = Fixed Costs / (Selling Price – Variable Cost per Unit)
  // Calculate weighted average across all products
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalCOGS = products.reduce((sum, p) => sum + p.cogs, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.units, 0);

  const avgSellingPrice = totalRevenue / totalUnits;
  const avgVariableCost = totalCOGS / totalUnits;
  const contributionMarginPerUnit = avgSellingPrice - avgVariableCost;

  // Fixed costs = Operating expenses (assuming these are mostly fixed)
  const monthlyFixedCosts = incomeStatement.operatingExpenses / 12;
  const breakEvenUnits = monthlyFixedCosts / contributionMarginPerUnit;
  const breakEvenRevenue = breakEvenUnits * avgSellingPrice;

  // Current month performance vs break-even
  const currentMonthUnits = (currentMonthRevenue / avgSellingPrice);
  const unitsAboveBreakEven = currentMonthUnits - breakEvenUnits;
  const breakEvenPercentage = (breakEvenRevenue / currentMonthRevenue) * 100;
  const breakEvenStatus = breakEvenPercentage <= 50 ? "good" : breakEvenPercentage <= 70 ? "warning" : "critical";

  // Calculate break-even by product
  const productBreakEven = products.map(p => {
    const sellingPrice = p.revenue / p.units;
    const variableCost = p.cogs / p.units;
    const contributionMargin = sellingPrice - variableCost;
    const allocatedFixedCosts = (p.revenue / totalRevenue) * monthlyFixedCosts;
    const breakEvenUnits = allocatedFixedCosts / contributionMargin;
    const margin = ((contributionMargin / sellingPrice) * 100);
    
    return {
      ...p,
      sellingPrice,
      variableCost,
      contributionMargin,
      breakEvenUnits,
      currentUnits: p.units,
      marginOfSafety: ((p.units - breakEvenUnits) / p.units) * 100,
      contributionMarginPercent: margin,
    };
  }).sort((a, b) => b.marginOfSafety - a.marginOfSafety);

  // 3. Cash Runway = Current Cash / Monthly Burn
  // Calculate average monthly burn rate
  const avgMonthlyBurn = monthlyBurn.reduce((sum, m) => sum + Math.abs(m.netBurn), 0) / monthlyBurn.length;
  const currentCash = balanceSheet.assets.cash;
  const cashRunway = currentCash / avgMonthlyBurn;

  // Calculate cash runway projection
  const runwayMonths = Math.ceil(cashRunway) + 3; // Show a few months beyond runway
  const cashRunwayProjection = Array.from({ length: Math.min(runwayMonths, 12) }, (_, i) => {
    const projectedCash = currentCash - (avgMonthlyBurn * i);
    return {
      month: `Month ${i + 1}`,
      cashBalance: Math.max(0, projectedCash),
      burnRate: avgMonthlyBurn,
      runway: projectedCash > 0 ? (projectedCash / avgMonthlyBurn) : 0,
    };
  });

  const runwayStatus = cashRunway >= 12 ? "good" : cashRunway >= 6 ? "warning" : "critical";

  // Determine if cash is growing or declining
  const cashTrend = monthlyBurn[monthlyBurn.length - 1].cashBalance - monthlyBurn[0].cashBalance;
  const isCashPositive = cashTrend > 0;

  const kpis = [
    {
      name: "Projected Revenue",
      abbr: "PR",
      value: `$${(nextMonthRevenue / 1000).toFixed(0)}K`,
      status: projectionStatus,
      benchmark: "Positive growth",
      formula: "Linear regression on historical trends",
      explanation: "Forecast future revenue based on historical growth patterns.",
      insight: avgGrowthRate >= 5
        ? `Strong growth trajectory at ${avgGrowthRate.toFixed(1)}% monthly average`
        : avgGrowthRate >= 0
        ? `Modest growth at ${avgGrowthRate.toFixed(1)}% - explore acceleration strategies`
        : `Declining revenue at ${avgGrowthRate.toFixed(1)}% - urgent action needed`,
      icon: Target,
      detailValue: avgGrowthRate,
      detailLabel: "Avg Monthly Growth",
    },
    {
      name: "Break-even Point",
      abbr: "BEP",
      value: `${(breakEvenUnits / 1000).toFixed(1)}K units`,
      status: breakEvenStatus,
      benchmark: "<70% of revenue",
      formula: "Fixed Costs / (Selling Price – Variable Cost per Unit)",
      explanation: "Know when the business becomes profitable.",
      insight: breakEvenPercentage <= 50
        ? `Excellent margin of safety - break-even at ${breakEvenPercentage.toFixed(0)}% of current revenue`
        : breakEvenPercentage <= 70
        ? `Moderate safety margin - ${breakEvenPercentage.toFixed(0)}% of revenue needed to break even`
        : `Tight margins - ${breakEvenPercentage.toFixed(0)}% of revenue needed - reduce costs or increase prices`,
      icon: DollarSign,
      detailValue: breakEvenRevenue,
      detailLabel: "Break-even Revenue",
    },
    {
      name: "Cash Runway",
      abbr: "CR",
      value: `${cashRunway.toFixed(1)} months`,
      status: runwayStatus,
      benchmark: "≥12 months",
      formula: "Current Cash / Monthly Burn Rate",
      explanation: "Time until cash runs out at current burn rate.",
      insight: cashRunway >= 12
        ? "Healthy cash position - over a year of runway"
        : cashRunway >= 6
        ? "Moderate runway - consider fundraising or profitability improvements"
        : "Critical - less than 6 months runway, take immediate action",
      icon: Clock,
      detailValue: avgMonthlyBurn,
      detailLabel: "Monthly Burn Rate",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "warning":
        return <TrendingDown className="w-5 h-5 text-orange-600" />;
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Growth & Predictive Metrics</h2>
        <p className="text-muted-foreground">
          Revenue forecasting, break-even analysis, and cash runway planning
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.abbr} className={`p-6 border-2 ${getStatusColor(kpi.status)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{kpi.abbr}</span>
                </div>
                {getStatusIcon(kpi.status)}
              </div>
              <div className="text-3xl mb-2">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">
                Target: {kpi.benchmark}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.abbr + "-detail"} className={`p-6 border-2 ${getStatusColor(kpi.status)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-5 h-5" />
                    <h3 className="text-lg">{kpi.name}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm mb-2"><strong>Formula:</strong> {kpi.formula}</p>
                          <p className="text-sm">{kpi.explanation}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Benchmark: {kpi.benchmark}
                  </p>
                </div>
                {getStatusIcon(kpi.status)}
              </div>

              <div className="mb-4">
                <div className="text-4xl mb-2">{kpi.value}</div>
                <p className="text-sm text-muted-foreground">
                  {kpi.detailLabel}: {
                    typeof kpi.detailValue === 'number' 
                      ? kpi.abbr === 'PR' 
                        ? `${kpi.detailValue.toFixed(1)}%`
                        : kpi.abbr === 'BEP'
                        ? `$${(kpi.detailValue / 1000).toFixed(0)}K/mo`
                        : `$${(kpi.detailValue / 1000).toFixed(0)}K/mo`
                      : kpi.detailValue
                  }
                </p>
              </div>

              <div className={`p-3 rounded-lg ${
                kpi.status === "good" ? "bg-green-100/50" : 
                kpi.status === "warning" ? "bg-orange-100/50" : 
                "bg-red-100/50"
              }`}>
                <p className="text-sm">{kpi.insight}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Projection */}
        <Card className="p-4">
          <h3 className="mb-4">Revenue Forecast (Linear Regression)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <RechartsTooltip formatter={(value: number) => value ? `$${(value / 1000).toFixed(0)}K` : 'N/A'} />
              <Legend />
              <Bar dataKey="actual" fill="#3b82f6" name="Actual Revenue" />
              <Line type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" name="Projected" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Next Month</p>
              <p className="text-lg">${(nextMonthRevenue / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">6-Mo Total</p>
              <p className="text-lg">${(totalProjected6Months / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
              <p className="text-lg">{avgGrowthRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        {/* Cash Runway */}
        <Card className="p-4">
          <h3 className="mb-4">Cash Runway Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cashRunwayProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
              <Legend />
              <Area type="monotone" dataKey="cashBalance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Cash Balance" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current Cash</p>
              <p className="text-lg">${(currentCash / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Monthly Burn</p>
              <p className="text-lg">${(avgMonthlyBurn / 1000).toFixed(0)}K</p>
            </div>
            <div className={`p-3 rounded-lg ${runwayStatus === 'good' ? 'bg-green-50' : runwayStatus === 'warning' ? 'bg-orange-50' : 'bg-red-50'}`}>
              <p className="text-xs text-muted-foreground mb-1">Runway</p>
              <p className="text-lg">{cashRunway.toFixed(1)}mo</p>
            </div>
          </div>
        </Card>

        {/* Break-even Analysis */}
        <Card className="p-4 lg:col-span-2">
          <h3 className="mb-4">Break-even Analysis Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: 'Current', value: currentMonthUnits, label: 'Current Units' },
                  { name: 'Break-even', value: breakEvenUnits, label: 'Break-even Units' },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value: number) => `${(value / 1000).toFixed(1)}K units`} />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-muted-foreground mb-1">Break-even Point</p>
                <p className="text-2xl mb-2">{(breakEvenUnits / 1000).toFixed(1)}K units</p>
                <p className="text-sm">${(breakEvenRevenue / 1000).toFixed(0)}K revenue</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-muted-foreground mb-1">Margin of Safety</p>
                <p className="text-2xl mb-2">{(unitsAboveBreakEven / 1000).toFixed(1)}K units</p>
                <p className="text-sm">{((unitsAboveBreakEven / currentMonthUnits) * 100).toFixed(1)}% above break-even</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-sm text-muted-foreground mb-1">Contribution Margin</p>
                <p className="text-2xl mb-2">${contributionMarginPerUnit.toFixed(0)}/unit</p>
                <p className="text-sm">{((contributionMarginPerUnit / avgSellingPrice) * 100).toFixed(1)}% margin</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3">Product-Level Break-even Analysis</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Product</th>
                    <th className="text-right py-2 px-2">Selling Price</th>
                    <th className="text-right py-2 px-2">Variable Cost</th>
                    <th className="text-right py-2 px-2">Contribution</th>
                    <th className="text-right py-2 px-2">Break-even</th>
                    <th className="text-right py-2 px-2">Margin of Safety</th>
                  </tr>
                </thead>
                <tbody>
                  {productBreakEven.slice(0, 5).map(p => (
                    <tr key={p.id} className="border-b">
                      <td className="py-2 px-2">{p.name}</td>
                      <td className="text-right py-2 px-2 font-mono">${p.sellingPrice.toFixed(0)}</td>
                      <td className="text-right py-2 px-2 font-mono">${p.variableCost.toFixed(0)}</td>
                      <td className="text-right py-2 px-2 font-mono">${p.contributionMargin.toFixed(0)}</td>
                      <td className="text-right py-2 px-2 font-mono">{p.breakEvenUnits.toFixed(0)}</td>
                      <td className="text-right py-2 px-2">
                        <Badge className={
                          p.marginOfSafety >= 50 ? "bg-green-600" :
                          p.marginOfSafety >= 30 ? "bg-orange-600" : "bg-red-600"
                        }>
                          {p.marginOfSafety.toFixed(0)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Burn Details */}
      <Card className="p-4">
        <h3 className="mb-4">Cash Flow & Burn Rate Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={monthlyBurn}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
            <Legend />
            <Area type="monotone" dataKey="cashBalance" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" name="Cash Balance" />
            <Bar dataKey="cashIn" fill="#10b981" name="Cash In" />
            <Bar dataKey="cashOut" fill="#ef4444" name="Cash Out" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Starting Cash</p>
            <p className="text-lg font-mono">${(monthlyBurn[0].cashBalance / 1000).toFixed(0)}K</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Current Cash</p>
            <p className="text-lg font-mono">${(currentCash / 1000).toFixed(0)}K</p>
          </div>
          <div className={`p-3 rounded-lg ${isCashPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-xs text-muted-foreground mb-1">Net Change</p>
            <p className="text-lg font-mono">{isCashPositive ? '+' : ''}{(cashTrend / 1000).toFixed(0)}K</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Avg Burn</p>
            <p className="text-lg font-mono">${(avgMonthlyBurn / 1000).toFixed(0)}K/mo</p>
          </div>
        </div>
      </Card>

      {/* Summary & Recommendations */}
      <Card className="p-4">
        <h3 className="mb-4">Growth Metrics Summary & Strategic Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-1">
              {kpis.filter(k => k.status === "good").length}
            </div>
            <p className="text-sm text-muted-foreground">Healthy Metrics</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl mb-1">
              {kpis.filter(k => k.status === "warning").length}
            </div>
            <p className="text-sm text-muted-foreground">Need Attention</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl mb-1">
              {kpis.filter(k => k.status === "critical").length}
            </div>
            <p className="text-sm text-muted-foreground">Critical Issues</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4>Strategic Priorities:</h4>
          {kpis
            .filter(k => k.status !== "good")
            .map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{kpi.name}: {kpi.value}</p>
                    <p className="text-sm text-muted-foreground">{kpi.insight}</p>
                  </div>
                </div>
              );
            })}
          
          {kpis.every(k => k.status === "good") && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-medium text-green-900">All growth metrics are healthy!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your business is on a strong growth trajectory with solid fundamentals
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Key Insights Panel */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <h3 className="mb-4">Key Growth Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="mb-2">Revenue Trajectory</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Average growth: {avgGrowthRate.toFixed(1)}% monthly</li>
              <li>• Next month forecast: ${(nextMonthRevenue / 1000).toFixed(0)}K</li>
              <li>• 6-month projection: ${(totalProjected6Months / 1000000).toFixed(2)}M</li>
              <li>• {avgGrowthRate >= 5 ? "Strong momentum" : avgGrowthRate >= 0 ? "Stable growth" : "Declining trend"}</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="mb-2">Profitability Position</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Break-even: {(breakEvenUnits / 1000).toFixed(1)}K units/month</li>
              <li>• Current: {(currentMonthUnits / 1000).toFixed(1)}K units/month</li>
              <li>• Safety margin: {((unitsAboveBreakEven / currentMonthUnits) * 100).toFixed(0)}%</li>
              <li>• Contribution: ${contributionMarginPerUnit.toFixed(0)}/unit</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="mb-2">Financial Runway</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Current cash: ${(currentCash / 1000).toFixed(0)}K</li>
              <li>• Monthly burn: ${(avgMonthlyBurn / 1000).toFixed(0)}K</li>
              <li>• Runway: {cashRunway.toFixed(1)} months</li>
              <li>• Status: {isCashPositive ? "Cash positive ✓" : "Burning cash"}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}