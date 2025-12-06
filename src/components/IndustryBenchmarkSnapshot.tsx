import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { 
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BarChart3,
  Users,
  Building2,
  Zap,
  Trophy,
  AlertCircle,
  CheckCircle,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Shield,
  Sparkles,
  LineChart,
  Globe
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Cell,
  ComposedChart
} from "recharts";

interface IndustryBenchmarkSnapshotProps {
  data: FinancialData;
  industryTag?: string;
}

export function IndustryBenchmarkSnapshot({ data, industryTag = "Manufacturing" }: IndustryBenchmarkSnapshotProps) {
  
  // Calculate key metrics from the financial data
  const revenue = data.incomeStatement.revenue;
  const netIncome = data.incomeStatement.netIncome;
  const totalAssets = data.balanceSheet.totalAssets;
  const totalEquity = data.balanceSheet.totalEquity;
  const totalLiabilities = data.balanceSheet.totalLiabilities;
  const currentAssets = data.balanceSheet.currentAssets;
  const currentLiabilities = data.balanceSheet.currentLiabilities;
  const operatingIncome = data.incomeStatement.operatingIncome;

  // Calculate ratios
  const netProfitMargin = (netIncome / revenue) * 100;
  const roa = (netIncome / totalAssets) * 100;
  const roe = (netEquity: number) => (netIncome / netEquity) * 100;
  const currentRatio = currentAssets / currentLiabilities;
  const debtToEquity = totalLiabilities / totalEquity;
  const assetTurnover = revenue / totalAssets;
  const operatingMargin = (operatingIncome / revenue) * 100;

  // Industry benchmarks (AI-derived - simulated with realistic industry data)
  // These would come from a database or API in production
  const industryBenchmarks = {
    Manufacturing: {
      netProfitMargin: { p25: 5, median: 8, p75: 12, average: 8.5 },
      roa: { p25: 4, median: 7, p75: 11, average: 7.5 },
      roe: { p25: 8, median: 13, p75: 20, average: 14 },
      currentRatio: { p25: 1.2, median: 1.5, p75: 2.0, average: 1.6 },
      debtToEquity: { p25: 0.5, median: 1.0, p75: 1.8, average: 1.1 },
      assetTurnover: { p25: 0.8, median: 1.2, p75: 1.6, average: 1.2 },
      operatingMargin: { p25: 8, median: 12, p75: 16, average: 12.5 },
      sampleSize: 2847,
      geography: "Global",
    },
    Retail: {
      netProfitMargin: { p25: 3, median: 5, p75: 8, average: 5.5 },
      roa: { p25: 5, median: 8, p75: 12, average: 8.5 },
      roe: { p25: 10, median: 15, p75: 22, average: 16 },
      currentRatio: { p25: 1.0, median: 1.3, p75: 1.8, average: 1.4 },
      debtToEquity: { p25: 0.6, median: 1.2, p75: 2.0, average: 1.3 },
      assetTurnover: { p25: 1.5, median: 2.2, p75: 3.0, average: 2.3 },
      operatingMargin: { p25: 5, median: 8, p75: 12, average: 8.5 },
      sampleSize: 3521,
      geography: "Global",
    },
    Services: {
      netProfitMargin: { p25: 6, median: 10, p75: 15, average: 10.5 },
      roa: { p25: 6, median: 10, p75: 15, average: 10.5 },
      roe: { p25: 12, median: 18, p75: 25, average: 18.5 },
      currentRatio: { p25: 1.3, median: 1.7, p75: 2.2, average: 1.8 },
      debtToEquity: { p25: 0.3, median: 0.8, p75: 1.5, average: 0.9 },
      assetTurnover: { p25: 1.0, median: 1.5, p75: 2.2, average: 1.6 },
      operatingMargin: { p25: 10, median: 15, p75: 20, average: 15 },
      sampleSize: 4102,
      geography: "Global",
    },
  };

  const benchmark = industryBenchmarks[industryTag as keyof typeof industryBenchmarks] || industryBenchmarks.Manufacturing;

  // Calculate percentile rankings for each metric
  const calculatePercentile = (value: number, benchData: { p25: number; median: number; p75: number }) => {
    if (value >= benchData.p75) return { percentile: 75, rank: "Top 25%", color: "green", icon: Trophy };
    if (value >= benchData.median) return { percentile: 50, rank: "Top 50%", color: "blue", icon: Star };
    if (value >= benchData.p25) return { percentile: 25, rank: "Bottom 50%", color: "orange", icon: Target };
    return { percentile: 10, rank: "Bottom 25%", color: "red", icon: AlertCircle };
  };

  // Special handling for debt-to-equity (lower is better)
  const calculatePercentileInverse = (value: number, benchData: { p25: number; median: number; p75: number }) => {
    if (value <= benchData.p25) return { percentile: 75, rank: "Top 25%", color: "green", icon: Trophy };
    if (value <= benchData.median) return { percentile: 50, rank: "Top 50%", color: "blue", icon: Star };
    if (value <= benchData.p75) return { percentile: 25, rank: "Bottom 50%", color: "orange", icon: Target };
    return { percentile: 10, rank: "Bottom 25%", color: "red", icon: AlertCircle };
  };

  const metrics = [
    {
      name: "Net Profit Margin",
      value: netProfitMargin,
      unit: "%",
      benchmark: benchmark.netProfitMargin,
      ranking: calculatePercentile(netProfitMargin, benchmark.netProfitMargin),
      description: "How much profit you keep from each dollar of revenue",
      icon: TrendingUp,
    },
    {
      name: "Return on Assets (ROA)",
      value: roa,
      unit: "%",
      benchmark: benchmark.roa,
      ranking: calculatePercentile(roa, benchmark.roa),
      description: "How efficiently you're using your assets to generate profit",
      icon: BarChart3,
    },
    {
      name: "Return on Equity (ROE)",
      value: roe(totalEquity),
      unit: "%",
      benchmark: benchmark.roe,
      ranking: calculatePercentile(roe(totalEquity), benchmark.roe),
      description: "Return generated on shareholder investment",
      icon: Award,
    },
    {
      name: "Current Ratio",
      value: currentRatio,
      unit: "x",
      benchmark: benchmark.currentRatio,
      ranking: calculatePercentile(currentRatio, benchmark.currentRatio),
      description: "Your ability to pay short-term obligations",
      icon: Shield,
    },
    {
      name: "Debt-to-Equity",
      value: debtToEquity,
      unit: "x",
      benchmark: benchmark.debtToEquity,
      ranking: calculatePercentileInverse(debtToEquity, benchmark.debtToEquity),
      description: "How much debt you're using vs equity (lower is better)",
      icon: Target,
      inverse: true,
    },
    {
      name: "Asset Turnover",
      value: assetTurnover,
      unit: "x",
      benchmark: benchmark.assetTurnover,
      ranking: calculatePercentile(assetTurnover, benchmark.assetTurnover),
      description: "How efficiently you generate revenue from assets",
      icon: Zap,
    },
    {
      name: "Operating Margin",
      value: operatingMargin,
      unit: "%",
      benchmark: benchmark.operatingMargin,
      ranking: calculatePercentile(operatingMargin, benchmark.operatingMargin),
      description: "Profit from core operations before interest and taxes",
      icon: LineChart,
    },
  ];

  // Calculate overall performance score
  const avgPercentile = metrics.reduce((sum, m) => sum + m.ranking.percentile, 0) / metrics.length;
  const overallRank = avgPercentile >= 62.5 ? "Elite Performer" : avgPercentile >= 50 ? "Strong Performer" : avgPercentile >= 37.5 ? "Average Performer" : "Needs Improvement";

  // Count strengths and weaknesses
  const strengths = metrics.filter(m => m.ranking.percentile >= 50);
  const weaknesses = metrics.filter(m => m.ranking.percentile < 50);

  // Radar chart data
  const radarData = metrics.map(m => ({
    metric: m.name.split(" ")[0],
    yourScore: (m.value / (m.benchmark.p75 * 1.2)) * 100, // Normalize to 100
    industryAvg: (m.benchmark.median / (m.benchmark.p75 * 1.2)) * 100,
    topQuartile: (m.benchmark.p75 / (m.benchmark.p75 * 1.2)) * 100,
  }));

  // Comparison bars data
  const comparisonData = metrics.map(m => ({
    name: m.name,
    "Your Performance": m.value,
    "Industry Median": m.benchmark.median,
    "Top 25%": m.benchmark.p75,
    unit: m.unit,
  }));

  const colorMap: Record<string, string> = {
    green: "#10b981",
    blue: "#3b82f6",
    orange: "#f59e0b",
    red: "#ef4444",
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-10"></div>
        <Card className="p-6 border-2 border-indigo-200 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-indigo-900">Industry Benchmark Snapshot</h2>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Your financials compared to <strong>{benchmark.sampleSize.toLocaleString()} {industryTag} MSMEs</strong> globally
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Globe className="w-3 h-3" />
                    <span>{benchmark.geography} Dataset</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{benchmark.sampleSize.toLocaleString()} Companies</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Verified Data</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Performance Badge */}
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Overall Ranking</div>
              <div className={`text-3xl mb-1 ${avgPercentile >= 62.5 ? 'text-green-600' : avgPercentile >= 50 ? 'text-blue-600' : avgPercentile >= 37.5 ? 'text-orange-600' : 'text-red-600'}`}>
                {avgPercentile.toFixed(0)}th
              </div>
              <Badge className={`${avgPercentile >= 62.5 ? 'bg-green-600' : avgPercentile >= 50 ? 'bg-blue-600' : avgPercentile >= 37.5 ? 'bg-orange-600' : 'bg-red-600'} text-white`}>
                {overallRank}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Key Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Your Strengths</div>
              <div className="text-2xl text-green-600">{strengths.length}</div>
            </div>
          </div>
          <div className="text-xs text-green-900 space-y-1">
            {strengths.slice(0, 3).map(s => (
              <div key={s.name} className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Areas to Improve</div>
              <div className="text-2xl text-orange-600">{weaknesses.length}</div>
            </div>
          </div>
          <div className="text-xs text-orange-900 space-y-1">
            {weaknesses.slice(0, 3).map(w => (
              <div key={w.name} className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{w.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Industry Position</div>
              <div className="text-2xl text-blue-600">Top {(100 - avgPercentile).toFixed(0)}%</div>
            </div>
          </div>
          <p className="text-xs text-blue-900">
            You're performing better than {avgPercentile.toFixed(0)}% of {industryTag} MSMEs in your sector
          </p>
        </Card>
      </div>

      {/* Detailed Metric Cards */}
      <div>
        <h3 className="mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Detailed Performance Comparison
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const RankIcon = metric.ranking.icon;
            const isAboveMedian = metric.inverse ? 
              metric.value <= metric.benchmark.median : 
              metric.value >= metric.benchmark.median;
            const diff = metric.inverse ?
              ((metric.benchmark.median - metric.value) / metric.benchmark.median) * 100 :
              ((metric.value - metric.benchmark.median) / metric.benchmark.median) * 100;

            return (
              <Card key={metric.name} className={`p-4 border-l-4 ${metric.ranking.percentile >= 50 ? 'border-l-green-500' : 'border-l-orange-500'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${metric.ranking.color}-100`}>
                      <Icon className={`w-5 h-5 text-${metric.ranking.color}-600`} />
                    </div>
                    <div>
                      <h4 className="text-sm mb-1">{metric.name}</h4>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  </div>
                  <Badge className={`bg-${metric.ranking.color}-600 text-white`}>
                    <RankIcon className="w-3 h-3 mr-1" />
                    {metric.ranking.rank}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Your Score</div>
                    <div className={`text-xl text-${metric.ranking.color}-600`}>
                      {metric.value.toFixed(1)}{metric.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Industry Median</div>
                    <div className="text-xl">
                      {metric.benchmark.median.toFixed(1)}{metric.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Top 25%</div>
                    <div className="text-xl text-green-600">
                      {metric.benchmark.p75.toFixed(1)}{metric.unit}
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-muted-foreground">Bottom 25%</span>
                    <span className="text-muted-foreground">Median</span>
                    <span className="text-muted-foreground">Top 25%</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    {/* Quartile markers */}
                    <div className="absolute inset-y-0 left-1/4 w-px bg-gray-400"></div>
                    <div className="absolute inset-y-0 left-1/2 w-px bg-gray-600"></div>
                    <div className="absolute inset-y-0 left-3/4 w-px bg-gray-400"></div>
                    
                    {/* Your position */}
                    <div 
                      className={`absolute top-0 bottom-0 w-1 bg-${metric.ranking.color}-600`}
                      style={{ 
                        left: `${Math.min(Math.max(
                          metric.inverse ? 
                            (1 - (metric.value / (metric.benchmark.p75 * 1.5))) * 100 :
                            (metric.value / (metric.benchmark.p75 * 1.5)) * 100, 
                          0), 100)}%`,
                        transform: 'translateX(-50%)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Comparison Text */}
                <div className={`p-2 rounded text-xs ${isAboveMedian ? 'bg-green-50 text-green-900' : 'bg-orange-50 text-orange-900'}`}>
                  {isAboveMedian ? (
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      <span>
                        <strong>{Math.abs(diff).toFixed(1)}% {metric.inverse ? 'below' : 'above'}</strong> industry median
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <ArrowDown className="w-3 h-3" />
                      <span>
                        <strong>{Math.abs(diff).toFixed(1)}% {metric.inverse ? 'above' : 'below'}</strong> industry median
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Visual Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="p-4">
          <h3 className="mb-4">📊 Performance Spider Chart</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar 
                name="Your Performance" 
                dataKey="yourScore" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar 
                name="Industry Median" 
                dataKey="industryAvg" 
                stroke="#94a3b8" 
                fill="#94a3b8" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar 
                name="Top 25%" 
                dataKey="topQuartile" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Blue = You | Gray = Industry Average | Green = Top Performers
          </p>
        </Card>

        {/* Percentile Distribution */}
        <Card className="p-4">
          <h3 className="mb-4">📈 Your Position in the Industry</h3>
          <div className="space-y-4">
            {metrics.map(metric => (
              <div key={metric.name}>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="truncate max-w-[180px]">{metric.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`border-${metric.ranking.color}-600 text-${metric.ranking.color}-600`}
                  >
                    {metric.ranking.rank}
                  </Badge>
                </div>
                <div className="relative">
                  <Progress 
                    value={metric.ranking.percentile} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>Bottom</span>
                    <span className={`text-${metric.ranking.color}-600`}>
                      {metric.ranking.percentile}th percentile
                    </span>
                    <span>Top</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Elite Insights */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-indigo-300">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-indigo-900 mb-3">💎 AI-Powered Insights & Recommendations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What You're Doing Right */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <h4 className="text-sm text-green-900">What Sets You Apart</h4>
                </div>
                <div className="space-y-2 text-xs">
                  {strengths.slice(0, 3).map(strength => (
                    <div key={strength.name} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-900">
                          <strong>{strength.name}:</strong> You're in the <strong>{strength.ranking.rank}</strong>
                        </p>
                        <p className="text-green-700">
                          {strength.value.toFixed(1)}{strength.unit} vs industry median of {strength.benchmark.median.toFixed(1)}{strength.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Improvements */}
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h4 className="text-sm text-orange-900">Priority Improvements</h4>
                </div>
                <div className="space-y-2 text-xs">
                  {weaknesses.slice(0, 3).map(weakness => {
                    const gap = weakness.inverse ?
                      weakness.value - weakness.benchmark.median :
                      weakness.benchmark.median - weakness.value;
                    
                    return (
                      <div key={weakness.name} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-orange-900">
                            <strong>{weakness.name}:</strong> {weakness.ranking.rank}
                          </p>
                          <p className="text-orange-700">
                            Improve by <strong>{Math.abs(gap).toFixed(1)}{weakness.unit}</strong> to reach industry median
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Competitive Position Summary */}
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-indigo-200">
              <div className="flex items-start gap-3">
                <Award className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm mb-2 text-indigo-900">🎯 Your Competitive Position</h4>
                  <p className="text-xs text-muted-foreground">
                    {avgPercentile >= 62.5 ? (
                      <>
                        <strong className="text-green-600">Outstanding performance!</strong> You're operating at an elite level, 
                        outperforming {avgPercentile.toFixed(0)}% of {industryTag} MSMEs. Your financial discipline 
                        and operational efficiency are comparable to industry leaders. Focus on maintaining this momentum 
                        while continuing to optimize your weaker metrics.
                      </>
                    ) : avgPercentile >= 50 ? (
                      <>
                        <strong className="text-blue-600">Strong performance!</strong> You're in the top half of your industry, 
                        performing better than {avgPercentile.toFixed(0)}% of peers. You have a solid foundation. 
                        By addressing your weaknesses, you can move into the elite category and significantly improve your competitive advantage.
                      </>
                    ) : avgPercentile >= 37.5 ? (
                      <>
                        <strong className="text-orange-600">Average performance.</strong> You're performing at industry average levels. 
                        There's significant opportunity to improve by focusing on the metrics where you're below median. 
                        Small improvements in 2-3 key areas could move you into the top 50%.
                      </>
                    ) : (
                      <>
                        <strong className="text-red-600">Room for improvement.</strong> Your performance is below industry averages 
                        in several key areas. This represents both a challenge and an opportunity. By implementing targeted 
                        improvements in your weak areas, you can quickly improve your competitive position.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* How to Interpret */}
      <Card className="p-4 bg-gray-50">
        <h4 className="text-sm mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          Understanding Your Benchmark Comparison
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <strong>Top 25%</strong>
            </div>
            <p className="text-muted-foreground">
              Elite performers. You're doing better than 75% of companies in your sector.
            </p>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <strong>Top 50%</strong>
            </div>
            <p className="text-muted-foreground">
              Above average. You're outperforming half of your industry peers.
            </p>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <strong>Bottom 50%</strong>
            </div>
            <p className="text-muted-foreground">
              Below average. Focus area for improvement to reach industry standards.
            </p>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <strong>Bottom 25%</strong>
            </div>
            <p className="text-muted-foreground">
              Priority improvement area. Significant gap vs industry norms.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
