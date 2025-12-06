import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FinancialData {
  // Balance Sheet
  currentAssets: number;
  fixedAssets: number;
  currentLiabilities: number;
  longTermLiabilities: number;
  equity: number;
  inventory: number;
  accountsReceivable: number;
  cash: number;
  
  // Income Statement
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  interestExpense: number;
  taxes: number;
  
  // Additional Data
  unitsSold: number;
  averageSellingPrice: number;
  variableCostPerUnit: number;
  fixedCosts: number;
}

export interface ProductData {
  name: string;
  revenue: number;
  cost: number;
  units: number;
}

interface FinancialContextType {
  financialData: FinancialData;
  updateFinancialData: (data: Partial<FinancialData>) => void;
  products: ProductData[];
  updateProducts: (products: ProductData[]) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancialData = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancialData must be used within FinancialDataProvider');
  }
  return context;
};

export const FinancialDataProvider = ({ children }: { children: ReactNode }) => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    // Balance Sheet (in thousands)
    currentAssets: 850,
    fixedAssets: 1200,
    currentLiabilities: 450,
    longTermLiabilities: 600,
    equity: 1000,
    inventory: 320,
    accountsReceivable: 380,
    cash: 150,
    
    // Income Statement (in thousands)
    revenue: 3500,
    cogs: 2100,
    operatingExpenses: 800,
    interestExpense: 50,
    taxes: 165,
    
    // Unit Economics
    unitsSold: 50000,
    averageSellingPrice: 70,
    variableCostPerUnit: 42,
    fixedCosts: 800,
  });

  const [products, setProducts] = useState<ProductData[]>([
    { name: 'Product A', revenue: 1400, cost: 800, units: 20000 },
    { name: 'Product B', revenue: 1050, cost: 650, units: 15000 },
    { name: 'Product C', revenue: 700, cost: 450, units: 10000 },
    { name: 'Product D', revenue: 210, cost: 140, units: 3000 },
    { name: 'Product E', revenue: 140, cost: 100, units: 2000 },
  ]);

  const updateFinancialData = (data: Partial<FinancialData>) => {
    setFinancialData(prev => ({ ...prev, ...data }));
  };

  const updateProducts = (newProducts: ProductData[]) => {
    setProducts(newProducts);
  };

  return (
    <FinancialContext.Provider value={{ financialData, updateFinancialData, products, updateProducts }}>
      {children}
    </FinancialContext.Provider>
  );
};
