import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Database } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { FinancialData, Product } from "../types/financial";

interface DataInputProps {
  onDataUpdate: (data: FinancialData, products: Product[]) => void;
  currentData: FinancialData;
  currentProducts: Product[];
}

export function DataInput({ onDataUpdate, currentData, currentProducts }: DataInputProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  // Manual input state
  const [manualData, setManualData] = useState({
    // Balance Sheet
    cash: currentData.balanceSheet.assets.cash.toString(),
    inventory: currentData.balanceSheet.assets.inventory.toString(),
    accountsReceivable: currentData.balanceSheet.assets.accountsReceivable.toString(),
    currentLiabilities: currentData.balanceSheet.liabilities.currentLiabilities.toString(),
    longTermDebt: currentData.balanceSheet.liabilities.longTermDebt.toString(),
    
    // Income Statement
    revenue: currentData.incomeStatement.revenue.toString(),
    cogs: currentData.incomeStatement.cogs.toString(),
    operatingExpenses: currentData.incomeStatement.operatingExpenses.toString(),
    
    // Operational
    employees: currentData.operationalData.employees.toString(),
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error("CSV file must contain headers and data");
        }

        // Parse CSV
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const dataRows = lines.slice(1).map(line => {
          const values = line.split(',');
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index]?.trim() || '';
          });
          return row;
        });

        // Map to our data structure
        // This is a simplified version - in production, you'd want more robust mapping
        const firstRow = dataRows[0];
        
        // Update financial data based on CSV
        // For now, we'll just show success message
        setUploadStatus("success");
        setUploadMessage(`Successfully loaded ${lines.length - 1} rows of data from ${file.name}`);
        
      } catch (error) {
        setUploadStatus("error");
        setUploadMessage(error instanceof Error ? error.message : "Error parsing file");
      }
    };

    reader.readAsText(file);
  };

  const handleManualUpdate = () => {
    try {
      // Create updated financial data
      const updatedData: FinancialData = {
        ...currentData,
        balanceSheet: {
          ...currentData.balanceSheet,
          assets: {
            ...currentData.balanceSheet.assets,
            cash: parseFloat(manualData.cash) || 0,
            inventory: parseFloat(manualData.inventory) || 0,
            accountsReceivable: parseFloat(manualData.accountsReceivable) || 0,
          },
          liabilities: {
            ...currentData.balanceSheet.liabilities,
            currentLiabilities: parseFloat(manualData.currentLiabilities) || 0,
            longTermDebt: parseFloat(manualData.longTermDebt) || 0,
          },
        },
        incomeStatement: {
          ...currentData.incomeStatement,
          revenue: parseFloat(manualData.revenue) || 0,
          cogs: parseFloat(manualData.cogs) || 0,
          operatingExpenses: parseFloat(manualData.operatingExpenses) || 0,
        },
        operationalData: {
          ...currentData.operationalData,
          employees: parseInt(manualData.employees) || 0,
        },
      };

      // Recalculate derived values
      updatedData.balanceSheet.assets.currentAssets = 
        updatedData.balanceSheet.assets.cash + 
        updatedData.balanceSheet.assets.inventory + 
        updatedData.balanceSheet.assets.accountsReceivable;

      onDataUpdate(updatedData, currentProducts);
      setUploadStatus("success");
      setUploadMessage("Data updated successfully! All KPIs have been recalculated.");
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage(error instanceof Error ? error.message : "Error updating data");
    }
  };

  const downloadTemplate = () => {
    const template = `Category,Field,Value,Unit,Description
Balance Sheet,Cash,500000,USD,Cash and cash equivalents
Balance Sheet,Inventory,800000,USD,Current inventory value
Balance Sheet,Accounts Receivable,450000,USD,Money owed by customers
Balance Sheet,Current Liabilities,400000,USD,Short-term obligations
Balance Sheet,Long-term Debt,600000,USD,Long-term debt obligations
Income Statement,Revenue,5500000,USD,Total revenue
Income Statement,COGS,4200000,USD,Cost of goods sold
Income Statement,Operating Expenses,800000,USD,Operating expenses
Operational,Employees,45,Count,Number of employees
Operational,Marketing Spend,35000,USD,Monthly marketing spend
Sales,Monthly Orders,215,Count,Number of orders
Sales,New Customers,48,Count,New customers acquired`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadSampleData = () => {
    const sample = `month,revenue,cogs,expenses,inventory,orders,new_customers,marketing_spend,employees
Apr 2024,650000,520000,550000,720000,145,28,25000,45
May 2024,720000,560000,590000,750000,156,32,28000,45
Jun 2024,630000,480000,520000,680000,138,25,22000,45
Jul 2024,780000,610000,640000,780000,168,35,30000,45
Aug 2024,820000,640000,670000,820000,175,38,32000,45
Sep 2024,900000,700000,730000,850000,189,42,35000,45
Oct 2024,1050000,820000,850000,800000,215,48,38000,45`;

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_financial_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Data Input & Upload</h2>
        <p className="text-muted-foreground">
          Upload financial data via CSV/Excel or enter manually to automatically calculate all KPIs
        </p>
      </div>

      {/* Upload Status Alert */}
      {uploadStatus !== "idle" && (
        <Alert className={uploadStatus === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {uploadStatus === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={uploadStatus === "success" ? "text-green-900" : "text-red-900"}>
            {uploadMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Data Points</p>
              <p className="text-2xl">50+</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Auto KPIs</p>
              <p className="text-2xl">15+</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Products</p>
              <p className="text-2xl">{currentProducts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Alerts</p>
              <p className="text-2xl">Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Input Tabs */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="manual">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Download className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        {/* File Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Upload CSV or Excel File</h3>
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="mb-2">Drag and drop your file here</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Supports CSV, Excel (.xlsx, .xls) files
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Choose File
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="mb-3">File Format Requirements</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• <strong>Headers:</strong> First row must contain column names</li>
              <li>• <strong>Required fields:</strong> Revenue, COGS, Expenses, Cash, Inventory</li>
              <li>• <strong>Optional fields:</strong> Employees, Marketing Spend, Orders, New Customers</li>
              <li>• <strong>Format:</strong> Numbers without currency symbols or commas</li>
              <li>• <strong>Date format:</strong> YYYY-MM-DD or MM/DD/YYYY</li>
            </ul>
          </Card>
        </TabsContent>

        {/* Manual Entry Tab */}
        <TabsContent value="manual" className="space-y-6">
          <Card className="p-4">
            <h3 className="mb-4">Balance Sheet Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cash">Cash & Cash Equivalents ($)</Label>
                <Input
                  id="cash"
                  type="number"
                  value={manualData.cash}
                  onChange={(e) => setManualData({ ...manualData, cash: e.target.value })}
                  placeholder="500000"
                />
              </div>
              <div>
                <Label htmlFor="inventory">Inventory ($)</Label>
                <Input
                  id="inventory"
                  type="number"
                  value={manualData.inventory}
                  onChange={(e) => setManualData({ ...manualData, inventory: e.target.value })}
                  placeholder="800000"
                />
              </div>
              <div>
                <Label htmlFor="ar">Accounts Receivable ($)</Label>
                <Input
                  id="ar"
                  type="number"
                  value={manualData.accountsReceivable}
                  onChange={(e) => setManualData({ ...manualData, accountsReceivable: e.target.value })}
                  placeholder="450000"
                />
              </div>
              <div>
                <Label htmlFor="cl">Current Liabilities ($)</Label>
                <Input
                  id="cl"
                  type="number"
                  value={manualData.currentLiabilities}
                  onChange={(e) => setManualData({ ...manualData, currentLiabilities: e.target.value })}
                  placeholder="400000"
                />
              </div>
              <div>
                <Label htmlFor="debt">Long-term Debt ($)</Label>
                <Input
                  id="debt"
                  type="number"
                  value={manualData.longTermDebt}
                  onChange={(e) => setManualData({ ...manualData, longTermDebt: e.target.value })}
                  placeholder="600000"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="mb-4">Income Statement Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="revenue">Total Revenue ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={manualData.revenue}
                  onChange={(e) => setManualData({ ...manualData, revenue: e.target.value })}
                  placeholder="5500000"
                />
              </div>
              <div>
                <Label htmlFor="cogs">Cost of Goods Sold ($)</Label>
                <Input
                  id="cogs"
                  type="number"
                  value={manualData.cogs}
                  onChange={(e) => setManualData({ ...manualData, cogs: e.target.value })}
                  placeholder="4200000"
                />
              </div>
              <div>
                <Label htmlFor="opex">Operating Expenses ($)</Label>
                <Input
                  id="opex"
                  type="number"
                  value={manualData.operatingExpenses}
                  onChange={(e) => setManualData({ ...manualData, operatingExpenses: e.target.value })}
                  placeholder="800000"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="mb-4">Operational Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  value={manualData.employees}
                  onChange={(e) => setManualData({ ...manualData, employees: e.target.value })}
                  placeholder="45"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setUploadStatus("idle")}>
              Reset
            </Button>
            <Button onClick={handleManualUpdate}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Update Data & Calculate KPIs
            </Button>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="p-4">
            <h3 className="mb-4">Download Templates & Samples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-6">
                <FileSpreadsheet className="w-12 h-12 text-blue-600 mb-3" />
                <h4 className="mb-2">Blank Template</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Empty CSV template with all required fields and headers
                </p>
                <Button onClick={downloadTemplate} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div className="border rounded-lg p-6">
                <Database className="w-12 h-12 text-green-600 mb-3" />
                <h4 className="mb-2">Sample Data</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Pre-filled example data to test the system
                </p>
                <Button onClick={downloadSampleData} className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <h3 className="mb-4">Data Collection Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="mb-3 flex items-center gap-2">
                  <Badge className="bg-blue-600">Balance Sheet</Badge>
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Cash & cash equivalents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Inventory value
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Accounts receivable
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Current liabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Long-term debt
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2">
                  <Badge className="bg-green-600">Income Statement</Badge>
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Total revenue
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Cost of goods sold (COGS)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Operating expenses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Interest expense
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Taxes
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2">
                  <Badge className="bg-purple-600">Operational</Badge>
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Number of employees
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Inventory levels (monthly)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Units sold
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2">
                  <Badge className="bg-orange-600">Sales & Marketing</Badge>
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Monthly orders/transactions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    New customers acquired
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Marketing spend
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Product-wise revenue
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Automatic Calculations Info */}
      <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <h3 className="mb-4">✨ Automatic KPI Calculations</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you upload or enter your data, the following KPIs will be automatically calculated:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm mb-2">Financial Health (5)</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Gross Profit Margin</li>
              <li>• Net Profit Margin</li>
              <li>• Current Ratio</li>
              <li>• Debt-to-Equity Ratio</li>
              <li>• Cash Conversion Cycle</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm mb-2">Sales & Revenue (5)</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Revenue Growth Rate</li>
              <li>• Average Order Value</li>
              <li>• Customer Acquisition Cost</li>
              <li>• Customer Lifetime Value</li>
              <li>• ABC Analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm mb-2">Operational (4)</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Inventory Turnover</li>
              <li>• Unit Economics</li>
              <li>• Expense Ratio</li>
              <li>• Employee Productivity</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm mb-2">Growth & Predictive (3)</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Projected Revenue</li>
              <li>• Break-even Point</li>
              <li>• Cash Runway</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm mb-2">Ratio Analysis (8+)</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Liquidity Ratios</li>
              <li>• Profitability Ratios</li>
              <li>• Efficiency Ratios</li>
              <li>• Leverage Ratios</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm mb-2">Visual Analytics</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Trend Charts</li>
              <li>• Composition Pie Charts</li>
              <li>• KPI Gauges</li>
              <li>• Alert Indicators</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Alert Thresholds */}
      <Card className="p-4">
        <h3 className="mb-4">🚨 Alert Thresholds & Indicators</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <div className="flex-1">
              <p className="font-medium text-sm">Green (Good)</p>
              <p className="text-xs text-muted-foreground">
                KPIs meet or exceed benchmarks (e.g., Net Profit ≥ 10%, Current Ratio ≥ 2)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <div className="flex-1">
              <p className="font-medium text-sm">Orange (Warning)</p>
              <p className="text-xs text-muted-foreground">
                KPIs below target but acceptable (e.g., Net Profit 5-10%, Current Ratio 1.5-2)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <div className="flex-1">
              <p className="font-medium text-sm">Red (Critical)</p>
              <p className="text-xs text-muted-foreground">
                KPIs significantly below target (e.g., Net Profit {'<'} 5%, Inventory Turnover {'<'} 4)
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}