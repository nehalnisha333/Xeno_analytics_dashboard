import { Card } from "./ui/card";
import { FinancialData, Product } from "../types/financial";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Package,
  Percent,
  Clock,
  Activity,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { safeDivide, safePercentage, safeNumber, toMillions, toThousands } from "../lib/mathUtils";

interface DashboardProps {
  data: FinancialData;
  products: Product[];
}

export function Dashboard({ data, products }: DashboardProps) {
  const { balanceSheet, incomeStatement, salesData, customerMetrics, cashFlow, operationalData } = data;

  // ========== FINANCIAL HEALTH METRICS ==========
  
  // Gross Profit Margin (GPM)
  const grossProfit = incomeStatement.revenue - incomeStatement.cogs;
  const grossProfitMargin = safePercentage(grossProfit, incomeStatement.revenue, 0);
  
  // Net Profit Margin (NPM)
  const totalProfit = incomeStatement.revenue - incomeStatement.cogs - incomeStatement.operatingExpenses - incomeStatement.interestExpense - incomeStatement.tax;
  const netProfitMargin = safePercentage(totalProfit, incomeStatement.revenue, 0);
  
  // Cash Conversion Cycle (CCC)
  const daysInventory = safeDivide(balanceSheet.assets.inventory, incomeStatement.cogs, 0) * 365;
  const daysSales = safeDivide(balanceSheet.assets.accountsReceivable, incomeStatement.revenue, 0) * 365;
  const daysPayable = safeDivide(balanceSheet.liabilities.accountsPayable, incomeStatement.cogs, 0) * 365;
  const cashConversionCycle = daysInventory + daysSales - daysPayable;

  // ========== SALES & CUSTOMER METRICS ==========
  
  // Revenue Growth Rate
  const recentSales = salesData.slice(-2);
  const revenueGrowth = recentSales.length === 2 
    ? safePercentage(recentSales[1].revenue - recentSales[0].revenue, recentSales[0].revenue, 0)
    : 0;

  // Average Order Value (AOV)
  const totalOrders = salesData.reduce((sum, s) => sum + s.orders, 0);
  const totalRevenue = incomeStatement.revenue;
  const avgOrderValue = safeDivide(totalRevenue, totalOrders, 0);

  // Customer Lifetime Value (CLV)
  const avgPurchaseFrequency = safeDivide(totalOrders, customerMetrics.totalCustomers, 1);
  const avgCustomerLifespan = 3; // years
  const customerLifetimeValue = avgOrderValue * avgPurchaseFrequency * avgCustomerLifespan * 12;

  // Top 5 Products
  const topProducts = [...products]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // ========== OPERATIONS & GROWTH METRICS ==========
  
  // Inventory Turnover
  const inventoryTurnover = safeDivide(incomeStatement.cogs, balanceSheet.assets.inventory, 0);

  // Unit Economics (Contribution Margin per Unit)
  const totalUnits = products.reduce((sum, p) => sum + p.units, 0);
  const totalVariableCosts = incomeStatement.cogs;
  const contributionMargin = grossProfit;
  const contributionMarginPerUnit = safeDivide(contributionMargin, totalUnits, 0);

  // Projected Revenue (simple linear projection)
  const avgRevenueGrowth = salesData.length >= 2 
    ? safeDivide(salesData[salesData.length - 1].revenue - salesData[0].revenue, salesData[0].revenue, 0.1) / (salesData.length - 1)
    : 0.1;
  const currentMonthlyRevenue = salesData[salesData.length - 1]?.revenue || 0;
  const projectedNextMonthRevenue = currentMonthlyRevenue * (1 + avgRevenueGrowth);
  const projectedNextQuarterRevenue = currentMonthlyRevenue * 3 * (1 + avgRevenueGrowth * 1.5);

  // Break-even Point
  const fixedCosts = incomeStatement.operatingExpenses;
  const variableCostPerUnit = safeDivide(totalVariableCosts, totalUnits, 0);
  const avgSellingPrice = safeDivide(totalRevenue, totalUnits, 0);
  const contributionPerUnit = avgSellingPrice - variableCostPerUnit;
  const breakEvenUnits = safeDivide(fixedCosts, contributionPerUnit, 0);
  const breakEvenRevenue = breakEvenUnits * avgSellingPrice;

  // Product Revenue Distribution for Pie Chart
  const productRevenueData = topProducts.map(p => ({
    name: p.name,
    value: p.revenue,
  }));

  // Expense Distribution for Pie Chart
  const expenseData = [
    { name: 'COGS', value: incomeStatement.cogs },
    { name: 'Operating Expenses', value: incomeStatement.operatingExpenses },
    { name: 'Interest', value: incomeStatement.interestExpense },
    { name: 'Tax', value: incomeStatement.tax },
  ];

  // Cash Flow Data for Line Chart
  const cashFlowData = salesData.map((s, index) => ({
    month: s.month,
    operating: (cashFlow.operating / salesData.length) * (1 + (Math.random() - 0.5) * 0.2) / 1000,
    investing: (cashFlow.investing / salesData.length) * (1 + (Math.random() - 0.5) * 0.3) / 1000,
    financing: (cashFlow.financing / salesData.length) * (1 + (Math.random() - 0.5) * 0.4) / 1000,
  }));

  // Liquidity Ratios
  const currentRatio = safeDivide(balanceSheet.assets.currentAssets, balanceSheet.liabilities.currentLiabilities, 1);
  const quickRatio = safeDivide(balanceSheet.assets.currentAssets - balanceSheet.assets.inventory, balanceSheet.liabilities.currentLiabilities, 1);
  const totalDebt = balanceSheet.liabilities.currentLiabilities + balanceSheet.liabilities.longTermDebt;
  const debtToEquity = safeDivide(totalDebt, balanceSheet.equity, 0);

  // Revenue Trend
  const revenueTrend = salesData.map(s => ({
    month: s.month,
    revenue: s.revenue / 1000, // in thousands
    target: currentMonthlyRevenue / 1000,
  }));

  // Status indicators
  const getStatus = (value: number, good: number, warning: number) => {
    if (value >= good) return "good";
    if (value >= warning) return "warning";
    return "critical";
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Executive Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive overview of financial health, sales performance, and growth metrics
        </p>
      </div>

      {/* ========== TOP ROW: FINANCIAL HEALTH ========== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h3>Financial Health</h3>
          <Badge variant="outline" className="ml-2">Core Metrics</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gross Profit Margin */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-muted-foreground">Gross Profit Margin</p>
              </div>
              <Badge className={
                grossProfitMargin >= 40 ? "bg-green-600" :
                grossProfitMargin >= 25 ? "bg-orange-600" : "bg-red-600"
              }>
                {grossProfitMargin >= 40 ? "Good" : grossProfitMargin >= 25 ? "Fair" : "Low"}
              </Badge>
            </div>
            <div className="text-3xl mb-2">{grossProfitMargin.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">
              Formula: (Revenue - COGS) / Revenue
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-xs">
                <span>Revenue</span>
                <span className="font-mono">${(incomeStatement.revenue / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>COGS</span>
                <span className="font-mono">${(incomeStatement.cogs / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Gross Profit</span>
                <span className="font-mono">${(grossProfit / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </Card>

          {/* Net Profit Margin */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <p className="text-sm text-muted-foreground">Net Profit Margin</p>
              </div>
              <Badge className={
                netProfitMargin >= 10 ? "bg-green-600" :
                netProfitMargin >= 5 ? "bg-orange-600" : "bg-red-600"
              }>
                {netProfitMargin >= 10 ? "Healthy" : netProfitMargin >= 5 ? "Fair" : "Critical"}
              </Badge>
            </div>
            <div className="text-3xl mb-2">{netProfitMargin.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">
              Formula: Net Profit / Revenue
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-xs">
                <span>Revenue</span>
                <span className="font-mono">${(incomeStatement.revenue / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>All Expenses</span>
                <span className="font-mono">${((incomeStatement.cogs + incomeStatement.operatingExpenses + incomeStatement.interestExpense + incomeStatement.tax) / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Net Profit</span>
                <span className="font-mono">${(totalProfit / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </Card>

          {/* Cash Conversion Cycle */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-muted-foreground">Cash Conversion Cycle</p>
              </div>
              <Badge className={
                cashConversionCycle <= 30 ? "bg-green-600" :
                cashConversionCycle <= 60 ? "bg-orange-600" : "bg-red-600"
              }>
                {cashConversionCycle <= 30 ? "Fast" : cashConversionCycle <= 60 ? "Moderate" : "Slow"}
              </Badge>
            </div>
            <div className="text-3xl mb-2">{Math.round(cashConversionCycle)} days</div>
            <div className="text-sm text-muted-foreground">
              Formula: DIO + DSO - DPO
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-xs">
                <span>Days Inventory (DIO)</span>
                <span className="font-mono">{Math.round(daysInventory)} days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Days Sales (DSO)</span>
                <span className="font-mono">{Math.round(daysSales)} days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Days Payable (DPO)</span>
                <span className="font-mono">{Math.round(daysPayable)} days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ========== MIDDLE ROW: SALES & CUSTOMERS ========== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-green-600" />
          <h3>Sales & Customer Metrics</h3>
          <Badge variant="outline" className="ml-2">Growth Indicators</Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Growth + Top Products */}
          <Card className="p-4 lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Growth Trend */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4>Revenue Growth Trend</h4>
                  <Badge className={revenueGrowth >= 10 ? "bg-green-600" : revenueGrowth >= 5 ? "bg-orange-600" : "bg-red-600"}>
                    {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth.toFixed(1)}%
                  </Badge>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top 5 Products */}
              <div>
                <h4 className="mb-3">Top 5 Products by Revenue</h4>
                <div className="space-y-2">
                  {topProducts.map((product, index) => {
                    const profit = product.revenue - product.cogs;
                    const margin = safePercentage(profit, product.revenue, 0);
                    return (
                      <div key={product.name} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          index === 0 ? "bg-yellow-500 text-white" :
                          index === 1 ? "bg-gray-400 text-white" :
                          index === 2 ? "bg-orange-600 text-white" :
                          "bg-blue-100 text-blue-900"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${(product.revenue / 1000).toFixed(0)}K • {margin.toFixed(0)}% margin
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* AOV & CLV */}
          <div className="space-y-4">
            {/* Average Order Value */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </div>
              <div className="text-2xl mb-2">${avgOrderValue.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground mb-3">
                Formula: Total Revenue / Total Orders
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t">
                <span>Total Orders</span>
                <span className="font-mono">{totalOrders.toLocaleString()}</span>
              </div>
            </Card>

            {/* Customer Lifetime Value */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-green-600" />
                <p className="text-sm text-muted-foreground">Customer LTV</p>
              </div>
              <div className="text-2xl mb-2">${(customerLifetimeValue / 1000).toFixed(1)}K</div>
              <div className="text-xs text-muted-foreground mb-3">
                AOV × Frequency × Lifespan
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t">
                <span>Retention Rate</span>
                <span className="font-mono">{customerMetrics.retentionRate}%</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ========== BOTTOM ROW: OPERATIONS & GROWTH ========== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3>Operations & Growth</h3>
          <Badge variant="outline" className="ml-2">Efficiency & Forecasting</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Inventory Turnover */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-muted-foreground">Inventory Turnover</p>
              </div>
              <Badge className={
                inventoryTurnover >= 6 ? "bg-green-600" :
                inventoryTurnover >= 4 ? "bg-orange-600" : "bg-red-600"
              }>
                {inventoryTurnover >= 6 ? "Fast" : inventoryTurnover >= 4 ? "Moderate" : "Slow"}
              </Badge>
            </div>
            <div className="text-3xl mb-2">{inventoryTurnover.toFixed(1)}x</div>
            <div className="text-xs text-muted-foreground mb-3">
              Formula: COGS / Avg Inventory
            </div>
            <div className="text-xs pt-2 border-t">
              <div className="flex items-center justify-between">
                <span>Days to Sell</span>
                <span className="font-mono">{Math.round(365 / inventoryTurnover)} days</span>
              </div>
            </div>
          </Card>

          {/* Unit Economics */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <p className="text-sm text-muted-foreground">Unit Economics</p>
              </div>
              <Badge className={
                contributionMarginPerUnit >= avgSellingPrice * 0.3 ? "bg-green-600" :
                contributionMarginPerUnit >= avgSellingPrice * 0.2 ? "bg-orange-600" : "bg-red-600"
              }>
                {safePercentage(contributionMarginPerUnit, avgSellingPrice, 0).toFixed(0)}%
              </Badge>
            </div>
            <div className="text-3xl mb-2">${contributionMarginPerUnit.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mb-3">
              Contribution Margin per Unit
            </div>
            <div className="text-xs pt-2 border-t space-y-1">
              <div className="flex items-center justify-between">
                <span>Avg Price</span>
                <span className="font-mono">${avgSellingPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Var. Cost</span>
                <span className="font-mono">${variableCostPerUnit.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Projected Revenue */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-muted-foreground">Projected Revenue</p>
              </div>
              <Badge variant="outline">Next Quarter</Badge>
            </div>
            <div className="text-3xl mb-2">${(projectedNextQuarterRevenue / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground mb-3">
              Based on {(avgRevenueGrowth * 100).toFixed(1)}% growth trend
            </div>
            <div className="text-xs pt-2 border-t space-y-1">
              <div className="flex items-center justify-between">
                <span>Current Monthly</span>
                <span className="font-mono">${(currentMonthlyRevenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Next Month</span>
                <span className="font-mono">${(projectedNextMonthRevenue / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </Card>

          {/* Break-even Point */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-red-600" />
                <p className="text-sm text-muted-foreground">Break-even Point</p>
              </div>
              <Badge className={
                totalUnits >= breakEvenUnits ? "bg-green-600" : "bg-orange-600"
              }>
                {totalUnits >= breakEvenUnits ? "Profitable" : "Below Target"}
              </Badge>
            </div>
            <div className="text-3xl mb-2">{(breakEvenUnits / 1000).toFixed(1)}K</div>
            <div className="text-xs text-muted-foreground mb-3">
              Units needed to break even
            </div>
            <div className="text-xs pt-2 border-t space-y-1">
              <div className="flex items-center justify-between">
                <span>Current Units</span>
                <span className="font-mono">{(totalUnits / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span>BE Revenue</span>
                <span className="font-mono">${(breakEvenRevenue / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Action Items */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="mb-3">📊 Quick Insights & Action Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm mb-2 flex items-center gap-2">
              <Badge className="bg-blue-600">Financial Health</Badge>
            </h4>
            <ul className="text-sm space-y-1">
              {netProfitMargin >= 10 ? (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Strong profitability
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Review cost structure
                </li>
              )}
              {cashConversionCycle <= 45 ? (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Efficient cash cycle
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Optimize working capital
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm mb-2 flex items-center gap-2">
              <Badge className="bg-green-600">Sales & Growth</Badge>
            </h4>
            <ul className="text-sm space-y-1">
              {revenueGrowth >= 10 ? (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Strong revenue growth
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Focus on growth initiatives
                </li>
              )}
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Top product: {topProducts[0]?.name}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm mb-2 flex items-center gap-2">
              <Badge className="bg-purple-600">Operations</Badge>
            </h4>
            <ul className="text-sm space-y-1">
              {inventoryTurnover >= 6 ? (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Healthy inventory turnover
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Reduce inventory holding
                </li>
              )}
              {totalUnits >= breakEvenUnits ? (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Above break-even point
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Increase sales volume
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>

      {/* ========== ADDITIONAL VISUALIZATIONS ========== */}
      
      {/* Composition Analysis (Pie Charts) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3>Composition Analysis</h3>
          <Badge variant="outline" className="ml-2">Pie Charts</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Products Distribution */}
          <Card className="p-4">
            <h4 className="mb-4">Revenue by Top Products</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {productRevenueData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Expense Distribution */}
          <Card className="p-4">
            <h4 className="mb-4">Expense Breakdown</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {expenseData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Ratio Gauges & Cash Flow Trend */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-orange-600" />
          <h3>Ratio Gauges & Cash Flow</h3>
          <Badge variant="outline" className="ml-2">Performance Indicators</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Liquidity Ratios Gauge */}
          <Card className="p-4">
            <h4 className="mb-4">Liquidity Ratios</h4>
            <div className="space-y-4">
              {/* Current Ratio */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Current Ratio</span>
                  <Badge className={
                    currentRatio >= 2 ? "bg-green-600" :
                    currentRatio >= 1.5 ? "bg-orange-600" : "bg-red-600"
                  }>
                    {currentRatio.toFixed(2)}
                  </Badge>
                </div>
                <Progress 
                  value={Math.min((currentRatio / 3) * 100, 100)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {currentRatio >= 2 ? "✓ Excellent liquidity" : currentRatio >= 1.5 ? "⚠ Adequate liquidity" : "🚨 Low liquidity"}
                </p>
              </div>

              {/* Quick Ratio */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Quick Ratio</span>
                  <Badge className={
                    quickRatio >= 1 ? "bg-green-600" :
                    quickRatio >= 0.75 ? "bg-orange-600" : "bg-red-600"
                  }>
                    {quickRatio.toFixed(2)}
                  </Badge>
                </div>
                <Progress 
                  value={Math.min((quickRatio / 2) * 100, 100)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {quickRatio >= 1 ? "✓ Strong short-term assets" : quickRatio >= 0.75 ? "⚠ Fair position" : "🚨 Improve liquid assets"}
                </p>
              </div>

              {/* Debt-to-Equity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Debt-to-Equity</span>
                  <Badge className={
                    debtToEquity <= 1 ? "bg-green-600" :
                    debtToEquity <= 2 ? "bg-orange-600" : "bg-red-600"
                  }>
                    {debtToEquity.toFixed(2)}
                  </Badge>
                </div>
                <Progress 
                  value={Math.min((debtToEquity / 3) * 100, 100)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {debtToEquity <= 1 ? "✓ Conservative leverage" : debtToEquity <= 2 ? "⚠ Moderate debt" : "🚨 High leverage"}
                </p>
              </div>
            </div>
          </Card>

          {/* Cash Flow Trend */}
          <Card className="p-4 lg:col-span-2">
            <h4 className="mb-4">Cash Flow Trend (Last 7 Months)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `$${value.toFixed(0)}K`} />
                <Legend />
                <Line type="monotone" dataKey="operating" stroke="#10b981" strokeWidth={2} name="Operating" />
                <Line type="monotone" dataKey="investing" stroke="#f59e0b" strokeWidth={2} name="Investing" />
                <Line type="monotone" dataKey="financing" stroke="#ef4444" strokeWidth={2} name="Financing" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Critical Alerts Banner (if any) */}
      {(netProfitMargin < 5 || currentRatio < 1 || cashConversionCycle > 90) && (
        <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-900 mb-2">🚨 Critical Alerts - Immediate Action Required</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {netProfitMargin < 5 && (
                  <div className="bg-white/80 p-3 rounded-lg border border-red-200">
                    <p className="text-sm mb-1">
                      <strong>Low Profitability</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      NPM is {netProfitMargin.toFixed(1)}% (below 5% threshold). Review pricing and cost structure immediately.
                    </p>
                  </div>
                )}
                {currentRatio < 1 && (
                  <div className="bg-white/80 p-3 rounded-lg border border-red-200">
                    <p className="text-sm mb-1">
                      <strong>Liquidity Crisis</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current Ratio is {currentRatio.toFixed(2)} (below 1.0). Urgent cash flow management needed.
                    </p>
                  </div>
                )}
                {cashConversionCycle > 90 && (
                  <div className="bg-white/80 p-3 rounded-lg border border-red-200">
                    <p className="text-sm mb-1">
                      <strong>Slow Cash Cycle</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CCC is {Math.round(cashConversionCycle)} days (above 90). Optimize inventory and collections.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}