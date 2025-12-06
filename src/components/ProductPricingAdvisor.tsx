import { Card } from "./ui/card";
import { Product } from "../types/financial";
import { 
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  BarChart3,
  Percent,
  Package,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  MinusCircle,
  Calculator,
  Brain,
  TrendingUpIcon
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  ComposedChart,
  Cell,
  Area,
  ReferenceLine,
  ScatterChart,
  Scatter
} from "recharts";
import { useState } from "react";
import { safeDivide, safePercentage, safeNumber } from "../lib/mathUtils";

interface ProductPricingAdvisorProps {
  products: Product[];
}

interface MarketComparable {
  productName: string;
  price: number;
  volume: number;
  marketShare: number;
  pricePosition: "Premium" | "Mid-Market" | "Value";
}

interface PriceScenario {
  priceChange: number; // percentage
  newPrice: number;
  volumeChange: number; // percentage (negative = volume drops)
  newVolume: number;
  revenueChange: number; // dollar amount
  newRevenue: number;
  profitChange: number;
  newProfit: number;
  recommendation: "Highly Recommended" | "Recommended" | "Neutral" | "Not Recommended" | "Risky";
}

export function ProductPricingAdvisor({ products }: ProductPricingAdvisorProps) {
  
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);
  const [priceAdjustment, setPriceAdjustment] = useState<number>(0);

  // Get selected product
  const selectedProduct = products[selectedProductIndex] || products[0];

  // Calculate derived metrics with safe division
  const currentPrice = safeDivide(selectedProduct.revenue, selectedProduct.units, 100);
  const costPerUnit = safeDivide(selectedProduct.cogs, selectedProduct.units, 50);
  const profitPerUnit = currentPrice - costPerUnit;
  const marginPercent = safePercentage(profitPerUnit, currentPrice, 30);
  const totalProfit = selectedProduct.revenue - selectedProduct.cogs;

  // Generate market comparables based on the product
  const generateMarketComparables = (): MarketComparable[] => {
    const basePrice = currentPrice;
    const baseVolume = selectedProduct.units;
    
    return [
      {
        productName: "Your Product",
        price: currentPrice,
        volume: selectedProduct.units,
        marketShare: 8.5,
        pricePosition: "Mid-Market"
      },
      {
        productName: "Competitor A - Premium",
        price: basePrice * 1.28,
        volume: baseVolume * 0.62,
        marketShare: 12.3,
        pricePosition: "Premium"
      },
      {
        productName: "Competitor B - Leader",
        price: basePrice * 1.08,
        volume: baseVolume * 1.45,
        marketShare: 22.1,
        pricePosition: "Mid-Market"
      },
      {
        productName: "Competitor C - Value",
        price: basePrice * 0.85,
        volume: baseVolume * 1.82,
        marketShare: 18.7,
        pricePosition: "Value"
      },
      {
        productName: "Competitor D - Direct",
        price: basePrice * 0.97,
        volume: baseVolume * 1.12,
        marketShare: 14.2,
        pricePosition: "Mid-Market"
      },
      {
        productName: "Industry Average",
        price: basePrice * 0.98,
        volume: baseVolume * 1.35,
        marketShare: 8.4,
        pricePosition: "Mid-Market"
      }
    ];
  };

  const marketComparables = generateMarketComparables();

  // Calculate price elasticity
  const calculateElasticity = (): number => {
    // Higher margin products tend to be more elastic
    const marginFactor = marginPercent / 100;
    
    let elasticity = -2.0;
    
    if (marginFactor > 0.4) elasticity = -2.8; // Premium/luxury goods
    else if (marginFactor > 0.3) elasticity = -2.2;
    else if (marginFactor < 0.15) elasticity = -1.5; // Commodities less elastic
    
    return elasticity;
  };

  const elasticity = calculateElasticity();

  // Generate price scenarios
  const generateScenarios = (): PriceScenario[] => {
    const scenarios: PriceScenario[] = [];
    const priceChanges = [-10, -5, -2, 0, 2, 5, 10, 15, 20];
    
    const currentRevenue = selectedProduct.revenue;
    const currentCost = selectedProduct.cogs;
    const currentProfit = totalProfit;
    
    priceChanges.forEach(change => {
      const newPrice = currentPrice * (1 + change / 100);
      
      // Calculate volume change using price elasticity
      const volumeChangePercent = elasticity * change;
      const newVolume = selectedProduct.units * (1 + volumeChangePercent / 100);
      
      const newRevenue = newPrice * newVolume;
      const newCost = costPerUnit * newVolume;
      const newProfit = newRevenue - newCost;
      
      const revenueChange = newRevenue - currentRevenue;
      const profitChange = newProfit - currentProfit;
      
      // Determine recommendation
      let recommendation: PriceScenario["recommendation"];
      
      if (profitChange > currentProfit * 0.15) recommendation = "Highly Recommended";
      else if (profitChange > currentProfit * 0.05) recommendation = "Recommended";
      else if (profitChange > -currentProfit * 0.03) recommendation = "Neutral";
      else if (profitChange > -currentProfit * 0.10) recommendation = "Not Recommended";
      else recommendation = "Risky";
      
      scenarios.push({
        priceChange: change,
        newPrice,
        volumeChange: volumeChangePercent,
        newVolume: Math.max(0, newVolume),
        revenueChange,
        newRevenue,
        profitChange,
        newProfit,
        recommendation
      });
    });
    
    return scenarios;
  };

  const scenarios = generateScenarios();

  // Find optimal price
  const optimalScenario = [...scenarios].sort((a, b) => b.profitChange - a.profitChange)[0];

  // Calculate current price position
  const avgMarketPrice = safeDivide(
    marketComparables.reduce((sum, c) => sum + c.price, 0),
    marketComparables.length,
    currentPrice
  );
  const priceVsMarket = safePercentage(currentPrice - avgMarketPrice, avgMarketPrice, 0);

  const currentPosition = currentPrice > avgMarketPrice * 1.15 ? "Premium" :
                          currentPrice > avgMarketPrice * 0.85 ? "Mid-Market" : "Value";

  // Get selected scenario based on slider
  const currentScenario = scenarios.find(s => s.priceChange === 0) || scenarios[3];
  const selectedScenario = scenarios.find(s => 
    Math.abs(s.priceChange - priceAdjustment) < 0.1
  ) || currentScenario;

  // Regional pricing data
  const regionalPricing = [
    { region: "Midwest", avgPrice: currentPrice * 0.98, variance: "+/- 8%", opportunity: "Medium" },
    { region: "Northeast", avgPrice: currentPrice * 1.15, variance: "+/- 12%", opportunity: "High" },
    { region: "South", avgPrice: currentPrice * 0.92, variance: "+/- 6%", opportunity: "Low" },
    { region: "West", avgPrice: currentPrice * 1.22, variance: "+/- 15%", opportunity: "Very High" },
  ];

  // Customer segments
  const customerSegments = [
    { segment: "Premium Buyers", percentage: 15, sensitivity: "Low", maxPriceIncrease: "+35%" },
    { segment: "Quality-Conscious", percentage: 35, sensitivity: "Medium", maxPriceIncrease: "+10%" },
    { segment: "Price-Aware", percentage: 40, sensitivity: "High", maxPriceIncrease: "-5%" },
    { segment: "Budget-Focused", percentage: 10, sensitivity: "Very High", maxPriceIncrease: "-25%" },
  ];

  // Competitive analysis data
  const competitiveAnalysis = products.map(p => {
    const price = safeDivide(p.revenue, p.units, 0);
    const cost = safeDivide(p.cogs, p.units, 0);
    const margin = safePercentage(price - cost, price, 0);
    
    return {
      name: p.name,
      price,
      volume: p.units,
      margin,
      revenue: p.revenue
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-indigo-600" />
          <div>
            <h2>AI Product Pricing Advisor</h2>
            <p className="text-muted-foreground">
              Market intelligence and pricing optimization powered by advanced analytics
            </p>
          </div>
        </div>
      </div>

      {/* Product Selector */}
      <Card className="p-4">
        <h3 className="mb-3">Select Product to Analyze</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {products.map((product, index) => {
            const price = safeDivide(product.revenue, product.units, 0);
            return (
              <Button
                key={product.id}
                variant={selectedProductIndex === index ? "default" : "outline"}
                onClick={() => {
                  setSelectedProductIndex(index);
                  setPriceAdjustment(0);
                }}
                className="text-xs h-auto py-3"
              >
                <div className="text-left w-full">
                  <div className="truncate">{product.name}</div>
                  <div className="text-xs opacity-80">${price.toFixed(2)}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* AI INSIGHTS BANNER */}
      <Card className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-3">🤖 AI-Powered Pricing Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm text-white/90 mb-1">Optimal Price Point</div>
                <div className="text-3xl mb-1">
                  ${optimalScenario.newPrice.toFixed(2)}
                </div>
                <div className="text-xs text-white/90">
                  {optimalScenario.priceChange > 0 ? '+' : ''}{optimalScenario.priceChange}% from current
                </div>
                <Badge className="mt-2 bg-white text-indigo-600">
                  +${(optimalScenario.profitChange / 1000).toFixed(0)}K profit
                </Badge>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm text-white/90 mb-1">Price Position</div>
                <div className="text-3xl mb-1">
                  {priceVsMarket > 0 ? '+' : ''}{priceVsMarket.toFixed(0)}%
                </div>
                <div className="text-xs text-white/90">vs market average</div>
                <Badge className="mt-2 bg-white text-purple-600">
                  {currentPosition} Position
                </Badge>
              </div>

              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm text-white/90 mb-1">Price Elasticity</div>
                <div className="text-3xl mb-1">
                  {elasticity.toFixed(1)}
                </div>
                <div className="text-xs text-white/90">
                  1% price ↑ = {Math.abs(elasticity).toFixed(1)}% volume ↓
                </div>
                <Badge className="mt-2 bg-white text-pink-600">
                  {Math.abs(elasticity) > 2.5 ? "Highly Elastic" : 
                   Math.abs(elasticity) > 1.8 ? "Elastic" : "Moderate"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* CURRENT METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Current Price</span>
          </div>
          <div className="text-3xl mb-1">${currentPrice.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">per unit</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Package className="w-4 h-4" />
            <span className="text-sm">Units Sold</span>
          </div>
          <div className="text-3xl mb-1">{selectedProduct.units.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">total volume</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Percent className="w-4 h-4" />
            <span className="text-sm">Profit Margin</span>
          </div>
          <div className="text-3xl mb-1">{marginPercent.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">${profitPerUnit.toFixed(2)} per unit</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Total Profit</span>
          </div>
          <div className="text-3xl mb-1">${(totalProfit / 1000).toFixed(0)}K</div>
          <div className="text-xs text-muted-foreground">annual</div>
        </Card>
      </div>

      {/* WHAT-IF SCENARIO SIMULATOR */}
      <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-indigo-900 mb-1">💡 What-If Pricing Simulator</h3>
            <p className="text-sm text-muted-foreground">
              See instant impact of price changes on revenue and profit
            </p>
          </div>
        </div>

        {/* Price Adjustment Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm">Adjust Price:</label>
            <div className="flex items-center gap-3">
              <Badge variant={priceAdjustment > 0 ? "default" : priceAdjustment < 0 ? "destructive" : "outline"}>
                {priceAdjustment > 0 ? '+' : ''}{priceAdjustment}%
              </Badge>
              <div className="text-sm">
                ${currentPrice.toFixed(2)} → ${selectedScenario.newPrice.toFixed(2)}
              </div>
            </div>
          </div>
          
          <Slider
            value={[priceAdjustment]}
            onValueChange={(values) => setPriceAdjustment(values[0])}
            min={-10}
            max={20}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>-10%</span>
            <span>0%</span>
            <span>+20%</span>
          </div>
        </div>

        {/* Impact Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Volume Impact */}
          <Card className="p-4 border-2">
            <div className="text-xs text-muted-foreground mb-2">Volume Impact</div>
            <div className="flex items-center gap-2">
              {selectedScenario.volumeChange < 0 ? (
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              ) : selectedScenario.volumeChange > 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <MinusCircle className="w-5 h-5 text-gray-600" />
              )}
              <div className={`text-2xl ${
                selectedScenario.volumeChange < 0 ? 'text-red-600' : 
                selectedScenario.volumeChange > 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {selectedScenario.volumeChange > 0 ? '+' : ''}{selectedScenario.volumeChange.toFixed(1)}%
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {selectedProduct.units.toLocaleString()} → {Math.round(selectedScenario.newVolume).toLocaleString()} units
            </div>
          </Card>

          {/* Revenue Impact */}
          <Card className="p-4 border-2">
            <div className="text-xs text-muted-foreground mb-2">Revenue Impact</div>
            <div className="flex items-center gap-2">
              {selectedScenario.revenueChange < 0 ? (
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              ) : selectedScenario.revenueChange > 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <MinusCircle className="w-5 h-5 text-gray-600" />
              )}
              <div className={`text-2xl ${
                selectedScenario.revenueChange < 0 ? 'text-red-600' : 
                selectedScenario.revenueChange > 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {selectedScenario.revenueChange > 0 ? '+' : ''}${(selectedScenario.revenueChange / 1000).toFixed(0)}K
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              New revenue: ${(selectedScenario.newRevenue / 1000).toFixed(0)}K
            </div>
          </Card>

          {/* Profit Impact */}
          <Card className="p-4 border-2">
            <div className="text-xs text-muted-foreground mb-2">Profit Impact</div>
            <div className="flex items-center gap-2">
              {selectedScenario.profitChange < 0 ? (
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              ) : selectedScenario.profitChange > 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <MinusCircle className="w-5 h-5 text-gray-600" />
              )}
              <div className={`text-2xl ${
                selectedScenario.profitChange < 0 ? 'text-red-600' : 
                selectedScenario.profitChange > 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {selectedScenario.profitChange > 0 ? '+' : ''}${(selectedScenario.profitChange / 1000).toFixed(0)}K
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              New profit: ${(selectedScenario.newProfit / 1000).toFixed(0)}K
            </div>
          </Card>

          {/* Recommendation */}
          <Card className={`p-4 border-2 ${
            selectedScenario.recommendation === "Highly Recommended" ? 'bg-green-50 border-green-300' :
            selectedScenario.recommendation === "Recommended" ? 'bg-blue-50 border-blue-300' :
            selectedScenario.recommendation === "Neutral" ? 'bg-gray-50 border-gray-300' :
            selectedScenario.recommendation === "Not Recommended" ? 'bg-orange-50 border-orange-300' :
            'bg-red-50 border-red-300'
          }`}>
            <div className="text-xs text-muted-foreground mb-2">Recommendation</div>
            <div className="flex items-center gap-2 mb-2">
              {selectedScenario.recommendation === "Highly Recommended" ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : selectedScenario.recommendation === "Risky" ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : (
                <Info className="w-5 h-5 text-blue-600" />
              )}
              <Badge className={
                selectedScenario.recommendation === "Highly Recommended" ? 'bg-green-600' :
                selectedScenario.recommendation === "Recommended" ? 'bg-blue-600' :
                selectedScenario.recommendation === "Neutral" ? 'bg-gray-600' :
                selectedScenario.recommendation === "Not Recommended" ? 'bg-orange-600' :
                'bg-red-600'
              }>
                {selectedScenario.recommendation}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedScenario.recommendation === "Highly Recommended" && "Strong profit increase"}
              {selectedScenario.recommendation === "Recommended" && "Good profit improvement"}
              {selectedScenario.recommendation === "Neutral" && "Minimal impact"}
              {selectedScenario.recommendation === "Not Recommended" && "Hurts profitability"}
              {selectedScenario.recommendation === "Risky" && "Significant profit loss"}
            </div>
          </Card>
        </div>

        {/* Quick Insights */}
        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-indigo-200">
          <p className="text-sm">
            <strong>💡 Quick Insight:</strong>{' '}
            {priceAdjustment === 0 && "Adjust the slider to see impact of price changes."}
            {priceAdjustment > 0 && selectedScenario.profitChange > 0 && 
              `A ${priceAdjustment}% price increase could add $${(selectedScenario.profitChange / 1000).toFixed(0)}K in profit despite losing ${Math.abs(selectedScenario.volumeChange).toFixed(1)}% volume.`}
            {priceAdjustment > 0 && selectedScenario.profitChange <= 0 && 
              `A ${priceAdjustment}% price increase is too aggressive - you'll lose ${Math.abs(selectedScenario.volumeChange).toFixed(1)}% volume and hurt profits.`}
            {priceAdjustment < 0 && selectedScenario.profitChange > 0 && 
              `Lowering price by ${Math.abs(priceAdjustment)}% could boost volume by ${Math.abs(selectedScenario.volumeChange).toFixed(1)}% and increase profit.`}
            {priceAdjustment < 0 && selectedScenario.profitChange <= 0 && 
              `Lowering price by ${Math.abs(priceAdjustment)}% won't generate enough volume to offset margin loss.`}
          </p>
        </div>
      </Card>

      {/* MARKET COMPARISON */}
      <Card className="p-4">
        <h3 className="mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Market Pricing Comparison
        </h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={marketComparables}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value.toFixed(0)}`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === "Market Share") return `${value.toFixed(1)}%`;
                if (name === "Price") return `$${value.toFixed(2)}`;
                return value.toLocaleString();
              }}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            
            <Bar yAxisId="left" dataKey="price" fill="#3b82f6" name="Price">
              {marketComparables.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.productName === "Your Product" ? "#10b981" : "#3b82f6"} 
                />
              ))}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="marketShare" stroke="#f59e0b" strokeWidth={2} name="Market Share" />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Competitive Position */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-600" />
              <strong className="text-sm">Your Position</strong>
            </div>
            <div className="text-2xl text-green-600 mb-1">${currentPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              {currentPosition} pricing • {priceVsMarket > 0 ? '+' : ''}{priceVsMarket.toFixed(0)}% vs market
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <strong className="text-sm">Market Average</strong>
            </div>
            <div className="text-2xl text-blue-600 mb-1">${avgMarketPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              Across {marketComparables.length} competitors
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <strong className="text-sm">Opportunity</strong>
            </div>
            <div className="text-2xl text-purple-600 mb-1">
              {optimalScenario.priceChange > 0 ? '+' : ''}{optimalScenario.priceChange}%
            </div>
            <div className="text-xs text-muted-foreground">
              Recommended price adjustment
            </div>
          </div>
        </div>
      </Card>

      {/* ALL PRODUCTS COMPARISON */}
      <Card className="p-4">
        <h3 className="mb-4">📊 Product Portfolio Pricing</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="price" 
              name="Price" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              label={{ value: 'Price per Unit', position: 'bottom', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="margin" 
              name="Margin" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${value}%`}
              label={{ value: 'Profit Margin %', angle: -90, position: 'left', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg text-sm">
                      <p className="font-semibold">{data.name}</p>
                      <p>Price: ${data.price.toFixed(2)}</p>
                      <p>Margin: {data.margin.toFixed(1)}%</p>
                      <p>Volume: {data.volume.toLocaleString()} units</p>
                      <p>Revenue: ${(data.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={competitiveAnalysis} fill="#8884d8">
              {competitiveAnalysis.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === selectedProduct.name ? "#10b981" : "#3b82f6"}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>💡 Portfolio Insight:</strong> Products in the upper-right quadrant (high price, high margin) are your premium offerings. 
            Lower-left products may need price optimization or cost reduction.
          </p>
        </div>
      </Card>

      {/* SCENARIO ANALYSIS TABLE */}
      <Card className="p-4">
        <h3 className="mb-4">📊 All Pricing Scenarios</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Price Change</th>
                <th className="text-right p-2">New Price</th>
                <th className="text-right p-2">Volume Change</th>
                <th className="text-right p-2">Revenue Impact</th>
                <th className="text-right p-2">Profit Impact</th>
                <th className="text-center p-2">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, idx) => {
                const isOptimal = scenario.priceChange === optimalScenario.priceChange;
                const isCurrent = scenario.priceChange === 0;
                
                return (
                  <tr 
                    key={idx} 
                    className={`border-t hover:bg-gray-50 ${
                      isOptimal ? 'bg-green-50 border-green-200' :
                      isCurrent ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {scenario.priceChange > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        ) : scenario.priceChange < 0 ? (
                          <ArrowDownRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <MinusCircle className="w-4 h-4 text-gray-600" />
                        )}
                        <span className={isOptimal ? 'font-bold text-green-700' : isCurrent ? 'font-bold text-blue-700' : ''}>
                          {scenario.priceChange > 0 ? '+' : ''}{scenario.priceChange}%
                          {isOptimal && ' ⭐'}
                          {isCurrent && ' (Current)'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-right font-mono">${scenario.newPrice.toFixed(2)}</td>
                    <td className={`p-2 text-right font-mono ${
                      scenario.volumeChange < 0 ? 'text-red-600' : 
                      scenario.volumeChange > 0 ? 'text-green-600' : ''
                    }`}>
                      {scenario.volumeChange > 0 ? '+' : ''}{scenario.volumeChange.toFixed(1)}%
                    </td>
                    <td className={`p-2 text-right font-mono ${
                      scenario.revenueChange < 0 ? 'text-red-600' : 
                      scenario.revenueChange > 0 ? 'text-green-600' : ''
                    }`}>
                      {scenario.revenueChange > 0 ? '+' : ''}${(scenario.revenueChange / 1000).toFixed(0)}K
                    </td>
                    <td className={`p-2 text-right font-mono ${
                      scenario.profitChange < 0 ? 'text-red-600' : 
                      scenario.profitChange > 0 ? 'text-green-600' : ''
                    }`}>
                      {scenario.profitChange > 0 ? '+' : ''}${(scenario.profitChange / 1000).toFixed(0)}K
                    </td>
                    <td className="p-2 text-center">
                      <Badge className={`text-xs ${
                        scenario.recommendation === "Highly Recommended" ? 'bg-green-600' :
                        scenario.recommendation === "Recommended" ? 'bg-blue-600' :
                        scenario.recommendation === "Neutral" ? 'bg-gray-600' :
                        scenario.recommendation === "Not Recommended" ? 'bg-orange-600' :
                        'bg-red-600'
                      }`}>
                        {scenario.recommendation === "Highly Recommended" ? "Highly Rec." :
                         scenario.recommendation === "Recommended" ? "Rec." :
                         scenario.recommendation === "Not Recommended" ? "Not Rec." :
                         scenario.recommendation}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* REGIONAL PRICING */}
      <Card className="p-4">
        <h3 className="mb-4">🗺️ Regional Pricing Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regionalPricing.map((region, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">{region.region}</div>
              <div className="text-2xl mb-2">${region.avgPrice.toFixed(2)}</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Variance:</span>
                  <span>{region.variance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opportunity:</span>
                  <Badge variant={
                    region.opportunity === "Very High" ? "default" :
                    region.opportunity === "High" ? "default" :
                    region.opportunity === "Medium" ? "secondary" : "outline"
                  } className="text-xs">
                    {region.opportunity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CUSTOMER SEGMENTS */}
      <Card className="p-4">
        <h3 className="mb-4">👥 Customer Price Sensitivity</h3>
        <div className="space-y-3">
          {customerSegments.map((segment, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{segment.segment}</div>
                  <div className="text-sm text-muted-foreground">
                    {segment.percentage}% of customer base
                  </div>
                </div>
                <Badge variant={
                  segment.sensitivity === "Low" ? "default" :
                  segment.sensitivity === "Medium" ? "secondary" :
                  segment.sensitivity === "High" ? "outline" : "destructive"
                }>
                  {segment.sensitivity} Sensitivity
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Max price: {segment.maxPriceIncrease}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ACTION ITEMS */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <h3 className="mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600" />
          Recommended Actions
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Implement Optimal Pricing</p>
              <p className="text-sm text-muted-foreground">
                Adjust {selectedProduct.name} price to ${optimalScenario.newPrice.toFixed(2)} 
                ({optimalScenario.priceChange > 0 ? '+' : ''}{optimalScenario.priceChange}%) 
                to maximize profit by ${(optimalScenario.profitChange / 1000).toFixed(0)}K
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Monitor Volume Impact</p>
              <p className="text-sm text-muted-foreground">
                Expected volume change: {optimalScenario.volumeChange > 0 ? '+' : ''}{optimalScenario.volumeChange.toFixed(1)}%. 
                Track actual performance weekly for first month.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Test Regional Variations</p>
              <p className="text-sm text-muted-foreground">
                Consider premium pricing in Northeast and West regions where market can support higher prices
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
