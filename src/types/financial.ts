export interface FinancialData {
  balanceSheet: {
    assets: {
      currentAssets: number;
      inventory: number;
      accountsReceivable: number;
      cash: number;
      fixedAssets: number;
    };
    liabilities: {
      currentLiabilities: number;
      accountsPayable: number;
      longTermDebt: number;
    };
    equity: number;
  };
  incomeStatement: {
    revenue: number;
    cogs: number;
    operatingExpenses: number;
    interestExpense: number;
    tax: number;
  };
  periods: FinancialPeriod[];
  salesData: SalesData[];
  customerMetrics: CustomerMetrics;
  cashFlow: CashFlowData;
  operationalData: OperationalData;
  monthlyBurn: MonthlyBurnData[];
}

export interface MonthlyBurnData {
  month: string;
  cashBalance: number;
  cashIn: number;
  cashOut: number;
  netBurn: number;
}

export interface OperationalData {
  employees: number;
  monthlyInventory: { month: string; inventory: number; cogs: number }[];
  monthlyExpenses: { month: string; totalExpenses: number; revenue: number }[];
}

export interface SalesData {
  month: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  newCustomers: number;
  marketingSpend?: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  retentionRate: number;
  lifetimeValue: number;
}

export interface CashFlowData {
  operating: number;
  investing: number;
  financing: number;
  netCashFlow: number;
  cashBalance: number;
}

export interface FinancialPeriod {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  assets: number;
  liabilities: number;
}

export interface Product {
  id: string;
  name: string;
  revenue: number;
  units: number;
  cogs: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  segment: string;
  industry?: string;
  acquisitionCost?: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  category: string;
  isFixed: boolean;
}

export interface FinancialRatios {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
  grossProfitMargin: number;
  netProfitMargin: number;
  assetTurnover: number;
  inventoryTurnover: number;
}