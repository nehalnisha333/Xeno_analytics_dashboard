import { Card } from "./ui/card";
import { Product, Customer } from "../types/financial";
import { 
  AlertTriangle,
  TrendingUp,
  Users,
  Building2,
  Shield,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  Zap,
  Network,
  PieChart as PieChartIcon,
  BarChart3,
  Package,
  DollarSign,
  XCircle,
  Award,
  TrendingDown
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
  Sankey,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { safeDivide, safePercentage, safeNumber } from "../lib/mathUtils";

interface VendorClientDependencyMapProps {
  products: Product[];
  customers: Customer[];
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  monthlyPurchases: number;
  paymentTerms: number;
  reliability: "High" | "Medium" | "Low";
}

export function VendorClientDependencyMap({ products, customers }: VendorClientDependencyMapProps) {
  
  // Mock vendor data (would come from purchase register)
  const vendors: Vendor[] = [
    { id: "V001", name: "Global Parts Supplier", category: "Raw Materials", monthlyPurchases: 1250000, paymentTerms: 30, reliability: "High" },
    { id: "V002", name: "TechCore Components", category: "Components", monthlyPurchases: 850000, paymentTerms: 45, reliability: "High" },
    { id: "V003", name: "Premium Logistics Co.", category: "Logistics", monthlyPurchases: 420000, paymentTerms: 15, reliability: "Medium" },
    { id: "V004", name: "PackagePro Ltd.", category: "Packaging", monthlyPurchases: 280000, paymentTerms: 30, reliability: "High" },
    { id: "V005", name: "Industrial Supplies Inc.", category: "Supplies", monthlyPurchases: 195000, paymentTerms: 30, reliability: "Medium" },
    { id: "V006", name: "Quality Materials Co.", category: "Raw Materials", monthlyPurchases: 165000, paymentTerms: 60, reliability: "Low" },
    { id: "V007", name: "Swift Transport", category: "Logistics", monthlyPurchases: 145000, paymentTerms: 15, reliability: "High" },
    { id: "V008", name: "Office Essentials", category: "Office", monthlyPurchases: 85000, paymentTerms: 30, reliability: "High" },
    { id: "V009", name: "Energy Solutions", category: "Utilities", monthlyPurchases: 120000, paymentTerms: 30, reliability: "High" },
    { id: "V010", name: "Consulting Partners", category: "Services", monthlyPurchases: 95000, paymentTerms: 30, reliability: "Medium" },
  ];

  // Calculate totals with safe math - use 'revenue' not 'totalRevenue'
  const totalRevenue = customers.reduce((sum, c) => sum + safeNumber(c.revenue, 0), 0);
  const totalPurchases = vendors.reduce((sum, v) => sum + safeNumber(v.monthlyPurchases, 0), 0);

  // Sort by revenue/purchases
  const sortedCustomers = [...customers].sort((a, b) => safeNumber(b.revenue, 0) - safeNumber(a.revenue, 0));
  const sortedVendors = [...vendors].sort((a, b) => safeNumber(b.monthlyPurchases, 0) - safeNumber(a.monthlyPurchases, 0));

  // CONCENTRATION ANALYSIS
  
  // Client concentration - use 'revenue' field
  const top1ClientRevenue = safeNumber(sortedCustomers[0]?.revenue, 0);
  const top2ClientsRevenue = sortedCustomers.slice(0, 2).reduce((sum, c) => sum + safeNumber(c.revenue, 0), 0);
  const top3ClientsRevenue = sortedCustomers.slice(0, 3).reduce((sum, c) => sum + safeNumber(c.revenue, 0), 0);
  const top5ClientsRevenue = sortedCustomers.slice(0, 5).reduce((sum, c) => sum + safeNumber(c.revenue, 0), 0);

  const top1ClientPercent = safePercentage(top1ClientRevenue, totalRevenue, 0);
  const top2ClientsPercent = safePercentage(top2ClientsRevenue, totalRevenue, 0);
  const top3ClientsPercent = safePercentage(top3ClientsRevenue, totalRevenue, 0);
  const top5ClientsPercent = safePercentage(top5ClientsRevenue, totalRevenue, 0);

  // Vendor concentration
  const top1VendorPurchases = safeNumber(sortedVendors[0]?.monthlyPurchases, 0);
  const top2VendorsPurchases = sortedVendors.slice(0, 2).reduce((sum, v) => sum + safeNumber(v.monthlyPurchases, 0), 0);
  const top3VendorsPurchases = sortedVendors.slice(0, 3).reduce((sum, v) => sum + safeNumber(v.monthlyPurchases, 0), 0);
  const top5VendorsPurchases = sortedVendors.slice(0, 5).reduce((sum, v) => sum + safeNumber(v.monthlyPurchases, 0), 0);

  const top1VendorPercent = safePercentage(top1VendorPurchases, totalPurchases, 0);
  const top2VendorsPercent = safePercentage(top2VendorsPurchases, totalPurchases, 0);
  const top3VendorsPercent = safePercentage(top3VendorsPurchases, totalPurchases, 0);
  const top5VendorsPercent = safePercentage(top5VendorsPurchases, totalPurchases, 0);

  // RISK ASSESSMENT
  const assessConcentrationRisk = (topNPercent: number, n: number) => {
    // Critical: Top N accounts for >70%
    // High: Top N accounts for 50-70%
    // Medium: Top N accounts for 30-50%
    // Low: Top N accounts for <30%
    
    const threshold = n === 1 ? 40 : n === 2 ? 60 : n === 3 ? 70 : 80;
    
    if (topNPercent > threshold) return { level: "Critical", color: "red", score: 0 };
    if (topNPercent > threshold * 0.8) return { level: "High", color: "orange", score: 30 };
    if (topNPercent > threshold * 0.6) return { level: "Medium", color: "yellow", score: 60 };
    return { level: "Low", color: "green", score: 90 };
  };

  const clientRisk = assessConcentrationRisk(top2ClientsPercent, 2);
  const vendorRisk = assessConcentrationRisk(top2VendorsPercent, 2);

  // DIVERSIFICATION SCORE (0-100)
  const calculateDiversificationScore = () => {
    let score = 0;

    // Factor 1: Client concentration (40 points)
    // Lower concentration = higher score
    const clientConcentration = 100 - top3ClientsPercent;
    score += (clientConcentration / 100) * 40;

    // Factor 2: Vendor concentration (40 points)
    const vendorConcentration = 100 - top3VendorsPercent;
    score += (vendorConcentration / 100) * 40;

    // Factor 3: Number of active relationships (10 points)
    const activeClients = customers.length;
    const activeVendors = vendors.length;
    const relationshipScore = Math.min(10, (activeClients + activeVendors) / 3);
    score += relationshipScore;

    // Factor 4: Geographic/category diversification (10 points)
    const vendorCategories = new Set(vendors.map(v => v.category)).size;
    const categoryScore = Math.min(10, vendorCategories * 1.5);
    score += categoryScore;

    return Math.min(100, Math.max(0, score));
  };

  const diversificationScore = calculateDiversificationScore();
  const scoreGrade = diversificationScore >= 75 ? "Excellent" : 
                     diversificationScore >= 60 ? "Good" : 
                     diversificationScore >= 40 ? "Fair" : "High Risk";

  const scoreColor = diversificationScore >= 75 ? "green" : 
                     diversificationScore >= 60 ? "blue" : 
                     diversificationScore >= 40 ? "orange" : "red";

  // Get full class names based on color (for Tailwind)
  const getScoreColorClass = (type: 'text' | 'bg' | 'border') => {
    const baseClass = type === 'text' ? 'text-' : type === 'bg' ? 'bg-' : 'border-';
    if (scoreColor === 'green') return `${baseClass}green-600`;
    if (scoreColor === 'blue') return `${baseClass}blue-600`;
    if (scoreColor === 'orange') return `${baseClass}orange-600`;
    return `${baseClass}red-600`;
  };

  const getRiskColorClass = (color: string, type: 'text' | 'bg' | 'border') => {
    const baseClass = type === 'text' ? 'text-' : type === 'bg' ? 'bg-' : 'border-';
    if (color === 'green') return `${baseClass}green-600`;
    if (color === 'blue') return `${baseClass}blue-600`;
    if (color === 'orange') return `${baseClass}orange-600`;
    if (color === 'yellow') return `${baseClass}yellow-600`;
    return `${baseClass}red-600`;
  };

  // Chart data
  const clientPieData = [
    { name: sortedCustomers[0]?.name || "Client 1", value: top1ClientRevenue },
    { name: sortedCustomers[1]?.name || "Client 2", value: (sortedCustomers[1]?.revenue || 0) },
    { name: sortedCustomers[2]?.name || "Client 3", value: (sortedCustomers[2]?.revenue || 0) },
    { name: "Other Clients", value: totalRevenue - top3ClientsRevenue },
  ];

  const vendorPieData = [
    { name: sortedVendors[0]?.name || "Vendor 1", value: top1VendorPurchases },
    { name: sortedVendors[1]?.name || "Vendor 2", value: (sortedVendors[1]?.monthlyPurchases || 0) },
    { name: sortedVendors[2]?.name || "Vendor 3", value: (sortedVendors[2]?.monthlyPurchases || 0) },
    { name: "Other Vendors", value: totalPurchases - top3VendorsPurchases },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#f97316", "#10b981"];

  // Concentration comparison data
  const concentrationData = [
    { metric: "Top 1", client: top1ClientPercent, vendor: top1VendorPercent },
    { metric: "Top 2", client: top2ClientsPercent, vendor: top2VendorsPercent },
    { metric: "Top 3", client: top3ClientsPercent, vendor: top3VendorsPercent },
    { metric: "Top 5", client: top5ClientsPercent, vendor: top5VendorsPercent },
  ];

  // Risk radar
  const riskRadarData = [
    { dimension: "Client Concentration", score: 100 - top3ClientsPercent, fullMark: 100 },
    { dimension: "Vendor Concentration", score: 100 - top3VendorsPercent, fullMark: 100 },
    { dimension: "Relationship Count", score: ((customers.length + vendors.length) / 30) * 100, fullMark: 100 },
    { dimension: "Payment Terms", score: 65, fullMark: 100 },
    { dimension: "Geographic Diversity", score: 55, fullMark: 100 },
  ];

  // RECOMMENDATIONS
  const recommendations = [];

  if (top2ClientsPercent > 50) {
    const targetClients = Math.ceil(totalRevenue / (totalRevenue / customers.length) * 0.25);
    recommendations.push({
      priority: "Critical",
      type: "Client",
      title: "Reduce Client Concentration Risk",
      description: `${sortedCustomers.slice(0, 2).map(c => c.name).join(" & ")} represent ${top2ClientsPercent.toFixed(0)}% of revenue`,
      action: `Acquire ${targetClients} new clients to reduce top-2 concentration to <50%`,
      impact: `Reduce revenue-at-risk from $${((top2ClientsRevenue) / 1000).toFixed(0)}K to <$${(totalRevenue * 0.5 / 1000).toFixed(0)}K`,
      timeline: "3-6 months",
      icon: AlertTriangle,
    });
  }

  if (top1ClientPercent > 25) {
    recommendations.push({
      priority: "High",
      type: "Client",
      title: "Single Client Over-Dependence",
      description: `${sortedCustomers[0]?.name} alone represents ${top1ClientPercent.toFixed(0)}% of revenue`,
      action: `Diversify revenue streams to reduce single-client risk below 25%`,
      impact: `Current risk: $${(top1ClientRevenue / 1000).toFixed(0)}K revenue at stake`,
      timeline: "6-12 months",
      icon: AlertCircle,
    });
  }

  if (top2VendorsPercent > 50) {
    recommendations.push({
      priority: "High",
      type: "Vendor",
      title: "Vendor Concentration Risk",
      description: `${sortedVendors.slice(0, 2).map(v => v.name).join(" & ")} control ${top2VendorsPercent.toFixed(0)}% of purchases`,
      action: `Identify alternative suppliers for top categories`,
      impact: `Reduce supply chain vulnerability`,
      timeline: "2-4 months",
      icon: Package,
    });
  }

  const criticalVendor = sortedVendors.find(v => v.reliability === "Low" && v.monthlyPurchases > totalPurchases * 0.1);
  if (criticalVendor) {
    recommendations.push({
      priority: "Medium",
      type: "Vendor",
      title: "Low-Reliability High-Volume Vendor",
      description: `${criticalVendor.name} has low reliability but ${((criticalVendor.monthlyPurchases / totalPurchases) * 100).toFixed(0)}% of purchases`,
      action: `Develop backup supplier or improve relationship`,
      impact: `Mitigate supply chain disruption risk`,
      timeline: "1-2 months",
      icon: Shield,
    });
  }

  if (customers.length < 10) {
    recommendations.push({
      priority: "Medium",
      type: "Client",
      title: "Limited Customer Base",
      description: `Only ${customers.length} active clients - vulnerable to churn`,
      action: `Expand customer acquisition to 15+ clients`,
      impact: `Improve revenue stability and resilience`,
      timeline: "Ongoing",
      icon: TrendingUp,
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-8 h-8 text-indigo-600" />
          <div>
            <h2>Vendor-Client Dependency Map</h2>
            <p className="text-muted-foreground">
              Analyze concentration risk and over-reliance on key clients and vendors
            </p>
          </div>
        </div>
      </div>

      {/* CRITICAL ALERT */}
      {(clientRisk.level === "Critical" || vendorRisk.level === "Critical") && (
        <Card className="p-6 bg-gradient-to-r from-red-600 via-orange-600 to-red-500 text-white border-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">🚨 CRITICAL: High Concentration Risk Detected</h3>
              {clientRisk.level === "Critical" && (
                <p className="text-white/95 text-lg mb-2">
                  <strong>{top2ClientsPercent.toFixed(0)}% of revenue from just 2 clients</strong> - 
                  Losing {sortedCustomers[0]?.name} would be catastrophic.
                </p>
              )}
              {vendorRisk.level === "Critical" && (
                <p className="text-white/95 text-lg mb-2">
                  <strong>{top2VendorsPercent.toFixed(0)}% of purchases from 2 vendors</strong> - 
                  Supply chain is extremely vulnerable.
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-white/90 mb-1">Revenue at Risk</div>
                  <div className="text-2xl">${(top2ClientsRevenue / 1000000).toFixed(2)}M</div>
                  <div className="text-xs text-white/90">Top 2 clients</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-white/90 mb-1">Supply at Risk</div>
                  <div className="text-2xl">${(top2VendorsPurchases / 1000000).toFixed(2)}M</div>
                  <div className="text-xs text-white/90">Top 2 vendors</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* WARNING ALERT */}
      {(clientRisk.level === "High" || vendorRisk.level === "High") && 
       clientRisk.level !== "Critical" && vendorRisk.level !== "Critical" && (
        <Card className="p-6 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white border-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">⚠️ WARNING: Moderate Concentration Risk</h3>
              <p className="text-white/95 mb-2">
                Your business has significant dependence on a small number of relationships.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-xs text-white/90">Top 3 Clients</div>
                  <div className="text-xl">{top3ClientsPercent.toFixed(0)}% of revenue</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-xs text-white/90">Top 3 Vendors</div>
                  <div className="text-xl">{top3VendorsPercent.toFixed(0)}% of purchases</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* DIVERSIFICATION SCORE */}
      <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Score */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Diversification Score</div>
            <div className="relative inline-block">
              <div className={`text-6xl ${getScoreColorClass('text')} mb-2`}>
                {diversificationScore.toFixed(0)}
              </div>
              <div className="absolute -top-1 -right-5 text-2xl text-muted-foreground">/100</div>
            </div>
            <Badge className={`mt-2 ${
              scoreColor === 'green' ? 'bg-green-600' :
              scoreColor === 'blue' ? 'bg-blue-600' :
              scoreColor === 'orange' ? 'bg-orange-600' : 'bg-red-600'
            }`}>
              {scoreGrade}
            </Badge>
            <div className="mt-3">
              <Progress value={diversificationScore} className="h-2" />
            </div>
          </div>

          {/* Client Metrics */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Client Concentration</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Top 1 Client:</span>
                  <span className={top1ClientPercent > 40 ? 'text-red-600' : 'text-green-600'}>
                    {top1ClientPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={top1ClientPercent} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Top 2 Clients:</span>
                  <span className={top2ClientsPercent > 60 ? 'text-red-600' : 'text-green-600'}>
                    {top2ClientsPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={top2ClientsPercent} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Top 3 Clients:</span>
                  <span className={top3ClientsPercent > 70 ? 'text-orange-600' : 'text-green-600'}>
                    {top3ClientsPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={top3ClientsPercent} className="h-1" />
              </div>
            </div>
            <Badge variant="outline" className={getRiskColorClass(clientRisk.color, 'border') + ' ' + getRiskColorClass(clientRisk.color, 'text') + ' mt-3'}>
              {clientRisk.level} Risk
            </Badge>
          </div>

          {/* Vendor Metrics */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Vendor Concentration</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Top 1 Vendor:</span>
                  <span className={top1VendorPercent > 40 ? 'text-red-600' : 'text-green-600'}>
                    {top1VendorPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={top1VendorPercent} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Top 2 Vendors:</span>
                  <span className={top2VendorsPercent > 60 ? 'text-red-600' : 'text-green-600'}>
                    {top2VendorsPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={top2VendorsPercent} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Top 3 Vendors:</span>
                  <span className={top3VendorsPercent > 70 ? 'text-orange-600' : 'text-green-600'}>
                    {top3VendorsPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={top3VendorsPercent} className="h-1" />
              </div>
            </div>
            <Badge variant="outline" className={getRiskColorClass(vendorRisk.color, 'border') + ' ' + getRiskColorClass(vendorRisk.color, 'text') + ' mt-3'}>
              {vendorRisk.level} Risk
            </Badge>
          </div>

          {/* Radar Chart */}
          <div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={riskRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                <Radar 
                  name="Diversification" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* CLIENT & VENDOR PIE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Concentration */}
        <Card className="p-4">
          <h3 className="mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Client Revenue Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {clientPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Top Clients List */}
          <div className="mt-4 space-y-2">
            {sortedCustomers.slice(0, 5).map((client, idx) => {
              const percent = (client.revenue / totalRevenue) * 100;
              const isRisky = idx === 0 ? percent > 40 : idx === 1 ? percent > 30 : percent > 20;
              
              return (
                <div key={client.id} className={`p-2 rounded ${isRisky ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                        idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : idx === 2 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={isRisky ? 'font-medium' : ''}>{client.name}</span>
                      {isRisky && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="text-right">
                      <div className={`font-mono ${isRisky ? 'text-red-600' : ''}`}>{percent.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">${(client.revenue / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Vendor Concentration */}
        <Card className="p-4">
          <h3 className="mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Vendor Purchase Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vendorPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vendorPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>

          {/* Top Vendors List */}
          <div className="mt-4 space-y-2">
            {sortedVendors.slice(0, 5).map((vendor, idx) => {
              const percent = (vendor.monthlyPurchases / totalPurchases) * 100;
              const isRisky = idx === 0 ? percent > 40 : idx === 1 ? percent > 30 : percent > 20;
              
              return (
                <div key={vendor.id} className={`p-2 rounded ${isRisky ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                        idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : idx === 2 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={isRisky ? 'font-medium' : ''}>{vendor.name}</span>
                      {isRisky && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="text-right">
                      <div className={`font-mono ${isRisky ? 'text-red-600' : ''}`}>{percent.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">${(vendor.monthlyPurchases / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* CONCENTRATION COMPARISON */}
      <Card className="p-4">
        <h3 className="mb-4">📊 Concentration Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={concentrationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="client" fill="#3b82f6" name="Client Concentration %" />
            <Bar dataKey="vendor" fill="#8b5cf6" name="Vendor Concentration %" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <div className="p-3 bg-blue-50 rounded text-center">
            <div className="text-xs text-muted-foreground mb-1">Top 1 Client</div>
            <div className="text-2xl text-blue-600">{top1ClientPercent.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">${(top1ClientRevenue / 1000).toFixed(0)}K</div>
          </div>
          <div className="p-3 bg-purple-50 rounded text-center">
            <div className="text-xs text-muted-foreground mb-1">Top 1 Vendor</div>
            <div className="text-2xl text-purple-600">{top1VendorPercent.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">${(top1VendorPurchases / 1000).toFixed(0)}K</div>
          </div>
          <div className="p-3 bg-blue-50 rounded text-center">
            <div className="text-xs text-muted-foreground mb-1">Top 3 Clients</div>
            <div className="text-2xl text-blue-600">{top3ClientsPercent.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">${(top3ClientsRevenue / 1000).toFixed(0)}K</div>
          </div>
          <div className="p-3 bg-purple-50 rounded text-center">
            <div className="text-xs text-muted-foreground mb-1">Top 3 Vendors</div>
            <div className="text-2xl text-purple-600">{top3VendorsPercent.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">${(top3VendorsPurchases / 1000).toFixed(0)}K</div>
          </div>
        </div>
      </Card>

      {/* DETAILED CLIENT ANALYSIS */}
      <Card className="p-4">
        <h3 className="mb-4">👥 Detailed Client Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Rank</th>
                <th className="text-left p-2">Client Name</th>
                <th className="text-right p-2">Revenue</th>
                <th className="text-right p-2">% of Total</th>
                <th className="text-right p-2">Cumulative %</th>
                <th className="text-center p-2">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((client, idx) => {
                const percent = (client.revenue / totalRevenue) * 100;
                const cumulative = sortedCustomers.slice(0, idx + 1).reduce((sum, c) => sum + c.revenue, 0) / totalRevenue * 100;
                const riskLevel = idx === 0 && percent > 40 ? "Critical" :
                                 idx < 2 && percent > 30 ? "High" :
                                 idx < 3 && percent > 20 ? "Medium" : "Low";
                const riskColor = riskLevel === "Critical" ? "red" :
                                 riskLevel === "High" ? "orange" :
                                 riskLevel === "Medium" ? "yellow" : "green";
                
                return (
                  <tr key={client.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                        idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : idx === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        #{idx + 1}
                      </div>
                    </td>
                    <td className="p-2">{client.name}</td>
                    <td className="p-2 text-right font-mono">${(client.revenue / 1000).toFixed(0)}K</td>
                    <td className="p-2 text-right font-mono">{percent.toFixed(1)}%</td>
                    <td className="p-2 text-right font-mono">{cumulative.toFixed(1)}%</td>
                    <td className="p-2 text-center">
                      <Badge className={
                        riskColor === 'red' ? 'bg-red-600 text-white text-xs' :
                        riskColor === 'orange' ? 'bg-orange-600 text-white text-xs' :
                        riskColor === 'yellow' ? 'bg-yellow-600 text-white text-xs' :
                        'bg-green-600 text-white text-xs'
                      }>
                        {riskLevel}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-indigo-900 mb-4">💡 Diversification Recommendations</h3>
              
              <div className="space-y-3">
                {recommendations.map((rec, idx) => {
                  const Icon = rec.icon;
                  const priorityBgClass = rec.priority === "Critical" ? 'bg-red-600' :
                                         rec.priority === "High" ? 'bg-orange-600' :
                                         rec.priority === "Medium" ? 'bg-blue-600' : 'bg-green-600';
                  const priorityTextClass = rec.priority === "Critical" ? 'text-red-600' :
                                           rec.priority === "High" ? 'text-orange-600' :
                                           rec.priority === "Medium" ? 'text-blue-600' : 'text-green-600';
                  
                  return (
                    <div key={idx} className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 ${priorityTextClass} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm">{rec.title}</h4>
                            <Badge className={`${priorityBgClass} text-white text-xs`}>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rec.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-indigo-700">
                              <ArrowRight className="w-3 h-3" />
                              <span><strong>Action:</strong> {rec.action}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs">
                            <strong>Impact:</strong> {rec.impact}
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          {rec.timeline}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* BEST PRACTICES */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="text-sm mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          Risk Mitigation Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">🎯 Ideal Targets</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Top client: &lt;25% of revenue</li>
              <li>• Top 3 clients: &lt;50% of revenue</li>
              <li>• Top vendor: &lt;30% of purchases</li>
              <li>• Minimum 10+ active clients</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">🛡️ Risk Management</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Maintain backup suppliers</li>
              <li>• Diversify across geographies</li>
              <li>• Negotiate flexible contracts</li>
              <li>• Build strategic reserves</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-sm">📈 Growth Strategy</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Actively acquire new clients</li>
              <li>• Develop multiple sales channels</li>
              <li>• Cross-sell to existing base</li>
              <li>• Review quarterly</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* KEY INSIGHTS */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <h4 className="text-sm mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-600" />
          Key Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-3 bg-white p-3 rounded">
            {top2ClientsPercent > 50 ? (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            )}
            <div>
              <strong className={top2ClientsPercent > 50 ? 'text-red-900' : 'text-green-900'}>
                Client Concentration: {top2ClientsPercent.toFixed(0)}%
              </strong>
              <p className="text-xs text-muted-foreground mt-1">
                {top2ClientsPercent > 50 
                  ? `High risk - Top 2 clients control majority of revenue`
                  : `Healthy diversification across client base`
                }
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white p-3 rounded">
            {top2VendorsPercent > 50 ? (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            )}
            <div>
              <strong className={top2VendorsPercent > 50 ? 'text-red-900' : 'text-green-900'}>
                Vendor Concentration: {top2VendorsPercent.toFixed(0)}%
              </strong>
              <p className="text-xs text-muted-foreground mt-1">
                {top2VendorsPercent > 50 
                  ? `Supply chain vulnerable - Top 2 vendors control majority`
                  : `Good supplier diversification`
                }
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}