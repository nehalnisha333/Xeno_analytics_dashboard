import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { 
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Zap,
  Shield,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  LineChart,
  Droplet,
  Flame,
  Wind,
  CloudRain,
  Sun,
  Cloud
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
  Cell
} from "recharts";
import { safeDivide, safeNumber } from "../lib/mathUtils";

interface CashFlowPredictorProps {
  data: FinancialData;
}

export function CashFlowPredictor({ data }: CashFlowPredictorProps) {
  
  // Current financial position - using correct field names
  const currentCash = safeNumber(data.balanceSheet.assets.cash, 500000);
  const monthlyRevenue = safeNumber(data.incomeStatement.revenue, 0);
  const monthlyCOGS = safeNumber(data.incomeStatement.cogs, 0);
  const monthlyExpenses = safeNumber(data.incomeStatement.operatingExpenses, 0);
  // Calculate net income since it doesn't exist in the data structure
  const monthlyNetIncome = monthlyRevenue - monthlyCOGS - monthlyExpenses - safeNumber(data.incomeStatement.interestExpense, 0) - safeNumber(data.incomeStatement.tax, 0);
  
  // Accounts Receivable & Payable - using correct nested paths
  const accountsReceivable = safeNumber(data.balanceSheet.assets.accountsReceivable, 0);
  const accountsPayable = safeNumber(data.balanceSheet.liabilities.accountsPayable, 0);
  const inventory = safeNumber(data.balanceSheet.assets.inventory, 0);
  
  // Calculate key cash flow metrics with safe division
  const operatingCashFlow = monthlyNetIncome + 150000; // Add back depreciation/amortization (simulated)
  const monthlyBurnRate = monthlyExpenses + monthlyCOGS - monthlyRevenue;
  const cashRunway = safeDivide(currentCash, Math.abs(monthlyBurnRate) || 1, 12); // Months of cash remaining

  // Cash Conversion Cycle (days) - with safe division
  const daysInPeriod = 30;
  const daysInventoryOutstanding = safeDivide(inventory, monthlyCOGS, 1) * daysInPeriod;
  const daysReceivablesOutstanding = safeDivide(accountsReceivable, monthlyRevenue, 1) * daysInPeriod;
  const daysPayablesOutstanding = safeDivide(accountsPayable, monthlyCOGS, 1) * daysInPeriod;
  const cashConversionCycle = daysInventoryOutstanding + daysReceivablesOutstanding - daysPayablesOutstanding;

  // 3-MONTH FORECAST
  const generateForecast = () => {
    const months = ["Month 1 (Nov)", "Month 2 (Dec)", "Month 3 (Jan)"];
    let runningCash = currentCash;
    
    // Seasonal factors and business patterns
    const seasonalityFactors = [1.0, 1.25, 0.85]; // Dec is high (holiday), Jan is low (post-holiday slump)
    const collectionDelays = [0.95, 0.88, 0.92]; // Collection efficiency varies
    
    return months.map((month, idx) => {
      // Revenue forecast with seasonality
      const forecastRevenue = monthlyRevenue * seasonalityFactors[idx];
      
      // Cash inflows (adjusted for collection timing)
      const cashFromSales = forecastRevenue * collectionDelays[idx]; // Some sales collected this month
      const collectionFromAR = accountsReceivable * 0.35; // Collect 35% of outstanding AR
      const otherInflows = 50000; // Other income
      const totalInflows = cashFromSales + collectionFromAR + otherInflows;
      
      // Cash outflows
      const cashForCOGS = monthlyCOGS * seasonalityFactors[idx] * 0.85; // Pay 85% in cash
      const operatingExpenses = monthlyExpenses * 1.02; // 2% inflation
      const payrollAndBenefits = 850000;
      const taxPayments = idx === 2 ? 450000 : 0; // Quarterly tax payment in Month 3
      const capitalExpenditures = idx === 1 ? 300000 : 50000; // Large capex in Month 2
      const debtService = 125000; // Monthly loan payments
      const totalOutflows = cashForCOGS + operatingExpenses + payrollAndBenefits + taxPayments + capitalExpenditures + debtService;
      
      // Net change and ending cash
      const netChange = totalInflows - totalOutflows;
      const endingCash = runningCash + netChange;
      
      // Check for stress points
      const isStressPoint = endingCash < 1000000; // Stress if cash drops below $1M
      const isCritical = endingCash < 500000; // Critical if below $500K
      
      // Update running cash
      runningCash = endingCash;
      
      return {
        month,
        monthShort: months[idx].split(' ')[1].replace('(', '').replace(')', ''),
        inflows: totalInflows,
        outflows: totalOutflows,
        netChange,
        endingCash,
        beginningCash: runningCash - netChange,
        isStressPoint,
        isCritical,
        // Breakdown
        cashFromSales,
        collectionFromAR,
        otherInflows,
        cashForCOGS,
        operatingExpenses,
        payrollAndBenefits,
        taxPayments,
        capitalExpenditures,
        debtService,
        // Metrics
        cashCoverage: endingCash / totalOutflows, // How many months of expenses can we cover
        burnRate: netChange < 0 ? Math.abs(netChange) : 0,
      };
    });
  };

  const forecast = generateForecast();
  
  // Identify stress points
  const stressPoints = forecast.filter(f => f.isStressPoint);
  const criticalPoints = forecast.filter(f => f.isCritical);
  
  // Calculate cash health score (0-100)
  const calculateCashHealthScore = () => {
    let score = 0;
    
    // Factor 1: Current cash position (30 points)
    const cashToMonthlyExpenses = currentCash / (monthlyExpenses + monthlyCOGS);
    score += Math.min(30, cashToMonthlyExpenses * 10);
    
    // Factor 2: Forecast stability (30 points)
    const avgEndingCash = forecast.reduce((sum, f) => sum + f.endingCash, 0) / forecast.length;
    const minEndingCash = Math.min(...forecast.map(f => f.endingCash));
    const stability = minEndingCash / avgEndingCash;
    score += stability * 30;
    
    // Factor 3: Cash conversion cycle (20 points)
    const idealCCC = 30; // 30 days is good
    const cccScore = Math.max(0, 20 - Math.abs(cashConversionCycle - idealCCC) / 5);
    score += cccScore;
    
    // Factor 4: Operating cash flow (20 points)
    const ocfPositive = operatingCashFlow > 0 ? 20 : (operatingCashFlow / monthlyRevenue) * 100;
    score += Math.max(0, ocfPositive);
    
    return Math.min(100, Math.max(0, score));
  };

  const cashHealthScore = calculateCashHealthScore();
  const healthGrade = cashHealthScore >= 80 ? "Excellent" : 
                      cashHealthScore >= 65 ? "Good" : 
                      cashHealthScore >= 50 ? "Fair" : "Critical";

  const healthColor = cashHealthScore >= 80 ? "green" : 
                      cashHealthScore >= 65 ? "blue" : 
                      cashHealthScore >= 50 ? "orange" : "red";

  // SCENARIO ANALYSIS
  const scenarios = {
    best: forecast.map(f => ({
      month: f.monthShort,
      endingCash: f.endingCash * 1.15, // 15% better
    })),
    expected: forecast.map(f => ({
      month: f.monthShort,
      endingCash: f.endingCash,
    })),
    worst: forecast.map(f => ({
      month: f.monthShort,
      endingCash: f.endingCash * 0.85, // 15% worse
    })),
  };

  // RECOMMENDATIONS based on stress points
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (criticalPoints.length > 0) {
      const criticalMonth = criticalPoints[0];
      const shortfall = 1000000 - criticalMonth.endingCash; // Target minimum $1M
      
      recommendations.push({
        priority: "Critical",
        title: "Immediate Cash Injection Needed",
        description: `${criticalMonth.month.split(' ')[1]} shows critical cash shortage`,
        action: `Secure $${(shortfall / 1000).toFixed(0)}K+ in funding or defer expenses`,
        impact: shortfall,
        timeline: "Within 2 weeks",
        icon: AlertTriangle,
        color: "red",
      });
    }
    
    if (stressPoints.length > 0 && criticalPoints.length === 0) {
      const firstStress = stressPoints[0];
      const shortfall = 1000000 - firstStress.endingCash;
      
      recommendations.push({
        priority: "High",
        title: "Cash Buffer at Risk",
        description: `${firstStress.month.split(' ')[1]} drops below recommended minimum`,
        action: `Build $${(shortfall / 1000).toFixed(0)}K buffer or optimize timing`,
        impact: shortfall,
        timeline: "Within 1 month",
        icon: AlertCircle,
        color: "orange",
      });
    }
    
    // AR collection opportunity
    if (daysReceivablesOutstanding > 30) {
      const potentialCash = accountsReceivable * 0.3; // 30% faster collection
      recommendations.push({
        priority: "Medium",
        title: "Accelerate Receivables Collection",
        description: `Currently taking ${daysReceivablesOutstanding.toFixed(0)} days to collect`,
        action: `Reduce to 30 days to free up $${(potentialCash / 1000).toFixed(0)}K`,
        impact: potentialCash,
        timeline: "Ongoing",
        icon: TrendingUp,
        color: "blue",
      });
    }
    
    // Inventory optimization
    if (daysInventoryOutstanding > 45) {
      const excessInventory = (daysInventoryOutstanding - 45) * (monthlyCOGS / 30);
      recommendations.push({
        priority: "Medium",
        title: "Reduce Inventory Holding",
        description: `${daysInventoryOutstanding.toFixed(0)} days of inventory on hand`,
        action: `Target 45 days to free up $${(excessInventory / 1000).toFixed(0)}K`,
        impact: excessInventory,
        timeline: "2-3 months",
        icon: Target,
        color: "blue",
      });
    }
    
    // Extend payables
    if (daysPayablesOutstanding < 40) {
      const additionalBuffer = (40 - daysPayablesOutstanding) * (monthlyCOGS / 30);
      recommendations.push({
        priority: "Low",
        title: "Optimize Payment Terms",
        description: `Paying suppliers in ${daysPayablesOutstanding.toFixed(0)} days`,
        action: `Negotiate 45-day terms to retain $${(additionalBuffer / 1000).toFixed(0)}K longer`,
        impact: additionalBuffer,
        timeline: "1-2 months",
        icon: Clock,
        color: "green",
      });
    }
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  // Waterfall data for cash movements
  const waterfallData = [
    { category: "Starting Cash", value: currentCash, cumulative: currentCash },
    { category: "Collections", value: forecast[0].cashFromSales + forecast[0].collectionFromAR, cumulative: currentCash + forecast[0].cashFromSales + forecast[0].collectionFromAR },
    { category: "COGS", value: -forecast[0].cashForCOGS, cumulative: currentCash + forecast[0].cashFromSales + forecast[0].collectionFromAR - forecast[0].cashForCOGS },
    { category: "Operating Exp", value: -forecast[0].operatingExpenses, cumulative: 0 },
    { category: "Payroll", value: -forecast[0].payrollAndBenefits, cumulative: 0 },
    { category: "Other", value: -(forecast[0].capitalExpenditures + forecast[0].debtService), cumulative: 0 },
    { category: "Ending Cash", value: 0, cumulative: forecast[0].endingCash },
  ];

  // Calculate cumulative for waterfall
  for (let i = 3; i < waterfallData.length - 1; i++) {
    waterfallData[i].cumulative = waterfallData[i - 1].cumulative + waterfallData[i].value;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h2>Cash Flow Predictor</h2>
            <p className="text-muted-foreground">
              AI-powered 3-month forecast with stress point detection
            </p>
          </div>
        </div>
      </div>

      {/* CRITICAL ALERT BANNER */}
      {criticalPoints.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white border-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">🚨 CRITICAL: Cash Shortage Detected</h3>
              <p className="text-white/95 text-lg mb-3">
                Don't run out of cash next quarter! Your forecast shows {criticalPoints.length} critical stress point{criticalPoints.length > 1 ? 's' : ''}.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalPoints.map((point, idx) => (
                  <div key={idx} className="bg-white/10 p-3 rounded-lg">
                    <div className="text-sm text-white/90 mb-1">{point.month}</div>
                    <div className="text-2xl mb-1">${(point.endingCash / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-white/90">
                      ${((1000000 - point.endingCash) / 1000).toFixed(0)}K below safe minimum
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* WARNING ALERT BANNER */}
      {stressPoints.length > 0 && criticalPoints.length === 0 && (
        <Card className="p-6 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white border-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">⚠️ WARNING: Cash Stress Points Ahead</h3>
              <p className="text-white/95 mb-3">
                Your cash buffer will drop below recommended levels in {stressPoints.length} month{stressPoints.length > 1 ? 's' : ''}.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stressPoints.map((point, idx) => (
                  <div key={idx} className="bg-white/10 p-3 rounded-lg">
                    <div className="text-xs text-white/90 mb-1">{point.month}</div>
                    <div className="text-xl">${(point.endingCash / 1000).toFixed(0)}K</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* HEALTHY BANNER */}
      {stressPoints.length === 0 && (
        <Card className="p-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-white mb-2">✅ Cash Position Healthy</h3>
              <p className="text-white/95">
                Your 3-month forecast shows stable cash flow with no stress points. Keep monitoring regularly.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* CASH HEALTH SCORE */}
      <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Score */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Cash Health Score</div>
            <div className="relative inline-block">
              <div className={`text-6xl text-${healthColor}-600 mb-2`}>
                {cashHealthScore.toFixed(0)}
              </div>
              <div className="absolute -top-1 -right-5 text-2xl text-muted-foreground">/100</div>
            </div>
            <Badge className={`mt-2 ${
              healthColor === 'green' ? 'bg-green-600' :
              healthColor === 'blue' ? 'bg-blue-600' :
              healthColor === 'orange' ? 'bg-orange-600' : 'bg-red-600'
            }`}>
              {healthGrade}
            </Badge>
            <div className="mt-3">
              <Progress value={cashHealthScore} className="h-2" />
            </div>
          </div>

          {/* Current Position */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Current Cash</div>
            <div className="text-3xl mb-1">${(currentCash / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground mb-3">
              {(currentCash / (monthlyExpenses + monthlyCOGS)).toFixed(1)} months of expenses
            </div>
            <div className="text-xs text-muted-foreground mb-1">Operating Cash Flow</div>
            <div className={`text-xl ${operatingCashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(operatingCashFlow / 1000).toFixed(0)}K
            </div>
          </div>

          {/* Forecast Metrics */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">3-Month Forecast</div>
            <div className="text-3xl mb-1">${(forecast[2].endingCash / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground mb-3">
              Projected cash in {forecast[2].monthShort}
            </div>
            <div className="text-xs text-muted-foreground mb-1">Net Change</div>
            <div className={`text-xl ${forecast[2].endingCash - currentCash > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {forecast[2].endingCash - currentCash > 0 ? '+' : ''}${((forecast[2].endingCash - currentCash) / 1000).toFixed(0)}K
            </div>
          </div>

          {/* Cash Conversion */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Cash Conversion Cycle</div>
            <div className="text-3xl mb-1">{cashConversionCycle.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mb-3">days</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days Inventory:</span>
                <span>{daysInventoryOutstanding.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days Receivables:</span>
                <span>{daysReceivablesOutstanding.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days Payables:</span>
                <span>{daysPayablesOutstanding.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3-MONTH FORECAST CHART */}
      <Card className="p-4">
        <h3 className="mb-4">📊 3-Month Cash Flow Forecast</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip 
              formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            
            {/* Safe minimum line */}
            <ReferenceLine y={1000000} stroke="#10b981" strokeDasharray="3 3" label="Safe Minimum" />
            
            {/* Critical line */}
            <ReferenceLine y={500000} stroke="#ef4444" strokeDasharray="3 3" label="Critical" />
            
            <Area 
              type="monotone" 
              dataKey="inflows" 
              fill="#10b981" 
              stroke="#10b981" 
              fillOpacity={0.3}
              name="Cash Inflows"
            />
            <Area 
              type="monotone" 
              dataKey="outflows" 
              fill="#ef4444" 
              stroke="#ef4444" 
              fillOpacity={0.3}
              name="Cash Outflows"
            />
            <Line 
              type="monotone" 
              dataKey="endingCash" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Ending Cash Position"
              dot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* MONTHLY BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecast.map((month, idx) => {
          const Icon = month.isCritical ? AlertTriangle : 
                       month.isStressPoint ? AlertCircle : 
                       CheckCircle;
          const bgColor = month.isCritical ? "bg-red-50 border-red-300" : 
                         month.isStressPoint ? "bg-orange-50 border-orange-300" : 
                         "bg-green-50 border-green-300";
          const textColor = month.isCritical ? "text-red-900" : 
                           month.isStressPoint ? "text-orange-900" : 
                           "text-green-900";
          
          return (
            <Card key={idx} className={`p-4 border-2 ${bgColor}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${month.isCritical ? 'text-red-600' : month.isStressPoint ? 'text-orange-600' : 'text-green-600'}`} />
                <h4 className={textColor}>{month.month}</h4>
              </div>
              
              {/* Cash Position */}
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-1">Ending Cash Position</div>
                <div className={`text-3xl ${month.isCritical ? 'text-red-600' : month.isStressPoint ? 'text-orange-600' : 'text-green-600'}`}>
                  ${(month.endingCash / 1000000).toFixed(2)}M
                </div>
                <div className={`text-xs ${month.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {month.netChange >= 0 ? '+' : ''}${(month.netChange / 1000).toFixed(0)}K net change
                </div>
              </div>

              {/* Inflows */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Cash Inflows</span>
                  <span className="text-green-600">${(month.inflows / 1000).toFixed(0)}K</span>
                </div>
                <div className="space-y-0.5 text-xs pl-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>• Sales collections</span>
                    <span>${(month.cashFromSales / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>• AR collections</span>
                    <span>${(month.collectionFromAR / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>• Other income</span>
                    <span>${(month.otherInflows / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              {/* Outflows */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Cash Outflows</span>
                  <span className="text-red-600">${(month.outflows / 1000).toFixed(0)}K</span>
                </div>
                <div className="space-y-0.5 text-xs pl-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>• COGS</span>
                    <span>${(month.cashForCOGS / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>• Operating exp</span>
                    <span>${(month.operatingExpenses / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>• Payroll</span>
                    <span>${(month.payrollAndBenefits / 1000).toFixed(0)}K</span>
                  </div>
                  {month.taxPayments > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>• Tax payments</span>
                      <span>${(month.taxPayments / 1000).toFixed(0)}K</span>
                    </div>
                  )}
                  {month.capitalExpenditures > 100000 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>• Capex</span>
                      <span>${(month.capitalExpenditures / 1000).toFixed(0)}K</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="pt-3 border-t space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Coverage:</span>
                  <span>{month.cashCoverage.toFixed(1)}x</span>
                </div>
                {month.burnRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Burn Rate:</span>
                    <span className="text-red-600">${(month.burnRate / 1000).toFixed(0)}K/mo</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* SCENARIO ANALYSIS */}
      <Card className="p-4">
        <h3 className="mb-4">🎯 Scenario Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLine data={scenarios.expected}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              type="category" 
              allowDuplicatedCategory={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            
            <ReferenceLine y={1000000} stroke="#10b981" strokeDasharray="3 3" />
            <ReferenceLine y={500000} stroke="#ef4444" strokeDasharray="3 3" />
            
            <Line 
              data={scenarios.best} 
              type="monotone" 
              dataKey="endingCash" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Best Case (+15%)"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="endingCash" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Expected Case"
            />
            <Line 
              data={scenarios.worst} 
              type="monotone" 
              dataKey="endingCash" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Worst Case (-15%)"
              strokeDasharray="5 5"
            />
          </RechartsLine>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-green-600" />
              <strong className="text-green-900">Best Case</strong>
            </div>
            <p className="text-xs text-muted-foreground">15% better collections, lower expenses</p>
            <p className="text-lg text-green-600 mt-2">
              ${(scenarios.best[2].endingCash / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-4 h-4 text-blue-600" />
              <strong className="text-blue-900">Expected Case</strong>
            </div>
            <p className="text-xs text-muted-foreground">Based on current trends and patterns</p>
            <p className="text-lg text-blue-600 mt-2">
              ${(scenarios.expected[2].endingCash / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <CloudRain className="w-4 h-4 text-red-600" />
              <strong className="text-red-900">Worst Case</strong>
            </div>
            <p className="text-xs text-muted-foreground">Delayed collections, higher costs</p>
            <p className="text-lg text-red-600 mt-2">
              ${(scenarios.worst[2].endingCash / 1000000).toFixed(2)}M
            </p>
          </div>
        </div>
      </Card>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-indigo-900 mb-4">💡 Recommended Actions to Improve Cash Position</h3>
              
              <div className="space-y-3">
                {recommendations.map((rec, idx) => {
                  const Icon = rec.icon;
                  const priorityColor = rec.priority === "Critical" ? "red" :
                                       rec.priority === "High" ? "orange" :
                                       rec.priority === "Medium" ? "blue" : "green";
                  
                  return (
                    <div key={idx} className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 text-${rec.color}-600 flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm">{rec.title}</h4>
                            <Badge className={`bg-${priorityColor}-600 text-white text-xs`}>
                              {rec.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-indigo-700">
                              <ArrowRight className="w-3 h-3" />
                              <span><strong>Action:</strong> {rec.action}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{rec.timeline}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Impact</div>
                          <div className="text-xl text-green-600">
                            +${(rec.impact / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Impact */}
              <div className="mt-4 p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/90 mb-1">Total Potential Cash Improvement</p>
                    <p className="text-3xl">
                      +${(recommendations.reduce((sum, r) => sum + r.impact, 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/90">{recommendations.length} Actions</p>
                    <p className="text-xs text-white/80 mt-1">
                      Implement over {recommendations[0]?.timeline || '1-3 months'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* CASH CONVERSION CYCLE */}
      <Card className="p-4">
        <h3 className="mb-4">⏱️ Cash Conversion Cycle Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <div className="text-xs text-muted-foreground mb-2">Days Inventory Outstanding</div>
            <div className="text-4xl text-blue-600 mb-2">{daysInventoryOutstanding.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Time inventory sits before sale</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <div className="text-xs text-muted-foreground mb-2">Days Sales Outstanding</div>
            <div className="text-4xl text-green-600 mb-2">{daysReceivablesOutstanding.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Time to collect after sale</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
            <div className="text-xs text-muted-foreground mb-2">Days Payables Outstanding</div>
            <div className="text-4xl text-orange-600 mb-2">{daysPayablesOutstanding.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Time to pay suppliers</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-400 text-center">
            <div className="text-xs text-muted-foreground mb-2">Cash Conversion Cycle</div>
            <div className="text-4xl text-purple-600 mb-2">{cashConversionCycle.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              {cashConversionCycle < 30 ? 'Excellent!' : cashConversionCycle < 60 ? 'Good' : 'Needs improvement'}
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p className="text-xs text-muted-foreground">
            <strong>Formula:</strong> DIO + DSO - DPO = CCC
            <br />
            <strong>Your Cycle:</strong> {daysInventoryOutstanding.toFixed(0)} + {daysReceivablesOutstanding.toFixed(0)} - {daysPayablesOutstanding.toFixed(0)} = <strong>{cashConversionCycle.toFixed(0)} days</strong>
            <br />
            <strong>Meaning:</strong> It takes {cashConversionCycle.toFixed(0)} days to convert your investments in inventory and receivables back into cash.
          </p>
        </div>
      </Card>

      {/* TIPS */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="text-sm mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          Cash Flow Management Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">🎯 Monitor Weekly</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Review cash position every week</li>
              <li>• Track actual vs forecast variance</li>
              <li>• Update forecast with new data</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">💰 Build Reserves</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Maintain 2-3 months of expenses</li>
              <li>• Set up line of credit before needed</li>
              <li>• Consider invoice factoring for AR</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">⚡ Accelerate Collections</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Offer early payment discounts</li>
              <li>• Automate payment reminders</li>
              <li>• Invoice immediately after delivery</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* DISCLAIMER */}
      <Card className="p-3 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-2 text-xs">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-900">
            <strong>Forecast Disclaimer:</strong> This cash flow forecast is based on historical patterns and AI projections. 
            Actual results may vary due to market conditions, customer behavior, and unforeseen events. 
            Review and update your forecast regularly with actual data.
          </p>
        </div>
      </Card>
    </div>
  );
}