import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { Building2, TrendingUp, DollarSign, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { safeDivide, safePercentage, safeNumber } from "../lib/mathUtils";

interface CMAReportProps {
  data: FinancialData;
}

export function CMAReport({ data }: CMAReportProps) {
  const { balanceSheet, incomeStatement } = data;

  // Balance Sheet Calculations
  const totalAssets = balanceSheet.assets.currentAssets + balanceSheet.assets.fixedAssets;
  const totalLiabilities = balanceSheet.liabilities.currentLiabilities + balanceSheet.liabilities.longTermDebt;
  const workingCapital = balanceSheet.assets.currentAssets - balanceSheet.liabilities.currentLiabilities;
  const netWorth = totalAssets - totalLiabilities;

  // Income Statement Calculations
  const grossProfit = incomeStatement.revenue - incomeStatement.cogs;
  const netProfit = incomeStatement.revenue - incomeStatement.cogs - incomeStatement.operatingExpenses - incomeStatement.interestExpense - incomeStatement.tax;
  
  // Financial Ratios with safe division
  const currentRatio = safeDivide(balanceSheet.assets.currentAssets, balanceSheet.liabilities.currentLiabilities, 1);
  const debtServiceCoverageRatio = safeDivide(netProfit + incomeStatement.interestExpense, incomeStatement.interestExpense + (balanceSheet.liabilities.longTermDebt * 0.1), 1); // Assuming 10% principal repayment
  const debtToEquity = safeDivide(totalLiabilities, balanceSheet.equity, 0);

  // Credit assessment
  const creditScore = () => {
    let score = 0;
    if (currentRatio >= 1.5) score += 25;
    else if (currentRatio >= 1.0) score += 15;
    
    if (debtServiceCoverageRatio >= 2.0) score += 30;
    else if (debtServiceCoverageRatio >= 1.25) score += 20;
    
    if (debtToEquity <= 1.0) score += 25;
    else if (debtToEquity <= 2.0) score += 15;
    
    if (netProfit > 0) score += 20;
    
    return score;
  };

  const score = creditScore();
  const creditRating = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Poor";

  return (
    <div className="space-y-6">
      <div>
        <h2>CMA Report & Bank Connection</h2>
        <p className="text-muted-foreground">
          Credit Monitoring Arrangement data and banking readiness assessment
        </p>
      </div>

      {/* Credit Assessment */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h3>Credit Assessment Score</h3>
          </div>
          <div className="text-right">
            <div className="text-4xl">{score}/100</div>
            <div className={`text-sm ${score >= 60 ? 'text-green-600' : 'text-orange-600'}`}>
              {creditRating}
            </div>
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </Card>

      {/* CMA Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <Card className="p-4">
          <h3 className="mb-4">Assets Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Assets</span>
              <span className="font-mono">${(balanceSheet.assets.currentAssets / 1000000).toFixed(2)}M</span>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cash & Bank</span>
                <span className="font-mono">${(balanceSheet.assets.cash / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accounts Receivable</span>
                <span className="font-mono">${(balanceSheet.assets.accountsReceivable / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inventory</span>
                <span className="font-mono">${(balanceSheet.assets.inventory / 1000000).toFixed(2)}M</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-muted-foreground">Fixed Assets</span>
              <span className="font-mono">${(balanceSheet.assets.fixedAssets / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span>Total Assets</span>
              <span className="font-mono">${(totalAssets / 1000000).toFixed(2)}M</span>
            </div>
          </div>
        </Card>

        {/* Liabilities & Equity */}
        <Card className="p-4">
          <h3 className="mb-4">Liabilities & Equity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Liabilities</span>
              <span className="font-mono">${(balanceSheet.liabilities.currentLiabilities / 1000000).toFixed(2)}M</span>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accounts Payable</span>
                <span className="font-mono">${(balanceSheet.liabilities.accountsPayable / 1000000).toFixed(2)}M</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-muted-foreground">Long-term Debt</span>
              <span className="font-mono">${(balanceSheet.liabilities.longTermDebt / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-muted-foreground">Total Liabilities</span>
              <span className="font-mono">${(totalLiabilities / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span>Shareholders' Equity</span>
              <span className="font-mono">${(balanceSheet.equity / 1000000).toFixed(2)}M</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Income Statement */}
      <Card className="p-4">
        <h3 className="mb-4">Income Statement Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Revenue</span>
              <span className="font-mono">${(incomeStatement.revenue / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cost of Goods Sold</span>
              <span className="font-mono">${(incomeStatement.cogs / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span>Gross Profit</span>
              <span className="font-mono text-green-600">${(grossProfit / 1000000).toFixed(2)}M</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Operating Expenses</span>
              <span className="font-mono">${(incomeStatement.operatingExpenses / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Interest Expense</span>
              <span className="font-mono">${(incomeStatement.interestExpense / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-mono">${(incomeStatement.tax / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span>Net Profit</span>
              <span className="font-mono text-green-600">${(netProfit / 1000000).toFixed(2)}M</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Banking Ratios */}
      <Card className="p-4">
        <h3 className="mb-4">Key Banking Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Ratio</span>
              {currentRatio >= 1.5 ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-600" />
              )}
            </div>
            <div className="text-2xl">{currentRatio.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Benchmark: ≥ 1.5</div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Debt Service Coverage</span>
              {debtServiceCoverageRatio >= 1.25 ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-600" />
              )}
            </div>
            <div className="text-2xl">{debtServiceCoverageRatio.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Benchmark: ≥ 1.25</div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Debt to Equity</span>
              {debtToEquity <= 2.0 ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-600" />
              )}
            </div>
            <div className="text-2xl">{debtToEquity.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Benchmark: ≤ 2.0</div>
          </div>
        </div>
      </Card>

      {/* Working Capital Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Working Capital</span>
          </div>
          <div className="text-3xl">${(workingCapital / 1000000).toFixed(2)}M</div>
          <p className="text-sm text-muted-foreground mt-2">
            Current Assets - Current Liabilities
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Net Worth</span>
          </div>
          <div className="text-3xl">${(netWorth / 1000000).toFixed(2)}M</div>
          <p className="text-sm text-muted-foreground mt-2">
            Total Assets - Total Liabilities
          </p>
        </Card>
      </div>

      {/* Bank Connection Status */}
      <Card className="p-4">
        <h3 className="mb-4">Banking Readiness Assessment</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {currentRatio >= 1.5 ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">Liquidity Position</p>
              <p className="text-sm text-muted-foreground">
                {currentRatio >= 1.5 
                  ? "Strong liquidity position with current ratio above benchmark"
                  : "Consider improving liquidity to meet banking requirements"}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            {debtServiceCoverageRatio >= 1.25 ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">Debt Servicing Ability</p>
              <p className="text-sm text-muted-foreground">
                {debtServiceCoverageRatio >= 1.25
                  ? "Adequate cash flow to service existing debt obligations"
                  : "May need to improve cash flow before taking on additional debt"}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            {netProfit > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">Profitability</p>
              <p className="text-sm text-muted-foreground">
                {netProfit > 0
                  ? "Positive net profit demonstrates business viability"
                  : "Focus on achieving profitability to improve creditworthiness"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-4">
        <h3 className="mb-4">Export CMA Report</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Generate detailed reports for bank submissions and credit applications
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button variant="outline">
            <Building2 className="w-4 h-4 mr-2" />
            Connect to Bank API
          </Button>
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Bank connections require secure authentication. 
            Contact your financial institution to set up API access for automated data sharing.
          </p>
        </div>
      </Card>
    </div>
  );
}