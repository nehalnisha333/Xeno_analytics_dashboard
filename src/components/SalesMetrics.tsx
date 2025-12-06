import { Card } from "./ui/card";
import { FinancialData, Product } from "../types/financial";
import { TrendingUp, TrendingDown, Info, ShoppingCart, Users, DollarSign, Target, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart, Area } from "recharts";
import { Badge } from "./ui/badge";

interface SalesMetricsProps {
  data: FinancialData;
  products: Product[];
}

export function SalesMetrics({ data, products }: SalesMetricsProps) {
  const { salesData, customerMetrics } = data;

  // B. Sales & Revenue Metrics KPIs

  // 1. Revenue Growth Rate
  const currentRevenue = salesData[salesData.length - 1].revenue;
  const previousRevenue = salesData[salesData.length - 2].revenue;
  const revenueGrowthRate = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  const revenueGrowthStatus = revenueGrowthRate >= 10 ? "good" : revenueGrowthRate >= 5 ? "warning" : "critical";

  // Calculate month-over-month growth for all periods
  const growthData = salesData.map((current, index) => {
    if (index === 0) return { ...current, growthRate: 0 };
    const prev = salesData[index - 1];
    const growth = ((current.revenue - prev.revenue) / prev.revenue) * 100;
    return { ...current, growthRate: growth };
  });

  const avgGrowthRate = growthData.slice(1).reduce((sum, d) => sum + d.growthRate, 0) / (growthData.length - 1);

  // 2. Top Products (ABC Analysis) - Already exists but we'll show summary
  const sortedProducts = [...products].sort((a, b) => b.revenue - a.revenue);
  const totalProductRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  
  let cumulativeRevenue = 0;
  const abcProducts = sortedProducts.map(p => {
    cumulativeRevenue += p.revenue;
    const contribution = (p.revenue / totalProductRevenue) * 100;
    const cumulative = (cumulativeRevenue / totalProductRevenue) * 100;
    let category = 'C';
    if (cumulative <= 80) category = 'A';
    else if (cumulative <= 95) category = 'B';
    return { ...p, contribution, cumulative, category };
  });

  const aProducts = abcProducts.filter(p => p.category === 'A');
  const bProducts = abcProducts.filter(p => p.category === 'B');
  const cProducts = abcProducts.filter(p => p.category === 'C');

  // 3. Average Order Value (AOV)
  const totalOrders = salesData.reduce((sum, s) => sum + s.orders, 0);
  const totalRevenue = salesData.reduce((sum, s) => sum + s.revenue, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const lastMonthAOV = salesData[salesData.length - 1].avgOrderValue;
  const prevMonthAOV = salesData[salesData.length - 2].avgOrderValue;
  const aovGrowth = ((lastMonthAOV - prevMonthAOV) / prevMonthAOV) * 100;
  const aovStatus = lastMonthAOV >= 5000 ? "good" : lastMonthAOV >= 4000 ? "warning" : "critical";

  // 4. Customer Acquisition Cost (CAC)
  const totalMarketingSpend = salesData.reduce((sum, s) => sum + (s.marketingSpend || 0), 0);
  const totalNewCustomers = salesData.reduce((sum, s) => sum + s.newCustomers, 0);
  const cac = totalMarketingSpend / totalNewCustomers;
  const lastMonthCAC = (salesData[salesData.length - 1].marketingSpend || 0) / salesData[salesData.length - 1].newCustomers;
  const cacBenchmark = 1000; // Target CAC
  const cacStatus = lastMonthCAC <= cacBenchmark ? "good" : lastMonthCAC <= 1500 ? "warning" : "critical";

  // CAC trend data
  const cacTrendData = salesData.map(s => ({
    month: s.month,
    cac: s.marketingSpend && s.newCustomers ? s.marketingSpend / s.newCustomers : 0,
    newCustomers: s.newCustomers,
    marketingSpend: s.marketingSpend || 0,
  }));

  // 5. Customer Lifetime Value (CLV)
  // CLV = Average Purchase Value * Purchase Frequency * Retention Period
  // We'll calculate it from the data we have
  const avgPurchaseValue = avgOrderValue;
  const avgCustomerOrders = totalOrders / customerMetrics.totalCustomers;
  const retentionPeriod = customerMetrics.retentionRate / 100 * 36; // months (3 years adjusted by retention)
  const clv = avgPurchaseValue * avgCustomerOrders * (retentionPeriod / 7); // normalized
  
  // Use the provided CLV from customerMetrics as it's more accurate
  const customerLifetimeValue = customerMetrics.lifetimeValue;
  const clvToCacRatio = customerLifetimeValue / lastMonthCAC;
  const clvStatus = clvToCacRatio >= 3 ? "good" : clvToCacRatio >= 2 ? "warning" : "critical";

  const kpis = [
    {
      name: "Revenue Growth Rate",
      abbr: "RGR",
      value: `${revenueGrowthRate.toFixed(1)}%`,
      status: revenueGrowthStatus,
      benchmark: "≥10%",
      formula: "(Current Revenue – Previous Revenue) / Previous Revenue × 100",
      explanation: "Tracks growth momentum month-over-month.",
      insight: revenueGrowthRate >= 10
        ? "Strong revenue growth - maintain momentum"
        : revenueGrowthRate >= 5
        ? "Moderate growth - explore expansion opportunities"
        : "Low growth - review sales strategies and market positioning",
      icon: TrendingUp,
      detailValue: currentRevenue - previousRevenue,
      trend: avgGrowthRate,
    },
    {
      name: "Average Order Value",
      abbr: "AOV",
      value: `$${lastMonthAOV.toFixed(0)}`,
      status: aovStatus,
      benchmark: "≥$5,000",
      formula: "Total Revenue / Number of Orders",
      explanation: "Measures upsell/cross-sell effectiveness.",
      insight: lastMonthAOV >= 5000
        ? "Excellent order value - upselling is working"
        : lastMonthAOV >= 4000
        ? "Good AOV - consider product bundling strategies"
        : "Low AOV - implement upsell and cross-sell tactics",
      icon: ShoppingCart,
      detailValue: aovGrowth,
      trend: aovGrowth,
    },
    {
      name: "Customer Acquisition Cost",
      abbr: "CAC",
      value: `$${lastMonthCAC.toFixed(0)}`,
      status: cacStatus,
      benchmark: `≤$${cacBenchmark}`,
      formula: "Total Marketing Spend / New Customers",
      explanation: "Efficiency of acquiring customers.",
      insight: lastMonthCAC <= cacBenchmark
        ? "Efficient customer acquisition"
        : lastMonthCAC <= 1500
        ? "Acceptable CAC - optimize campaigns for better ROI"
        : "High CAC - review marketing channel efficiency",
      icon: Users,
      detailValue: salesData[salesData.length - 1].marketingSpend || 0,
      trend: null,
    },
    {
      name: "Customer Lifetime Value",
      abbr: "CLV",
      value: `$${customerLifetimeValue.toLocaleString()}`,
      status: clvStatus,
      benchmark: "CLV:CAC ≥3:1",
      formula: "Avg Purchase Value × Purchase Frequency × Retention Period",
      explanation: "Guides retention strategies and marketing investment.",
      insight: clvToCacRatio >= 3
        ? `Strong unit economics (${clvToCacRatio.toFixed(1)}:1 ratio)`
        : clvToCacRatio >= 2
        ? `Acceptable ratio (${clvToCacRatio.toFixed(1)}:1) - improve retention`
        : `Poor ratio (${clvToCacRatio.toFixed(1)}:1) - urgent: reduce CAC or increase CLV`,
      icon: Award,
      detailValue: clvToCacRatio,
      trend: clvToCacRatio,
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
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Sales & Revenue Metrics</h2>
        <p className="text-muted-foreground">
          Track growth momentum, customer value, and sales performance
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                {kpi.abbr === "RGR" && (
                  <p className="text-sm text-muted-foreground">
                    Revenue increase: ${(kpi.detailValue / 1000).toFixed(0)}K | Avg growth: {kpi.trend?.toFixed(1)}%
                  </p>
                )}
                {kpi.abbr === "AOV" && (
                  <p className="text-sm text-muted-foreground">
                    {kpi.trend && kpi.trend > 0 ? '↑' : '↓'} {Math.abs(kpi.trend || 0).toFixed(1)}% vs last month
                  </p>
                )}
                {kpi.abbr === "CAC" && (
                  <p className="text-sm text-muted-foreground">
                    Last month spend: ${(kpi.detailValue / 1000).toFixed(1)}K
                  </p>
                )}
                {kpi.abbr === "CLV" && (
                  <p className="text-sm text-muted-foreground">
                    CLV to CAC ratio: {kpi.trend?.toFixed(1)}:1
                  </p>
                )}
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
        {/* Revenue Growth Trend */}
        <Card className="p-4">
          <h3 className="mb-4">Revenue Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="growthRate" stroke="#10b981" strokeWidth={2} name="Growth (%)" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current MoM Growth</p>
              <p className="text-xl">{revenueGrowthRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Avg Growth Rate</p>
              <p className="text-xl">{avgGrowthRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        {/* AOV and Order Volume */}
        <Card className="p-4">
          <h3 className="mb-4">Average Order Value Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#8b5cf6" name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="avgOrderValue" stroke="#f59e0b" strokeWidth={2} name="AOV ($)" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Orders (Period)</p>
              <p className="text-xl">{totalOrders.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Avg AOV (Period)</p>
              <p className="text-xl">${avgOrderValue.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        {/* CAC Trend */}
        <Card className="p-4">
          <h3 className="mb-4">Customer Acquisition Cost</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={cacTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="marketingSpend" fill="#ec4899" fillOpacity={0.6} name="Marketing Spend ($)" />
              <Line yAxisId="right" type="monotone" dataKey="cac" stroke="#ef4444" strokeWidth={2} name="CAC ($)" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-pink-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Marketing Spend</p>
              <p className="text-xl">${(totalMarketingSpend / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Avg CAC</p>
              <p className="text-xl">${cac.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        {/* CLV Analysis */}
        <Card className="p-4">
          <h3 className="mb-4">Customer Lifetime Value Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Customer Lifetime Value</p>
                <p className="text-3xl">${customerLifetimeValue.toLocaleString()}</p>
              </div>
              <Award className="w-12 h-12 text-green-600" />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Avg Purchase</p>
                <p className="text-lg">${avgOrderValue.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Retention</p>
                <p className="text-lg">{customerMetrics.retentionRate}%</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Active</p>
                <p className="text-lg">{customerMetrics.activeCustomers}</p>
              </div>
            </div>

            <div className="p-4 border-2 border-dashed rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">CLV to CAC Ratio</span>
                <Badge className={
                  clvToCacRatio >= 3 ? "bg-green-600" :
                  clvToCacRatio >= 2 ? "bg-orange-600" : "bg-red-600"
                }>
                  {clvToCacRatio.toFixed(1)}:1
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {clvToCacRatio >= 3 
                  ? "✓ Excellent - sustainable growth model"
                  : clvToCacRatio >= 2
                  ? "⚠ Acceptable - monitor closely"
                  : "✗ Critical - improve retention or reduce CAC"}
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs mb-2">
                <strong>Customer Value Breakdown:</strong>
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Total Customers:</span>
                  <span className="font-mono">{customerMetrics.totalCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Customer Value:</span>
                  <span className="font-mono">${(customerMetrics.totalCustomers * customerLifetimeValue / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ABC Analysis Summary */}
      <Card className="p-4">
        <h3 className="mb-4">Product Performance (ABC Analysis)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4>Category A Products</h4>
              <Badge className="bg-green-600">{aProducts.length}</Badge>
            </div>
            <p className="text-2xl mb-1">{((aProducts.reduce((s, p) => s + p.revenue, 0) / totalProductRevenue) * 100).toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">of total revenue (top 80%)</p>
            <div className="mt-3 space-y-1">
              {aProducts.slice(0, 3).map(p => (
                <div key={p.id} className="text-sm flex justify-between">
                  <span className="truncate">{p.name}</span>
                  <span className="font-mono ml-2">${(p.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4>Category B Products</h4>
              <Badge className="bg-orange-600">{bProducts.length}</Badge>
            </div>
            <p className="text-2xl mb-1">{((bProducts.reduce((s, p) => s + p.revenue, 0) / totalProductRevenue) * 100).toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">of total revenue (80-95%)</p>
            <div className="mt-3 space-y-1">
              {bProducts.slice(0, 3).map(p => (
                <div key={p.id} className="text-sm flex justify-between">
                  <span className="truncate">{p.name}</span>
                  <span className="font-mono ml-2">${(p.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4>Category C Products</h4>
              <Badge variant="secondary">{cProducts.length}</Badge>
            </div>
            <p className="text-2xl mb-1">{((cProducts.reduce((s, p) => s + p.revenue, 0) / totalProductRevenue) * 100).toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">of total revenue (bottom 5%)</p>
            <p className="text-xs mt-3 text-muted-foreground">
              Review for discontinuation or repositioning
            </p>
          </div>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm">
            💡 <strong>Tip:</strong> Focus on Category A products for inventory and marketing. Visit the ABC Analysis tab for detailed insights.
          </p>
        </div>
      </Card>

      {/* Summary & Recommendations */}
      <Card className="p-4">
        <h3 className="mb-4">Sales Metrics Summary & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-1">
              {kpis.filter(k => k.status === "good").length}
            </div>
            <p className="text-sm text-muted-foreground">Performing Well</p>
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
          <h4>Priority Actions:</h4>
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
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-medium text-green-900">All sales metrics are healthy!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your sales and revenue metrics are performing above benchmarks
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}