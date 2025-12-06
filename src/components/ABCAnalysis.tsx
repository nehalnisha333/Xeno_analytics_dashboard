import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Product } from "../types/financial";
import { Package, TrendingUp, DollarSign } from "lucide-react";
import { safeDivide, safePercentage } from "../lib/mathUtils";

interface ABCAnalysisProps {
  products: Product[];
}

export function ABCAnalysis({ products }: ABCAnalysisProps) {
  // Sort products by revenue
  const sortedProducts = [...products].sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);

  // Calculate cumulative percentages for Pareto analysis
  let cumulative = 0;
  const paretoData = sortedProducts.map((product) => {
    const revenuePercent = safePercentage(product.revenue, totalRevenue, 0);
    cumulative += revenuePercent;
    return {
      name: product.name,
      revenue: product.revenue,
      revenuePercent,
      cumulative: cumulative,
    };
  });

  // Classify into A, B, C categories
  const categoryA = paretoData.filter(p => p.cumulative <= 80); // Top products contributing to 80% revenue
  const categoryB = paretoData.filter(p => p.cumulative > 80 && p.cumulative <= 95);
  const categoryC = paretoData.filter(p => p.cumulative > 95);

  // ABC Summary
  const abcSummary = [
    {
      category: "A",
      count: categoryA.length,
      revenue: categoryA.reduce((sum, p) => sum + p.revenue, 0),
      percent: safePercentage(categoryA.reduce((sum, p) => sum + p.revenue, 0), totalRevenue, 0),
      color: "#10b981",
    },
    {
      category: "B",
      count: categoryB.length,
      revenue: categoryB.reduce((sum, p) => sum + p.revenue, 0),
      percent: safePercentage(categoryB.reduce((sum, p) => sum + p.revenue, 0), totalRevenue, 0),
      color: "#f59e0b",
    },
    {
      category: "C",
      count: categoryC.length,
      revenue: categoryC.reduce((sum, p) => sum + p.revenue, 0),
      percent: safePercentage(categoryC.reduce((sum, p) => sum + p.revenue, 0), totalRevenue, 0),
      color: "#ef4444",
    },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div>
        <h2>80/20 & ABC Analysis</h2>
        <p className="text-muted-foreground">
          Identify your highest-value products and optimize inventory management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {abcSummary.map((item) => (
          <Card key={item.category} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Category {item.category}</span>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{item.count}</span>
                <span className="text-muted-foreground">products</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono">${(item.revenue / 1000000).toFixed(2)}M</span>
              </div>
              <div className="text-muted-foreground">
                {item.percent.toFixed(1)}% of revenue
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pareto Chart */}
      <Card className="p-4">
        <h3 className="mb-4">Pareto Analysis (80/20 Rule)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={paretoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === "Cumulative %") return `${value.toFixed(1)}%`;
                return `$${value.toLocaleString()}`;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="cumulative" 
              stroke="#ef4444" 
              strokeWidth={3}
              name="Cumulative %"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm">
            <strong>80/20 Insight:</strong> Top {categoryA.length} products ({((categoryA.length / products.length) * 100).toFixed(0)}%) generate {abcSummary[0].percent.toFixed(1)}% of total revenue
          </p>
        </div>
      </Card>

      {/* ABC Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="mb-4">ABC Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={abcSummary}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category}: ${percent.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {abcSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="mb-4">Product Count by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={abcSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Product Count">
                {abcSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Product Table */}
      <Card className="p-4">
        <h3 className="mb-4">Product Classification Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Product</th>
                <th className="text-right py-3 px-2">Revenue</th>
                <th className="text-right py-3 px-2">% of Total</th>
                <th className="text-right py-3 px-2">Cumulative %</th>
                <th className="text-center py-3 px-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {paretoData.map((product) => (
                <tr key={product.name} className="border-b">
                  <td className="py-3 px-2">{product.name}</td>
                  <td className="text-right py-3 px-2 font-mono">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-2">
                    {product.revenuePercent.toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-2">
                    {product.cumulative.toFixed(1)}%
                  </td>
                  <td className="text-center py-3 px-2">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-white text-sm"
                      style={{ backgroundColor: product.cumulative <= 80 ? "#10b981" : product.cumulative <= 95 ? "#f59e0b" : "#ef4444" }}
                    >
                      {product.cumulative <= 80 ? "A" : product.cumulative <= 95 ? "B" : "C"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-4">
        <h3 className="mb-4">Strategic Recommendations</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
            <div>
              <p className="font-medium">Category A Products (High Priority)</p>
              <p className="text-sm text-muted-foreground">
                Focus on maintaining optimal stock levels, ensure high service quality, and consider premium positioning strategies
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
            <div>
              <p className="font-medium">Category B Products (Medium Priority)</p>
              <p className="text-sm text-muted-foreground">
                Monitor regularly, maintain moderate stock levels, and look for opportunities to move to Category A
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
            <div>
              <p className="font-medium">Category C Products (Low Priority)</p>
              <p className="text-sm text-muted-foreground">
                Minimize inventory, consider discontinuation or bundling with A/B products, automate ordering
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}