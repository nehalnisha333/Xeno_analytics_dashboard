import { Dashboard } from "./components/Dashboard";
import { CoreKPIs } from "./components/CoreKPIs";
import { SalesMetrics } from "./components/SalesMetrics";
import { OperationalMetrics } from "./components/OperationalMetrics";
import { GrowthMetrics } from "./components/GrowthMetrics";
import { RatioAnalysis } from "./components/RatioAnalysis";
import { RatioTrendAnalyzer } from "./components/RatioTrendAnalyzer";
import { IndustryBenchmarkSnapshot } from "./components/IndustryBenchmarkSnapshot";
import { ABCAnalysisEnhanced } from "./components/ABCAnalysisEnhanced";
import { UnitEconomicsEnhanced } from "./components/UnitEconomicsEnhanced";
import { ExpenseOptimizationMap } from "./components/ExpenseOptimizationMap";
import { MarketingReadinessScore } from "./components/MarketingReadinessScore";
import { SmartTaxHealthCheck } from "./components/SmartTaxHealthCheck";
import { CashFlowPredictor } from "./components/CashFlowPredictor";
import { VendorClientDependencyMap } from "./components/VendorClientDependencyMap";
import { CreditLoanRecommender } from "./components/CreditLoanRecommender";
import { ProductPricingAdvisor } from "./components/ProductPricingAdvisor";
import { SeasonalTrendDetector } from "./components/SeasonalTrendDetector";
import { WhatsAppReportShare } from "./components/WhatsAppReportShare";
import { FinancialProjections } from "./components/FinancialProjections";
import { CMAReport } from "./components/CMAReport";
import { DataInput } from "./components/DataInput";
import { ProfitPulse } from "./components/ProfitPulse";
import { mockFinancialData, mockProducts, mockCustomers, mockExpenseCategories } from "./lib/mockData";
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Target, 
  Building2, 
  LayoutDashboard, 
  Gauge, 
  ShoppingBag, 
  Activity, 
  Zap, 
  Upload, 
  Heart, 
  Bell, 
  ChevronDown, 
  DollarSign, 
  Briefcase, 
  FileText,
  Calendar,
  Users,
  PieChart
} from "lucide-react";
import { useState } from "react";
import { FinancialData, Product } from "./types/financial";
import { Button } from "./components/ui/button";

