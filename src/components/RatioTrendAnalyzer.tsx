import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Award,
  Users,
  Activity
} from "lucide-react";
import { Badge } from "./ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, ReferenceLine } from "recharts";
import { Progress } from "./ui/progress";

interface RatioTrendAnalyzerProps {
  data: FinancialData;
}

export function RatioTrendAnalyzer({ data }: RatioTrendAnalyzerProps) {
  const { balanceSheet, incomeStatement, salesData } = data;

  // ========== CALCULATE KEY RATIOS ==========
  const totalAssets = balanceSheet.assets.currentAssets + balanceSheet.assets.fixedAssets;
  const netProfit = incomeStatement.revenue - incomeStatement.cogs - incomeStatement.operatingExpenses - incomeStatement.interestExpense - incomeStatement.tax;
  const totalDebt = balanceSheet.liabilities.currentLiabilities + balanceSheet.liabilities.longTermDebt;

  const currentRatios = {
    roa: (netProfit / totalAssets) * 100, // Return on Assets
    roe: (netProfit / balanceSheet.equity) * 100, // Return on Equity
    debtToEquity: totalDebt / balanceSheet.equity,
    currentRatio: balanceSheet.assets.currentAssets / balanceSheet.liabilities.currentLiabilities,
    quickRatio: (balanceSheet.assets.currentAssets - balanceSheet.assets.inventory) / balanceSheet.liabilities.currentLiabilities,
    grossMargin: ((incomeStatement.revenue - incomeStatement.cogs) / incomeStatement.revenue) * 100,
    netMargin: (netProfit / incomeStatement.revenue) * 100,
    assetTurnover: incomeStatement.revenue / totalAssets,
  };

  // ========== INDUSTRY BENCHMARKS (Mock Peer Data) ==========
  const industryBenchmarks = {
    roa: 12.5, // Industry average ROA
    roe: 18.0, // Industry average ROE
    debtToEquity: 1.2, // Industry average D/E (lower is better)
    currentRatio: 2.0, // Industry average Current Ratio
    quickRatio: 1.2, // Industry average Quick Ratio
    grossMargin: 42.0, // Industry average Gross Margin
    netMargin: 12.0, // Industry average Net Margin
    assetTurnover: 1.5, // Industry average Asset Turnover
  };

  // Top performers (75th percentile)
  const topPerformers = {
    roa: 18.0,
    roe: 25.0,
    debtToEquity: 0.8,
    currentRatio: 2.5,
    quickRatio: 1.5,
    grossMargin: 50.0,
    netMargin: 18.0,
    assetTurnover: 2.0,
  };

  // ========== TREND DATA (Last 6 periods) ==========
  // Simulate historical trends based on current values
  const generateTrend = (currentValue: number, volatility: number = 0.1) => {
    const trend = [];
    const startValue = currentValue * (0.85 + Math.random() * 0.15);
    const growth = (currentValue - startValue) / 5;
    
    for (let i = 0; i < 6; i++) {
      const period = salesData[i] ? salesData[i].month : `M${i + 1}`;
      trend.push({
        period,
        company: startValue + growth * i + (Math.random() - 0.5) * currentValue * volatility,
        industry: industryBenchmarks.roa * (0.95 + Math.random() * 0.1),
        topPerformer: topPerformers.roa * (0.95 + Math.random() * 0.1),
      });
    }
    return trend;
  };

  const roaTrend = salesData.slice(-6).map((s, i) => {
    const baseROA = currentRatios.roa * (0.85 + (i * 0.03));
    return {
      period: s.month,
      company: baseROA + (Math.random() - 0.5) * 2,
      industry: industryBenchmarks.roa + (Math.random() - 0.5) * 1.5,
      topPerformer: topPerformers.roa + (Math.random() - 0.5) * 1,
    };
  });

  const roeTrend = salesData.slice(-6).map((s, i) => {
    const baseROE = currentRatios.roe * (0.85 + (i * 0.03));
    return {
      period: s.month,
      company: baseROE + (Math.random() - 0.5) * 3,
      industry: industryBenchmarks.roe + (Math.random() - 0.5) * 2,
      topPerformer: topPerformers.roe + (Math.random() - 0.5) * 1.5,
    };
  });

  const debtTrend = salesData.slice(-6).map((s, i) => {
    const baseDebt = currentRatios.debtToEquity * (1.1 - (i * 0.02));
    return {
      period: s.month,
      company: baseDebt + (Math.random() - 0.5) * 0.1,
      industry: industryBenchmarks.debtToEquity + (Math.random() - 0.5) * 0.1,
      topPerformer: topPerformers.debtToEquity + (Math.random() - 0.5) * 0.05,
    };
  });

  const liquidityTrend = salesData.slice(-6).map((s, i) => {
    const baseCurrent = currentRatios.currentRatio * (0.9 + (i * 0.02));
    return {
      period: s.month,
      company: baseCurrent + (Math.random() - 0.5) * 0.2,
      industry: industryBenchmarks.currentRatio + (Math.random() - 0.5) * 0.15,
      topPerformer: topPerformers.currentRatio + (Math.random() - 0.5) * 0.1,
    };
  });

  // ========== COMPARISON METRICS ==========
  const ratioComparisons = [
    {
      name: "Return on Assets (ROA)",
      acronym: "ROA",
      current: currentRatios.roa,
      industry: industryBenchmarks.roa,
      topPerformer: topPerformers.roa,
      unit: "%",
      trend: roaTrend,
      description: "Measures how efficiently assets generate profit",
      higherIsBetter: true,
      icon: Target,
      color: "#10b981",
    },
    {
      name: "Return on Equity (ROE)",
      acronym: "ROE",
      current: currentRatios.roe,
      industry: industryBenchmarks.roe,
      topPerformer: topPerformers.roe,
      unit: "%",
      trend: roeTrend,
      description: "Shows return generated on shareholder equity",
      higherIsBetter: true,
      icon: Award,
      color: "#3b82f6",
    },
    {
      name: "Debt-to-Equity Ratio",
      acronym: "D/E",
      current: currentRatios.debtToEquity,
      industry: industryBenchmarks.debtToEquity,
      topPerformer: topPerformers.debtToEquity,
      unit: "",
      trend: debtTrend,
      description: "Indicates financial leverage and risk level",
      higherIsBetter: false,
      icon: BarChart3,
      color: "#f59e0b",
    },
    {
      name: "Current Ratio",
      acronym: "CR",
      current: currentRatios.currentRatio,
      industry: industryBenchmarks.currentRatio,
      topPerformer: topPerformers.currentRatio,
      unit: "",
      trend: liquidityTrend,
      description: "Measures ability to pay short-term obligations",
      higherIsBetter: true,
      icon: Activity,
      color: "#8b5cf6",
    },
  ];

  // ========== PERFORMANCE ASSESSMENT ==========
  const getPerformance = (current: number, industry: number, top: number, higherIsBetter: boolean) => {
    if (higherIsBetter) {
      if (current >= top) return { status: "excellent", label: "Top Performer", color: "green", icon: Award };
      if (current >= industry) return { status: "good", label: "Above Average", color: "blue", icon: TrendingUp };
      if (current >= industry * 0.85) return { status: "fair", label: "Below Average", color: "orange", icon: Minus };
      return { status: "poor", label: "Needs Improvement", color: "red", icon: TrendingDown };
    } else {
      if (current <= top) return { status: "excellent", label: "Top Performer", color: "green", icon: Award };
      if (current <= industry) return { status: "good", label: "Above Average", color: "blue", icon: TrendingUp };
      if (current <= industry * 1.15) return { status: "fair", label: "Below Average", color: "orange", icon: Minus };
      return { status: "poor", label: "Needs Improvement", color: "red", icon: TrendingDown };
    }
  };

  const getTrendDirection = (trend: any[]) => {
    const firstValue = trend[0].company;
    const lastValue = trend[trend.length - 1].company;
    const change = ((lastValue - firstValue) / firstValue) * 100;
    return {
      direction: change > 1 ? "up" : change < -1 ? "down" : "stable",
      change: Math.abs(change),
      icon: change > 1 ? ArrowUpRight : change < -1 ? ArrowDownRight : Minus,
    };
  };

  // Overall performance score
  const overallScore = ratioComparisons.reduce((sum, ratio) => {
    const perf = getPerformance(ratio.current, ratio.industry, ratio.topPerformer, ratio.higherIsBetter);
    if (perf.status === "excellent") return sum + 25;
    if (perf.status === "good") return sum + 20;
    if (perf.status === "fair") return sum + 10;
    return sum + 5;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <div>
            <h2>AI Ratio & Trend Analyzer</h2>
            <p className="text-muted-foreground">
              Compare your financial ratios against industry benchmarks and top performers
            </p>
          </div>
        </div>
      </div>

      {/* Overall Performance Summary */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="text-5xl mb-2">{overallScore}</div>
            <div className="text-sm text-muted-foreground mb-1">Performance Score</div>
            <Badge className={
              overallScore >= 80 ? "bg-green-600" :
              overallScore >= 60 ? "bg-blue-600" :
              overallScore >= 40 ? "bg-orange-600" : "bg-red-600"
            }>
              {overallScore >= 80 ? "🏆 Excellent" :
               overallScore >= 60 ? "✅ Good" :
               overallScore >= 40 ? "⚠️ Fair" : "🚨 Needs Work"}
            </Badge>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 gap-3">
            {ratioComparisons.map((ratio) => {
              const perf = getPerformance(ratio.current, ratio.industry, ratio.topPerformer, ratio.higherIsBetter);
              const Icon = perf.icon;
              return (
                <div key={ratio.acronym} className="bg-white/80 p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{ratio.acronym}</span>
                    <Icon className={`w-4 h-4 text-${perf.color}-600`} />
                  </div>
                  <div className="text-xl">{ratio.current.toFixed(1)}{ratio.unit}</div>
                  <div className="text-xs text-muted-foreground">
                    vs Industry: {ratio.industry.toFixed(1)}{ratio.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Detailed Ratio Comparisons */}
      <div>
        <h3 className="mb-4">📊 Detailed Ratio Analysis vs Peers</h3>
        <div className="space-y-6">
          {ratioComparisons.map((ratio) => {
            const Icon = ratio.icon;
            const perf = getPerformance(ratio.current, ratio.industry, ratio.topPerformer, ratio.higherIsBetter);
            const PerIcon = perf.icon;
            const trend = getTrendDirection(ratio.trend);
            const TrendIcon = trend.icon;

            return (
              <Card key={ratio.name} className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Current Performance */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${ratio.color}20` }}>
                        <Icon className="w-6 h-6" style={{ color: ratio.color }} />
                      </div>
                      <div className="flex-1">
                        <h4>{ratio.name}</h4>
                        <p className="text-xs text-muted-foreground">{ratio.description}</p>
                      </div>
                      <Badge className={`bg-${perf.color}-600`}>
                        {perf.label}
                      </Badge>
                    </div>

                    {/* Current Value Display */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl">{ratio.current.toFixed(2)}</span>
                        <span className="text-xl text-muted-foreground">{ratio.unit}</span>
                        <div className="flex items-center gap-1 ml-2">
                          <TrendIcon className={`w-5 h-5 ${
                            trend.direction === "up" ? "text-green-600" :
                            trend.direction === "down" ? "text-red-600" : "text-gray-600"
                          }`} />
                          <span className="text-sm text-muted-foreground">
                            {trend.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Your current {ratio.acronym}</p>
                    </div>

                    {/* Comparison Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span>Your Company</span>
                          <span className="font-mono">{ratio.current.toFixed(2)}{ratio.unit}</span>
                        </div>
                        <Progress 
                          value={ratio.higherIsBetter ? 
                            Math.min((ratio.current / ratio.topPerformer) * 100, 100) :
                            Math.min((ratio.topPerformer / ratio.current) * 100, 100)
                          } 
                          className="h-3"
                          style={{ backgroundColor: `${ratio.color}40` }}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Industry Average
                          </span>
                          <span className="font-mono">{ratio.industry.toFixed(2)}{ratio.unit}</span>
                        </div>
                        <Progress 
                          value={ratio.higherIsBetter ? 
                            Math.min((ratio.industry / ratio.topPerformer) * 100, 100) :
                            Math.min((ratio.topPerformer / ratio.industry) * 100, 100)
                          } 
                          className="h-3 opacity-60"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Top Performers
                          </span>
                          <span className="font-mono">{ratio.topPerformer.toFixed(2)}{ratio.unit}</span>
                        </div>
                        <Progress value={100} className="h-3 opacity-40" />
                      </div>
                    </div>

                    {/* Performance Insight */}
                    <div className="mt-4 p-3 rounded-lg bg-muted">
                      <div className="flex items-start gap-2">
                        <PerIcon className={`w-5 h-5 text-${perf.color}-600 flex-shrink-0 mt-0.5`} />
                        <div className="text-sm">
                          {perf.status === "excellent" && (
                            <p>Outstanding! You're performing better than top industry players.</p>
                          )}
                          {perf.status === "good" && (
                            <p>Great job! You're above the industry average. Keep pushing toward top performer levels.</p>
                          )}
                          {perf.status === "fair" && (
                            <p>You're slightly below industry average. Focus on improvement strategies to reach benchmark levels.</p>
                          )}
                          {perf.status === "poor" && (
                            <p>This metric needs immediate attention. Significant gap from industry standards.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Trend Chart */}
                  <div>
                    <h4 className="mb-3">6-Month Trend Comparison</h4>
                    <ResponsiveContainer width="100%" height={280}>
                      <ComposedChart data={ratio.trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value: number) => `${value.toFixed(2)}${ratio.unit}`}
                        />
                        <Legend />
                        
                        {/* Benchmark reference line */}
                        <ReferenceLine 
                          y={ratio.industry} 
                          stroke="#94a3b8" 
                          strokeDasharray="5 5"
                          label="Industry Avg"
                        />
                        
                        {/* Top performer reference line */}
                        <ReferenceLine 
                          y={ratio.topPerformer} 
                          stroke="#10b981" 
                          strokeDasharray="5 5"
                          label="Top Performers"
                        />
                        
                        <Area
                          type="monotone"
                          dataKey="topPerformer"
                          fill="#10b98120"
                          stroke="none"
                          name="Top Performer Zone"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="company" 
                          stroke={ratio.color} 
                          strokeWidth={3}
                          dot={{ fill: ratio.color, r: 4 }}
                          name="Your Company"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="industry" 
                          stroke="#94a3b8" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Industry Average"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>

                    {/* Trend Insights */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted text-center">
                        <p className="text-muted-foreground mb-1">Your Trend</p>
                        <div className="flex items-center justify-center gap-1">
                          <TrendIcon className={`w-4 h-4 ${
                            trend.direction === "up" ? "text-green-600" :
                            trend.direction === "down" ? "text-red-600" : "text-gray-600"
                          }`} />
                          <span>{trend.direction === "up" ? "Improving" : trend.direction === "down" ? "Declining" : "Stable"}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-muted text-center">
                        <p className="text-muted-foreground mb-1">Gap to Industry</p>
                        <p className="font-mono">
                          {ratio.higherIsBetter ? 
                            (ratio.current - ratio.industry > 0 ? "+" : "") :
                            (ratio.industry - ratio.current > 0 ? "+" : "-")
                          }
                          {Math.abs(ratio.current - ratio.industry).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-2 rounded bg-muted text-center">
                        <p className="text-muted-foreground mb-1">Gap to Top</p>
                        <p className="font-mono">
                          {ratio.higherIsBetter ? 
                            (ratio.current - ratio.topPerformer > 0 ? "+" : "") :
                            (ratio.topPerformer - ratio.current > 0 ? "+" : "-")
                          }
                          {Math.abs(ratio.current - ratio.topPerformer).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
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
            <h3 className="mb-3">🎯 AI-Powered Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratioComparisons.map((ratio) => {
                const perf = getPerformance(ratio.current, ratio.industry, ratio.topPerformer, ratio.higherIsBetter);
                if (perf.status === "excellent") return null; // Skip excellent performers
                
                return (
                  <div key={ratio.name} className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Improve {ratio.acronym}</span>
                    </div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {ratio.acronym === "ROA" && (
                        <>
                          <li>• Optimize asset utilization</li>
                          <li>• Reduce idle inventory</li>
                          <li>• Improve operational efficiency</li>
                        </>
                      )}
                      {ratio.acronym === "ROE" && (
                        <>
                          <li>• Increase profit margins</li>
                          <li>• Optimize capital structure</li>
                          <li>• Focus on high-return projects</li>
                        </>
                      )}
                      {ratio.acronym === "D/E" && (
                        <>
                          <li>• Pay down high-interest debt</li>
                          <li>• Consider equity financing</li>
                          <li>• Improve retained earnings</li>
                        </>
                      )}
                      {ratio.acronym === "CR" && (
                        <>
                          <li>• Accelerate receivables collection</li>
                          <li>• Maintain adequate cash reserves</li>
                          <li>• Manage payables efficiently</li>
                        </>
                      )}
                    </ul>
                  </div>
                );
              })}

              {ratioComparisons.every(r => getPerformance(r.current, r.industry, r.topPerformer, r.higherIsBetter).status === "excellent") && (
                <div className="md:col-span-2 bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Excellent Performance Across All Ratios!</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You're outperforming industry benchmarks. Continue monitoring these metrics and maintain your competitive advantage.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Methodology */}
      <Card className="p-4 bg-gray-50">
        <h4 className="mb-3">📚 How Peer Comparison Works</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-2">
              <strong>Benchmarking Methodology:</strong>
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• <strong>Industry Average:</strong> Median performance across similar companies</li>
              <li>• <strong>Top Performers:</strong> 75th percentile of industry leaders</li>
              <li>• <strong>Your Position:</strong> Real-time calculation from your financials</li>
              <li>• <strong>Trend Analysis:</strong> 6-month rolling comparison</li>
            </ul>
          </div>
          <div>
            <p className="mb-2">
              <strong>Performance Categories:</strong>
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• 🏆 <strong>Top Performer:</strong> Exceeds top 25% of industry</li>
              <li>• ✅ <strong>Above Average:</strong> Better than industry median</li>
              <li>• ⚠️ <strong>Below Average:</strong> Within 15% of industry median</li>
              <li>• 🚨 <strong>Needs Improvement:</strong> Significantly below benchmarks</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
