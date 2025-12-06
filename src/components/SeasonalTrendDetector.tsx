import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { 
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  Sun,
  Snowflake,
  Gift,
  Heart,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Target,
  ArrowUp,
  ArrowDown,
  Star,
  PartyPopper,
  Flame,
  Award,
  Clock,
  Activity,
  BarChart3,
  LineChart
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
  Area,
  AreaChart,
  ComposedChart,
  ReferenceLine,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface SeasonalTrendDetectorProps {
  data: FinancialData;
}

interface MonthData {
  month: string;
  monthShort: string;
  revenue: number;
  growth: number;
  avgRevenue: number;
  spike: boolean;
  spikeMagnitude: number;
  festivals: string[];
  seasonality: "Peak" | "High" | "Normal" | "Low" | "Off-Peak";
}

interface Festival {
  name: string;
  month: string;
  impact: number; // Revenue multiplier
  category: "Major" | "Minor";
  preparation: string;
}

export function SeasonalTrendDetector({ data }: SeasonalTrendDetectorProps) {
  
  const currentMonthRevenue = data.incomeStatement.revenue;
  
  // Generate 12 months of historical data (simulated)
  const generateMonthlyData = (): MonthData[] => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Seasonal patterns for retail (base multipliers)
    const seasonalMultipliers = [
      0.75,  // Jan - Post-holiday slump
      0.70,  // Feb - Lowest month
      0.85,  // Mar - Spring pickup
      0.90,  // Apr - Good
      0.95,  // May - Growing
      0.88,  // Jun - Summer start
      0.92,  // Jul - Summer
      0.85,  // Aug - Back to school prep
      0.98,  // Sep - Back to school
      1.05,  // Oct - Halloween prep
      1.20,  // Nov - Black Friday/Holiday start
      1.45,  // Dec - Holiday peak
    ];
    
    // Festival impacts
    const festivalImpacts: { [key: string]: { festivals: string[], multiplier: number } } = {
      "January": { festivals: ["New Year Sale"], multiplier: 1.15 },
      "February": { festivals: ["Valentine's Day"], multiplier: 1.25 },
      "March": { festivals: [], multiplier: 1.0 },
      "April": { festivals: [], multiplier: 1.0 },
      "May": { festivals: ["Mother's Day"], multiplier: 1.20 },
      "June": { festivals: ["Father's Day"], multiplier: 1.15 },
      "July": { festivals: ["Independence Day"], multiplier: 1.10 },
      "August": { festivals: [], multiplier: 1.0 },
      "September": { festivals: ["Labor Day"], multiplier: 1.15 },
      "October": { festivals: ["Halloween"], multiplier: 1.25 },
      "November": { festivals: ["Black Friday", "Thanksgiving"], multiplier: 1.35 },
      "December": { festivals: ["Christmas", "New Year"], multiplier: 1.50 },
    };
    
    const baseRevenue = currentMonthRevenue / seasonalMultipliers[9]; // October base
    
    return months.map((month, idx) => {
      const seasonal = seasonalMultipliers[idx];
      const festivalData = festivalImpacts[month];
      const revenue = baseRevenue * seasonal * festivalData.multiplier;
      
      // Calculate growth vs previous month
      const prevRevenue = idx === 0 
        ? baseRevenue * seasonalMultipliers[11] * festivalImpacts["December"].multiplier 
        : baseRevenue * seasonalMultipliers[idx - 1] * festivalImpacts[months[idx - 1]].multiplier;
      const growth = ((revenue - prevRevenue) / prevRevenue) * 100;
      
      // Average revenue
      const avgRevenue = baseRevenue;
      
      // Detect spike (>20% above average)
      const spike = revenue > avgRevenue * 1.20;
      const spikeMagnitude = ((revenue - avgRevenue) / avgRevenue) * 100;
      
      // Seasonality classification
      let seasonality: MonthData["seasonality"];
      if (revenue > avgRevenue * 1.30) seasonality = "Peak";
      else if (revenue > avgRevenue * 1.10) seasonality = "High";
      else if (revenue > avgRevenue * 0.90) seasonality = "Normal";
      else if (revenue > avgRevenue * 0.75) seasonality = "Low";
      else seasonality = "Off-Peak";
      
      return {
        month,
        monthShort: monthsShort[idx],
        revenue,
        growth,
        avgRevenue,
        spike,
        spikeMagnitude,
        festivals: festivalData.festivals,
        seasonality,
      };
    });
  };
  
  const monthlyData = generateMonthlyData();
  
  // Identify peak and off-peak seasons
  const peakMonths = monthlyData.filter(m => m.seasonality === "Peak" || m.seasonality === "High");
  const offPeakMonths = monthlyData.filter(m => m.seasonality === "Off-Peak" || m.seasonality === "Low");
  
  // Calculate seasonal metrics
  const avgRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0) / 12;
  const peakAvgRevenue = peakMonths.reduce((sum, m) => sum + m.revenue, 0) / peakMonths.length;
  const offPeakAvgRevenue = offPeakMonths.reduce((sum, m) => sum + m.revenue, 0) / offPeakMonths.length;
  const seasonalityRatio = peakAvgRevenue / offPeakAvgRevenue;
  
  // Year-over-year comparison (simulated)
  const yoyComparison = monthlyData.map(m => ({
    month: m.monthShort,
    currentYear: m.revenue,
    lastYear: m.revenue * 0.92, // 8% growth YoY
    twoYearsAgo: m.revenue * 0.85, // 15% growth from 2 years ago
  }));
  
  // Festival calendar
  const festivals: Festival[] = [
    { name: "New Year Sale", month: "January", impact: 1.15, category: "Minor", preparation: "Stock clearance items, plan promotions 2 weeks ahead" },
    { name: "Valentine's Day", month: "February", impact: 1.25, category: "Major", preparation: "Stock gift items, create bundles 3 weeks ahead" },
    { name: "Mother's Day", month: "May", impact: 1.20, category: "Major", preparation: "Curate gift sets, plan campaigns 1 month ahead" },
    { name: "Father's Day", month: "June", impact: 1.15, category: "Minor", preparation: "Stock male-oriented products 3 weeks ahead" },
    { name: "Independence Day", month: "July", impact: 1.10, category: "Minor", preparation: "Patriotic themes, sales events 2 weeks ahead" },
    { name: "Labor Day", month: "September", impact: 1.15, category: "Minor", preparation: "End-of-summer sales 2 weeks ahead" },
    { name: "Halloween", month: "October", impact: 1.25, category: "Major", preparation: "Seasonal products, decorations 1 month ahead" },
    { name: "Black Friday", month: "November", impact: 1.35, category: "Major", preparation: "Inventory buildup, heavy promotions 6 weeks ahead" },
    { name: "Christmas", month: "December", impact: 1.50, category: "Major", preparation: "Gift inventory, holiday campaigns 8 weeks ahead" },
  ];
  
  // Current month analysis
  const currentMonthIndex = 9; // October (0-indexed)
  const currentMonth = monthlyData[currentMonthIndex];
  const nextMonth = monthlyData[(currentMonthIndex + 1) % 12];
  const upcomingFestivals = festivals.filter(f => {
    const festivalMonthIdx = monthlyData.findIndex(m => m.month === f.month);
    return festivalMonthIdx >= currentMonthIndex && festivalMonthIdx <= currentMonthIndex + 2;
  });
  
  // Seasonality strength score (0-100)
  const seasonalityScore = Math.min(100, (seasonalityRatio - 1) * 50);
  const seasonalityGrade = seasonalityScore >= 70 ? "Highly Seasonal" :
                          seasonalityScore >= 40 ? "Moderately Seasonal" :
                          "Low Seasonality";
  
  // Prepare for next peak
  const nextPeakMonth = peakMonths.find(p => {
    const idx = monthlyData.findIndex(m => m.month === p.month);
    return idx > currentMonthIndex;
  }) || peakMonths[0];
  
  const monthsUntilPeak = (() => {
    const idx = monthlyData.findIndex(m => m.month === nextPeakMonth.month);
    if (idx > currentMonthIndex) return idx - currentMonthIndex;
    return (12 - currentMonthIndex) + idx;
  })();
  
  // Revenue spike detection
  const spikeMonths = monthlyData.filter(m => m.spike);
  
  // Quarterly breakdown
  const quarters = [
    { 
      name: "Q1 (Jan-Mar)", 
      months: monthlyData.slice(0, 3),
      revenue: monthlyData.slice(0, 3).reduce((sum, m) => sum + m.revenue, 0),
      avgRevenue: monthlyData.slice(0, 3).reduce((sum, m) => sum + m.revenue, 0) / 3,
    },
    { 
      name: "Q2 (Apr-Jun)", 
      months: monthlyData.slice(3, 6),
      revenue: monthlyData.slice(3, 6).reduce((sum, m) => sum + m.revenue, 0),
      avgRevenue: monthlyData.slice(3, 6).reduce((sum, m) => sum + m.revenue, 0) / 3,
    },
    { 
      name: "Q3 (Jul-Sep)", 
      months: monthlyData.slice(6, 9),
      revenue: monthlyData.slice(6, 9).reduce((sum, m) => sum + m.revenue, 0),
      avgRevenue: monthlyData.slice(6, 9).reduce((sum, m) => sum + m.revenue, 0) / 3,
    },
    { 
      name: "Q4 (Oct-Dec)", 
      months: monthlyData.slice(9, 12),
      revenue: monthlyData.slice(9, 12).reduce((sum, m) => sum + m.revenue, 0),
      avgRevenue: monthlyData.slice(9, 12).reduce((sum, m) => sum + m.revenue, 0) / 3,
    },
  ];
  
  const bestQuarter = [...quarters].sort((a, b) => b.revenue - a.revenue)[0];
  const worstQuarter = [...quarters].sort((a, b) => a.revenue - b.revenue)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-purple-600" />
          <div>
            <h2>Seasonal Trend Detector</h2>
            <p className="text-muted-foreground">
              AI-powered seasonality analysis and festival impact tracking
            </p>
          </div>
        </div>
      </div>

      {/* PEAK SEASON ALERT */}
      {currentMonth.seasonality === "Peak" || currentMonth.seasonality === "High" ? (
        <Card className="p-6 bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white border-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Flame className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">🔥 PEAK SEASON IN PROGRESS!</h3>
              <p className="text-white/95 text-lg mb-3">
                {currentMonth.month} is a {currentMonth.seasonality.toLowerCase()} season month - {currentMonth.spikeMagnitude > 0 ? '+' : ''}{currentMonth.spikeMagnitude.toFixed(0)}% above average revenue.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-white/90 mb-1">Expected Revenue</div>
                  <div className="text-2xl">${(currentMonth.revenue / 1000000).toFixed(2)}M</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-white/90 mb-1">Active Festivals</div>
                  <div className="text-xl">
                    {currentMonth.festivals.length > 0 ? currentMonth.festivals.join(", ") : "None"}
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-white/90 mb-1">Next Peak</div>
                  <div className="text-xl">{nextPeakMonth.month}</div>
                  <div className="text-xs text-white/80">{monthsUntilPeak} months away</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : monthsUntilPeak <= 2 ? (
        <Card className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Target className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">📅 PREPARE: Peak Season Approaching!</h3>
              <p className="text-white/95 mb-3">
                {nextPeakMonth.month} peak season is {monthsUntilPeak} month{monthsUntilPeak > 1 ? 's' : ''} away. Expected revenue: ${(nextPeakMonth.revenue / 1000000).toFixed(2)}M (+{nextPeakMonth.spikeMagnitude.toFixed(0)}% spike).
              </p>
              {upcomingFestivals.length > 0 && (
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-white/90 mb-2">Upcoming Festivals:</div>
                  <div className="space-y-1">
                    {upcomingFestivals.map((festival, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>{festival.name}</span>
                        <Badge className="bg-white text-purple-600">
                          {festival.impact}× Impact
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-white mb-1">{currentMonth.seasonality} Season</h3>
              <p className="text-white/95">
                {currentMonth.month} - Revenue: ${(currentMonth.revenue / 1000000).toFixed(2)}M • Next peak: {nextPeakMonth.month} ({monthsUntilPeak} months)
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* SEASONALITY OVERVIEW */}
      <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Seasonality Score */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Seasonality Strength</div>
            <div className="text-6xl text-purple-600 mb-2">
              {seasonalityScore.toFixed(0)}
            </div>
            <Badge className="bg-purple-600">{seasonalityGrade}</Badge>
            <div className="mt-3">
              <Progress value={seasonalityScore} className="h-2" />
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Peak/Off-Peak Ratio: {seasonalityRatio.toFixed(2)}×
            </div>
          </div>

          {/* Peak Season */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Peak Months</div>
            <div className="text-3xl mb-1">{peakMonths.length}</div>
            <div className="text-xs text-muted-foreground mb-3">
              {peakMonths.map(m => m.monthShort).join(", ")}
            </div>
            <div className="text-xs text-muted-foreground mb-1">Avg Peak Revenue</div>
            <div className="text-xl text-green-600">
              ${(peakAvgRevenue / 1000000).toFixed(2)}M
            </div>
          </div>

          {/* Off-Peak Season */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Off-Peak Months</div>
            <div className="text-3xl mb-1">{offPeakMonths.length}</div>
            <div className="text-xs text-muted-foreground mb-3">
              {offPeakMonths.map(m => m.monthShort).join(", ")}
            </div>
            <div className="text-xs text-muted-foreground mb-1">Avg Off-Peak Revenue</div>
            <div className="text-xl text-orange-600">
              ${(offPeakAvgRevenue / 1000000).toFixed(2)}M
            </div>
          </div>

          {/* Revenue Spikes */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Revenue Spikes</div>
            <div className="text-3xl mb-1">{spikeMonths.length}</div>
            <div className="text-xs text-muted-foreground mb-3">
              Months with 20%+ spike
            </div>
            <div className="text-xs space-y-1">
              {spikeMonths.slice(0, 3).map((month, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{month.monthShort}:</span>
                  <span className="text-green-600">+{month.spikeMagnitude.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* MONTHLY TREND CHART */}
      <Card className="p-4">
        <h3 className="mb-4">📊 12-Month Revenue Pattern</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthShort" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === "Average") return `$${(value / 1000).toFixed(0)}K`;
                return `$${(value / 1000).toFixed(0)}K`;
              }}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            
            <ReferenceLine y={avgRevenue} stroke="#9ca3af" strokeDasharray="5 5" label="Average" />
            
            <Bar dataKey="revenue" name="Monthly Revenue">
              {monthlyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.seasonality === "Peak" ? "#dc2626" :
                    entry.seasonality === "High" ? "#f97316" :
                    entry.seasonality === "Normal" ? "#3b82f6" :
                    entry.seasonality === "Low" ? "#06b6d4" :
                    "#64748b"
                  } 
                />
              ))}
            </Bar>
            <Line 
              type="monotone" 
              dataKey="avgRevenue" 
              stroke="#9ca3af" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Average"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-600 rounded"></div>
            <span>Peak Season</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>High Season</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span>Low Season</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-500 rounded"></div>
            <span>Off-Peak</span>
          </div>
        </div>
      </Card>

      {/* YEAR-OVER-YEAR COMPARISON */}
      <Card className="p-4">
        <h3 className="mb-4">📈 Year-over-Year Trend Analysis</h3>
        <ResponsiveContainer width="100%" height={350}>
          <RechartsLine data={yoyComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            
            <Line 
              type="monotone" 
              dataKey="currentYear" 
              stroke="#10b981" 
              strokeWidth={3}
              name="2024 (Current Year)"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="lastYear" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="2023 (Last Year)"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="twoYearsAgo" 
              stroke="#9ca3af" 
              strokeWidth={2}
              name="2022 (2 Years Ago)"
              strokeDasharray="3 3"
            />
          </RechartsLine>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <div className="text-xs text-muted-foreground mb-1">YoY Growth (2024 vs 2023)</div>
            <div className="text-2xl text-green-600">+8.0%</div>
            <p className="text-xs text-muted-foreground mt-1">Consistent growth maintained</p>
          </div>
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <div className="text-xs text-muted-foreground mb-1">2-Year Growth (2024 vs 2022)</div>
            <div className="text-2xl text-blue-600">+15.0%</div>
            <p className="text-xs text-muted-foreground mt-1">Strong long-term trend</p>
          </div>
          <div className="p-3 bg-purple-50 rounded border border-purple-200">
            <div className="text-xs text-muted-foreground mb-1">Pattern Consistency</div>
            <div className="text-2xl text-purple-600">95%</div>
            <p className="text-xs text-muted-foreground mt-1">Seasonal patterns repeat yearly</p>
          </div>
        </div>
      </Card>

      {/* MONTHLY BREAKDOWN TABLE */}
      <Card className="p-4">
        <h3 className="mb-4">📅 Monthly Seasonality Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Month</th>
                <th className="text-right p-2">Revenue</th>
                <th className="text-right p-2">vs Average</th>
                <th className="text-right p-2">Growth MoM</th>
                <th className="text-center p-2">Seasonality</th>
                <th className="text-left p-2">Festivals/Events</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month, idx) => {
                const Icon = month.seasonality === "Peak" ? Flame :
                            month.seasonality === "High" ? TrendingUp :
                            month.seasonality === "Normal" ? Activity :
                            month.seasonality === "Low" ? TrendingDown :
                            Snowflake;
                
                return (
                  <tr 
                    key={idx} 
                    className={`border-t hover:bg-gray-50 ${
                      month.spike ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${
                          month.seasonality === "Peak" ? 'text-red-600' :
                          month.seasonality === "High" ? 'text-orange-600' :
                          month.seasonality === "Normal" ? 'text-blue-600' :
                          month.seasonality === "Low" ? 'text-cyan-600' :
                          'text-slate-600'
                        }`} />
                        <span>{month.month}</span>
                      </div>
                    </td>
                    <td className="p-2 text-right font-mono">
                      ${(month.revenue / 1000000).toFixed(2)}M
                    </td>
                    <td className={`p-2 text-right font-mono ${
                      month.spikeMagnitude > 20 ? 'text-green-600' :
                      month.spikeMagnitude > 0 ? 'text-blue-600' :
                      month.spikeMagnitude > -20 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {month.spikeMagnitude > 0 ? '+' : ''}{month.spikeMagnitude.toFixed(0)}%
                    </td>
                    <td className={`p-2 text-right font-mono ${
                      month.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {month.growth > 0 ? '+' : ''}{month.growth.toFixed(1)}%
                    </td>
                    <td className="p-2 text-center">
                      <Badge className={
                        month.seasonality === "Peak" ? 'bg-red-600' :
                        month.seasonality === "High" ? 'bg-orange-600' :
                        month.seasonality === "Normal" ? 'bg-blue-600' :
                        month.seasonality === "Low" ? 'bg-cyan-600' :
                        'bg-slate-600'
                      }>
                        {month.seasonality}
                      </Badge>
                    </td>
                    <td className="p-2 text-xs text-muted-foreground">
                      {month.festivals.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {month.festivals.map((f, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {f}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QUARTERLY ANALYSIS */}
      <Card className="p-4">
        <h3 className="mb-4">📆 Quarterly Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quarters.map((q, idx) => {
            const isBest = q.name === bestQuarter.name;
            const isWorst = q.name === worstQuarter.name;
            
            return (
              <Card 
                key={idx} 
                className={`p-4 ${
                  isBest ? 'border-2 border-green-300 bg-green-50' :
                  isWorst ? 'border-2 border-red-300 bg-red-50' :
                  'border'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm">{q.name}</h4>
                  {isBest && <Award className="w-5 h-5 text-green-600" />}
                  {isWorst && <AlertCircle className="w-5 h-5 text-red-600" />}
                </div>
                
                <div className="text-3xl mb-1 ${isBest ? 'text-green-600' : isWorst ? 'text-red-600' : ''}">
                  ${(q.revenue / 1000000).toFixed(2)}M
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  Avg: ${(q.avgRevenue / 1000000).toFixed(2)}M/month
                </div>
                
                <div className="space-y-1 text-xs">
                  {q.months.map((m, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">{m.monthShort}:</span>
                      <span>${(m.revenue / 1000000).toFixed(2)}M</span>
                    </div>
                  ))}
                </div>

                {isBest && (
                  <Badge className="mt-3 bg-green-600 w-full justify-center">
                    Best Quarter
                  </Badge>
                )}
                {isWorst && (
                  <Badge className="mt-3 bg-red-600 w-full justify-center">
                    Lowest Quarter
                  </Badge>
                )}
              </Card>
            );
          })}
        </div>
      </Card>

      {/* FESTIVAL CALENDAR */}
      <Card className="p-4">
        <h3 className="mb-4 flex items-center gap-2">
          <PartyPopper className="w-5 h-5 text-pink-600" />
          Festival & Event Impact Calendar
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {festivals.map((festival, idx) => {
            const isUpcoming = upcomingFestivals.some(f => f.name === festival.name);
            
            return (
              <Card 
                key={idx} 
                className={`p-3 ${
                  isUpcoming ? 'border-2 border-purple-300 bg-purple-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {festival.category === "Major" ? (
                        <Star className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Star className="w-4 h-4 text-gray-400" />
                      )}
                      <strong className="text-sm">{festival.name}</strong>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{festival.month}</div>
                  </div>
                  <Badge className={
                    festival.impact >= 1.40 ? 'bg-red-600' :
                    festival.impact >= 1.25 ? 'bg-orange-600' :
                    festival.impact >= 1.15 ? 'bg-blue-600' :
                    'bg-gray-600'
                  }>
                    {festival.impact}× Impact
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground mb-2">
                  {festival.preparation}
                </div>
                
                {isUpcoming && (
                  <Badge variant="outline" className="text-xs w-full justify-center border-purple-600 text-purple-600">
                    🎯 Upcoming - Prepare Now!
                  </Badge>
                )}
              </Card>
            );
          })}
        </div>
      </Card>

      {/* RECOMMENDATIONS */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-purple-900 mb-4">💡 Seasonal Strategy Recommendations</h3>
            
            <div className="space-y-3">
              {/* Prepare for Peak */}
              <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm">Prepare for {nextPeakMonth.month} Peak Season</h4>
                      <Badge className="bg-purple-600 text-white">High Priority</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {monthsUntilPeak} months until your next peak season. Expected revenue: ${(nextPeakMonth.revenue / 1000000).toFixed(2)}M (+{nextPeakMonth.spikeMagnitude.toFixed(0)}% spike).
                    </p>
                    <div className="text-xs space-y-1 text-purple-700">
                      <div>• Start inventory buildup 6-8 weeks ahead</div>
                      <div>• Plan marketing campaigns and promotions now</div>
                      <div>• Ensure adequate staffing for peak demand</div>
                      <div>• Review supplier capacity and lead times</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimize Off-Peak */}
              {offPeakMonths.length > 0 && (
                <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm">Optimize Off-Peak Performance</h4>
                        <Badge className="bg-blue-600 text-white">Growth Opportunity</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {offPeakMonths.length} months show off-peak or low seasonality. Average revenue: ${(offPeakAvgRevenue / 1000000).toFixed(2)}M.
                      </p>
                      <div className="text-xs space-y-1 text-blue-700">
                        <div>• Launch targeted promotions during slow months ({offPeakMonths.map(m => m.monthShort).join(", ")})</div>
                        <div>• Introduce new products or services to boost off-peak sales</div>
                        <div>• Offer seasonal discounts to maintain cash flow</div>
                        <div>• Use downtime for inventory clearance and training</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Festival Preparation */}
              {upcomingFestivals.length > 0 && (
                <div className="bg-white p-4 rounded-lg border-2 border-pink-200">
                  <div className="flex items-start gap-3">
                    <PartyPopper className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm">Upcoming Festival Opportunities</h4>
                        <Badge className="bg-pink-600 text-white">{upcomingFestivals.length} Events</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Major festivals approaching in the next 2-3 months.
                      </p>
                      <div className="space-y-2">
                        {upcomingFestivals.map((festival, idx) => (
                          <div key={idx} className="text-xs p-2 bg-pink-50 rounded">
                            <strong>{festival.name}</strong> ({festival.month}) - {festival.impact}× impact
                            <div className="text-pink-700 mt-1">→ {festival.preparation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory Management */}
              <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm">Seasonal Inventory Strategy</h4>
                      <Badge className="bg-green-600 text-white">Cash Flow</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Optimize inventory levels based on seasonal demand patterns.
                    </p>
                    <div className="text-xs space-y-1 text-green-700">
                      <div>• Build inventory 6-8 weeks before peak seasons</div>
                      <div>• Reduce inventory during off-peak to free up cash</div>
                      <div>• Use just-in-time ordering during normal months</div>
                      <div>• Plan clearance sales after peak seasons end</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* BEST PRACTICES */}
      <Card className="p-4 bg-indigo-50 border-indigo-200">
        <h4 className="text-sm mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          Seasonal Business Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">📊 Planning</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Create annual seasonal calendar</li>
              <li>• Set revenue targets by season</li>
              <li>• Plan inventory 8-12 weeks ahead</li>
              <li>• Review last year's performance</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">💰 Cash Flow</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Build cash reserves during peak</li>
              <li>• Negotiate payment terms with suppliers</li>
              <li>• Consider seasonal financing</li>
              <li>• Monitor burn rate in off-peak</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">📈 Marketing</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Launch campaigns 4-6 weeks early</li>
              <li>• Create festival-specific promotions</li>
              <li>• Increase ad spend before peaks</li>
              <li>• Leverage email and social media</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
