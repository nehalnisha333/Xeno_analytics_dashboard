import { Card } from "./ui/card";
import { FinancialData } from "../types/financial";
import { 
  CreditCard,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Percent,
  Calendar,
  Shield,
  Zap,
  Target,
  Info,
  ArrowRight,
  Sparkles,
  Building2,
  TrendingDown,
  Clock,
  Gift,
  Briefcase,
  Plane,
  ShoppingCart,
  Fuel,
  Users,
  FileText,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  LineChart,
  PiggyBank,
  Landmark
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart as RechartsLine,
  Line
} from "recharts";

interface CreditLoanRecommenderProps {
  data: FinancialData;
}

interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  type: "Cashback" | "Rewards" | "Travel" | "Low APR" | "0% Intro APR";
  annualFee: number;
  cashbackRate: number;
  rewardsMultiplier: number;
  introAPR: string;
  regularAPR: string;
  creditLimit: string;
  benefits: string[];
  eligibility: {
    minRevenue: number;
    minCreditScore: number;
    minYearsInBusiness: number;
  };
  bestFor: string[];
  approvalLikelihood: number; // 0-100
}

interface LoanProduct {
  id: string;
  name: string;
  provider: string;
  type: "Term Loan" | "Line of Credit" | "SBA Loan" | "Invoice Factoring" | "Merchant Cash Advance" | "Equipment Financing";
  amount: string;
  interestRate: string;
  term: string;
  fees: string;
  timeToFunding: string;
  eligibility: {
    minRevenue: number;
    minCreditScore: number;
    minYearsInBusiness: number;
  };
  benefits: string[];
  drawbacks: string[];
  bestFor: string[];
  approvalLikelihood: number; // 0-100
}

