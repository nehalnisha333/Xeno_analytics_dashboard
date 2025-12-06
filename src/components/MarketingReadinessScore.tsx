import { Card } from "./ui/card";
import { FinancialData, Product } from "../types/financial";
import { 
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Megaphone,
  Zap,
  AlertCircle,
  CheckCircle,
  Award,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  BarChart3,
  LineChart,
  Sparkles,
  Shield,
  Rocket,
  ThumbsUp,
  ThumbsDown,
  Info,
  Calculator,
  TrendingUpIcon
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  LineChart as RechartsLine,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";

interface MarketingReadinessScoreProps {
  data: FinancialData;
  products: Product[];
}

export function MarketingReadinessScore({ data, products }: MarketingReadinessScoreProps) {
  
  // Current period data
  const currentRevenue = data.incomeStatement.revenue;
  const marketingExpense = 380000; // From mock expense data - would come from expenses breakdown
  const currentMarketingSpendPercent = (marketingExpense / currentRevenue) * 100;
  
  // Industry benchmarks by growth stage
  const industryBenchmarks = {
    "High Growth": { min: 15, median: 20, max: 30, romi: 4.5 }, // High growth companies
    "Moderate Growth": { min: 10, median: 15, max: 20, romi: 5.0 }, // Moderate growth
    "Stable/Mature": { min: 5, median: 10, max: 15, romi: 6.0 }, // Stable companies
  };

  // Determine growth stage based on revenue
  const growthStage = currentRevenue < 10000000 ? "High Growth" : 
                      currentRevenue < 50000000 ? "Moderate Growth" : "Stable/Mature";
  
  const benchmark = industryBenchmarks[growthStage];

  // Historical data (simulated - would come from actual historical records)
  const historicalData = [
    { month: "Jan", revenue: 4200000, marketing: 320000, revenueGrowth: 8.5 },
    { month: "Feb", revenue: 4350000, marketing: 340000, revenueGrowth: 10.2 },
    { month: "Mar", revenue: 4100000, marketing: 280000, revenueGrowth: 5.8 },
    { month: "Apr", revenue: 4500000, marketing: 360000, revenueGrowth: 12.5 },
    { month: "May", revenue: 4650000, marketing: 380000, revenueGrowth: 13.8 },
    { month: "Jun", revenue: 4800000, marketing: 380000, revenueGrowth: 14.2 },
  ];

  // Calculate metrics
  const avgHistoricalMarketingPercent = historicalData.reduce((sum, d) => 
    sum + (d.marketing / d.revenue) * 100, 0) / historicalData.length;

  const avgRevenueGrowth = historicalData.reduce((sum, d) => sum + d.revenueGrowth, 0) / historicalData.length;

  // Calculate correlation between marketing spend and revenue growth
  const calculateCorrelation = () => {
    const marketingSpends = historicalData.map(d => (d.marketing / d.revenue) * 100);
    const growthRates = historicalData.map(d => d.revenueGrowth);
    
    const n = marketingSpends.length;
    const sumX = marketingSpends.reduce((a, b) => a + b, 0);
    const sumY = growthRates.reduce((a, b) => a + b, 0);
    const sumXY = marketingSpends.reduce((sum, x, i) => sum + x * growthRates[i], 0);
    const sumX2 = marketingSpends.reduce((sum, x) => sum + x * x, 0);
    const sumY2 = growthRates.reduce((sum, y) => sum + y * y, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return correlation;
  };

  const correlation = calculateCorrelation();
  const correlationStrength = Math.abs(correlation) > 0.7 ? "Strong" : 
                               Math.abs(correlation) > 0.4 ? "Moderate" : "Weak";

  // Calculate Return on Marketing Investment (ROMI)
  // ROMI = (Revenue Growth Attributed to Marketing / Marketing Spend) * 100
  const estimatedMarketingAttributedRevenue = currentRevenue * 0.35; // Assume 35% of revenue is marketing-driven
  const currentROMI = (estimatedMarketingAttributedRevenue / marketingExpense);
  
  // Compare to industry
  const vsIndustryMedian = currentMarketingSpendPercent - benchmark.median;
  const isUnderSpending = currentMarketingSpendPercent < benchmark.median;
  const multiplier = isUnderSpending ? 
    benchmark.median / currentMarketingSpendPercent : 
    currentMarketingSpendPercent / benchmark.median;

  // Calculate recommended marketing spend
  const recommendedSpendPercent = benchmark.median;
  const recommendedSpendAmount = (recommendedSpendPercent / 100) * currentRevenue;
  const spendGap = recommendedSpendAmount - marketingExpense;

  // Calculate Marketing Readiness Score (0-100)
  const calculateReadinessScore = () => {
    let score = 0;
    
    // Factor 1: Spend vs Industry (30 points)
    const spendDiff = Math.abs(currentMarketingSpendPercent - benchmark.median);
    const spendScore = Math.max(0, 30 - (spendDiff * 3));
    score += spendScore;
    
    // Factor 2: ROMI vs Industry (30 points)
    const romiDiff = Math.abs(currentROMI - benchmark.romi);
    const romiScore = Math.max(0, 30 - (romiDiff * 3));
    score += romiScore;
    
    // Factor 3: Correlation strength (20 points)
    const correlationScore = Math.abs(correlation) * 20;
    score += correlationScore;
    
    // Factor 4: Growth trajectory (20 points)
    const growthScore = Math.min(20, (avgRevenueGrowth / 15) * 20);
    score += growthScore;
    
    return Math.min(100, Math.max(0, score));
  };

  const readinessScore = calculateReadinessScore();
  const scoreGrade = readinessScore >= 80 ? "Excellent" : 
                     readinessScore >= 65 ? "Good" : 
                     readinessScore >= 50 ? "Fair" : "Needs Improvement";

  // Projected impact of recommended spend
  const projectedRevenueIncrease = spendGap * benchmark.romi;
  const projectedROI = (projectedRevenueIncrease / spendGap) * 100;

  // Scatter data for spend vs growth correlation
  const scatterData = historicalData.map(d => ({
    marketingPercent: (d.marketing / d.revenue) * 100,
    growth: d.revenueGrowth,
    month: d.month,
  }));

  // Enhanced historical data with marketing %
  const enhancedHistoricalData = historicalData.map(d => ({
    ...d,
    marketingPercent: (d.marketing / d.revenue) * 100,
    romi: ((d.revenue * 0.35) / d.marketing).toFixed(1),
  }));

  // Color based on score
  const scoreColor = readinessScore >= 80 ? "green" : 
                     readinessScore >= 65 ? "blue" : 
                     readinessScore >= 50 ? "orange" : "red";

  const scoreColorClass = readinessScore >= 80 ? "text-green-600" : 
                          readinessScore >= 65 ? "text-blue-600" : 
                          readinessScore >= 50 ? "text-orange-600" : "text-red-600";

  const scoreBgClass = readinessScore >= 80 ? "bg-green-50 border-green-200" : 
                       readinessScore >= 65 ? "bg-blue-50 border-blue-200" : 
                       readinessScore >= 50 ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Megaphone className="w-8 h-8 text-purple-600" />
          <div>
            <h2>Marketing Readiness Score</h2>
            <p className="text-muted-foreground">
              Evaluating your marketing spend effectiveness and revenue growth correlation
            </p>
          </div>
        </div>
      </div>

      {/* MAIN SCORE CARD */}
      <Card className={`p-6 border-2 ${scoreBgClass}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Score */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Marketing Readiness Score</div>
              <div className="relative inline-block">
                <div className={`text-7xl ${scoreColorClass} mb-2`}>
                  {readinessScore.toFixed(0)}
                </div>
                <div className="absolute -top-2 -right-6 text-3xl text-muted-foreground">/100</div>
              </div>
              <Badge className={`mt-2 ${
                readinessScore >= 80 ? 'bg-green-600' : 
                readinessScore >= 65 ? 'bg-blue-600' : 
                readinessScore >= 50 ? 'bg-orange-600' : 'bg-red-600'
              }`}>
                {scoreGrade}
              </Badge>
              
              {/* Score Progress */}
              <div className="mt-4">
                <Progress value={readinessScore} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Key Metrics */}
          <div className="lg:col-span-1 space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Current Marketing Spend</div>
              <div className="text-2xl">{currentMarketingSpendPercent.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">of revenue (${(marketingExpense / 1000).toFixed(0)}K/month)</div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Industry Benchmark</div>
              <div className="text-2xl">{benchmark.median}%</div>
              <div className="text-xs text-muted-foreground">{growthStage} companies</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Revenue Growth Correlation</div>
              <div className="text-2xl">{(correlation * 100).toFixed(0)}%</div>
              <Badge variant="outline" className={
                Math.abs(correlation) > 0.7 ? 'border-green-600 text-green-600' :
                Math.abs(correlation) > 0.4 ? 'border-blue-600 text-blue-600' :
                'border-orange-600 text-orange-600'
              }>
                {correlationStrength} Correlation
              </Badge>
            </div>
          </div>

          {/* Right: Recommendation */}
          <div className="lg:col-span-1">
            {isUnderSpending ? (
              <div className="bg-white p-4 rounded-lg border-2 border-orange-300">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h4 className="text-orange-900">Under-Spending Alert</h4>
                </div>
                <p className="text-sm text-orange-800 mb-3">
                  You're spending <strong>{multiplier.toFixed(1)}× less</strong> than industry average for {growthStage.toLowerCase()} companies.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="font-mono">${(marketingExpense / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recommended:</span>
                    <span className="font-mono text-orange-600">${(recommendedSpendAmount / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Increase by:</span>
                    <span className="font-mono text-orange-600">+${(spendGap / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="text-blue-900">Spending on Track</h4>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  You're spending <strong>{multiplier.toFixed(1)}× more</strong> than industry average. Monitor ROI closely.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="font-mono">${(marketingExpense / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry Median:</span>
                    <span className="font-mono">${(recommendedSpendAmount / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Over by:</span>
                    <span className="font-mono text-blue-600">+${Math.abs(spendGap / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Avg Revenue Growth</div>
          <div className="text-2xl text-green-600">{avgRevenueGrowth.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Last 6 months</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Marketing ROI</div>
          <div className="text-2xl">{currentROMI.toFixed(1)}x</div>
          <div className="text-xs text-muted-foreground">
            ${currentROMI.toFixed(2)} per $1 spent
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Industry Avg ROI</div>
          <div className="text-2xl text-blue-600">{benchmark.romi.toFixed(1)}x</div>
          <div className="text-xs text-muted-foreground">
            {growthStage} benchmark
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Spend Gap</div>
          <div className={`text-2xl ${isUnderSpending ? 'text-orange-600' : 'text-blue-600'}`}>
            {isUnderSpending ? '-' : '+'}{Math.abs(vsIndustryMedian).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">vs industry median</div>
        </Card>
      </div>

      {/* Marketing Spend vs Revenue Growth Correlation */}
      <Card className="p-4">
        <h3 className="mb-4">📈 Marketing Spend vs Revenue Growth Correlation</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scatter Plot */}
          <div>
            <h4 className="text-sm mb-3 text-muted-foreground">Spend % vs Growth Rate</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="marketingPercent" 
                  name="Marketing %" 
                  unit="%"
                  label={{ value: 'Marketing Spend (% of Revenue)', position: 'insideBottom', offset: -5, fontSize: 11 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="growth" 
                  name="Growth" 
                  unit="%"
                  label={{ value: 'Revenue Growth %', angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <ZAxis range={[100, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Monthly Performance" data={scatterData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-3 p-3 bg-purple-50 rounded text-xs">
              <p className="text-purple-900">
                <strong>Correlation: {(correlation * 100).toFixed(0)}%</strong> - {
                  Math.abs(correlation) > 0.7 ? 
                    "Strong positive correlation! Marketing spend drives growth." :
                  Math.abs(correlation) > 0.4 ?
                    "Moderate correlation. Marketing has noticeable impact." :
                    "Weak correlation. Review marketing effectiveness."
                }
              </p>
            </div>
          </div>

          {/* Trend Lines */}
          <div>
            <h4 className="text-sm mb-3 text-muted-foreground">Historical Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={enhancedHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="marketingPercent" fill="#8b5cf6" name="Marketing % of Revenue" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="revenueGrowth" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Revenue Growth %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Benchmark Comparison */}
      <Card className="p-4">
        <h3 className="mb-4">🎯 Industry Benchmark Comparison</h3>
        <div className="space-y-4">
          {/* Visual benchmark bar */}
          <div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span>Your Spend: {currentMarketingSpendPercent.toFixed(1)}%</span>
              <span className="text-muted-foreground">Industry Range: {benchmark.min}% - {benchmark.max}%</span>
            </div>
            <div className="relative h-12 bg-gray-200 rounded-lg overflow-hidden">
              {/* Industry range */}
              <div 
                className="absolute inset-y-0 bg-blue-200"
                style={{
                  left: `${(benchmark.min / benchmark.max) * 100}%`,
                  right: `${100 - (benchmark.max / benchmark.max) * 100}%`
                }}
              ></div>
              {/* Median marker */}
              <div 
                className="absolute inset-y-0 w-1 bg-blue-600"
                style={{ left: `${(benchmark.median / benchmark.max) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap text-blue-600 font-medium">
                  Median: {benchmark.median}%
                </div>
              </div>
              {/* Your position */}
              <div 
                className={`absolute inset-y-0 w-2 ${
                  isUnderSpending ? 'bg-orange-600' : 'bg-green-600'
                }`}
                style={{ 
                  left: `${Math.min((currentMarketingSpendPercent / benchmark.max) * 100, 100)}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap font-medium ${
                  isUnderSpending ? 'text-orange-600' : 'text-green-600'
                }`}>
                  You: {currentMarketingSpendPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xs text-muted-foreground mb-1">Conservative ({benchmark.min}%)</div>
              <div className="text-lg">${((benchmark.min / 100) * currentRevenue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground mt-1">Minimum for {growthStage.toLowerCase()}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded border-2 border-blue-300">
              <div className="text-xs text-blue-900 mb-1">Recommended ({benchmark.median}%)</div>
              <div className="text-lg text-blue-600">${(recommendedSpendAmount / 1000).toFixed(0)}K</div>
              <p className="text-xs text-blue-700 mt-1">Industry median spend</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xs text-muted-foreground mb-1">Aggressive ({benchmark.max}%)</div>
              <div className="text-lg">${((benchmark.max / 100) * currentRevenue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground mt-1">High-growth strategy</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ROI Analysis */}
      <Card className="p-4">
        <h3 className="mb-4">💰 Return on Marketing Investment (ROMI)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current ROMI */}
          <div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="text-sm text-green-900 mb-2">Current ROMI</div>
              <div className="text-4xl text-green-600 mb-2">{currentROMI.toFixed(1)}x</div>
              <p className="text-xs text-green-700">
                For every $1 spent on marketing, you generate ${currentROMI.toFixed(2)} in revenue
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-muted-foreground">Monthly Marketing Spend:</span>
                <span className="font-mono">${(marketingExpense / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-muted-foreground">Est. Marketing-Driven Revenue:</span>
                <span className="font-mono">${(estimatedMarketingAttributedRevenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between p-2 bg-green-50 rounded border border-green-200">
                <span className="text-green-900">ROMI Calculation:</span>
                <span className="font-mono text-green-600">${estimatedMarketingAttributedRevenue.toLocaleString()} ÷ ${marketingExpense.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Projected Impact */}
          <div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200 mb-4">
              <div className="text-sm text-purple-900 mb-2">Projected Impact at Recommended Spend</div>
              <div className="text-4xl text-purple-600 mb-2">+${(projectedRevenueIncrease / 1000).toFixed(0)}K</div>
              <p className="text-xs text-purple-700">
                Potential monthly revenue increase if you reach industry median spend
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-muted-foreground">Additional Investment Needed:</span>
                <span className="font-mono text-orange-600">+${(spendGap / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-muted-foreground">Expected Revenue Lift:</span>
                <span className="font-mono text-green-600">+${(projectedRevenueIncrease / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between p-2 bg-purple-50 rounded border border-purple-200">
                <span className="text-purple-900">Projected ROI:</span>
                <span className="font-mono text-purple-600">{projectedROI.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Plan */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-indigo-900 mb-4">🚀 Recommended Action Plan</h3>
            
            {isUnderSpending ? (
              <div className="space-y-4">
                {/* Under-spending recommendations */}
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowUp className="w-5 h-5 text-orange-600" />
                    <h4 className="text-sm">Increase Marketing Investment</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm mb-3">
                        You're under-spending by <strong>{multiplier.toFixed(1)}×</strong> compared to industry average. 
                        This is limiting your growth potential.
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Phase 1 (Month 1-2):</strong> Increase by ${(spendGap * 0.3 / 1000).toFixed(0)}K (+30%)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Phase 2 (Month 3-4):</strong> Add ${(spendGap * 0.35 / 1000).toFixed(0)}K more (+35%)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Phase 3 (Month 5-6):</strong> Final ${(spendGap * 0.35 / 1000).toFixed(0)}K (+35%)</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="text-xs text-orange-900 mb-2"><strong>Expected Impact:</strong></p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Revenue Increase:</span>
                          <span className="font-mono text-green-600">+${(projectedRevenueIncrease / 1000).toFixed(0)}K/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Impact:</span>
                          <span className="font-mono text-green-600">+${(projectedRevenueIncrease * 12 / 1000000).toFixed(2)}M</span>
                        </div>
                        <div className="flex justify-between border-t border-orange-200 pt-1">
                          <span>ROI:</span>
                          <span className="font-mono text-orange-600">{projectedROI.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Channel recommendations */}
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Recommended Investment Areas
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-indigo-50 rounded">
                      <div className="text-sm mb-1">Digital Advertising</div>
                      <div className="text-xs text-muted-foreground mb-2">40% of new budget</div>
                      <div className="font-mono text-sm text-indigo-600">+${(spendGap * 0.4 / 1000).toFixed(0)}K</div>
                      <p className="text-xs text-muted-foreground mt-1">Google Ads, Social Media, Retargeting</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded">
                      <div className="text-sm mb-1">Content Marketing</div>
                      <div className="text-xs text-muted-foreground mb-2">30% of new budget</div>
                      <div className="font-mono text-sm text-indigo-600">+${(spendGap * 0.3 / 1000).toFixed(0)}K</div>
                      <p className="text-xs text-muted-foreground mt-1">SEO, Blog, Video Content</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded">
                      <div className="text-sm mb-1">Sales Enablement</div>
                      <div className="text-xs text-muted-foreground mb-2">30% of new budget</div>
                      <div className="font-mono text-sm text-indigo-600">+${(spendGap * 0.3 / 1000).toFixed(0)}K</div>
                      <p className="text-xs text-muted-foreground mt-1">CRM, Automation, Lead Gen</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Over-spending recommendations */}
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm">Optimize Marketing Efficiency</h4>
                  </div>
                  <p className="text-sm mb-3">
                    You're spending <strong>{multiplier.toFixed(1)}×</strong> more than industry average. 
                    Focus on improving ROI and efficiency.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>1. Audit Performance</strong>
                      <p className="text-muted-foreground mt-1">
                        Identify underperforming channels and reallocate budget to high-ROI channels
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>2. A/B Testing</strong>
                      <p className="text-muted-foreground mt-1">
                        Test creative, messaging, and targeting to improve conversion rates
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>3. Attribution Tracking</strong>
                      <p className="text-muted-foreground mt-1">
                        Implement proper tracking to measure true marketing contribution
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General best practices */}
            <div className="bg-white p-4 rounded-lg border border-indigo-200 mt-4">
              <h4 className="text-sm mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                Marketing Best Practices
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Track marketing metrics weekly (CAC, LTV, ROMI)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Set clear KPIs for each marketing channel</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Review and optimize campaigns monthly</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Test new channels with 10-15% of budget</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Interpretation Guide */}
      <Card className="p-4 bg-gray-50">
        <h4 className="text-sm mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          Understanding Your Marketing Readiness Score
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <strong>80-100: Excellent</strong>
            </div>
            <p className="text-muted-foreground">
              Optimal spend levels with strong correlation to growth. Keep monitoring and optimizing.
            </p>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <strong>65-79: Good</strong>
            </div>
            <p className="text-muted-foreground">
              Generally healthy marketing investment. Some room for optimization.
            </p>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <strong>50-64: Fair</strong>
            </div>
            <p className="text-muted-foreground">
              Significant gap vs industry norms. Adjust spend or improve efficiency.
            </p>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <strong>0-49: Needs Work</strong>
            </div>
            <p className="text-muted-foreground">
              Critical gap. Either under-investing or poor ROI. Immediate action needed.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
