import { FinancialData, FinancialPeriod, Product, Customer, ExpenseCategory } from "../types/financial";

export const mockFinancialData: FinancialData = {
  balanceSheet: {
    assets: {
      currentAssets: 2500000,
      inventory: 800000,
      accountsReceivable: 1200000,
      cash: 500000,
      fixedAssets: 3500000,
    },
    liabilities: {
      currentLiabilities: 1000000,
      accountsPayable: 600000,
      longTermDebt: 2000000,
    },
    equity: 3000000,
  },
  incomeStatement: {
    revenue: 10000000,
    cogs: 6000000,
    operatingExpenses: 2500000,
    interestExpense: 200000,
    tax: 390000,
  },
  periods: [
    { period: "Q1 2024", revenue: 2000000, expenses: 1700000, profit: 300000, assets: 5500000, liabilities: 2700000 },
    { period: "Q2 2024", revenue: 2300000, expenses: 1900000, profit: 400000, assets: 5800000, liabilities: 2800000 },
    { period: "Q3 2024", revenue: 2500000, expenses: 2000000, profit: 500000, assets: 6000000, liabilities: 2900000 },
    { period: "Q4 2024", revenue: 3200000, expenses: 2600000, profit: 600000, assets: 6000000, liabilities: 3000000 },
  ],
  salesData: [
    { month: "Apr 2024", revenue: 650000, orders: 145, avgOrderValue: 4483, newCustomers: 28, marketingSpend: 25000 },
    { month: "May 2024", revenue: 720000, orders: 156, avgOrderValue: 4615, newCustomers: 32, marketingSpend: 28000 },
    { month: "Jun 2024", revenue: 630000, orders: 138, avgOrderValue: 4565, newCustomers: 25, marketingSpend: 22000 },
    { month: "Jul 2024", revenue: 780000, orders: 168, avgOrderValue: 4643, newCustomers: 35, marketingSpend: 30000 },
    { month: "Aug 2024", revenue: 820000, orders: 175, avgOrderValue: 4686, newCustomers: 38, marketingSpend: 32000 },
    { month: "Sep 2024", revenue: 900000, orders: 189, avgOrderValue: 4762, newCustomers: 42, marketingSpend: 35000 },
    { month: "Oct 2024", revenue: 1050000, orders: 215, avgOrderValue: 4884, newCustomers: 48, marketingSpend: 38000 },
  ],
  customerMetrics: {
    totalCustomers: 1250,
    activeCustomers: 890,
    newThisMonth: 48,
    retentionRate: 78.5,
    lifetimeValue: 12500,
  },
  cashFlow: {
    operating: 1200000,
    investing: -400000,
    financing: -200000,
    netCashFlow: 600000,
    cashBalance: 500000,
  },
  operationalData: {
    employees: 45,
    monthlyInventory: [
      { month: "Apr 2024", inventory: 720000, cogs: 520000 },
      { month: "May 2024", inventory: 750000, cogs: 560000 },
      { month: "Jun 2024", inventory: 680000, cogs: 480000 },
      { month: "Jul 2024", inventory: 780000, cogs: 610000 },
      { month: "Aug 2024", inventory: 820000, cogs: 640000 },
      { month: "Sep 2024", inventory: 850000, cogs: 700000 },
      { month: "Oct 2024", inventory: 800000, cogs: 820000 },
    ],
    monthlyExpenses: [
      { month: "Apr 2024", totalExpenses: 550000, revenue: 650000 },
      { month: "May 2024", totalExpenses: 590000, revenue: 720000 },
      { month: "Jun 2024", totalExpenses: 520000, revenue: 630000 },
      { month: "Jul 2024", totalExpenses: 640000, revenue: 780000 },
      { month: "Aug 2024", totalExpenses: 670000, revenue: 820000 },
      { month: "Sep 2024", totalExpenses: 730000, revenue: 900000 },
      { month: "Oct 2024", totalExpenses: 850000, revenue: 1050000 },
    ],
  },
  monthlyBurn: [
    { month: "Apr 2024", cashBalance: 450000, cashIn: 680000, cashOut: 600000, netBurn: -80000 },
    { month: "May 2024", cashBalance: 530000, cashIn: 750000, cashOut: 670000, netBurn: -80000 },
    { month: "Jun 2024", cashBalance: 610000, cashIn: 650000, cashOut: 570000, netBurn: -80000 },
    { month: "Jul 2024", cashBalance: 690000, cashIn: 820000, cashOut: 740000, netBurn: -80000 },
    { month: "Aug 2024", cashBalance: 770000, cashIn: 860000, cashOut: 780000, netBurn: -80000 },
    { month: "Sep 2024", cashBalance: 850000, cashIn: 950000, cashOut: 870000, netBurn: -80000 },
    { month: "Oct 2024", cashBalance: 930000, cashIn: 1100000, cashOut: 1020000, netBurn: -80000 },
  ],
};

