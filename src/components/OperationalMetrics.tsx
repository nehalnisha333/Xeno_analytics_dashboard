import { Card } from "./ui/card";
import { FinancialData, Product } from "../types/financial";
import { TrendingUp, TrendingDown, Info, Package, DollarSign, Users, PieChart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart, Area } from "recharts";
import { Badge } from "./ui/badge";

interface OperationalMetricsProps {
  data: FinancialData;
  products: Product[];
}

export function OperationalMetrics({ data, products }: OperationalMetricsProps) {
  const { incomeStatement, operationalData, balanceSheet } = data;

  // C. Operational Efficiency KPIs

  // 1. Inventory Turnover = COGS / Average Inventory
  const totalCOGS = operationalData.monthlyInventory.reduce((sum, m) => sum + m.cogs, 0);
  const avgInventory = operationalData.monthlyInventory.reduce((sum, m) => sum + m.inventory, 0) / operationalData.monthlyInventory.length;
  const inventoryTurnover = totalCOGS / avgInventory;
  const inventoryTurnoverBenchmark = 6; // times per year (normalized for period)
  const inventoryTurnoverStatus = inventoryTurnover >= inventoryTurnoverBenchmark ? "good" : inventoryTurnover >= 4 ? "warning" : "critical";

  // Calculate monthly turnover for trend
  const inventoryTurnoverData = operationalData.monthlyInventory.map((m, index) => {
    // Calculate rolling average inventory
    const startIndex = Math.max(0, index - 1);
    const rollingAvg = operationalData.monthlyInventory
      .slice(startIndex, index + 1)
      .reduce((sum, item) => sum + item.inventory, 0) / (index - startIndex + 1);
    
    return {
      month: m.month,
      inventory: m.inventory,
      cogs: m.cogs,
      turnover: m.cogs / rollingAvg,
      daysInInventory: (rollingAvg / m.cogs) * 30,
    };
  });

  // Days in Inventory
  const daysInInventory = (avgInventory / totalCOGS) * 365;

  // 2. Unit Economics - Selling Price – Variable Cost per Unit
  const productEconomics = products.map(p => {
    const sellingPrice = p.revenue / p.units;
    const variableCost = p.cogs / p.units;
    const unitProfit = sellingPrice - variableCost;
    const unitMargin = (unitProfit / sellingPrice) * 100;
    return {
      ...p,
      sellingPrice,
      variableCost,
      unitProfit,
      unitMargin,
    };
  });

  const avgUnitProfit = productEconomics.reduce((sum, p) => sum + p.unitProfit * p.units, 0) / products.reduce((sum, p) => sum + p.units, 0);
  const avgUnitMargin = productEconomics.reduce((sum, p) => sum + p.unitMargin * p.units, 0) / products.reduce((sum, p) => sum + p.units, 0);
  const unitEconomicsStatus = avgUnitMargin >= 30 ? "good" : avgUnitMargin >= 20 ? "warning" : "critical";

  // Top products by unit economics
  const topUnitEconomics = [...productEconomics].sort((a, b) => b.unitProfit - a.unitProfit).slice(0, 5);

  // 3. Expense Ratio = Total Expenses / Revenue * 100
  const expenseRatioData = operationalData.monthlyExpenses.map(m => ({
    month: m.month,
    totalExpenses: m.totalExpenses,
    revenue: m.revenue,
    expenseRatio: (m.totalExpenses / m.revenue) * 100,
    profit: m.revenue - m.totalExpenses,
  }));

  const totalExpenses = operationalData.monthlyExpenses.reduce((sum, m) => sum + m.totalExpenses, 0);
  const totalRevenue = operationalData.monthlyExpenses.reduce((sum, m) => sum + m.revenue, 0);
  const expenseRatio = (totalExpenses / totalRevenue) * 100;
  const lastMonthExpenseRatio = expenseRatioData[expenseRatioData.length - 1].expenseRatio;
  const expenseRatioBenchmark = 75; // Should be below 75%
  const expenseRatioStatus = lastMonthExpenseRatio <= expenseRatioBenchmark ? "good" : lastMonthExpenseRatio <= 85 ? "warning" : "critical";

  // Expense ratio trend
  const avgExpenseRatio = expenseRatioData.reduce((sum, m) => sum + m.expenseRatio, 0) / expenseRatioData.length;

  // 4. Employee Productivity = Revenue / Number of Employees
  const employeeProductivity = totalRevenue / operationalData.employees;
  const lastMonthRevenue = operationalData.monthlyExpenses[operationalData.monthlyExpenses.length - 1].revenue;
  const monthlyProductivity = lastMonthRevenue / operationalData.employees;
  const productivityBenchmark = 20000; // $20K per employee per month
  const productivityStatus = monthlyProductivity >= productivityBenchmark ? "good" : monthlyProductivity >= 15000 ? "warning" : "critical";

  // Calculate monthly productivity
  const productivityData = operationalData.monthlyExpenses.map(m => ({
    month: m.month,
    revenue: m.revenue,
    productivity: m.revenue / operationalData.employees,
    revenuePerEmployee: m.revenue / operationalData.employees,
  }));

  const kpis = [
    {
      name: "Inventory Turnover",
      abbr: "IT",
      value: `${inventoryTurnover.toFixed(1)}x`,
      status: inventoryTurnoverStatus,
      benchmark: `≥${inventoryTurnoverBenchmark}x`,
      formula: "COGS / Average Inventory",
      explanation: "Shows how fast inventory moves. Higher is better.",
      insight: inventoryTurnover >= inventoryTurnoverBenchmark
        ? "Excellent inventory velocity - efficient stock management"
        : inventoryTurnover >= 4
        ? "Moderate turnover - consider optimizing stock levels"
        : "Slow-moving inventory - risk of obsolescence and tied-up cash",
      icon: Package,
      detailValue: Math.round(daysInInventory),
      detailLabel: "Days in Inventory",
    },
    {
      name: "Unit Economics",
      abbr: "UE",
      value: `$${avgUnitProfit.toFixed(0)}`,
      status: unitEconomicsStatus,
      benchmark: "≥30% margin",
      formula: "Selling Price – Variable Cost per Unit",
      explanation: "Understand profit per unit sold.",
      insight: avgUnitMargin >= 30
        ? `Strong unit economics with ${avgUnitMargin.toFixed(1)}% margin`
        : avgUnitMargin >= 20
        ? `Acceptable margins (${avgUnitMargin.toFixed(1)}%) - optimize where possible`
        : `Weak margins (${avgUnitMargin.toFixed(1)}%) - review pricing and costs urgently`,
      icon: DollarSign,
      detailValue: avgUnitMargin,
      detailLabel: "Avg Unit Margin %",
    },
    {
      name: "Expense Ratio",
      abbr: "ER",
      value: `${lastMonthExpenseRatio.toFixed(1)}%`,
      status: expenseRatioStatus,
      benchmark: `≤${expenseRatioBenchmark}%`,
      formula: "Total Expenses / Revenue × 100",
      explanation: "Control cost efficiency. Lower is better.",
      insight: lastMonthExpenseRatio <= expenseRatioBenchmark
        ? "Excellent cost control - expenses well managed"
        : lastMonthExpenseRatio <= 85
        ? "Moderate expense ratio - look for optimization opportunities"
        : "High expenses - urgent cost reduction needed",
      icon: PieChart,
      detailValue: 100 - lastMonthExpenseRatio,
      detailLabel: "Profit Margin %",
    },
    {
      name: "Employee Productivity",
      abbr: "EP",
      value: `$${(monthlyProductivity / 1000).toFixed(1)}K`,
      status: productivityStatus,
      benchmark: `≥$${productivityBenchmark / 1000}K/month`,
      formula: "Revenue / Number of Employees",
      explanation: "Benchmarks team efficiency.",
      insight: monthlyProductivity >= productivityBenchmark
        ? "High productivity - team is performing efficiently"
        : monthlyProductivity >= 15000
        ? "Acceptable productivity - consider training and process improvements"
        : "Low productivity - review staffing and workflows",
      icon: Users,
      detailValue: operationalData.employees,
      detailLabel: "Total Employees",
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
        <h2>Operational Efficiency Metrics</h2>
        <p className="text-muted-foreground">
          Monitor inventory, costs, productivity, and operational performance
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
                <p className="text-sm text-muted-foreground">
                  {kpi.detailLabel}: {typeof kpi.detailValue === 'number' ? kpi.detailValue.toFixed(1) : kpi.detailValue}
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
        {/* Inventory Turnover Trend */}
        <Card className="p-4">
          <h3 className="mb-4">Inventory Turnover Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={inventoryTurnoverData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="inventory" fill="#3b82f6" name="Inventory ($)" />
              <Line yAxisId="right" type="monotone" dataKey="turnover" stroke="#10b981" strokeWidth={2} name="Turnover Ratio" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Avg Inventory</p>
              <p className="text-lg">${(avgInventory / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Turnover Rate</p>
              <p className="text-lg">{inventoryTurnover.toFixed(1)}x</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Days on Hand</p>
              <p className="text-lg">{Math.round(daysInInventory)}d</p>
            </div>
          </div>
        </Card>

        {/* Unit Economics by Product */}
        <Card className="p-4">
          <h3 className="mb-4">Top Products by Unit Economics</h3>
          <div className="space-y-3 mb-4">
            {topUnitEconomics.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.units.toLocaleString()} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">${product.unitProfit.toFixed(0)}/unit</p>
                  <p className="text-xs text-muted-foreground">{product.unitMargin.toFixed(1)}% margin</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Avg Unit Profit</p>
                <p className="font-mono">${avgUnitProfit.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Avg Margin</p>
                <p className="font-mono">{avgUnitMargin.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Expense Ratio Trend */}
        <Card className="p-4">
          <h3 className="mb-4">Expense Ratio Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={expenseRatioData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="totalExpenses" fill="#f59e0b" fillOpacity={0.6} name="Expenses ($)" />
              <Line yAxisId="right" type="monotone" dataKey="expenseRatio" stroke="#ef4444" strokeWidth={2} name="Expense Ratio (%)" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current Ratio</p>
              <p className="text-lg">{lastMonthExpenseRatio.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Avg Ratio</p>
              <p className="text-lg">{avgExpenseRatio.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
              <p className="text-lg">{(100 - lastMonthExpenseRatio).toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        {/* Employee Productivity */}
        <Card className="p-4">
          <h3 className="mb-4">Employee Productivity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip formatter={(value: number) => `$${(value / 1000).toFixed(1)}K`} />
              <Legend />
              <Bar dataKey="revenuePerEmployee" fill="#8b5cf6" name="Revenue per Employee ($)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Employees</p>
              <p className="text-lg">{operationalData.employees}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Rev/Employee</p>
              <p className="text-lg">${(monthlyProductivity / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Period Total</p>
              <p className="text-lg">${(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary & Recommendations */}
      <Card className="p-4">
        <h3 className="mb-4">Operational Efficiency Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <h4>Inventory</h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Value:</span>
                <span className="font-mono">${(balanceSheet.assets.inventory / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Turnover Rate:</span>
                <span className="font-mono">{inventoryTurnover.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days on Hand:</span>
                <span className="font-mono">{Math.round(daysInInventory)}d</span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h4>Unit Economics</h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Unit Profit:</span>
                <span className="font-mono">${avgUnitProfit.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Margin:</span>
                <span className="font-mono">{avgUnitMargin.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Units:</span>
                <span className="font-mono">{products.reduce((s, p) => s + p.units, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-5 h-5 text-orange-600" />
              <h4>Expenses</h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expense Ratio:</span>
                <span className="font-mono">{lastMonthExpenseRatio.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Expenses:</span>
                <span className="font-mono">${(totalExpenses / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit Margin:</span>
                <span className="font-mono">{(100 - lastMonthExpenseRatio).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <h4>Productivity</h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size:</span>
                <span className="font-mono">{operationalData.employees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rev/Employee:</span>
                <span className="font-mono">${(monthlyProductivity / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period Avg:</span>
                <span className="font-mono">${(employeeProductivity / 1000).toFixed(0)}K</span>
              </div>
            </div>
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
              <p className="font-medium text-green-900">All operational metrics are healthy!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your operations are running efficiently across all key areas
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <h3 className="mb-4">Key Operational Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="mb-2">Inventory Optimization</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Inventory turns {inventoryTurnover.toFixed(1)} times during period</li>
              <li>• Stock sits for approximately {Math.round(daysInInventory)} days</li>
              <li>• {inventoryTurnover >= 6 ? "Efficient inventory management" : "Consider faster turnover strategies"}</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="mb-2">Cost Control</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Expenses are {lastMonthExpenseRatio.toFixed(1)}% of revenue</li>
              <li>• Profit margin: {(100 - lastMonthExpenseRatio).toFixed(1)}%</li>
              <li>• {lastMonthExpenseRatio <= 75 ? "Strong cost discipline" : "Opportunity for expense reduction"}</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="mb-2">Unit Profitability</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Average profit per unit: ${avgUnitProfit.toFixed(0)}</li>
              <li>• Unit margin: {avgUnitMargin.toFixed(1)}%</li>
              <li>• {avgUnitMargin >= 30 ? "Strong unit economics" : "Review pricing and costs"}</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="mb-2">Team Efficiency</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• ${(monthlyProductivity / 1000).toFixed(0)}K revenue per employee/month</li>
              <li>• Team of {operationalData.employees} employees</li>
              <li>• {monthlyProductivity >= 20000 ? "High productivity levels" : "Room for productivity improvements"}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}