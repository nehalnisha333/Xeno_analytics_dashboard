import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from "recharts";
import { Product } from "../types/financial";
import { DollarSign, TrendingUp, Package, Percent } from "lucide-react";
import { safeDivide, safePercentage, safeNumber } from "../lib/mathUtils";

interface UnitEconomicsProps {
  products: Product[];
}

export function UnitEconomics({ products }: UnitEconomicsProps) {
  // Calculate unit economics for each product with safe division
  const unitData = products.map((product) => {
    const pricePerUnit = safeDivide(product.revenue, product.units, 0);
    const costPerUnit = safeDivide(product.cogs, product.units, 0);
    const profitPerUnit = pricePerUnit - costPerUnit;
    const margin = safePercentage(profitPerUnit, pricePerUnit, 0);
    const totalProfit = product.revenue - product.cogs;

    return {
      name: product.name,
      pricePerUnit,
      costPerUnit,
      profitPerUnit,
      margin,
      revenue: product.revenue,
      cogs: product.cogs,
      totalProfit,
      units: product.units,
      category: product.category
    };
  });

  // Sort by profit per unit
  const sortedByProfit = [...unitData].sort((a, b) => b.profitPerUnit - a.profitPerUnit);
  const sortedByMargin = [...unitData].sort((a, b) => b.margin - a.margin);

  // Calculate totals with safe division
  const totalRevenue = unitData.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = unitData.reduce((sum, p) => sum + p.totalProfit, 0);
  const totalUnits = unitData.reduce((sum, p) => sum + p.units, 0);
  const avgProfitPerUnit = safeDivide(totalProfit, totalUnits, 0);
  const avgMargin = safePercentage(totalProfit, totalRevenue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2>Unit Economics Analysis</h2>
        <p className="text-muted-foreground">
          Understand per-unit profitability and identify your most valuable products
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Package className="w-4 h-4" />
            <span className="text-sm">Total Units Sold</span>
          </div>
          <div className="text-3xl">{totalUnits.toLocaleString()}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Avg Profit/Unit</span>
          </div>
          <div className="text-3xl">${avgProfitPerUnit.toFixed(2)}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Percent className="w-4 h-4" />
            <span className="text-sm">Avg Margin</span>
          </div>
          <div className="text-3xl">{avgMargin.toFixed(1)}%</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Total Profit</span>
          </div>
          <div className="text-3xl">${(totalProfit / 1000000).toFixed(1)}M</div>
        </Card>
      </div>

      {/* Profit per Unit Chart */}
      <Card className="p-4">
        <h3 className="mb-4">Profit per Unit by Product</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={sortedByProfit} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="profitPerUnit" fill="#10b981" name="Profit/Unit" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Price vs Cost Analysis */}
      <Card className="p-4">
        <h3 className="mb-4">Unit Price vs Unit Cost</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={unitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="pricePerUnit" fill="#3b82f6" name="Price/Unit" />
            <Bar dataKey="costPerUnit" fill="#ef4444" name="Cost/Unit" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Margin Analysis */}
      <Card className="p-4">
        <h3 className="mb-4">Profit Margin by Product</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={sortedByMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Bar dataKey="margin" fill="#8b5cf6" name="Margin %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Volume vs Profitability */}
      <Card className="p-4">
        <h3 className="mb-4">Volume vs Unit Profitability</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={unitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="units" fill="#3b82f6" name="Units Sold" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="profitPerUnit" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Profit/Unit ($)"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm">
            <strong>Insight:</strong> This chart helps identify whether high-volume products also maintain healthy per-unit profitability
          </p>
        </div>
      </Card>

      {/* Detailed Table */}
      <Card className="p-4">
        <h3 className="mb-4">Detailed Unit Economics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Product</th>
                <th className="text-center py-3 px-2">Category</th>
                <th className="text-right py-3 px-2">Units</th>
                <th className="text-right py-3 px-2">Price/Unit</th>
                <th className="text-right py-3 px-2">Cost/Unit</th>
                <th className="text-right py-3 px-2">Profit/Unit</th>
                <th className="text-right py-3 px-2">Margin</th>
                <th className="text-right py-3 px-2">Total Profit</th>
              </tr>
            </thead>
            <tbody>
              {sortedByProfit.map((product) => (
                <tr key={product.name} className="border-b">
                  <td className="py-3 px-2">{product.name}</td>
                  <td className="text-center py-3 px-2">
                    <span className="inline-block px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="text-right py-3 px-2 font-mono">
                    {product.units.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-2 font-mono">
                    ${product.pricePerUnit.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-2 font-mono">
                    ${product.costPerUnit.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-2 font-mono text-green-600">
                    ${product.profitPerUnit.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-2 font-mono">
                    {product.margin.toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-2 font-mono">
                    ${product.totalProfit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-4">
        <h3 className="mb-4">Unit Economics Insights</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-medium text-green-900">Highest Margin Product</p>
            <p className="text-sm text-green-700">
              {sortedByMargin[0].name} with {sortedByMargin[0].margin.toFixed(1)}% margin and ${sortedByMargin[0].profitPerUnit.toFixed(2)} profit per unit
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-blue-900">Highest Volume Product</p>
            <p className="text-sm text-blue-700">
              {[...unitData].sort((a, b) => b.units - a.units)[0].name} with {[...unitData].sort((a, b) => b.units - a.units)[0].units.toLocaleString()} units sold
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="font-medium text-purple-900">Optimization Opportunity</p>
            <p className="text-sm text-purple-700">
              Consider focusing on high-margin, high-volume products. Review pricing strategy for products with margins below {avgMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}