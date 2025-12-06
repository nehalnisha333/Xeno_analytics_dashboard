import { Card } from "./ui/card";
import { FinancialData, ExpenseCategory } from "../types/financial";
import { 
  DollarSign,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Scissors,
  Target,
  TrendingUp,
  PiggyBank,
  Zap,
  Users,
  Building2,
  Megaphone,
  Cpu,
  PackageOpen,
  Briefcase,
  Settings,
  Eye,
  Lightbulb,
  Calculator,
  ArrowRight,
  ArrowDown
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap } from "recharts";

interface ExpenseOptimizationMapProps {
  data: FinancialData;
  expenses: ExpenseCategory[];
}

export function ExpenseOptimizationMap({ data, expenses }: ExpenseOptimizationMapProps) {
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = data.incomeStatement.revenue;
  const expenseToRevenueRatio = (totalExpenses / totalRevenue) * 100;
  
  // Industry benchmarks for expense ratios (as % of revenue)
  const industryBenchmarks = {
    "Personnel": 35,      // 35% of revenue
    "Marketing": 15,      // 15% of revenue
    "Facilities": 8,      // 8% of revenue
    "Technology": 10,     // 10% of revenue
    "Sales": 12,          // 12% of revenue
    "Operations": 8,      // 8% of revenue
    "Administrative": 5,  // 5% of revenue
  };

  // Categorize expenses
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = {
        category: expense.category,
        total: 0,
        items: [],
        isFixed: true,
      };
    }
    acc[expense.category].total += expense.amount;
    acc[expense.category].items.push(expense);
    if (!expense.isFixed) acc[expense.category].isFixed = false;
    return acc;
  }, {} as Record<string, { category: string; total: number; items: ExpenseCategory[]; isFixed: boolean }>);

  const categoryData = Object.values(expensesByCategory).map(cat => ({
    ...cat,
    percentage: (cat.total / totalExpenses) * 100,
    revenuePercentage: (cat.total / totalRevenue) * 100,
    benchmark: industryBenchmarks[cat.category as keyof typeof industryBenchmarks] || 10,
  }));

  // Sort by amount
  const sortedCategories = [...categoryData].sort((a, b) => b.total - a.total);

  // Fixed vs Variable breakdown
  const fixedExpenses = expenses.filter(e => e.isFixed).reduce((sum, e) => sum + e.amount, 0);
  const variableExpenses = expenses.filter(e => !e.isFixed).reduce((sum, e) => sum + e.amount, 0);

  const fixedVsVariable = [
    { name: "Fixed Costs", value: fixedExpenses, percentage: (fixedExpenses / totalExpenses) * 100, color: "#3b82f6" },
    { name: "Variable Costs", value: variableExpenses, percentage: (variableExpenses / totalExpenses) * 100, color: "#10b981" },
  ];

  // ========== OPTIMIZATION OPPORTUNITIES ==========
  const optimizationOpportunities = categoryData.map(cat => {
    const overBenchmark = cat.revenuePercentage - cat.benchmark;
    const savingsPotential = overBenchmark > 0 ? (overBenchmark / 100) * totalRevenue : 0;
    
    // Identify specific saving opportunities
    const opportunities: { action: string; savings: number; difficulty: "Easy" | "Medium" | "Hard" }[] = [];

    if (cat.category === "Marketing" && overBenchmark > 0) {
      opportunities.push(
        { action: "Cut underperforming ad channels", savings: savingsPotential * 0.3, difficulty: "Easy" },
        { action: "Negotiate better rates with agencies", savings: savingsPotential * 0.2, difficulty: "Medium" },
        { action: "Switch to lower-cost digital channels", savings: savingsPotential * 0.25, difficulty: "Easy" }
      );
    }

    if (cat.category === "Personnel" && overBenchmark > 0) {
      opportunities.push(
        { action: "Optimize overtime and part-time hours", savings: savingsPotential * 0.15, difficulty: "Easy" },
        { action: "Review compensation vs market rates", savings: savingsPotential * 0.2, difficulty: "Hard" },
        { action: "Implement performance-based pay", savings: savingsPotential * 0.15, difficulty: "Medium" }
      );
    }

    if (cat.category === "Facilities" && overBenchmark > 0) {
      opportunities.push(
        { action: "Renegotiate lease terms", savings: savingsPotential * 0.25, difficulty: "Medium" },
        { action: "Reduce energy consumption", savings: savingsPotential * 0.15, difficulty: "Easy" },
        { action: "Consider shared workspace", savings: savingsPotential * 0.3, difficulty: "Hard" }
      );
    }

    if (cat.category === "Technology" && overBenchmark > 0) {
      opportunities.push(
        { action: "Consolidate software subscriptions", savings: savingsPotential * 0.25, difficulty: "Easy" },
        { action: "Switch to annual plans for discounts", savings: savingsPotential * 0.15, difficulty: "Easy" },
        { action: "Eliminate unused licenses", savings: savingsPotential * 0.2, difficulty: "Easy" }
      );
    }

    if (cat.category === "Operations" && overBenchmark > 0) {
      opportunities.push(
        { action: "Automate manual processes", savings: savingsPotential * 0.3, difficulty: "Medium" },
        { action: "Negotiate bulk purchase discounts", savings: savingsPotential * 0.2, difficulty: "Easy" },
        { action: "Reduce waste and inefficiencies", savings: savingsPotential * 0.15, difficulty: "Easy" }
      );
    }

    if (cat.category === "Sales" && overBenchmark > 0) {
      opportunities.push(
        { action: "Optimize commission structure", savings: savingsPotential * 0.2, difficulty: "Medium" },
        { action: "Reduce travel expenses", savings: savingsPotential * 0.25, difficulty: "Easy" },
        { action: "Implement virtual sales tools", savings: savingsPotential * 0.15, difficulty: "Easy" }
      );
    }

    // Variable expense optimization (regardless of benchmark)
    if (!cat.isFixed) {
      const variableSavings = cat.total * 0.1; // 10% reduction potential on variable costs
      opportunities.push(
        { action: "Implement stricter approval process", savings: variableSavings * 0.4, difficulty: "Easy" },
        { action: "Review and cut non-essential spending", savings: variableSavings * 0.6, difficulty: "Easy" }
      );
    }

    return {
      ...cat,
      overBenchmark,
      savingsPotential,
      opportunities: opportunities.filter(o => o.savings > 0),
    };
  });

  // Total savings potential
  const totalSavingsPotential = optimizationOpportunities.reduce((sum, opp) => 
    sum + opp.opportunities.reduce((s, o) => s + o.savings, 0), 0
  );

  // Quick wins (easy + high impact)
  const quickWins = optimizationOpportunities
    .flatMap(cat => cat.opportunities.map(opp => ({ ...opp, category: cat.category })))
    .filter(opp => opp.difficulty === "Easy")
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 5);

  // High-impact opportunities
  const highImpact = optimizationOpportunities
    .filter(cat => cat.savingsPotential > 0)
    .sort((a, b) => b.savingsPotential - a.savingsPotential)
    .slice(0, 3);

  // Icon mapper
  const categoryIcons: Record<string, any> = {
    "Personnel": Users,
    "Marketing": Megaphone,
    "Facilities": Building2,
    "Technology": Cpu,
    "Sales": TrendingUp,
    "Operations": PackageOpen,
    "Administrative": Briefcase,
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

  // Treemap data for visual clustering
  const treemapData = expenses.map(e => ({
    name: e.name,
    size: e.amount,
    category: e.category,
    isFixed: e.isFixed,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Scissors className="w-8 h-8 text-orange-600" />
          <div>
            <h2>Expense Optimization Map</h2>
            <p className="text-muted-foreground">
              Identify where your money goes and discover opportunities to save
            </p>
          </div>
        </div>
      </div>

      {/* SAVINGS POTENTIAL BANNER */}
      <Card className="p-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-full">
              <PiggyBank className="w-12 h-12" />
            </div>
            <div>
              <div className="text-sm text-white/90 mb-1">💰 Total Savings Potential Identified</div>
              <div className="text-5xl mb-2">${(totalSavingsPotential / 1000).toFixed(0)}K</div>
              <div className="text-sm text-white/90">
                That's {((totalSavingsPotential / totalExpenses) * 100).toFixed(1)}% of your total expenses!
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/90 mb-2">Annual Impact</div>
            <div className="text-3xl">${((totalSavingsPotential * 12) / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-white/90">Over one year</div>
          </div>
        </div>
      </Card>

      {/* QUICK WINS - Top Priority */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-7 h-7 text-green-600" />
          <h2 className="text-green-900">⚡ Quick Wins - Start Here!</h2>
        </div>
        <p className="text-sm text-green-800 mb-4">
          These are easy-to-implement changes that can save you money immediately
        </p>
        <div className="space-y-3">
          {quickWins.map((win, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg border border-green-200 flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-600">{win.category}</Badge>
                  <Badge variant="outline" className="text-green-700 border-green-700">
                    {win.difficulty}
                  </Badge>
                </div>
                <p className="text-sm">{win.action}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Save</div>
                <div className="text-2xl text-green-600">${(win.savings / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">/month</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <span className="font-medium text-green-900">Total Quick Wins Potential:</span>
            <span className="text-2xl text-green-600">
              ${(quickWins.reduce((sum, w) => sum + w.savings, 0) / 1000).toFixed(1)}K/month
            </span>
          </div>
        </div>
      </Card>

      {/* Expense Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Monthly Expenses</div>
          <div className="text-3xl mb-2">${(totalExpenses / 1000).toFixed(0)}K</div>
          <div className="text-xs text-muted-foreground">
            {expenseToRevenueRatio.toFixed(1)}% of revenue
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Fixed Costs</div>
          <div className="text-3xl mb-2">${(fixedExpenses / 1000).toFixed(0)}K</div>
          <Progress value={(fixedExpenses / totalExpenses) * 100} className="h-2 mt-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {((fixedExpenses / totalExpenses) * 100).toFixed(1)}% of total
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Variable Costs</div>
          <div className="text-3xl mb-2 text-green-600">${(variableExpenses / 1000).toFixed(0)}K</div>
          <Progress value={(variableExpenses / totalExpenses) * 100} className="h-2 mt-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {((variableExpenses / totalExpenses) * 100).toFixed(1)}% of total
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="text-sm text-orange-900 mb-1">Optimization Potential</div>
          <div className="text-3xl mb-2 text-orange-600">
            {((totalSavingsPotential / totalExpenses) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-orange-700">
            Focus on variable costs for quick wins
          </div>
        </Card>
      </div>

      {/* Expense Clustering Visual */}
      <Card className="p-4">
        <h3 className="mb-4">💰 Where Your Money Goes (Expense Clustering)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h4 className="text-sm mb-3 text-muted-foreground">By Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sortedCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {sortedCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Fixed vs Variable */}
          <div>
            <h4 className="text-sm mb-3 text-muted-foreground">Fixed vs Variable</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fixedVsVariable}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fixedVsVariable.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <div className="w-3 h-3 rounded bg-blue-600"></div>
                <span>Fixed = Harder to reduce (rent, salaries)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <div className="w-3 h-3 rounded bg-green-600"></div>
                <span>Variable = Easier to optimize (marketing, supplies)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Benchmark Comparison */}
      <Card className="p-4">
        <h3 className="mb-4">📊 Your Spending vs Industry Benchmarks</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedCategories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
            <YAxis label={{ value: '% of Revenue', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend />
            <Bar dataKey="revenuePercentage" fill="#3b82f6" name="Your Spending (% of Revenue)">
              {sortedCategories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.revenuePercentage > entry.benchmark ? "#ef4444" : "#10b981"} 
                />
              ))}
            </Bar>
            <Bar dataKey="benchmark" fill="#94a3b8" name="Industry Benchmark" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-900">
              <strong>Red bars = Over benchmark</strong> - You're spending more than industry average
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-900">
              <strong>Green bars = Under benchmark</strong> - You're spending efficiently
            </p>
          </div>
        </div>
      </Card>

      {/* HIGH-IMPACT OPPORTUNITIES */}
      <div>
        <h3 className="mb-4">🎯 High-Impact Optimization Opportunities</h3>
        <div className="space-y-4">
          {highImpact.map((category) => {
            const Icon = categoryIcons[category.category] || Settings;
            const isOverBenchmark = category.overBenchmark > 0;
            
            return (
              <Card key={category.category} className={`p-4 ${isOverBenchmark ? 'border-2 border-orange-300 bg-orange-50' : ''}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Category Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4>{category.category}</h4>
                        <Badge variant={isOverBenchmark ? "destructive" : "secondary"}>
                          {isOverBenchmark ? "Over Budget" : "On Track"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Spend:</span>
                        <span className="font-mono">${(category.total / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">% of Revenue:</span>
                        <span className={`font-mono ${isOverBenchmark ? 'text-red-600' : 'text-green-600'}`}>
                          {category.revenuePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Industry Benchmark:</span>
                        <span className="font-mono">{category.benchmark.toFixed(1)}%</span>
                      </div>
                      {isOverBenchmark && (
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-orange-700">Over by:</span>
                          <span className="font-mono text-orange-700">
                            {category.overBenchmark.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {category.savingsPotential > 0 && (
                      <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                        <div className="text-sm text-orange-900 mb-1">Savings Potential</div>
                        <div className="text-2xl text-orange-600">
                          ${(category.savingsPotential / 1000).toFixed(1)}K
                        </div>
                        <div className="text-xs text-orange-700">per month</div>
                      </div>
                    )}
                  </div>

                  {/* Middle: Expense Breakdown */}
                  <div>
                    <h4 className="text-sm mb-3 text-muted-foreground">Expense Items</h4>
                    <div className="space-y-2">
                      {category.items.slice(0, 5).map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.isFixed ? 'bg-blue-600' : 'bg-green-600'}`}></div>
                            <span className="truncate max-w-[150px]">{item.name}</span>
                          </div>
                          <span className="font-mono text-xs">${(item.amount / 1000).toFixed(1)}K</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Specific Actions */}
                  <div>
                    <h4 className="text-sm mb-3 text-muted-foreground">💡 Recommended Actions</h4>
                    {category.opportunities.length > 0 ? (
                      <div className="space-y-3">
                        {category.opportunities.slice(0, 3).map((opp, idx) => (
                          <div key={idx} className="p-3 bg-white rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className={
                                opp.difficulty === "Easy" ? "border-green-600 text-green-600" :
                                opp.difficulty === "Medium" ? "border-orange-600 text-orange-600" :
                                "border-red-600 text-red-600"
                              }>
                                {opp.difficulty}
                              </Badge>
                              <span className="text-sm text-green-600 font-mono">
                                +${(opp.savings / 1000).toFixed(1)}K
                              </span>
                            </div>
                            <p className="text-xs">{opp.action}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-900">
                          This category is well optimized! Below industry benchmark.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Expense Table */}
      <Card className="p-4">
        <h3 className="mb-4">📋 Complete Expense Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Expense Item</th>
                <th className="text-left py-3 px-2">Category</th>
                <th className="text-center py-3 px-2">Type</th>
                <th className="text-right py-3 px-2">Amount</th>
                <th className="text-right py-3 px-2">% of Total</th>
                <th className="text-right py-3 px-2">% of Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[...expenses].sort((a, b) => b.amount - a.amount).map((expense) => {
                const percentage = (expense.amount / totalExpenses) * 100;
                const revenuePercentage = (expense.amount / totalRevenue) * 100;
                
                return (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{expense.name}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline">{expense.category}</Badge>
                    </td>
                    <td className="text-center py-3 px-2">
                      <Badge variant={expense.isFixed ? "default" : "secondary"}>
                        {expense.isFixed ? "Fixed" : "Variable"}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-2 font-mono">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-2">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="text-right py-3 px-2">
                      {revenuePercentage.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2">
                <td colSpan={3} className="py-3 px-2">
                  <strong>Total</strong>
                </td>
                <td className="text-right py-3 px-2 font-mono">
                  <strong>${totalExpenses.toLocaleString()}</strong>
                </td>
                <td className="text-right py-3 px-2">
                  <strong>100%</strong>
                </td>
                <td className="text-right py-3 px-2">
                  <strong>{expenseToRevenueRatio.toFixed(1)}%</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Implementation Roadmap */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-indigo-900 mb-4">🗺️ Your 90-Day Optimization Roadmap</h3>
            
            <div className="space-y-4">
              {/* Month 1 */}
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">
                    30
                  </div>
                  <h4>Month 1: Quick Wins (Easy Implementations)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-2">Focus Areas:</p>
                    <ul className="space-y-1 text-xs">
                      {quickWins.slice(0, 3).map((win, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-indigo-600" />
                          {win.action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Expected Savings</p>
                    <p className="text-2xl text-green-600">
                      ${(quickWins.slice(0, 3).reduce((sum, w) => sum + w.savings, 0) / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>
              </div>

              {/* Month 2-3 */}
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">
                    60
                  </div>
                  <h4>Months 2-3: Medium-Impact Changes</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-2">Focus Areas:</p>
                    <ul className="space-y-1 text-xs">
                      {highImpact.slice(0, 2).flatMap(cat => 
                        cat.opportunities.filter(o => o.difficulty === "Medium").slice(0, 2)
                      ).map((opp, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-orange-600" />
                          {opp.action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Additional Savings</p>
                    <p className="text-2xl text-green-600">
                      ${((totalSavingsPotential * 0.4) / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>
              </div>

              {/* Total Impact */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/90 mb-1">Total 90-Day Impact</p>
                    <p className="text-3xl">${(totalSavingsPotential / 1000).toFixed(1)}K/month</p>
                    <p className="text-sm text-white/90">
                      = ${((totalSavingsPotential * 12) / 1000000).toFixed(2)}M annual savings
                    </p>
                  </div>
                  <div className="text-right">
                    <Calculator className="w-12 h-12 text-white/80 mb-2" />
                    <p className="text-xs text-white/90">
                      {((totalSavingsPotential / totalExpenses) * 100).toFixed(1)}% cost reduction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
