import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area } from "recharts";
import { Product, Customer, ExpenseCategory } from "../types/financial";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  TrendingDown,
  Eye,
  XCircle,
  Award
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ABCAnalysisEnhancedProps {
  products: Product[];
  customers: Customer[];
  expenses: ExpenseCategory[];
}

export function ABCAnalysisEnhanced({ products, customers, expenses }: ABCAnalysisEnhancedProps) {
  
  // ========== PRODUCT ANALYSIS ==========
  const sortedProducts = [...products].sort((a, b) => b.revenue - a.revenue);
  const totalProductRevenue = sortedProducts.reduce((sum, p) => sum + p.revenue, 0);
  
  let cumulativeProduct = 0;
  const productParetoData = sortedProducts.map((product) => {
    const revenuePercent = (product.revenue / totalProductRevenue) * 100;
    cumulativeProduct += revenuePercent;
    const profit = product.revenue - product.cogs;
    const profitMargin = (profit / product.revenue) * 100;
    
    return {
      name: product.name,
      revenue: product.revenue,
      profit,
      profitMargin,
      revenuePercent,
      cumulative: cumulativeProduct,
      category: cumulativeProduct <= 80 ? "A" : cumulativeProduct <= 95 ? "B" : "C",
    };
  });

  const productCategoryA = productParetoData.filter(p => p.category === "A");
  const productCategoryB = productParetoData.filter(p => p.category === "B");
  const productCategoryC = productParetoData.filter(p => p.category === "C");

  // ========== CUSTOMER ANALYSIS ==========
  const sortedCustomers = [...customers].sort((a, b) => b.revenue - a.revenue);
  const totalCustomerRevenue = sortedCustomers.reduce((sum, c) => sum + c.revenue, 0);
  
  let cumulativeCustomer = 0;
  const customerParetoData = sortedCustomers.map((customer) => {
    const revenuePercent = (customer.revenue / totalCustomerRevenue) * 100;
    cumulativeCustomer += revenuePercent;
    const roi = customer.acquisitionCost ? ((customer.revenue - (customer.acquisitionCost || 0)) / (customer.acquisitionCost || 1)) * 100 : 0;
    
    return {
      name: customer.name,
      revenue: customer.revenue,
      orders: customer.orders,
      avgOrderValue: customer.avgOrderValue,
      revenuePercent,
      cumulative: cumulativeCustomer,
      roi,
      category: cumulativeCustomer <= 80 ? "A" : cumulativeCustomer <= 95 ? "B" : "C",
      segment: customer.segment,
    };
  });

  const customerCategoryA = customerParetoData.filter(c => c.category === "A");
  const customerCategoryB = customerParetoData.filter(c => c.category === "B");
  const customerCategoryC = customerParetoData.filter(c => c.category === "C");

  // ========== EXPENSE ANALYSIS ==========
  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
  const totalExpenses = sortedExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  let cumulativeExpense = 0;
  const expenseParetoData = sortedExpenses.map((expense) => {
    const expensePercent = (expense.amount / totalExpenses) * 100;
    cumulativeExpense += expensePercent;
    
    return {
      name: expense.name,
      amount: expense.amount,
      expensePercent,
      cumulative: cumulativeExpense,
      category: cumulativeExpense <= 80 ? "A" : cumulativeExpense <= 95 ? "B" : "C",
      expenseCategory: expense.category,
      isFixed: expense.isFixed,
    };
  });

  const expenseCategoryA = expenseParetoData.filter(e => e.category === "A");
  const expenseCategoryB = expenseParetoData.filter(e => e.category === "B");
  const expenseCategoryC = expenseParetoData.filter(e => e.category === "C");

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  // ========== KEY INSIGHTS ==========
  const topProducts = productCategoryA.slice(0, 5);
  const topCustomers = customerCategoryA.slice(0, 5);
  const topExpenses = expenseCategoryA.slice(0, 5);
  const bottomProducts = productCategoryC;
  const variableExpenses = expenseParetoData.filter(e => !e.isFixed && e.category === "A");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-blue-600" />
          <div>
            <h2>80/20 & ABC Analysis</h2>
            <p className="text-muted-foreground">
              Identify top revenue/expense drivers across products, customers, and costs
            </p>
          </div>
        </div>
      </div>

      {/* ACTION PLAN - MOST IMPORTANT */}
      <Card className="p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white border-0">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8" />
          <h2 className="text-white">🎯 YOUR ACTION PLAN - Focus Here!</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5" />
              <h3 className="text-white">Focus on These {topProducts.length} SKUs</h3>
            </div>
            <p className="text-sm text-white/90 mb-3">
              These {topProducts.length} products generate {productCategoryA.reduce((sum, p) => sum + p.revenuePercent, 0).toFixed(0)}% of your revenue!
            </p>
            <ul className="space-y-2">
              {topProducts.map((product, idx) => (
                <li key={product.name} className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{idx + 1}. {product.name}</span>
                  <span className="font-mono text-xs">${(product.revenue / 1000000).toFixed(1)}M</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-white/80">
                ✅ Ensure optimal stock levels<br/>
                ✅ Prioritize quality control<br/>
                ✅ Consider premium positioning
              </p>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5" />
              <h3 className="text-white">Nurture These {topCustomers.length} Accounts</h3>
            </div>
            <p className="text-sm text-white/90 mb-3">
              These {topCustomers.length} clients drive {customerCategoryA.reduce((sum, c) => sum + c.revenuePercent, 0).toFixed(0)}% of customer revenue!
            </p>
            <ul className="space-y-2">
              {topCustomers.map((customer, idx) => (
                <li key={customer.name} className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{idx + 1}. {customer.name}</span>
                  <span className="font-mono text-xs">${(customer.revenue / 1000000).toFixed(1)}M</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-white/80">
                ✅ Assign dedicated account managers<br/>
                ✅ Provide VIP support<br/>
                ✅ Explore upsell opportunities
              </p>
            </div>
          </div>

          {/* Cost Optimization */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5" />
              <h3 className="text-white">Optimize These {variableExpenses.length} Costs</h3>
            </div>
            <p className="text-sm text-white/90 mb-3">
              Focus on these variable expenses for quick wins!
            </p>
            <ul className="space-y-2">
              {variableExpenses.slice(0, 5).map((expense, idx) => (
                <li key={expense.name} className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{idx + 1}. {expense.name}</span>
                  <span className="font-mono text-xs">${(expense.amount / 1000).toFixed(0)}K</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-white/80">
                ✅ Negotiate better rates<br/>
                ✅ Review ROI on each item<br/>
                ✅ Eliminate waste
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Performers Warning */}
        {bottomProducts.length > 0 && (
          <div className="mt-4 bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-300/30">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-200" />
              <h4 className="text-white">⚠️ Consider Discontinuing or Bundling</h4>
            </div>
            <p className="text-sm text-white/90 mb-2">
              {bottomProducts.length} products (Category C) only contribute {productCategoryC.reduce((sum, p) => sum + p.revenuePercent, 0).toFixed(1)}% of revenue:
            </p>
            <div className="flex flex-wrap gap-2">
              {bottomProducts.map(product => (
                <Badge key={product.name} className="bg-red-500/30 text-white border-red-300/30">
                  {product.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Expenses
          </TabsTrigger>
        </TabsList>

        {/* PRODUCTS TAB */}
        <TabsContent value="products" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { cat: "A", data: productCategoryA, color: COLORS[0] },
              { cat: "B", data: productCategoryB, color: COLORS[1] },
              { cat: "C", data: productCategoryC, color: COLORS[2] }
            ].map(({ cat, data, color }) => (
              <Card key={cat} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Category {cat} Products</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl">{data.length}</span>
                    <span className="text-muted-foreground">SKUs</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${(data.reduce((sum, p) => sum + p.revenue, 0) / 1000000).toFixed(2)}M revenue
                  </div>
                  <div className="text-sm">
                    {data.reduce((sum, p) => sum + p.revenuePercent, 0).toFixed(1)}% of total
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pareto Chart */}
          <Card className="p-4">
            <h3 className="mb-4">📊 Product Pareto Analysis (80/20 Rule)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={productParetoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === "Cumulative %") return `${value.toFixed(1)}%`;
                    return `$${value.toLocaleString()}`;
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue">
                  {productParetoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.category === "A" ? COLORS[0] : entry.category === "B" ? COLORS[1] : COLORS[2]} />
                  ))}
                </Bar>
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Cumulative %"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>80/20 Insight:</strong> Top {productCategoryA.length} products ({((productCategoryA.length / products.length) * 100).toFixed(0)}% of SKUs) generate {productCategoryA.reduce((sum, p) => sum + p.revenuePercent, 0).toFixed(1)}% of total revenue
              </p>
            </div>
          </Card>

          {/* Product Table */}
          <Card className="p-4">
            <h3 className="mb-4">Product Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Product</th>
                    <th className="text-right py-3 px-2">Revenue</th>
                    <th className="text-right py-3 px-2">Profit</th>
                    <th className="text-right py-3 px-2">Margin</th>
                    <th className="text-right py-3 px-2">% of Total</th>
                    <th className="text-center py-3 px-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {productParetoData.map((product) => (
                    <tr key={product.name} className="border-b">
                      <td className="py-3 px-2">{product.name}</td>
                      <td className="text-right py-3 px-2 font-mono">${product.revenue.toLocaleString()}</td>
                      <td className="text-right py-3 px-2 font-mono">${product.profit.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">{product.profitMargin.toFixed(1)}%</td>
                      <td className="text-right py-3 px-2">{product.revenuePercent.toFixed(1)}%</td>
                      <td className="text-center py-3 px-2">
                        <Badge className={
                          product.category === "A" ? "bg-green-600" :
                          product.category === "B" ? "bg-orange-600" : "bg-red-600"
                        }>
                          {product.category}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* CUSTOMERS TAB */}
        <TabsContent value="customers" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { cat: "A", data: customerCategoryA, color: COLORS[0] },
              { cat: "B", data: customerCategoryB, color: COLORS[1] },
              { cat: "C", data: customerCategoryC, color: COLORS[2] }
            ].map(({ cat, data, color }) => (
              <Card key={cat} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Category {cat} Customers</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl">{data.length}</span>
                    <span className="text-muted-foreground">clients</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${(data.reduce((sum, c) => sum + c.revenue, 0) / 1000000).toFixed(2)}M revenue
                  </div>
                  <div className="text-sm">
                    {data.reduce((sum, c) => sum + c.revenuePercent, 0).toFixed(1)}% of total
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pareto Chart */}
          <Card className="p-4">
            <h3 className="mb-4">👥 Customer Pareto Analysis (80/20 Rule)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={customerParetoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === "Cumulative %") return `${value.toFixed(1)}%`;
                    return `$${value.toLocaleString()}`;
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue">
                  {customerParetoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.category === "A" ? COLORS[0] : entry.category === "B" ? COLORS[1] : COLORS[2]} />
                  ))}
                </Bar>
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Cumulative %"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>80/20 Insight:</strong> Top {customerCategoryA.length} customers ({((customerCategoryA.length / customers.length) * 100).toFixed(0)}% of clients) generate {customerCategoryA.reduce((sum, c) => sum + c.revenuePercent, 0).toFixed(1)}% of customer revenue
              </p>
            </div>
          </Card>

          {/* Customer Table */}
          <Card className="p-4">
            <h3 className="mb-4">Customer Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Customer</th>
                    <th className="text-left py-3 px-2">Segment</th>
                    <th className="text-right py-3 px-2">Revenue</th>
                    <th className="text-right py-3 px-2">Orders</th>
                    <th className="text-right py-3 px-2">AOV</th>
                    <th className="text-right py-3 px-2">% of Total</th>
                    <th className="text-center py-3 px-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {customerParetoData.map((customer) => (
                    <tr key={customer.name} className="border-b">
                      <td className="py-3 px-2">{customer.name}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">{customer.segment}</Badge>
                      </td>
                      <td className="text-right py-3 px-2 font-mono">${customer.revenue.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">{customer.orders}</td>
                      <td className="text-right py-3 px-2 font-mono">${customer.avgOrderValue.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">{customer.revenuePercent.toFixed(1)}%</td>
                      <td className="text-center py-3 px-2">
                        <Badge className={
                          customer.category === "A" ? "bg-green-600" :
                          customer.category === "B" ? "bg-orange-600" : "bg-red-600"
                        }>
                          {customer.category}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* EXPENSES TAB */}
        <TabsContent value="expenses" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { cat: "A", data: expenseCategoryA, color: COLORS[0] },
              { cat: "B", data: expenseCategoryB, color: COLORS[1] },
              { cat: "C", data: expenseCategoryC, color: COLORS[2] }
            ].map(({ cat, data, color }) => (
              <Card key={cat} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Category {cat} Expenses</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl">{data.length}</span>
                    <span className="text-muted-foreground">items</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${(data.reduce((sum, e) => sum + e.amount, 0) / 1000).toFixed(0)}K spending
                  </div>
                  <div className="text-sm">
                    {data.reduce((sum, e) => sum + e.expensePercent, 0).toFixed(1)}% of total
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pareto Chart */}
          <Card className="p-4">
            <h3 className="mb-4">💰 Expense Pareto Analysis (80/20 Rule)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={expenseParetoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === "Cumulative %") return `${value.toFixed(1)}%`;
                    return `$${value.toLocaleString()}`;
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="amount" fill="#3b82f6" name="Expense Amount">
                  {expenseParetoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.category === "A" ? COLORS[0] : entry.category === "B" ? COLORS[1] : COLORS[2]} />
                  ))}
                </Bar>
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Cumulative %"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm">
                <strong>80/20 Insight:</strong> Top {expenseCategoryA.length} expense items ({((expenseCategoryA.length / expenses.length) * 100).toFixed(0)}% of line items) account for {expenseCategoryA.reduce((sum, e) => sum + e.expensePercent, 0).toFixed(1)}% of total expenses
              </p>
            </div>
          </Card>

          {/* Expense Table */}
          <Card className="p-4">
            <h3 className="mb-4">Expense Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Expense Item</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-right py-3 px-2">Amount</th>
                    <th className="text-right py-3 px-2">% of Total</th>
                    <th className="text-center py-3 px-2">Fixed/Variable</th>
                    <th className="text-center py-3 px-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseParetoData.map((expense) => (
                    <tr key={expense.name} className="border-b">
                      <td className="py-3 px-2">{expense.name}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">{expense.expenseCategory}</Badge>
                      </td>
                      <td className="text-right py-3 px-2 font-mono">${expense.amount.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">{expense.expensePercent.toFixed(1)}%</td>
                      <td className="text-center py-3 px-2">
                        <Badge variant={expense.isFixed ? "default" : "secondary"}>
                          {expense.isFixed ? "Fixed" : "Variable"}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge className={
                          expense.category === "A" ? "bg-green-600" :
                          expense.category === "B" ? "bg-orange-600" : "bg-red-600"
                        }>
                          {expense.category}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Cost Optimization Tips */}
          <Card className="p-4 bg-orange-50">
            <h3 className="mb-3">💡 Cost Optimization Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm mb-2">High-Impact Variable Costs (Category A)</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {variableExpenses.slice(0, 3).map(expense => (
                    <li key={expense.name} className="flex items-center gap-2">
                      <Target className="w-3 h-3 text-orange-600" />
                      {expense.name} - ${(expense.amount / 1000).toFixed(0)}K
                    </li>
                  ))}
                </ul>
                <p className="text-xs mt-2 text-muted-foreground">
                  Focus negotiation and optimization efforts here for maximum impact.
                </p>
              </div>
              <div>
                <h4 className="text-sm mb-2">Quick Wins</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Renegotiate contracts for top 3 variable expenses</li>
                  <li>• Review ROI on marketing spend categories</li>
                  <li>• Consolidate vendors for better pricing</li>
                  <li>• Automate processes to reduce manual costs</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
