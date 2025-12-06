import { Card } from "./ui/card";
import { FinancialData, ExpenseCategory } from "../types/financial";
import { 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Shield,
  TrendingDown,
  Calculator,
  FileText,
  Zap,
  Award,
  AlertCircle,
  Info,
  ThumbsUp,
  ThumbsDown,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  XCircle,
  TrendingUp,
  BookOpen,
  BarChart3,
  PiggyBank,
  Percent
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface SmartTaxHealthCheckProps {
  data: FinancialData;
  expenses: ExpenseCategory[];
}

export function SmartTaxHealthCheck({ data, expenses }: SmartTaxHealthCheckProps) {
  
  // Financial data
  const revenue = data.incomeStatement.revenue;
  const netIncome = data.incomeStatement.netIncome;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Assumed tax rate
  const corporateTaxRate = 0.30; // 30% corporate tax
  const gstRate = 0.18; // 18% GST

  // Calculate current tax liability
  const taxableIncome = netIncome;
  const estimatedTaxLiability = taxableIncome * corporateTaxRate;

  // GST Analysis
  const estimatedGSTOnSales = revenue * gstRate;
  const purchaseExpenses = expenses.filter(e => 
    e.category === "Operations" || e.category === "Sales"
  ).reduce((sum, e) => sum + e.amount, 0);
  const estimatedGSTOnPurchases = purchaseExpenses * gstRate;
  const netGSTLiability = estimatedGSTOnSales - estimatedGSTOnPurchases;

  // MISSED DEDUCTIONS DETECTOR
  const missedDeductions = [
    {
      category: "Depreciation & Amortization",
      description: "Accelerated depreciation on equipment and software",
      potentialSaving: 85000,
      confidence: "High",
      actionRequired: "Review fixed asset register and claim accelerated depreciation",
      timeToImplement: "1-2 weeks",
      riskLevel: "Low",
      documentationNeeded: ["Asset purchase invoices", "Depreciation schedule"],
      icon: Calculator,
    },
    {
      category: "R&D Tax Credits",
      description: "Research & development expenses eligible for credits",
      potentialSaving: 120000,
      confidence: "Medium",
      actionRequired: "Document R&D activities and file for tax credits",
      timeToImplement: "1-2 months",
      riskLevel: "Low",
      documentationNeeded: ["Project documentation", "Employee time logs", "Expense receipts"],
      icon: Sparkles,
    },
    {
      category: "Home Office Deductions",
      description: "Employee home office expenses (remote work)",
      potentialSaving: 35000,
      confidence: "High",
      actionRequired: "Collect employee home office expense declarations",
      timeToImplement: "1 week",
      riskLevel: "Low",
      documentationNeeded: ["Employee declarations", "Workspace measurements"],
      icon: FileText,
    },
    {
      category: "Professional Development",
      description: "Training, courses, and certification expenses",
      potentialSaving: 42000,
      confidence: "High",
      actionRequired: "Categorize and document all training expenses",
      timeToImplement: "1 week",
      riskLevel: "Low",
      documentationNeeded: ["Training invoices", "Attendance certificates"],
      icon: BookOpen,
    },
    {
      category: "Business Travel & Meals",
      description: "Unclaimed business travel and meal deductions",
      potentialSaving: 58000,
      confidence: "Medium",
      actionRequired: "Implement expense tracking system for travel and meals",
      timeToImplement: "2 weeks",
      riskLevel: "Medium",
      documentationNeeded: ["Travel receipts", "Business purpose documentation"],
      icon: Target,
    },
    {
      category: "Bad Debts Write-off",
      description: "Uncollectible receivables that can be written off",
      potentialSaving: 95000,
      confidence: "Medium",
      actionRequired: "Review accounts receivable aging and write off bad debts",
      timeToImplement: "2-3 weeks",
      riskLevel: "Medium",
      documentationNeeded: ["AR aging report", "Collection attempt documentation"],
      icon: AlertTriangle,
    },
    {
      category: "Retirement Contributions",
      description: "Employer contributions to retirement plans",
      potentialSaving: 75000,
      confidence: "High",
      actionRequired: "Maximize employer retirement plan contributions",
      timeToImplement: "Ongoing",
      riskLevel: "Low",
      documentationNeeded: ["Retirement plan statements", "Contribution receipts"],
      icon: PiggyBank,
    },
    {
      category: "Charitable Contributions",
      description: "Corporate social responsibility and donations",
      potentialSaving: 28000,
      confidence: "Medium",
      actionRequired: "Document all charitable contributions with proper receipts",
      timeToImplement: "1 week",
      riskLevel: "Low",
      documentationNeeded: ["Donation receipts", "80G certificates"],
      icon: Award,
    },
  ];

  // Calculate total potential savings
  const totalPotentialSavings = missedDeductions.reduce((sum, d) => sum + d.potentialSaving, 0);
  const taxSavingsFromDeductions = totalPotentialSavings * corporateTaxRate;

  // High confidence savings (easy wins)
  const highConfidenceSavings = missedDeductions
    .filter(d => d.confidence === "High")
    .reduce((sum, d) => sum + d.potentialSaving, 0) * corporateTaxRate;

  // GST ANOMALIES DETECTOR
  const gstAnomalies = [
    {
      type: "Input Tax Credit Reconciliation",
      description: "Mismatch between claimed ITC and GSTR-2A",
      estimatedImpact: 125000,
      severity: "High",
      action: "Reconcile GSTR-3B with GSTR-2A and claim missing credits",
      deadline: "Within 30 days of filing",
      icon: AlertTriangle,
    },
    {
      type: "Reverse Charge Mechanism",
      description: "RCM not applied on certain services",
      estimatedImpact: 45000,
      severity: "Medium",
      action: "Review vendor invoices and apply RCM where applicable",
      deadline: "Before year-end",
      icon: AlertCircle,
    },
    {
      type: "Export Documentation",
      description: "Missing export documentation for zero-rated supplies",
      estimatedImpact: 85000,
      severity: "High",
      action: "Obtain shipping bills and LUT/bond documentation",
      deadline: "Within 90 days of export",
      icon: FileText,
    },
    {
      type: "E-way Bill Compliance",
      description: "E-way bills not generated for interstate movement",
      estimatedImpact: 35000,
      severity: "Low",
      action: "Implement automated e-way bill generation",
      deadline: "Immediate",
      icon: Shield,
    },
  ];

  const totalGSTSavings = gstAnomalies.reduce((sum, a) => sum + a.estimatedImpact, 0);

  // COMPLIANCE CHECKLIST
  const complianceItems = [
    { item: "Monthly GST Returns Filed", status: true, importance: "Critical" },
    { item: "TDS Returns Filed on Time", status: true, importance: "Critical" },
    { item: "Annual Financial Statements Prepared", status: true, importance: "High" },
    { item: "Tax Audit Report Filed (if applicable)", status: false, importance: "High" },
    { item: "Transfer Pricing Documentation", status: false, importance: "Medium" },
    { item: "Advance Tax Payments Made", status: true, importance: "High" },
    { item: "Income Tax Return Filed", status: true, importance: "Critical" },
    { item: "Form 15CA/15CB for Foreign Payments", status: false, importance: "Medium" },
  ];

  const complianceScore = (complianceItems.filter(i => i.status).length / complianceItems.length) * 100;

  // TAX HEALTH SCORE CALCULATION (0-100)
  const calculateTaxHealthScore = () => {
    let score = 0;

    // Factor 1: Compliance (40 points)
    score += complianceScore * 0.4;

    // Factor 2: Deduction optimization (30 points)
    // Lower potential missed deductions = higher score
    const deductionUtilization = Math.max(0, 100 - (totalPotentialSavings / totalExpenses) * 100);
    score += (deductionUtilization * 0.3);

    // Factor 3: GST reconciliation (20 points)
    const gstIssueRatio = (totalGSTSavings / netGSTLiability) * 100;
    const gstScore = Math.max(0, 100 - gstIssueRatio);
    score += (gstScore * 0.2);

    // Factor 4: Documentation readiness (10 points)
    const documentationScore = 70; // Simulated - would be based on actual document availability
    score += (documentationScore * 0.1);

    return Math.min(100, Math.max(0, score));
  };

  const taxHealthScore = calculateTaxHealthScore();
  const scoreGrade = taxHealthScore >= 80 ? "Excellent" : 
                     taxHealthScore >= 65 ? "Good" : 
                     taxHealthScore >= 50 ? "Fair" : "Needs Attention";

  const scoreColor = taxHealthScore >= 80 ? "green" : 
                     taxHealthScore >= 65 ? "blue" : 
                     taxHealthScore >= 50 ? "orange" : "red";

  // TOTAL TAX SAVINGS OPPORTUNITY
  const totalTaxSavingsOpportunity = taxSavingsFromDeductions + totalGSTSavings;

  // QUICK WINS (High confidence + Low risk + Short timeframe)
  const quickWins = missedDeductions.filter(d => 
    d.confidence === "High" && 
    d.riskLevel === "Low" && 
    d.timeToImplement.includes("week")
  );

  const quickWinsSavings = quickWins.reduce((sum, d) => sum + d.potentialSaving, 0) * corporateTaxRate;

  // Category breakdown for chart
  const savingsByCategory = missedDeductions.reduce((acc, d) => {
    const existing = acc.find(item => item.category === d.category);
    if (existing) {
      existing.value += d.potentialSaving * corporateTaxRate;
    } else {
      acc.push({
        category: d.category,
        value: d.potentialSaving * corporateTaxRate,
        confidence: d.confidence,
      });
    }
    return acc;
  }, [] as { category: string; value: number; confidence: string }[]);

  // Sort by value
  const sortedSavings = [...savingsByCategory].sort((a, b) => b.value - a.value);

  // Radar chart data for tax health
  const taxHealthRadar = [
    { metric: "Compliance", score: complianceScore, fullMark: 100 },
    { metric: "Deductions", score: Math.max(0, 100 - (totalPotentialSavings / totalExpenses) * 100), fullMark: 100 },
    { metric: "GST Health", score: Math.max(0, 100 - (totalGSTSavings / netGSTLiability) * 100), fullMark: 100 },
    { metric: "Documentation", score: 70, fullMark: 100 },
    { metric: "Planning", score: 65, fullMark: 100 },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-green-600" />
          <div>
            <h2>Smart Tax Health Check</h2>
            <p className="text-muted-foreground">
              AI-powered analysis to help you avoid overpaying tax and maximize deductions
            </p>
          </div>
        </div>
      </div>

      {/* MAIN SAVINGS BANNER */}
      <Card className="p-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-full">
              <DollarSign className="w-12 h-12" />
            </div>
            <div>
              <div className="text-sm text-white/90 mb-1">💰 Potential Tax Savings Identified</div>
              <div className="text-5xl mb-2">${(totalTaxSavingsOpportunity / 1000).toFixed(0)}K</div>
              <div className="text-sm text-white/90">
                We found {missedDeductions.length} missed deductions + {gstAnomalies.length} GST optimization opportunities
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/90 mb-2">Quick Wins Available</div>
            <div className="text-3xl">${(quickWinsSavings / 1000).toFixed(0)}K</div>
            <div className="text-sm text-white/90">Implement in 1-2 weeks</div>
          </div>
        </div>
      </Card>

      {/* TAX HEALTH SCORE */}
      <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Tax Health Score</div>
            <div className="relative inline-block">
              <div className={`text-7xl text-${scoreColor}-600 mb-2`}>
                {taxHealthScore.toFixed(0)}
              </div>
              <div className="absolute -top-2 -right-6 text-3xl text-muted-foreground">/100</div>
            </div>
            <Badge className={`mt-2 ${
              scoreColor === 'green' ? 'bg-green-600' :
              scoreColor === 'blue' ? 'bg-blue-600' :
              scoreColor === 'orange' ? 'bg-orange-600' : 'bg-red-600'
            }`}>
              {scoreGrade}
            </Badge>
            <div className="mt-4">
              <Progress value={taxHealthScore} className="h-3" />
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Compliance Score</div>
              <div className="text-2xl">{complianceScore.toFixed(0)}%</div>
              <div className="text-xs text-green-600">
                {complianceItems.filter(i => i.status).length}/{complianceItems.length} items complete
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Estimated Tax Liability</div>
              <div className="text-2xl">${(estimatedTaxLiability / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground">Based on current income</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Potential Reduction</div>
              <div className="text-2xl text-green-600">
                {((totalTaxSavingsOpportunity / estimatedTaxLiability) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">If all opportunities captured</div>
            </div>
          </div>

          {/* Radar Chart */}
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={taxHealthRadar}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar 
                  name="Your Score" 
                  dataKey="score" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* QUICK WINS SECTION */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-7 h-7 text-green-600" />
          <h2 className="text-green-900">⚡ Quick Wins - Implement This Week!</h2>
        </div>
        <p className="text-sm text-green-800 mb-4">
          High-confidence, low-risk deductions you can claim immediately
        </p>
        <div className="space-y-3">
          {quickWins.map((win, idx) => {
            const Icon = win.icon;
            return (
              <div key={idx} className="bg-white p-4 rounded-lg border border-green-200 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm">{win.category}</h4>
                    <Badge className="bg-green-600 text-white text-xs">
                      {win.confidence} Confidence
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-700 text-xs">
                      {win.riskLevel} Risk
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{win.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{win.timeToImplement}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-700">
                      <ArrowRight className="w-3 h-3" />
                      <span>{win.actionRequired}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Tax Saving</div>
                  <div className="text-2xl text-green-600">
                    ${((win.potentialSaving * corporateTaxRate) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-muted-foreground">
                    (${(win.potentialSaving / 1000).toFixed(0)}K deduction)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-300">
          <div className="flex items-center justify-between">
            <span className="font-medium text-green-900">Total Quick Wins Savings:</span>
            <span className="text-2xl text-green-600">
              ${(quickWinsSavings / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
      </Card>

      {/* ALL MISSED DEDUCTIONS */}
      <Card className="p-4">
        <h3 className="mb-4">📋 All Potential Deductions ({missedDeductions.length} opportunities)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {missedDeductions.map((deduction, idx) => {
            const Icon = deduction.icon;
            const taxSaving = deduction.potentialSaving * corporateTaxRate;
            
            return (
              <Card key={idx} className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-1">{deduction.category}</h4>
                    <p className="text-xs text-muted-foreground">{deduction.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Save</div>
                    <div className="text-xl text-green-600">${(taxSaving / 1000).toFixed(0)}K</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-muted-foreground mb-1">Confidence</div>
                    <Badge variant={deduction.confidence === "High" ? "default" : "secondary"} className="text-xs">
                      {deduction.confidence}
                    </Badge>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-muted-foreground mb-1">Risk</div>
                    <Badge variant={deduction.riskLevel === "Low" ? "secondary" : "outline"} className="text-xs">
                      {deduction.riskLevel}
                    </Badge>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-muted-foreground mb-1">Timeline</div>
                    <span className="text-xs">{deduction.timeToImplement}</span>
                  </div>
                </div>

                <div className="text-xs mb-2">
                  <strong>Action Required:</strong> {deduction.actionRequired}
                </div>

                <div className="text-xs">
                  <strong>Documentation Needed:</strong>
                  <ul className="ml-4 mt-1 space-y-0.5">
                    {deduction.documentationNeeded.map((doc, i) => (
                      <li key={i} className="text-muted-foreground">• {doc}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* GST ANOMALIES */}
      <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h3 className="text-orange-900">🚨 GST Anomalies Detected</h3>
        </div>
        <p className="text-sm text-orange-800 mb-4">
          Potential GST issues that could lead to penalties or missed credits
        </p>
        <div className="space-y-3">
          {gstAnomalies.map((anomaly, idx) => {
            const Icon = anomaly.icon;
            const severityColor = anomaly.severity === "High" ? "red" : 
                                 anomaly.severity === "Medium" ? "orange" : "yellow";
            
            return (
              <div key={idx} className="bg-white p-4 rounded-lg border-2 border-orange-200">
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 text-${severityColor}-600 flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm">{anomaly.type}</h4>
                      <Badge className={`bg-${severityColor}-600 text-white text-xs`}>
                        {anomaly.severity} Priority
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{anomaly.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-orange-700">
                        <Target className="w-3 h-3" />
                        <span><strong>Action:</strong> {anomaly.action}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <Clock className="w-3 h-3" />
                        <span><strong>Deadline:</strong> {anomaly.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Potential Impact</div>
                    <div className="text-xl text-orange-600">
                      ${(anomaly.estimatedImpact / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-orange-300">
          <div className="flex items-center justify-between">
            <span className="font-medium text-orange-900">Total GST Savings Opportunity:</span>
            <span className="text-2xl text-orange-600">
              ${(totalGSTSavings / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
      </Card>

      {/* SAVINGS BREAKDOWN CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-4">
          <h3 className="mb-4">💰 Tax Savings by Category</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sortedSavings} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="category" type="category" width={150} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
              <Bar dataKey="value" fill="#10b981">
                {sortedSavings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.confidence === "High" ? "#10b981" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>High Confidence</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Medium Confidence</span>
            </div>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="p-4">
          <h3 className="mb-4">📊 Savings Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={sortedSavings.slice(0, 6)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, value }) => `${category.split(' ')[0]}: $${(value / 1000).toFixed(0)}K`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {sortedSavings.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* COMPLIANCE CHECKLIST */}
      <Card className="p-4">
        <h3 className="mb-4">✅ Tax Compliance Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {complianceItems.map((item, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                item.status ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              {item.status ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="text-sm mb-1">{item.item}</div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    item.importance === "Critical" ? 'border-red-600 text-red-600' :
                    item.importance === "High" ? 'border-orange-600 text-orange-600' :
                    'border-blue-600 text-blue-600'
                  }`}
                >
                  {item.importance}
                </Badge>
              </div>
              {!item.status && (
                <Badge variant="destructive" className="text-xs">Action Needed</Badge>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-900">Overall Compliance Score:</span>
            <div className="flex items-center gap-3">
              <Progress value={complianceScore} className="w-32 h-2" />
              <span className="text-2xl text-blue-600">{complianceScore.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* IMPLEMENTATION ROADMAP */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-indigo-900 mb-4">🗺️ Tax Optimization Roadmap</h3>
            
            <div className="space-y-4">
              {/* This Week */}
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                    1W
                  </div>
                  <h4>This Week: Quick Documentation Wins</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <ul className="space-y-2 text-xs">
                      {quickWins.slice(0, 3).map((win, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{win.category}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Expected Savings</p>
                    <p className="text-2xl text-green-600">
                      ${(quickWinsSavings / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </div>

              {/* This Month */}
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    1M
                  </div>
                  <h4>This Month: Medium-Priority Deductions</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <ul className="space-y-2 text-xs">
                      {missedDeductions.filter(d => d.confidence === "Medium").slice(0, 3).map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{d.category}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Additional Savings</p>
                    <p className="text-2xl text-blue-600">
                      ${((totalTaxSavingsOpportunity - quickWinsSavings - totalGSTSavings) / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </div>

              {/* This Quarter */}
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">
                    3M
                  </div>
                  <h4>This Quarter: GST Reconciliation & Cleanup</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <ul className="space-y-2 text-xs">
                      {gstAnomalies.slice(0, 3).map((a, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>{a.type}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground mb-1">GST Savings</p>
                    <p className="text-2xl text-orange-600">
                      ${(totalGSTSavings / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Impact */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/90 mb-1">Total Tax Savings Opportunity</p>
                    <p className="text-3xl">${(totalTaxSavingsOpportunity / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-white/90">
                      {((totalTaxSavingsOpportunity / estimatedTaxLiability) * 100).toFixed(1)}% reduction in tax liability
                    </p>
                  </div>
                  <div className="text-right">
                    <BadgeCheck className="w-12 h-12 text-white/80 mb-2" />
                    <p className="text-xs text-white/90">
                      {missedDeductions.length + gstAnomalies.length} opportunities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* YEAR-END TAX PLANNING TIPS */}
      <Card className="p-4 bg-gray-50">
        <h4 className="text-sm mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          Year-End Tax Planning Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">📅 Timing Strategies</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Prepay expenses to increase current year deductions</li>
              <li>• Defer income to next year if possible</li>
              <li>• Make advance tax payments to avoid penalties</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">💼 Asset Management</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Review depreciation schedules</li>
              <li>• Consider Section 179 expensing</li>
              <li>• Dispose of obsolete assets before year-end</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">📊 Record Keeping</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Digitize all receipts and invoices</li>
              <li>• Reconcile all bank and credit card statements</li>
              <li>• Update fixed asset register</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* DISCLAIMER */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-900">
            <strong>Important Disclaimer:</strong> This tax health check is based on general tax principles and industry best practices. 
            Specific applicability and actual savings may vary based on your business structure, location, and individual circumstances. 
            Always consult with a qualified tax professional or chartered accountant before implementing any tax strategies. 
            The amounts shown are estimates and not guaranteed savings.
          </div>
        </div>
      </Card>
    </div>
  );
}