export default function App() {
  const [financialData, setFinancialData] = useState<FinancialData>(mockFinancialData);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activeView, setActiveView] = useState("dashboard");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDataUpdate = (newData: FinancialData, newProducts: Product[]) => {
    setFinancialData(newData);
    setProducts(newProducts);
  };

  // Navigation structure with grouped items
  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      standalone: true
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      items: [
        { id: "kpis", label: "Core KPIs", icon: Gauge },
        { id: "ratios", label: "Financial Ratios", icon: BarChart3 },
        { id: "abc", label: "ABC Analysis", icon: Package },
        { id: "unit", label: "Unit Economics", icon: TrendingUp },
        { id: "pulse", label: "Profit Pulse", icon: Heart },
      ]
    },
    {
      id: "sales-marketing",
      label: "Sales & Marketing",
      icon: ShoppingBag,
      items: [
        { id: "sales", label: "Sales Metrics", icon: DollarSign },
        { id: "seasonal", label: "Seasonal Trends", icon: Calendar },
        { id: "marketing", label: "Marketing Readiness", icon: Zap },
        { id: "dependencies", label: "Vendor/Client Map", icon: Users },
      ]
    },
    {
      id: "operations-finance",
      label: "Operations",
      icon: Activity,
      items: [
        { id: "operations", label: "Operational Metrics", icon: Activity },
        { id: "cashflow", label: "Cash Flow Predictor", icon: TrendingUp },
        { id: "expenses", label: "Expense Optimization", icon: DollarSign },
      ]
    },
    {
      id: "planning",
      label: "Planning & Reports",
      icon: FileText,
      items: [
        { id: "projections", label: "Financial Projections", icon: Target },
        { id: "cma", label: "CMA Report", icon: Building2 },
        { id: "pricing", label: "Product Pricing", icon: PieChart },
        { id: "tax", label: "Tax Health Check", icon: FileText },
        { id: "loans", label: "Credit & Loans", icon: Briefcase },
      ]
    },
    {
      id: "data-alerts",
      label: "Data & Alerts",
      icon: Upload,
      items: [
        { id: "data", label: "Data Input", icon: Upload },
        { id: "alerts", label: "WhatsApp Reports", icon: Bell },
      ]
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard data={financialData} products={products} />;
      
      // Analytics
      case "kpis":
        return <CoreKPIs data={financialData} />;
      case "ratios":
        return (
          <>
            <IndustryBenchmarkSnapshot data={financialData} industryTag="Manufacturing" />
            <RatioAnalysis data={financialData} />
            <RatioTrendAnalyzer data={financialData} />
          </>
        );
      case "abc":
        return <ABCAnalysisEnhanced products={products} customers={mockCustomers} expenses={mockExpenseCategories} />;
      case "unit":
        return <UnitEconomicsEnhanced products={products} />;
      case "pulse":
        return <ProfitPulse data={financialData} />;
      
      // Sales & Marketing
      case "sales":
        return <SalesMetrics data={financialData} products={products} />;
      case "seasonal":
        return <SeasonalTrendDetector data={financialData} />;
      case "marketing":
        return <MarketingReadinessScore data={financialData} products={products} />;
      case "dependencies":
        return <VendorClientDependencyMap products={products} customers={mockCustomers} />;
      
      // Operations
      case "operations":
        return <OperationalMetrics data={financialData} products={products} />;
      case "cashflow":
        return <CashFlowPredictor data={financialData} />;
      case "expenses":
        return <ExpenseOptimizationMap data={financialData} expenses={mockExpenseCategories} />;
      
      // Planning & Reports
      case "projections":
        return <FinancialProjections data={financialData} />;
      case "cma":
        return <CMAReport data={financialData} />;
      case "pricing":
        return <ProductPricingAdvisor products={products} />;
      case "tax":
        return <SmartTaxHealthCheck data={financialData} expenses={mockExpenseCategories} />;
      case "loans":
        return <CreditLoanRecommender data={financialData} />;
      
      // Data & Alerts
      case "data":
        return (
          <DataInput 
            onDataUpdate={handleDataUpdate} 
            currentData={financialData} 
            currentProducts={products} 
          />
        );
      case "alerts":
        return <WhatsAppReportShare data={financialData} products={products} />;
      
      default:
        return <Dashboard data={financialData} products={products} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl">XENO DASHBOARD</h1>
              <p className="text-sm text-muted-foreground">
                Analytical Dashboard for XENO
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-white border-b sticky top-[73px] z-50 overflow-visible">
        <div className="container mx-auto px-4 overflow-visible">
          <div className="flex items-center gap-1 py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              if (item.standalone) {
                return (
                  <Button
                    key={item.id}
                    variant={activeView === item.id ? "default" : "ghost"}
                    className="flex items-center gap-2 whitespace-nowrap"
                    onClick={() => setActiveView(item.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              }
              
              // Check if any sub-item is active
              const hasActiveChild = item.items?.some(subItem => activeView === subItem.id);
              
              return (
                <div 
                  key={item.id} 
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Button
                    variant={hasActiveChild ? "default" : "ghost"}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                  
                  {/* Dropdown Menu */}
                  {openDropdown === item.id && (
                    <div 
                      className="absolute left-0 top-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-2xl min-w-[220px] py-1 z-[9999]"
                      style={{ zIndex: 9999 }}
                    >
                      {item.items?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <button
                            key={subItem.id}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm transition-colors ${
                              activeView === subItem.id ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                            onClick={() => {
                              setActiveView(subItem.id);
                              setOpenDropdown(null);
                            }}
                          >
                            <SubIcon className="w-4 h-4" />
                            {subItem.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-center text-muted-foreground">
            VYAPAR AI - Empowering MSMEs with AI-powered financial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}