export const mockProducts: Product[] = [
  { id: "1", name: "Premium Widget A", revenue: 3500000, units: 10000, cogs: 2000000, category: "Premium" },
  { id: "2", name: "Standard Widget B", revenue: 2800000, units: 20000, cogs: 1800000, category: "Standard" },
  { id: "3", name: "Premium Widget C", revenue: 1500000, units: 5000, cogs: 900000, category: "Premium" },
  { id: "4", name: "Economy Widget D", revenue: 1200000, units: 30000, cogs: 900000, category: "Economy" },
  { id: "5", name: "Standard Widget E", revenue: 800000, units: 8000, cogs: 550000, category: "Standard" },
  { id: "6", name: "Premium Widget F", revenue: 200000, units: 500, cogs: 150000, category: "Premium" },
  { id: "7", name: "Economy Widget G", revenue: 150000, units: 5000, cogs: 120000, category: "Economy" },
  { id: "8", name: "Standard Widget H", revenue: 100000, units: 2000, cogs: 80000, category: "Standard" },
];

export const mockCustomers: Customer[] = [
  { id: "1", name: "Acme Corp", revenue: 1800000, orders: 360, avgOrderValue: 5000, segment: "Enterprise", industry: "Manufacturing", acquisitionCost: 15000 },
  { id: "2", name: "GlobalTech Inc", revenue: 1500000, orders: 300, avgOrderValue: 5000, segment: "Enterprise", industry: "Technology", acquisitionCost: 12000 },
  { id: "3", name: "Beta Industries", revenue: 1200000, orders: 240, avgOrderValue: 5000, segment: "Mid-Market", industry: "Retail", acquisitionCost: 8000 },
  { id: "4", name: "Gamma Solutions", revenue: 950000, orders: 190, avgOrderValue: 5000, segment: "Mid-Market", industry: "Services", acquisitionCost: 7000 },
  { id: "5", name: "Delta Enterprises", revenue: 800000, orders: 160, avgOrderValue: 5000, segment: "Mid-Market", industry: "Healthcare", acquisitionCost: 6000 },
  { id: "6", name: "Epsilon Ltd", revenue: 650000, orders: 130, avgOrderValue: 5000, segment: "SMB", industry: "Retail", acquisitionCost: 4000 },
  { id: "7", name: "Zeta Corp", revenue: 500000, orders: 100, avgOrderValue: 5000, segment: "SMB", industry: "Manufacturing", acquisitionCost: 3000 },
  { id: "8", name: "Theta Co", revenue: 400000, orders: 80, avgOrderValue: 5000, segment: "SMB", industry: "Services", acquisitionCost: 2500 },
  { id: "9", name: "Iota Systems", revenue: 320000, orders: 64, avgOrderValue: 5000, segment: "SMB", industry: "Technology", acquisitionCost: 2000 },
  { id: "10", name: "Kappa Partners", revenue: 280000, orders: 56, avgOrderValue: 5000, segment: "SMB", industry: "Consulting", acquisitionCost: 1800 },
  { id: "11", name: "Lambda Group", revenue: 200000, orders: 40, avgOrderValue: 5000, segment: "Startup", industry: "Technology", acquisitionCost: 1500 },
  { id: "12", name: "Mu Ventures", revenue: 180000, orders: 36, avgOrderValue: 5000, segment: "Startup", industry: "Services", acquisitionCost: 1200 },
  { id: "13", name: "Nu Brands", revenue: 150000, orders: 30, avgOrderValue: 5000, segment: "Startup", industry: "Retail", acquisitionCost: 1000 },
  { id: "14", name: "Xi Holdings", revenue: 120000, orders: 24, avgOrderValue: 5000, segment: "Startup", industry: "Manufacturing", acquisitionCost: 800 },
  { id: "15", name: "Omicron Labs", revenue: 100000, orders: 20, avgOrderValue: 5000, segment: "Startup", industry: "Healthcare", acquisitionCost: 600 },
];

export const mockExpenseCategories: ExpenseCategory[] = [
  { id: "1", name: "Salaries & Wages", amount: 850000, category: "Personnel", isFixed: true },
  { id: "2", name: "Marketing & Advertising", amount: 380000, category: "Marketing", isFixed: false },
  { id: "3", name: "Rent & Utilities", amount: 320000, category: "Facilities", isFixed: true },
  { id: "4", name: "Software & Technology", amount: 280000, category: "Technology", isFixed: true },
  { id: "5", name: "Sales Commissions", amount: 250000, category: "Sales", isFixed: false },
  { id: "6", name: "Office Supplies", amount: 180000, category: "Operations", isFixed: false },
  { id: "7", name: "Travel & Entertainment", amount: 150000, category: "Operations", isFixed: false },
  { id: "8", name: "Insurance", amount: 120000, category: "Administrative", isFixed: true },
  { id: "9", name: "Professional Services", amount: 95000, category: "Administrative", isFixed: false },
  { id: "10", name: "Maintenance & Repairs", amount: 75000, category: "Facilities", isFixed: false },
  { id: "11", name: "Training & Development", amount: 60000, category: "Personnel", isFixed: false },
  { id: "12", name: "Shipping & Logistics", amount: 45000, category: "Operations", isFixed: false },
];