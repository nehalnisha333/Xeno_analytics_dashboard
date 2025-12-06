import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CoreKPIsProps {
  data: FinancialData;
}

export function CoreKPIs({ data }: CoreKPIsProps) {
  const { balanceSheet, incomeStatement } = data;

  // A. Financial Health KPIs

  // 1. Gross Profit Margin (GPM)
  const grossProfit = incomeStatement.revenue - incomeStatement.cogs;
  const grossProfitMargin = (grossProfit / incomeStatement.revenue) * 100;
  const gpmBenchmark = 40; // Industry benchmark
  const gpmStatus = grossProfitMargin >= gpmBenchmark ? "good" : grossProfitMargin >= 30 ? "warning" : "critical";

  // 2. Net Profit Margin (NPM)
  const netProfit = incomeStatement.revenue - incomeStatement.cogs - incomeStatement.operatingExpenses - incomeStatement.interestExpense - incomeStatement.tax;
  const netProfitMargin = (netProfit / incomeStatement.revenue) * 100;
  const npmBenchmark = 10;
  const npmStatus = netProfitMargin >= npmBenchmark ? "good" : netProfitMargin >= 5 ? "warning" : "critical";

  // 3. Current Ratio
  const currentRatio = balanceSheet.assets.currentAssets / balanceSheet.liabilities.currentLiabilities;
  const currentRatioBenchmark = 1.5;
  const currentRatioStatus = currentRatio >= currentRatioBenchmark ? "good" : currentRatio >= 1.0 ? "warning" : "critical";

  // 4. Debt-to-Equity Ratio
  const totalDebt = balanceSheet.liabilities.currentLiabilities + balanceSheet.liabilities.longTermDebt;
  const debtToEquity = totalDebt / balanceSheet.equity;
  const debtToEquityBenchmark = 1.0;
  const debtToEquityStatus = debtToEquity <= debtToEquityBenchmark ? "good" : debtToEquity <= 2.0 ? "warning" : "critical";

  // 5. Cash Conversion Cycle (CCC)
  // Days Inventory Outstanding (DIO) = (Inventory / COGS) * 365
  const daysInventory = (balanceSheet.assets.inventory / incomeStatement.cogs) * 365;
  
  // Days Sales Outstanding (DSO) = (Accounts Receivable / Revenue) * 365
  const daysSales = (balanceSheet.assets.accountsReceivable / incomeStatement.revenue) * 365;
  
  // Days Payable Outstanding (DPO) = (Accounts Payable / COGS) * 365
  const daysPayable = (balanceSheet.liabilities.accountsPayable / incomeStatement.cogs) * 365;
  
  // CCC = DIO + DSO - DPO
  const cashConversionCycle = daysInventory + daysSales - daysPayable;
  const cccBenchmark = 60; // Lower is better
  const cccStatus = cashConversionCycle <= cccBenchmark ? "good" : cashConversionCycle <= 90 ? "warning" : "critical";

  const kpis = [
    {
      name: "Gross Profit Margin",
      abbr: "GPM",
      value: `${grossProfitMargin.toFixed(1)}%`,
      status: gpmStatus,
      benchmark: `${gpmBenchmark}%`,
      formula: "(Revenue – COGS) / Revenue × 100",
      explanation: "Shows profitability before overheads. Higher is better.",
      insight: grossProfitMargin >= gpmBenchmark 
        ? "Strong gross margins - pricing and cost management are effective"
        : "Consider reviewing pricing strategy or reducing COGS",
      detailValue: grossProfit,
    },
    {
      name: "Net Profit Margin",
      abbr: "NPM",
      value: `${netProfitMargin.toFixed(1)}%`,
      status: npmStatus,
      benchmark: `${npmBenchmark}%`,
      formula: "Net Profit / Revenue × 100",
      explanation: "Measures overall profit efficiency after all expenses.",
      insight: netProfitMargin >= npmBenchmark
        ? "Healthy bottom-line profitability"
        : "Review operating expenses and efficiency improvements",
      detailValue: netProfit,
    },
    {
      name: "Current Ratio",
      abbr: "CR",
      value: currentRatio.toFixed(2),
      status: currentRatioStatus,
      benchmark: `${currentRatioBenchmark}`,
      formula: "Current Assets / Current Liabilities",
      explanation: "Assesses liquidity and short-term financial stability.",
      insight: currentRatio >= currentRatioBenchmark
        ? "Strong ability to cover short-term obligations"
        : currentRatio >= 1.0
        ? "Adequate liquidity but monitor closely"
        : "Cash flow concerns - prioritize receivables collection",
      detailValue: balanceSheet.assets.currentAssets - balanceSheet.liabilities.currentLiabilities,
    },
    {
      name: "Debt-to-Equity Ratio",
      abbr: "D/E",
      value: debtToEquity.toFixed(2),
      status: debtToEquityStatus,
      benchmark: `≤ ${debtToEquityBenchmark}`,
      formula: "Total Debt / Total Equity",
      explanation: "Shows financial leverage risk. Lower is less risky.",
      insight: debtToEquity <= debtToEquityBenchmark
        ? "Conservative debt levels - low financial risk"
        : debtToEquity <= 2.0
        ? "Moderate leverage - manageable if cash flow is strong"
        : "High leverage - focus on debt reduction",
      detailValue: totalDebt,
    },
    {
      name: "Cash Conversion Cycle",
      abbr: "CCC",
      value: `${Math.round(cashConversionCycle)} days`,
      status: cccStatus,
      benchmark: `≤ ${cccBenchmark} days`,
      formula: "Days Inventory + Days Receivable – Days Payable",
      explanation: "Time to convert investments back into cash. Lower is better.",
      insight: cashConversionCycle <= cccBenchmark
        ? "Efficient cash flow management"
        : cashConversionCycle <= 90
        ? "Room for improvement - consider faster collection or inventory turnover"
        : "Cash tied up too long - urgent optimization needed",
      detailValue: null,
      breakdown: {
        daysInventory: Math.round(daysInventory),
        daysSales: Math.round(daysSales),
        daysPayable: Math.round(daysPayable),
      },
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
        <h2>Core Financial KPIs</h2>
        <p className="text-muted-foreground">
          Essential metrics for assessing financial health and operational efficiency
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.abbr} className={`p-6 border-2 ${getStatusColor(kpi.status)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
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
              {kpi.detailValue !== null && (
                <p className="text-sm text-muted-foreground">
                  {kpi.abbr === "GPM" && `Gross Profit: $${(kpi.detailValue / 1000000).toFixed(2)}M`}
                  {kpi.abbr === "NPM" && `Net Profit: $${(kpi.detailValue / 1000000).toFixed(2)}M`}
                  {kpi.abbr === "CR" && `Working Capital: $${(kpi.detailValue / 1000000).toFixed(2)}M`}
                  {kpi.abbr === "D/E" && `Total Debt: $${(kpi.detailValue / 1000000).toFixed(2)}M`}
                </p>
              )}
            </div>

            {kpi.breakdown && (
              <div className="mb-4 p-3 bg-white rounded-lg border">
                <p className="text-sm font-medium mb-2">Cycle Breakdown:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Inventory</p>
                    <p className="font-mono">{kpi.breakdown.daysInventory}d</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Receivables</p>
                    <p className="font-mono">{kpi.breakdown.daysSales}d</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payables</p>
                    <p className="font-mono">-{kpi.breakdown.daysPayable}d</p>
                  </div>
                </div>
              </div>
            )}

            <div className={`p-3 rounded-lg ${
              kpi.status === "good" ? "bg-green-100/50" : 
              kpi.status === "warning" ? "bg-orange-100/50" : 
              "bg-red-100/50"
            }`}>
              <p className="text-sm">{kpi.insight}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary & Recommendations */}
      <Card className="p-4">
        <h3 className="mb-4">KPI Summary & Action Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-1">
              {kpis.filter(k => k.status === "good").length}
            </div>
            <p className="text-sm text-muted-foreground">Healthy KPIs</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl mb-1">
              {kpis.filter(k => k.status === "warning").length}
            </div>
            <p className="text-sm text-muted-foreground">Need Attention</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl mb-1">
              {kpis.filter(k => k.status === "critical").length}
            </div>
            <p className="text-sm text-muted-foreground">Critical Issues</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4>Recommended Actions:</h4>
          {kpis
            .filter(k => k.status !== "good")
            .map((kpi, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{kpi.name}: {kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.insight}</p>
                </div>
              </div>
            ))}
          
          {kpis.every(k => k.status === "good") && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-medium text-green-900">All KPIs are healthy!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your business is performing well across all core financial metrics
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Detailed Metrics Table */}
      <Card className="p-4">
        <h3 className="mb-4">Detailed KPI Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">KPI</th>
                <th className="text-center py-3 px-2">Current Value</th>
                <th className="text-center py-3 px-2">Benchmark</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Action Required</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((kpi) => (
                <tr key={kpi.abbr} className="border-b">
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium">{kpi.name}</p>
                      <p className="text-xs text-muted-foreground">{kpi.abbr}</p>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 font-mono">{kpi.value}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{kpi.benchmark}</td>
                  <td className="text-center py-3 px-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                      kpi.status === "good" ? "bg-green-100 text-green-800" :
                      kpi.status === "warning" ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {kpi.status === "good" ? "✓ Good" : kpi.status === "warning" ? "⚠ Warning" : "✕ Critical"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm">
                    {kpi.status === "good" ? "Maintain current performance" : "Review and improve"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}