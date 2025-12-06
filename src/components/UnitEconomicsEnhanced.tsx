import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, Cell } from "recharts";
import { Product } from "../types/financial";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Percent,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Calculator,
  Target,
  Zap,
  Info,
  ArrowRight,
  Award
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface UnitEconomicsEnhancedProps {
  products: Product[];
}

export function UnitEconomicsEnhanced({ products }: UnitEconomicsEnhancedProps) {
  // Assume monthly fixed costs (in a real scenario, this would come from P&L)
  const MONTHLY_FIXED_COSTS = 500000; // $500K monthly fixed costs (rent, salaries, etc.)
  
  // Calculate unit economics for each product
  const unitData = products.map((product) => {
    const pricePerUnit = product.revenue / product.units;
    const cogsPerUnit = product.cogs / product.units;
    const grossProfitPerUnit = pricePerUnit - cogsPerUnit;
    const grossMargin = (grossProfitPerUnit / pricePerUnit) * 100;
    const totalProfit = product.revenue - product.cogs;
    
    // Allocate fixed costs proportionally based on revenue contribution
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
    const revenueShare = product.revenue / totalRevenue;
    const allocatedFixedCosts = MONTHLY_FIXED_COSTS * revenueShare;
    const fixedCostPerUnit = allocatedFixedCosts / product.units;
    
    // Full unit economics
    const totalCostPerUnit = cogsPerUnit + fixedCostPerUnit;
    const netProfitPerUnit = pricePerUnit - totalCostPerUnit;
    const netMargin = (netProfitPerUnit / pricePerUnit) * 100;
    
    // Breakeven calculation
    // Breakeven units = Fixed Costs / Contribution Margin per Unit
    const contributionMargin = grossProfitPerUnit;
    const breakEvenUnits = allocatedFixedCosts / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;
    
    // Current performance vs breakeven
    const unitsAboveBreakeven = product.units - breakEvenUnits;
    const breakEvenCoverage = (product.units / breakEvenUnits) * 100;
    
    return {
      name: product.name,
      category: product.category,
      
      // Units & Revenue
      units: product.units,
      revenue: product.revenue,
      
      // Per Unit Metrics
      pricePerUnit,
      cogsPerUnit,
      fixedCostPerUnit,
      totalCostPerUnit,
      grossProfitPerUnit,
      netProfitPerUnit,
      
      // Margins
      grossMargin,
      netMargin,
      
      // Totals
      totalProfit,
      
      // Breakeven
      breakEvenUnits,
      breakEvenRevenue,
      unitsAboveBreakeven,
      breakEvenCoverage,
      allocatedFixedCosts,
    };
  });

  // Sort by different metrics
  const sortedByNetProfit = [...unitData].sort((a, b) => b.netProfitPerUnit - a.netProfitPerUnit);
  const sortedByGrossMargin = [...unitData].sort((a, b) => b.grossMargin - a.grossMargin);
  const sortedByBreakeven = [...unitData].sort((a, b) => b.breakEvenCoverage - a.breakEvenCoverage);

  // Calculate totals
  const totalRevenue = unitData.reduce((sum, p) => sum + p.revenue, 0);
  const totalGrossProfit = unitData.reduce((sum, p) => sum + p.totalProfit, 0);
  const totalUnits = unitData.reduce((sum, p) => sum + p.units, 0);
  const avgGrossProfitPerUnit = totalGrossProfit / totalUnits;
  const totalNetProfit = totalGrossProfit - MONTHLY_FIXED_COSTS;
  const avgNetProfitPerUnit = totalNetProfit / totalUnits;

  // Best and worst performers
  const bestProduct = sortedByNetProfit[0];
  const worstProduct = sortedByNetProfit[sortedByNetProfit.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-blue-600" />
          <div>
            <h2>Unit Economics Calculator</h2>
            <p className="text-muted-foreground">
              Simple breakdown: How much you make (or lose) on every item you sell
            </p>
          </div>
        </div>
      </div>

      {/* HOW TO READ THIS - Simple Explanation */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-900 mb-2">📚 What Are Unit Economics? (In Plain English)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="mb-2">
                  <strong>💰 Price Per Unit:</strong> What you charge customers for one item
                </p>
                <p className="mb-2">
                  <strong>📦 Cost Per Unit (COGS):</strong> What it costs you to make/buy one item
                </p>
                <p>
                  <strong>✅ Gross Profit Per Unit:</strong> Price - COGS = Money you keep before other expenses
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="mb-2">
                  <strong>🏢 Fixed Costs Per Unit:</strong> Your share of rent, salaries, etc. spread across items
                </p>
                <p className="mb-2">
                  <strong>💵 Net Profit Per Unit:</strong> Actual money you make after ALL costs
                </p>
                <p>
                  <strong>🎯 Breakeven:</strong> How many units you must sell to cover costs
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Numbers - Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2 text-xs">
            <Package className="w-4 h-4" />
            <span>Total Units Sold</span>
          </div>
          <div className="text-2xl mb-1">{totalUnits.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across all products</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2 text-xs">
            <DollarSign className="w-4 h-4" />
            <span>Avg Gross Profit/Unit</span>
          </div>
          <div className="text-2xl mb-1 text-green-600">${avgGrossProfitPerUnit.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Before fixed costs</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2 text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>Avg Net Profit/Unit</span>
          </div>
          <div className={`text-2xl mb-1 ${avgNetProfitPerUnit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${avgNetProfitPerUnit.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">After ALL costs</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2 text-xs">
            <Target className="w-4 h-4" />
            <span>Total Net Profit</span>
          </div>
          <div className={`text-2xl mb-1 ${totalNetProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${(totalNetProfit / 1000).toFixed(0)}K
          </div>
          <p className="text-xs text-muted-foreground">This period</p>
        </Card>
      </div>

      {/* PRODUCT CARDS - Visual & Easy to Understand */}
      <div>
        <h3 className="mb-4">📊 Your Products at a Glance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedByNetProfit.map((product, idx) => {
            const isProfit = product.netProfitPerUnit > 0;
            const isProfitable = product.units > product.breakEvenUnits;
            
            return (
              <Card key={product.name} className={`p-4 ${idx === 0 ? 'ring-2 ring-green-500' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{product.name}</h4>
                      {idx === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Units Sold</div>
                    <div className="text-xl">{product.units.toLocaleString()}</div>
                  </div>
                </div>

                {/* Simple Profit Equation */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3 font-mono text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">You Sell For:</span>
                    <span className="text-green-600">${product.pricePerUnit.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Cost to Make:</span>
                    <span className="text-red-600">-${product.cogsPerUnit.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Your Share of Fixed:</span>
                    <span className="text-orange-600">-${product.fixedCostPerUnit.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 my-1"></div>
                  <div className="flex items-center justify-between">
                    <span>You Keep Per Item:</span>
                    <span className={`${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      ${product.netProfitPerUnit.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Margin Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-muted-foreground">Gross Margin</span>
                    <span>{product.grossMargin.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={Math.min(product.grossMargin, 100)} 
                    className={`h-2 ${product.grossMargin >= 40 ? 'bg-green-200' : product.grossMargin >= 25 ? 'bg-yellow-200' : 'bg-red-200'}`}
                  />
                </div>

                {/* Breakeven Status */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Breakeven Point:</span>
                    <span className="text-sm font-mono">{Math.round(product.breakEvenUnits).toLocaleString()} units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isProfitable ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-green-700">
                          ✅ Profitable! You're {Math.round(product.unitsAboveBreakeven).toLocaleString()} units above breakeven
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-xs text-red-700">
                          ⚠️ Need {Math.round(-product.unitsAboveBreakeven).toLocaleString()} more units to break even
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={Math.min(product.breakEvenCoverage, 100)} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.breakEvenCoverage.toFixed(0)}% of breakeven target achieved
                    </p>
                  </div>
                </div>

                {/* Total Contribution */}
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Contribution:</span>
                    <span className={`font-mono ${product.netProfitPerUnit * product.units > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${((product.netProfitPerUnit * product.units) / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Breakeven Comparison Chart */}
      <Card className="p-4">
        <h3 className="mb-4">🎯 Breakeven Analysis: Are You Selling Enough?</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={unitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => value.toLocaleString()}
              labelFormatter={(label) => `Product: ${label}`}
            />
            <Legend />
            <Bar dataKey="breakEvenUnits" fill="#94a3b8" name="Breakeven Units (Need to Sell)" />
            <Bar dataKey="units" fill="#10b981" name="Actual Units Sold">
              {unitData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.units >= entry.breakEvenUnits ? "#10b981" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-900">
              <strong>Green bars = Good!</strong> You're selling more than you need to cover costs
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-900">
              <strong>Red bars = Warning!</strong> You need to sell more or reduce costs
            </p>
          </div>
        </div>
      </Card>

      {/* Unit Profitability Waterfall */}
      <Card className="p-4">
        <h3 className="mb-4">💰 Profit Per Unit: From Price to Profit</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedByNetProfit} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="pricePerUnit" fill="#3b82f6" name="Sale Price" />
            <Bar dataKey="cogsPerUnit" fill="#ef4444" name="Cost to Make" />
            <Bar dataKey="fixedCostPerUnit" fill="#f59e0b" name="Fixed Cost Share" />
            <Bar dataKey="netProfitPerUnit" name="Net Profit">
              {sortedByNetProfit.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.netProfitPerUnit > 0 ? "#10b981" : "#dc2626"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Simple Comparison: Best vs Worst */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-6 h-6 text-green-600" />
            <h3 className="text-green-900">🏆 Your Best Product</h3>
          </div>
          <div className="text-2xl mb-2">{bestProduct.name}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Net Profit Per Unit:</span>
              <span className="font-mono text-green-600">${bestProduct.netProfitPerUnit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Margin:</span>
              <span className="font-mono">{bestProduct.grossMargin.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Units Above Breakeven:</span>
              <span className="font-mono">{Math.round(bestProduct.unitsAboveBreakeven).toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-green-200">
            <p className="text-xs text-green-900">
              <strong>💡 Action:</strong> This is your money-maker! Consider increasing marketing spend and inventory for this product.
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-red-900">⚠️ Needs Attention</h3>
          </div>
          <div className="text-2xl mb-2">{worstProduct.name}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Net Profit Per Unit:</span>
              <span className={`font-mono ${worstProduct.netProfitPerUnit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${worstProduct.netProfitPerUnit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Margin:</span>
              <span className="font-mono">{worstProduct.grossMargin.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Breakeven Status:</span>
              <span className="font-mono">
                {worstProduct.breakEvenCoverage.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-red-200">
            <p className="text-xs text-red-900">
              <strong>💡 Action:</strong> Review pricing, reduce costs, or consider discontinuing if unprofitable.
            </p>
          </div>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="p-4">
        <h3 className="mb-4">📋 Complete Unit Economics Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Product</th>
                <th className="text-right py-3 px-2">Units Sold</th>
                <th className="text-right py-3 px-2">Price/Unit</th>
                <th className="text-right py-3 px-2">COGS/Unit</th>
                <th className="text-right py-3 px-2">Fixed/Unit</th>
                <th className="text-right py-3 px-2">Net Profit/Unit</th>
                <th className="text-right py-3 px-2">Margin</th>
                <th className="text-right py-3 px-2">Breakeven Units</th>
                <th className="text-center py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedByNetProfit.map((product) => {
                const isProfitable = product.units >= product.breakEvenUnits;
                return (
                  <tr key={product.name} className="border-b">
                    <td className="py-3 px-2">{product.name}</td>
                    <td className="text-right py-3 px-2 font-mono">{product.units.toLocaleString()}</td>
                    <td className="text-right py-3 px-2 font-mono">${product.pricePerUnit.toFixed(2)}</td>
                    <td className="text-right py-3 px-2 font-mono">${product.cogsPerUnit.toFixed(2)}</td>
                    <td className="text-right py-3 px-2 font-mono">${product.fixedCostPerUnit.toFixed(2)}</td>
                    <td className={`text-right py-3 px-2 font-mono ${product.netProfitPerUnit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${product.netProfitPerUnit.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-2 font-mono">{product.grossMargin.toFixed(1)}%</td>
                    <td className="text-right py-3 px-2 font-mono">{Math.round(product.breakEvenUnits).toLocaleString()}</td>
                    <td className="text-center py-3 px-2">
                      <Badge className={isProfitable ? "bg-green-600" : "bg-red-600"}>
                        {isProfitable ? "✅ Profitable" : "⚠️ Below"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Plan */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-indigo-900 mb-3">⚡ What To Do Next (Simple Actions)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border border-indigo-200">
                <h4 className="text-sm mb-2">🎯 Double Down on Winners</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {sortedByNetProfit.slice(0, 2).filter(p => p.netProfitPerUnit > 0).map(p => (
                    <li key={p.name} className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      {p.name}
                    </li>
                  ))}
                </ul>
                <p className="text-xs mt-2 text-muted-foreground">
                  Invest more in marketing and inventory for these profitable products.
                </p>
              </div>

              <div className="bg-white p-3 rounded border border-indigo-200">
                <h4 className="text-sm mb-2">⚠️ Fix or Cut Losers</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {sortedByNetProfit.slice(-2).filter(p => p.netProfitPerUnit < 0).map(p => (
                    <li key={p.name} className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      {p.name}
                    </li>
                  ))}
                </ul>
                <p className="text-xs mt-2 text-muted-foreground">
                  Increase prices, reduce costs, or stop selling these products.
                </p>
              </div>

              <div className="bg-white p-3 rounded border border-indigo-200">
                <h4 className="text-sm mb-2">📊 Improve Margins</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Products below {avgGrossProfitPerUnit.toFixed(2)} gross profit/unit:
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {unitData.filter(p => p.grossProfitPerUnit < avgGrossProfitPerUnit).slice(0, 2).map(p => (
                    <li key={p.name} className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      {p.name}
                    </li>
                  ))}
                </ul>
                <p className="text-xs mt-2 text-muted-foreground">
                  Negotiate better supplier prices or increase selling prices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