export function CreditLoanRecommender({ data }: CreditLoanRecommenderProps) {
  
  // Calculate business health metrics
  const revenue = data.incomeStatement.revenue;
  const annualRevenue = revenue * 12;
  const netIncome = data.incomeStatement.netIncome;
  const profitMargin = (netIncome / revenue) * 100;
  const totalAssets = data.balanceSheet.cashAndEquivalents + 
                      data.balanceSheet.accountsReceivable + 
                      data.balanceSheet.inventory + 
                      data.balanceSheet.fixedAssets;
  const totalLiabilities = data.balanceSheet.accountsPayable + 
                           data.balanceSheet.shortTermDebt + 
                           data.balanceSheet.longTermDebt;
  const debtToEquity = totalLiabilities / (totalAssets - totalLiabilities);
  const currentRatio = (data.balanceSheet.cashAndEquivalents + 
                        data.balanceSheet.accountsReceivable + 
                        data.balanceSheet.inventory) / 
                       (data.balanceSheet.accountsPayable + 
                        data.balanceSheet.shortTermDebt);

  // Estimate credit score based on financial health (600-850 scale)
  const estimateCreditScore = () => {
    let score = 600; // Base score
    
    // Factor 1: Profitability (up to 80 points)
    if (profitMargin > 20) score += 80;
    else if (profitMargin > 15) score += 60;
    else if (profitMargin > 10) score += 40;
    else if (profitMargin > 5) score += 20;
    
    // Factor 2: Current ratio (up to 60 points)
    if (currentRatio > 2.0) score += 60;
    else if (currentRatio > 1.5) score += 45;
    else if (currentRatio > 1.0) score += 30;
    else if (currentRatio > 0.8) score += 15;
    
    // Factor 3: Debt to equity (up to 60 points)
    if (debtToEquity < 0.5) score += 60;
    else if (debtToEquity < 1.0) score += 45;
    else if (debtToEquity < 1.5) score += 30;
    else if (debtToEquity < 2.0) score += 15;
    
    // Factor 4: Revenue (up to 50 points)
    if (annualRevenue > 10000000) score += 50;
    else if (annualRevenue > 5000000) score += 40;
    else if (annualRevenue > 1000000) score += 30;
    else if (annualRevenue > 500000) score += 20;
    else score += 10;
    
    return Math.min(850, Math.max(600, score));
  };

  const estimatedCreditScore = estimateCreditScore();
  const creditScoreGrade = estimatedCreditScore >= 750 ? "Excellent" :
                          estimatedCreditScore >= 700 ? "Good" :
                          estimatedCreditScore >= 650 ? "Fair" : "Poor";
  const creditScoreColor = estimatedCreditScore >= 750 ? "green" :
                          estimatedCreditScore >= 700 ? "blue" :
                          estimatedCreditScore >= 650 ? "orange" : "red";

  // Years in business (simulated)
  const yearsInBusiness = 3.5;

  // Monthly expenses (for credit card recommendations)
  const monthlyExpenses = data.incomeStatement.operatingExpenses + data.incomeStatement.costOfGoodsSold;

  // CREDIT CARD RECOMMENDATIONS
  const creditCards: CreditCard[] = [
    {
      id: "CC001",
      name: "Business Platinum Rewards",
      issuer: "American Express",
      type: "Rewards",
      annualFee: 695,
      cashbackRate: 0,
      rewardsMultiplier: 5,
      introAPR: "N/A",
      regularAPR: "19.99% - 27.99%",
      creditLimit: "$25K - $100K",
      benefits: [
        "5× points on flights & hotels booked via Amex Travel",
        "1.5× points on eligible purchases over $5K",
        "$200 airline fee credit annually",
        "Access to Amex Global Lounge Collection",
        "35% points back on flights with your selected airline"
      ],
      eligibility: {
        minRevenue: 1000000,
        minCreditScore: 720,
        minYearsInBusiness: 2
      },
      bestFor: ["Travel-heavy businesses", "Large purchases", "Premium perks"],
      approvalLikelihood: 0
    },
    {
      id: "CC002",
      name: "Business Cash Rewards",
      issuer: "Bank of America",
      type: "Cashback",
      annualFee: 0,
      cashbackRate: 3,
      rewardsMultiplier: 0,
      introAPR: "0% for 9 months",
      regularAPR: "17.99% - 24.99%",
      creditLimit: "$10K - $50K",
      benefits: [
        "3% cash back on category of choice (gas, dining, travel, etc.)",
        "2% cash back on dining",
        "1% unlimited cash back on all other purchases",
        "No annual fee",
        "Employee cards at no charge"
      ],
      eligibility: {
        minRevenue: 250000,
        minCreditScore: 680,
        minYearsInBusiness: 1
      },
      bestFor: ["Everyday spending", "Gas & dining expenses", "Small businesses"],
      approvalLikelihood: 0
    },
    {
      id: "CC003",
      name: "Business Advantage Unlimited",
      issuer: "Chase",
      type: "Cashback",
      annualFee: 0,
      cashbackRate: 1.5,
      rewardsMultiplier: 0,
      introAPR: "0% for 12 months",
      regularAPR: "18.49% - 24.49%",
      creditLimit: "$5K - $30K",
      benefits: [
        "1.5% unlimited cash back on every purchase",
        "0% intro APR for 12 months on purchases",
        "$300 bonus after $3K in purchases in first 3 months",
        "No annual fee",
        "Cell phone protection up to $1,200"
      ],
      eligibility: {
        minRevenue: 100000,
        minCreditScore: 660,
        minYearsInBusiness: 0.5
      },
      bestFor: ["New businesses", "Simple rewards", "Balance transfers"],
      approvalLikelihood: 0
    },
    {
      id: "CC004",
      name: "Business Prime Rewards",
      issuer: "Chase",
      type: "Rewards",
      annualFee: 175,
      cashbackRate: 0,
      rewardsMultiplier: 3,
      introAPR: "N/A",
      regularAPR: "20.24% - 25.24%",
      creditLimit: "$15K - $75K",
      benefits: [
        "3× points on shipping, internet, cable, phone services",
        "2× points on gas stations & restaurants",
        "5% back on Amazon Business purchases",
        "Exclusive Amazon discounts",
        "Purchase protection & extended warranty"
      ],
      eligibility: {
        minRevenue: 500000,
        minCreditScore: 700,
        minYearsInBusiness: 1.5
      },
      bestFor: ["E-commerce businesses", "Amazon sellers", "High shipping costs"],
      approvalLikelihood: 0
    },
    {
      id: "CC005",
      name: "SimplyCash Plus Business",
      issuer: "American Express",
      type: "Cashback",
      annualFee: 0,
      cashbackRate: 2,
      rewardsMultiplier: 0,
      introAPR: "0% for 12 months",
      regularAPR: "17.99% - 25.99%",
      creditLimit: "$10K - $40K",
      benefits: [
        "2% cash back on all eligible purchases",
        "$500 cash back after $5K spend in first 3 months",
        "No cap on cash back earned",
        "0% intro APR for 12 months",
        "Free employee cards"
      ],
      eligibility: {
        minRevenue: 300000,
        minCreditScore: 690,
        minYearsInBusiness: 1
      },
      bestFor: ["High-volume spenders", "Flat-rate rewards", "Growing businesses"],
      approvalLikelihood: 0
    }
  ];

  // LOAN PRODUCT RECOMMENDATIONS
  const loanProducts: LoanProduct[] = [
    {
      id: "LP001",
      name: "SBA 7(a) Business Loan",
      provider: "Multiple Lenders",
      type: "SBA Loan",
      amount: "$50K - $5M",
      interestRate: "7.5% - 10.5%",
      term: "10-25 years",
      fees: "2-3.5% guarantee fee",
      timeToFunding: "60-90 days",
      eligibility: {
        minRevenue: 500000,
        minCreditScore: 680,
        minYearsInBusiness: 2
      },
      benefits: [
        "Lowest interest rates available",
        "Longest repayment terms (up to 25 years)",
        "Can be used for working capital, equipment, real estate",
        "Government-backed with 85% guarantee"
      ],
      drawbacks: [
        "Lengthy application process",
        "Strict eligibility requirements",
        "Requires collateral for larger amounts",
        "Slower funding timeline"
      ],
      bestFor: ["Established businesses", "Major investments", "Real estate purchases"],
      approvalLikelihood: 0
    },
    {
      id: "LP002",
      name: "Business Line of Credit",
      provider: "BlueVine / Fundbox",
      type: "Line of Credit",
      amount: "$10K - $250K",
      interestRate: "9% - 25%",
      term: "6-12 months (revolving)",
      fees: "0.5-1% draw fee",
      timeToFunding: "1-3 days",
      eligibility: {
        minRevenue: 100000,
        minCreditScore: 650,
        minYearsInBusiness: 0.5
      },
      benefits: [
        "Fast approval and funding",
        "Only pay interest on amount drawn",
        "Revolving credit - reuse as you repay",
        "Flexible for cash flow gaps"
      ],
      drawbacks: [
        "Higher interest rates than term loans",
        "Annual or monthly maintenance fees",
        "Credit limit may be lower than needed",
        "Variable interest rates"
      ],
      bestFor: ["Cash flow management", "Seasonal businesses", "Unexpected expenses"],
      approvalLikelihood: 0
    },
    {
      id: "LP003",
      name: "Short-Term Business Loan",
      provider: "OnDeck / Kabbage",
      type: "Term Loan",
      amount: "$5K - $500K",
      interestRate: "12% - 40%",
      term: "3-18 months",
      fees: "2-5% origination fee",
      timeToFunding: "Same day - 2 days",
      eligibility: {
        minRevenue: 100000,
        minCreditScore: 625,
        minYearsInBusiness: 1
      },
      benefits: [
        "Very fast funding (24-48 hours)",
        "Minimal documentation required",
        "Can refinance multiple times",
        "Flexible qualification criteria"
      ],
      drawbacks: [
        "High interest rates (APR can exceed 40%)",
        "Short repayment period creates cash flow pressure",
        "Daily/weekly payment schedules",
        "Expensive for long-term needs"
      ],
      bestFor: ["Emergency funding", "Time-sensitive opportunities", "Inventory purchases"],
      approvalLikelihood: 0
    },
    {
      id: "LP004",
      name: "Invoice Factoring",
      provider: "Fundbox / Triumph Business Capital",
      type: "Invoice Factoring",
      amount: "80-90% of invoice value",
      interestRate: "1-5% per month",
      term: "Until invoice paid (30-90 days)",
      fees: "1-5% factoring fee",
      timeToFunding: "24 hours",
      eligibility: {
        minRevenue: 250000,
        minCreditScore: 600,
        minYearsInBusiness: 0.5
      },
      benefits: [
        "Immediate cash from outstanding invoices",
        "No debt added to balance sheet",
        "Approval based on customer credit, not yours",
        "Very fast funding"
      ],
      drawbacks: [
        "Can be expensive (effective APR 12-60%)",
        "Customers may be contacted",
        "Not all invoices qualify",
        "Reduces profit margins"
      ],
      bestFor: ["B2B businesses with Net 30/60/90 terms", "Strong AR balance", "Fast-growing companies"],
      approvalLikelihood: 0
    },
    {
      id: "LP005",
      name: "Equipment Financing",
      provider: "Crest Capital / Balboa Capital",
      type: "Equipment Financing",
      amount: "$10K - $5M",
      interestRate: "6% - 20%",
      term: "2-7 years",
      fees: "1-3% origination",
      timeToFunding: "3-5 days",
      eligibility: {
        minRevenue: 150000,
        minCreditScore: 640,
        minYearsInBusiness: 1
      },
      benefits: [
        "Equipment serves as collateral",
        "100% financing available",
        "Preserves working capital",
        "Potential tax benefits (Section 179)"
      ],
      drawbacks: [
        "Equipment-specific - can't use for other needs",
        "Equipment may depreciate faster than loan payoff",
        "Lender may restrict equipment use",
        "Prepayment penalties common"
      ],
      bestFor: ["Purchasing machinery/vehicles", "Technology upgrades", "Manufacturing businesses"],
      approvalLikelihood: 0
    },
    {
      id: "LP006",
      name: "Merchant Cash Advance",
      provider: "Square Capital / PayPal Working Capital",
      type: "Merchant Cash Advance",
      amount: "$2.5K - $250K",
      interestRate: "Factor rate 1.1-1.5 (10-50% effective)",
      term: "3-12 months",
      fees: "Built into factor rate",
      timeToFunding: "Same day - 1 day",
      eligibility: {
        minRevenue: 50000,
        minCreditScore: 580,
        minYearsInBusiness: 0.25
      },
      benefits: [
        "Fastest approval and funding",
        "No collateral required",
        "Repayment based on sales (% of daily receipts)",
        "Bad credit OK"
      ],
      drawbacks: [
        "VERY expensive (effective APR often 40-200%)",
        "Daily deductions impact cash flow",
        "Not technically a loan - fewer protections",
        "Can create debt spiral"
      ],
      bestFor: ["Emergency only", "High credit card volume businesses", "Last resort funding"],
      approvalLikelihood: 0
    }
  ];

  // Calculate approval likelihood for each product
  creditCards.forEach(card => {
    let likelihood = 100;
    
    // Revenue check
    if (annualRevenue < card.eligibility.minRevenue) {
      likelihood -= 40;
    } else if (annualRevenue < card.eligibility.minRevenue * 1.5) {
      likelihood -= 15;
    }
    
    // Credit score check
    if (estimatedCreditScore < card.eligibility.minCreditScore) {
      likelihood -= 35;
    } else if (estimatedCreditScore < card.eligibility.minCreditScore + 20) {
      likelihood -= 10;
    }
    
    // Years in business check
    if (yearsInBusiness < card.eligibility.minYearsInBusiness) {
      likelihood -= 25;
    }
    
    card.approvalLikelihood = Math.max(0, Math.min(100, likelihood));
  });

  loanProducts.forEach(loan => {
    let likelihood = 100;
    
    // Revenue check
    if (annualRevenue < loan.eligibility.minRevenue) {
      likelihood -= 35;
    } else if (annualRevenue < loan.eligibility.minRevenue * 1.5) {
      likelihood -= 10;
    }
    
    // Credit score check
    if (estimatedCreditScore < loan.eligibility.minCreditScore) {
      likelihood -= 30;
    } else if (estimatedCreditScore < loan.eligibility.minCreditScore + 20) {
      likelihood -= 10;
    }
    
    // Years in business check
    if (yearsInBusiness < loan.eligibility.minYearsInBusiness) {
      likelihood -= 20;
    }
    
    // Profitability check
    if (profitMargin < 5) {
      likelihood -= 15;
    }
    
    loan.approvalLikelihood = Math.max(0, Math.min(100, likelihood));
  });

  // Sort by approval likelihood
  const sortedCards = [...creditCards].sort((a, b) => b.approvalLikelihood - a.approvalLikelihood);
  const sortedLoans = [...loanProducts].sort((a, b) => b.approvalLikelihood - a.approvalLikelihood);

  // Top recommendations
  const topCards = sortedCards.filter(c => c.approvalLikelihood >= 70).slice(0, 3);
  const topLoans = sortedLoans.filter(l => l.approvalLikelihood >= 65).slice(0, 3);

  // Calculate potential savings/benefits
  const annualCashback = monthlyExpenses * 12 * 0.015; // Conservative 1.5% average
  const potentialCreditLimit = estimatedCreditScore >= 750 ? 100000 :
                               estimatedCreditScore >= 700 ? 50000 :
                               estimatedCreditScore >= 650 ? 25000 : 10000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <div>
            <h2>Credit Card & Loan Recommender</h2>
            <p className="text-muted-foreground">
              Your personalized financial concierge - tailored product recommendations
            </p>
          </div>
        </div>
      </div>

      {/* BUSINESS CREDIT PROFILE */}
      <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-purple-900 mb-1">Your Business Credit Profile</h3>
            <p className="text-sm text-muted-foreground">
              Based on your financial data, here's your estimated creditworthiness
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Credit Score */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Estimated Credit Score</div>
            <div className="relative inline-block">
              <div className={`text-6xl ${
                creditScoreColor === 'green' ? 'text-green-600' :
                creditScoreColor === 'blue' ? 'text-blue-600' :
                creditScoreColor === 'orange' ? 'text-orange-600' : 'text-red-600'
              } mb-2`}>
                {estimatedCreditScore}
              </div>
              <div className="absolute -top-1 -right-8 text-lg text-muted-foreground">/850</div>
            </div>
            <Badge className={
              creditScoreColor === 'green' ? 'bg-green-600' :
              creditScoreColor === 'blue' ? 'bg-blue-600' :
              creditScoreColor === 'orange' ? 'bg-orange-600' : 'bg-red-600'
            }>
              {creditScoreGrade}
            </Badge>
            <div className="mt-3">
              <Progress value={(estimatedCreditScore - 600) / 2.5} className="h-2" />
            </div>
          </div>

          {/* Revenue */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Annual Revenue</div>
            <div className="text-3xl mb-1">${(annualRevenue / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground mb-3">
              {annualRevenue >= 5000000 ? "Strong" : annualRevenue >= 1000000 ? "Good" : "Fair"}
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                {currentRatio > 1.5 ? 
                  <CheckCircle className="w-3 h-3 text-green-600" /> : 
                  <AlertCircle className="w-3 h-3 text-orange-600" />
                }
                <span className="text-muted-foreground">Current Ratio: {currentRatio.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                {profitMargin > 10 ? 
                  <CheckCircle className="w-3 h-3 text-green-600" /> : 
                  <AlertCircle className="w-3 h-3 text-orange-600" />
                }
                <span className="text-muted-foreground">Profit Margin: {profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Potential Benefits */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Potential Annual Benefits</div>
            <div className="text-3xl mb-1">${(annualCashback / 1000).toFixed(1)}K</div>
            <div className="text-xs text-muted-foreground mb-3">
              Cash back from optimal card
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Gift className="w-3 h-3 text-purple-600" />
                <span className="text-muted-foreground">Sign-up bonuses: $300-$500</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-purple-600" />
                <span className="text-muted-foreground">Rewards value: $500-$2K/yr</span>
              </div>
            </div>
          </div>

          {/* Approval Strength */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Approval Strength</div>
            <ResponsiveContainer width="100%" height={120}>
              <RadarChart 
                data={[
                  { metric: "Credit", score: ((estimatedCreditScore - 600) / 250) * 100 },
                  { metric: "Revenue", score: Math.min(100, (annualRevenue / 5000000) * 100) },
                  { metric: "Profitability", score: Math.min(100, profitMargin * 5) },
                  { metric: "Liquidity", score: Math.min(100, currentRatio * 50) },
                  { metric: "Time", score: Math.min(100, (yearsInBusiness / 5) * 100) }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={40}
              >
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 8 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                <Radar dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* TOP RECOMMENDATIONS SUMMARY */}
      <Card className="p-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <ThumbsUp className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-3">✨ Top Recommendations for Your Business</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topCards.length > 0 && (
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5" />
                    <strong>Best Credit Card Match</strong>
                  </div>
                  <div className="text-xl mb-1">{topCards[0].name}</div>
                  <div className="text-sm text-white/90">{topCards[0].issuer}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-white text-green-600">
                      {topCards[0].approvalLikelihood}% Approval Likely
                    </Badge>
                    {topCards[0].annualFee === 0 && (
                      <Badge variant="outline" className="border-white text-white">
                        No Annual Fee
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {topLoans.length > 0 && (
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <strong>Best Funding Option</strong>
                  </div>
                  <div className="text-xl mb-1">{topLoans[0].name}</div>
                  <div className="text-sm text-white/90">{topLoans[0].provider}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-white text-green-600">
                      {topLoans[0].approvalLikelihood}% Approval Likely
                    </Badge>
                    <Badge variant="outline" className="border-white text-white">
                      {topLoans[0].amount}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* CREDIT CARD RECOMMENDATIONS */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h3>Business Credit Card Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedCards.map((card) => {
            const Icon = card.type === "Travel" ? Plane :
                        card.type === "Cashback" ? DollarSign :
                        card.type === "Rewards" ? Star : CreditCard;
            
            const approvalColor = card.approvalLikelihood >= 80 ? "green" :
                                 card.approvalLikelihood >= 60 ? "blue" :
                                 card.approvalLikelihood >= 40 ? "orange" : "red";
            
            return (
              <Card key={card.id} className={`p-4 ${
                card.approvalLikelihood >= 70 ? 'border-2 border-green-300 bg-green-50' : 
                card.approvalLikelihood >= 50 ? 'border-2 border-blue-200 bg-blue-50' : 
                'border border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      approvalColor === 'green' ? 'bg-green-100' :
                      approvalColor === 'blue' ? 'bg-blue-100' :
                      approvalColor === 'orange' ? 'bg-orange-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        approvalColor === 'green' ? 'text-green-600' :
                        approvalColor === 'blue' ? 'text-blue-600' :
                        approvalColor === 'orange' ? 'text-orange-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{card.name}</h4>
                      <div className="text-xs text-muted-foreground">{card.issuer}</div>
                    </div>
                  </div>
                  <Badge className={
                    approvalColor === 'green' ? 'bg-green-600' :
                    approvalColor === 'blue' ? 'bg-blue-600' :
                    approvalColor === 'orange' ? 'bg-orange-600' : 'bg-red-600'
                  }>
                    {card.approvalLikelihood}%
                  </Badge>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-muted-foreground mb-1">Annual Fee</div>
                    <div className="font-mono">${card.annualFee}</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-muted-foreground mb-1">
                      {card.cashbackRate > 0 ? "Cash Back" : "Rewards"}
                    </div>
                    <div className="font-mono">
                      {card.cashbackRate > 0 ? `${card.cashbackRate}%` : `${card.rewardsMultiplier}×`}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-muted-foreground mb-1">APR</div>
                    <div className="font-mono text-xs">
                      {card.introAPR !== "N/A" ? card.introAPR.split(' ')[0] : card.regularAPR.split('-')[0]}
                    </div>
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-1">Best For:</div>
                  <div className="flex flex-wrap gap-1">
                    {card.bestFor.slice(0, 2).map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Top Benefits */}
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-2">Top Benefits:</div>
                  <ul className="space-y-1 text-xs">
                    {card.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility */}
                <div className="pt-3 border-t space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Min Revenue:</span>
                    <span className={annualRevenue >= card.eligibility.minRevenue ? 'text-green-600' : 'text-red-600'}>
                      ${(card.eligibility.minRevenue / 1000).toFixed(0)}K
                      {annualRevenue >= card.eligibility.minRevenue ? ' ✓' : ' ✗'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Min Credit Score:</span>
                    <span className={estimatedCreditScore >= card.eligibility.minCreditScore ? 'text-green-600' : 'text-red-600'}>
                      {card.eligibility.minCreditScore}
                      {estimatedCreditScore >= card.eligibility.minCreditScore ? ' ✓' : ' ✗'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Years in Business:</span>
                    <span className={yearsInBusiness >= card.eligibility.minYearsInBusiness ? 'text-green-600' : 'text-red-600'}>
                      {card.eligibility.minYearsInBusiness}+
                      {yearsInBusiness >= card.eligibility.minYearsInBusiness ? ' ✓' : ' ✗'}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className={`w-full mt-3 ${
                    card.approvalLikelihood >= 70 ? 'bg-green-600 hover:bg-green-700' :
                    card.approvalLikelihood >= 50 ? 'bg-blue-600 hover:bg-blue-700' :
                    'bg-gray-400'
                  }`}
                  disabled={card.approvalLikelihood < 30}
                >
                  {card.approvalLikelihood >= 70 ? '✨ Highly Recommended - Apply' :
                   card.approvalLikelihood >= 50 ? 'Good Match - Learn More' :
                   card.approvalLikelihood >= 30 ? 'Consider Applying' :
                   'Low Approval Chance'}
                </Button>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* LOAN PRODUCT RECOMMENDATIONS */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Landmark className="w-6 h-6 text-purple-600" />
          <h3>Working Capital & Loan Products</h3>
        </div>

        <div className="space-y-4">
          {sortedLoans.map((loan) => {
            const Icon = loan.type === "SBA Loan" ? Building2 :
                        loan.type === "Line of Credit" ? LineChart :
                        loan.type === "Invoice Factoring" ? FileText :
                        loan.type === "Equipment Financing" ? Briefcase :
                        loan.type === "Merchant Cash Advance" ? ShoppingCart : DollarSign;
            
            const approvalColor = loan.approvalLikelihood >= 75 ? "green" :
                                 loan.approvalLikelihood >= 55 ? "blue" :
                                 loan.approvalLikelihood >= 35 ? "orange" : "red";
            
            return (
              <Card key={loan.id} className={`p-4 ${
                loan.approvalLikelihood >= 65 ? 'border-2 border-green-300 bg-green-50' : 
                loan.approvalLikelihood >= 45 ? 'border-2 border-blue-200 bg-blue-50' : 
                'border border-gray-200'
              }`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left: Product Info */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        approvalColor === 'green' ? 'bg-green-100' :
                        approvalColor === 'blue' ? 'bg-blue-100' :
                        approvalColor === 'orange' ? 'bg-orange-100' : 'bg-red-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          approvalColor === 'green' ? 'text-green-600' :
                          approvalColor === 'blue' ? 'text-blue-600' :
                          approvalColor === 'orange' ? 'text-orange-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">{loan.name}</h4>
                        <div className="text-xs text-muted-foreground">{loan.provider}</div>
                        <Badge variant="outline" className="mt-1 text-xs">{loan.type}</Badge>
                      </div>
                      <Badge className={
                        approvalColor === 'green' ? 'bg-green-600' :
                        approvalColor === 'blue' ? 'bg-blue-600' :
                        approvalColor === 'orange' ? 'bg-orange-600' : 'bg-red-600'
                      }>
                        {loan.approvalLikelihood}%
                      </Badge>
                    </div>

                    {/* Key Terms */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span>{loan.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interest Rate:</span>
                        <span>{loan.interestRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Term:</span>
                        <span>{loan.term}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Funding Time:</span>
                        <span className="font-medium text-blue-600">{loan.timeToFunding}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Pros & Cons */}
                  <div>
                    <div className="mb-3">
                      <div className="text-xs text-muted-foreground mb-2">✓ Benefits:</div>
                      <ul className="space-y-1 text-xs">
                        {loan.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground mb-2">✗ Drawbacks:</div>
                      <ul className="space-y-1 text-xs">
                        {loan.drawbacks.slice(0, 2).map((drawback, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <XCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{drawback}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right: Eligibility & Action */}
                  <div>
                    <div className="mb-3">
                      <div className="text-xs text-muted-foreground mb-2">Best For:</div>
                      <div className="flex flex-wrap gap-1">
                        {loan.bestFor.slice(0, 3).map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs mb-3 p-2 bg-white rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Min Revenue:</span>
                        <span className={annualRevenue >= loan.eligibility.minRevenue ? 'text-green-600' : 'text-red-600'}>
                          ${(loan.eligibility.minRevenue / 1000).toFixed(0)}K
                          {annualRevenue >= loan.eligibility.minRevenue ? ' ✓' : ' ✗'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Min Score:</span>
                        <span className={estimatedCreditScore >= loan.eligibility.minCreditScore ? 'text-green-600' : 'text-red-600'}>
                          {loan.eligibility.minCreditScore}
                          {estimatedCreditScore >= loan.eligibility.minCreditScore ? ' ✓' : ' ✗'}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${
                        loan.approvalLikelihood >= 65 ? 'bg-green-600 hover:bg-green-700' :
                        loan.approvalLikelihood >= 45 ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-gray-400'
                      }`}
                      disabled={loan.approvalLikelihood < 25}
                    >
                      {loan.approvalLikelihood >= 65 ? '✨ Highly Recommended' :
                       loan.approvalLikelihood >= 45 ? 'Good Option' :
                       loan.approvalLikelihood >= 25 ? 'Consider' :
                       'Not Recommended'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* COMPARISON GUIDE */}
      <Card className="p-4 bg-indigo-50 border-indigo-200">
        <h4 className="text-sm mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          Product Comparison at a Glance
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Credit Cards Comparison */}
          <div className="bg-white p-3 rounded">
            <strong className="text-sm mb-3 block">Best Credit Cards by Category</strong>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  <strong>Best Cashback:</strong>
                </div>
                <div className="text-muted-foreground">{sortedCards.find(c => c.type === "Cashback")?.name}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-3 h-3 text-blue-600" />
                  <strong>Best Rewards:</strong>
                </div>
                <div className="text-muted-foreground">{sortedCards.find(c => c.type === "Rewards")?.name}</div>
              </div>
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3 h-3 text-purple-600" />
                  <strong>Best for New Businesses:</strong>
                </div>
                <div className="text-muted-foreground">{sortedCards.find(c => c.eligibility.minYearsInBusiness < 1)?.name}</div>
              </div>
            </div>
          </div>

          {/* Loans Comparison */}
          <div className="bg-white p-3 rounded">
            <strong className="text-sm mb-3 block">Best Loans by Need</strong>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3 h-3 text-green-600" />
                  <strong>Fastest Funding:</strong>
                </div>
                <div className="text-muted-foreground">{sortedLoans.find(l => l.timeToFunding.includes("Same"))?.name || "Merchant Cash Advance"}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="w-3 h-3 text-blue-600" />
                  <strong>Lowest Rates:</strong>
                </div>
                <div className="text-muted-foreground">{sortedLoans.find(l => l.type === "SBA Loan")?.name}</div>
              </div>
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <PiggyBank className="w-3 h-3 text-purple-600" />
                  <strong>Most Flexible:</strong>
                </div>
                <div className="text-muted-foreground">{sortedLoans.find(l => l.type === "Line of Credit")?.name}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* CONCIERGE TIPS */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <h4 className="text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Your Financial Concierge Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">💳 Credit Card Strategy</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Apply for {topCards.length > 0 ? topCards[0].name : 'highest approval match'} first</li>
              <li>• Earn ${(annualCashback / 1000).toFixed(0)}K+ annually in rewards</li>
              <li>• Use 0% intro APR for large purchases</li>
              <li>• Get employee cards for better tracking</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">💰 Financing Best Practices</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Avoid merchant cash advances (40-200% APR)</li>
              <li>• SBA loans best for major investments</li>
              <li>• Use LOC for cash flow gaps</li>
              <li>• Compare at least 3 lenders</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">📈 Improve Your Profile</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Build business credit separate from personal</li>
              <li>• Keep utilization below 30%</li>
              <li>• Pay invoices on time for 6+ months</li>
              <li>• Increase credit score to unlock better terms</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* DISCLAIMER */}
      <Card className="p-3 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-2 text-xs">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-900">
            <strong>Disclaimer:</strong> These recommendations are based on estimated creditworthiness from your financial data. 
            Actual approval and terms depend on full application review, credit history, and lender criteria. 
            Always compare multiple offers and read terms carefully before applying. Not sponsored by any financial institution.
          </p>
        </div>
      </Card>
    </div>
  );
}