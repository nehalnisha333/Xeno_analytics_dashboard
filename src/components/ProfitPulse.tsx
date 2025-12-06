import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Zap,
  Shield,
  Target,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Droplet,
  RefreshCw,
  Scale,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

interface ProfitPulseProps {
  data: FinancialData;
}

export function ProfitPulse({ data }: ProfitPulseProps) {
  const { balanceSheet, incomeStatement, cashFlow, salesData } = data;

  // ========== CALCULATE COMPONENT SCORES ==========
  
  // 1. PROFITABILITY SCORE (0-100)
  const grossProfit = incomeStatement.revenue - incomeStatement.cogs;
  const grossProfitMargin = (grossProfit / incomeStatement.revenue) * 100;
  const netProfit = incomeStatement.revenue - incomeStatement.cogs - incomeStatement.operatingExpenses - incomeStatement.interestExpense - incomeStatement.tax;
  const netProfitMargin = (netProfit / incomeStatement.revenue) * 100;
  
  const profitabilityScore = Math.min(
    100,
    (grossProfitMargin >= 40 ? 50 : (grossProfitMargin / 40) * 50) +
    (netProfitMargin >= 15 ? 50 : (netProfitMargin / 15) * 50)
  );

  // 2. LIQUIDITY SCORE (0-100)
  const currentRatio = balanceSheet.assets.currentAssets / balanceSheet.liabilities.currentLiabilities;
  const quickRatio = (balanceSheet.assets.currentAssets - balanceSheet.assets.inventory) / balanceSheet.liabilities.currentLiabilities;
  
  const liquidityScore = Math.min(
    100,
    (currentRatio >= 2 ? 50 : (currentRatio / 2) * 50) +
    (quickRatio >= 1 ? 50 : (quickRatio / 1) * 50)
  );

  // 3. EFFICIENCY SCORE (0-100)
  const inventoryTurnover = incomeStatement.cogs / balanceSheet.assets.inventory;
  const daysInventory = (balanceSheet.assets.inventory / incomeStatement.cogs) * 365;
  const daysSales = (balanceSheet.assets.accountsReceivable / incomeStatement.revenue) * 365;
  const daysPayable = (balanceSheet.liabilities.accountsPayable / incomeStatement.cogs) * 365;
  const cashConversionCycle = daysInventory + daysSales - daysPayable;
  
  const efficiencyScore = Math.min(
    100,
    (inventoryTurnover >= 8 ? 50 : (inventoryTurnover / 8) * 50) +
    (cashConversionCycle <= 30 ? 50 : Math.max(0, 50 - ((cashConversionCycle - 30) / 60) * 50))
  );

  // 4. LEVERAGE SCORE (0-100) - Lower debt is better
  const totalDebt = balanceSheet.liabilities.currentLiabilities + balanceSheet.liabilities.longTermDebt;
  const debtToEquity = totalDebt / balanceSheet.equity;
  const debtToAssets = totalDebt / (balanceSheet.assets.currentAssets + balanceSheet.assets.fixedAssets);
  
  const leverageScore = Math.min(
    100,
    (debtToEquity <= 1 ? 50 : Math.max(0, 50 - ((debtToEquity - 1) / 2) * 50)) +
    (debtToAssets <= 0.5 ? 50 : Math.max(0, 50 - ((debtToAssets - 0.5) / 0.5) * 50))
  );

  // 5. GROWTH SCORE (0-100)
  const recentSales = salesData.slice(-2);
  const revenueGrowth = recentSales.length === 2 
    ? ((recentSales[1].revenue - recentSales[0].revenue) / recentSales[0].revenue) * 100
    : 0;
  
  const operatingCashFlowMargin = (cashFlow.operating / incomeStatement.revenue) * 100;
  
  const growthScore = Math.min(
    100,
    (revenueGrowth >= 15 ? 50 : Math.max(0, (revenueGrowth / 15) * 50)) +
    (operatingCashFlowMargin >= 10 ? 50 : (operatingCashFlowMargin / 10) * 50)
  );

  // ========== OVERALL HEALTH SCORE ==========
  // Weighted average: Profitability (30%), Liquidity (25%), Efficiency (20%), Leverage (15%), Growth (10%)
  const overallScore = Math.round(
    profitabilityScore * 0.30 +
    liquidityScore * 0.25 +
    efficiencyScore * 0.20 +
    leverageScore * 0.15 +
    growthScore * 0.10
  );

  // Health Status
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "green", emoji: "🚀", className: "bg-green-600" };
    if (score >= 65) return { label: "Good", color: "blue", emoji: "✅", className: "bg-blue-600" };
    if (score >= 50) return { label: "Fair", color: "yellow", emoji: "⚠️", className: "bg-yellow-600" };
    if (score >= 35) return { label: "Poor", color: "orange", emoji: "⚡", className: "bg-orange-600" };
    return { label: "Critical", color: "red", emoji: "🚨", className: "bg-red-600" };
  };

  const healthStatus = getHealthStatus(overallScore);

  // Score breakdown data
  const scoreBreakdown = [
    {
      name: "Profitability",
      score: Math.round(profitabilityScore),
      weight: "30%",
      icon: DollarSign,
      color: "#10b981",
      metrics: [
        { name: "Gross Margin", value: `${grossProfitMargin.toFixed(1)}%`, status: grossProfitMargin >= 40 ? "good" : grossProfitMargin >= 25 ? "warning" : "critical" },
        { name: "Net Margin", value: `${netProfitMargin.toFixed(1)}%`, status: netProfitMargin >= 15 ? "good" : netProfitMargin >= 5 ? "warning" : "critical" }
      ]
    },
    {
      name: "Liquidity",
      score: Math.round(liquidityScore),
      weight: "25%",
      icon: Droplet,
      color: "#3b82f6",
      metrics: [
        { name: "Current Ratio", value: currentRatio.toFixed(2), status: currentRatio >= 2 ? "good" : currentRatio >= 1.5 ? "warning" : "critical" },
        { name: "Quick Ratio", value: quickRatio.toFixed(2), status: quickRatio >= 1 ? "good" : quickRatio >= 0.75 ? "warning" : "critical" }
      ]
    },
    {
      name: "Efficiency",
      score: Math.round(efficiencyScore),
      weight: "20%",
      icon: RefreshCw,
      color: "#8b5cf6",
      metrics: [
        { name: "Inventory Turnover", value: `${inventoryTurnover.toFixed(1)}x`, status: inventoryTurnover >= 8 ? "good" : inventoryTurnover >= 4 ? "warning" : "critical" },
        { name: "Cash Cycle", value: `${Math.round(cashConversionCycle)} days`, status: cashConversionCycle <= 30 ? "good" : cashConversionCycle <= 60 ? "warning" : "critical" }
      ]
    },
    {
      name: "Leverage",
      score: Math.round(leverageScore),
      weight: "15%",
      icon: Scale,
      color: "#f59e0b",
      metrics: [
        { name: "Debt-to-Equity", value: debtToEquity.toFixed(2), status: debtToEquity <= 1 ? "good" : debtToEquity <= 2 ? "warning" : "critical" },
        { name: "Debt-to-Assets", value: `${(debtToAssets * 100).toFixed(1)}%`, status: debtToAssets <= 0.5 ? "good" : debtToAssets <= 0.7 ? "warning" : "critical" }
      ]
    },
    {
      name: "Growth",
      score: Math.round(growthScore),
      weight: "10%",
      icon: TrendingUp,
      color: "#ef4444",
      metrics: [
        { name: "Revenue Growth", value: `${revenueGrowth.toFixed(1)}%`, status: revenueGrowth >= 15 ? "good" : revenueGrowth >= 5 ? "warning" : "critical" },
        { name: "OCF Margin", value: `${operatingCashFlowMargin.toFixed(1)}%`, status: operatingCashFlowMargin >= 10 ? "good" : operatingCashFlowMargin >= 5 ? "warning" : "critical" }
      ]
    }
  ];

  // Radial chart data
  const radialData = [{
    name: 'Health Score',
    value: overallScore,
    fill: overallScore >= 80 ? '#10b981' : overallScore >= 65 ? '#3b82f6' : overallScore >= 50 ? '#f59e0b' : '#ef4444'
  }];

  // Get status icon
  const getStatusIcon = (status: string) => {
    if (status === "good") return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === "warning") return <AlertCircle className="w-4 h-4 text-orange-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  // Get trend icon
  const getTrendIcon = (score: number) => {
    if (score >= 70) return <ArrowUp className="w-5 h-5 text-green-600" />;
    if (score >= 50) return <Minus className="w-5 h-5 text-yellow-600" />;
    return <ArrowDown className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h2>Profit Pulse</h2>
            <p className="text-muted-foreground">
              Your instant financial health score - like a credit score for your business
            </p>
          </div>
        </div>
      </div>

      {/* Main Score Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Score Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={280} height={280}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  barSize={20} 
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl mb-2">{overallScore}</div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
            <Badge className={`${healthStatus.className} text-lg px-4 py-2 mt-4`}>
              {healthStatus.emoji} {healthStatus.label}
            </Badge>
          </div>

          {/* Right: Quick Summary */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h3 className="mb-2">Financial Health Summary</h3>
              <p className="text-sm text-muted-foreground">
                {overallScore >= 80 && "Outstanding financial performance! Your business is thriving with strong metrics across all categories."}
                {overallScore >= 65 && overallScore < 80 && "Good financial health overall. Continue monitoring key metrics and address areas for improvement."}
                {overallScore >= 50 && overallScore < 65 && "Fair financial position. Focus on strengthening weak areas to improve overall health."}
                {overallScore >= 35 && overallScore < 50 && "Financial health needs attention. Prioritize improving liquidity and profitability."}
                {overallScore < 35 && "Critical financial situation. Immediate action required to stabilize the business."}
              </p>
            </div>

            {/* Score Components Preview */}
            <div className="grid grid-cols-2 gap-3">
              {scoreBreakdown.map((component) => {
                const Icon = component.icon;
                return (
                  <div key={component.name} className="bg-white/80 p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: component.color }} />
                        <span className="text-xs">{component.name}</span>
                      </div>
                      {getTrendIcon(component.score)}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl">{component.score}</span>
                      <span className="text-xs text-muted-foreground">{component.weight}</span>
                    </div>
                    <Progress value={component.score} className="h-1.5 mt-2" />
                  </div>
                );
              })}
            </div>

            <div className="bg-white/80 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Your Score:</strong> Weighted average of 5 key categories. Higher scores indicate better financial health.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Score Breakdown */}
      <div>
        <h3 className="mb-4">Score Breakdown by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoreBreakdown.map((component) => {
            const Icon = component.icon;
            const scoreStatus = component.score >= 80 ? "good" : component.score >= 50 ? "warning" : "critical";
            
            return (
              <Card key={component.name} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${component.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: component.color }} />
                    </div>
                    <div>
                      <h4 className="text-sm">{component.name}</h4>
                      <p className="text-xs text-muted-foreground">Weight: {component.weight}</p>
                    </div>
                  </div>
                  {getTrendIcon(component.score)}
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl">{component.score}</span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <Progress value={component.score} className="h-2" />
                </div>

                <div className="space-y-2 pt-3 border-t">
                  {component.metrics.map((metric) => (
                    <div key={metric.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(metric.status)}
                        <span>{metric.name}</span>
                      </div>
                      <span className="font-mono">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Recommendations */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="mb-3">🎯 Recommended Actions to Improve Your Score</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Profitability Actions */}
              {profitabilityScore < 70 && (
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Boost Profitability</span>
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Review pricing strategy</li>
                    <li>• Negotiate better supplier rates</li>
                    <li>• Reduce operating expenses</li>
                  </ul>
                </div>
              )}

              {/* Liquidity Actions */}
              {liquidityScore < 70 && (
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Improve Liquidity</span>
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Accelerate receivables collection</li>
                    <li>• Maintain cash reserves</li>
                    <li>• Reduce short-term liabilities</li>
                  </ul>
                </div>
              )}

              {/* Efficiency Actions */}
              {efficiencyScore < 70 && (
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Enhance Efficiency</span>
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Optimize inventory levels</li>
                    <li>• Improve cash conversion cycle</li>
                    <li>• Streamline operations</li>
                  </ul>
                </div>
              )}

              {/* Leverage Actions */}
              {leverageScore < 70 && (
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Manage Leverage</span>
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Pay down high-interest debt</li>
                    <li>• Increase equity financing</li>
                    <li>• Refinance existing loans</li>
                  </ul>
                </div>
              )}

              {/* Growth Actions */}
              {growthScore < 70 && (
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Accelerate Growth</span>
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Expand marketing efforts</li>
                    <li>• Launch new products/services</li>
                    <li>• Enter new markets</li>
                  </ul>
                </div>
              )}

              {/* All Good */}
              {profitabilityScore >= 70 && liquidityScore >= 70 && efficiencyScore >= 70 && leverageScore >= 70 && growthScore >= 70 && (
                <div className="bg-white p-3 rounded-lg border md:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Excellent Performance!</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your business is performing exceptionally well across all categories. Continue monitoring these metrics and maintain your current strategies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Score Methodology */}
      <Card className="p-4 bg-gray-50">
        <h4 className="mb-3">📊 How Your Score is Calculated</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="mb-2">
              <strong>Weighted Categories:</strong>
            </p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Profitability (30%): GPM, NPM</li>
              <li>• Liquidity (25%): Current Ratio, Quick Ratio</li>
              <li>• Efficiency (20%): Inventory Turnover, Cash Cycle</li>
              <li>• Leverage (15%): Debt-to-Equity, Debt-to-Assets</li>
              <li>• Growth (10%): Revenue Growth, OCF Margin</li>
            </ul>
          </div>
          <div>
            <p className="mb-2">
              <strong>Score Ranges:</strong>
            </p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• 80-100: 🚀 Excellent - Outstanding financial health</li>
              <li>• 65-79: ✅ Good - Strong overall performance</li>
              <li>• 50-64: ⚠️ Fair - Room for improvement</li>
              <li>• 35-49: ⚡ Poor - Needs attention</li>
              <li>• 0-34: 🚨 Critical - Immediate action required</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
