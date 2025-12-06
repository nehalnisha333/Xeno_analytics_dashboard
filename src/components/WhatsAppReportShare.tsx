import { Card } from "./ui/card";
import { FinancialData, Product } from "../types/financial";
import { 
  MessageCircle,
  Share2,
  Bell,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Package,
  Users,
  Calendar,
  Clock,
  Send,
  Copy,
  Download,
  Smartphone,
  Zap,
  Target,
  Activity,
  BarChart3,
  Info,
  Settings,
  Sparkles,
  QrCode,
  ArrowRight,
  Eye,
  Mail,
  Phone
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { toast } from "sonner";

interface WhatsAppReportShareProps {
  data: FinancialData;
  products: Product[];
}

interface ReportSection {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
}

interface Alert {
  type: "success" | "warning" | "danger" | "info";
  icon: any;
  message: string;
  value?: string;
}

export function WhatsAppReportShare({ data, products }: WhatsAppReportShareProps) {
  
  // Report configuration
  const [sections, setSections] = useState<ReportSection[]>([
    { id: "summary", name: "Executive Summary", icon: BarChart3, enabled: true },
    { id: "alerts", name: "Critical Alerts", icon: Bell, enabled: true },
    { id: "revenue", name: "Revenue Metrics", icon: DollarSign, enabled: true },
    { id: "profit", name: "Profit Analysis", icon: TrendingUp, enabled: true },
    { id: "cashflow", name: "Cash Flow Status", icon: Activity, enabled: false },
    { id: "products", name: "Top Products", icon: Package, enabled: true },
  ]);

  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [phoneNumber, setPhoneNumber] = useState("+1 555-0123");
  const [reportTime, setReportTime] = useState("08:00");

  // Calculate metrics
  const revenue = data.incomeStatement.revenue;
  const profit = data.incomeStatement.netIncome;
  const profitMargin = (profit / revenue) * 100;
  const currentRatio = data.balanceSheet.currentAssets / data.balanceSheet.currentLiabilities;
  const cash = data.balanceSheet.cashAndEquivalents;
  
  const totalAssets = data.balanceSheet.currentAssets + data.balanceSheet.fixedAssets;
  const totalLiabilities = data.balanceSheet.currentLiabilities + data.balanceSheet.longTermDebt;
  const equity = totalAssets - totalLiabilities;
  const debtToEquity = totalLiabilities / equity;

  // Top products
  const topProducts = [...products]
    .sort((a, b) => (b.price * b.unitsSold) - (a.price * a.unitsSold))
    .slice(0, 3);

  // Generate alerts
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    // Profit margin check
    if (profitMargin >= 20) {
      alerts.push({
        type: "success",
        icon: CheckCircle,
        message: "Excellent profit margin",
        value: `${profitMargin.toFixed(1)}%`
      });
    } else if (profitMargin < 10) {
      alerts.push({
        type: "warning",
        icon: AlertTriangle,
        message: "Low profit margin - review costs",
        value: `${profitMargin.toFixed(1)}%`
      });
    }

    // Current ratio check
    if (currentRatio < 1.0) {
      alerts.push({
        type: "danger",
        icon: AlertTriangle,
        message: "Liquidity risk - current ratio below 1.0",
        value: currentRatio.toFixed(2)
      });
    } else if (currentRatio >= 2.0) {
      alerts.push({
        type: "success",
        icon: CheckCircle,
        message: "Strong liquidity position",
        value: currentRatio.toFixed(2)
      });
    }

    // Debt to equity check
    if (debtToEquity > 2.0) {
      alerts.push({
        type: "warning",
        icon: AlertTriangle,
        message: "High debt levels - consider deleveraging",
        value: `${debtToEquity.toFixed(2)}×`
      });
    }

    // Revenue milestone
    if (revenue >= 1000000) {
      alerts.push({
        type: "success",
        icon: TrendingUp,
        message: "Revenue milestone achieved",
        value: `$${(revenue / 1000000).toFixed(2)}M`
      });
    }

    // Cash position
    if (cash < revenue * 0.1) {
      alerts.push({
        type: "warning",
        icon: AlertTriangle,
        message: "Low cash reserves - less than 10% of revenue",
        value: `$${(cash / 1000).toFixed(0)}K`
      });
    } else if (cash > revenue * 0.3) {
      alerts.push({
        type: "info",
        icon: Info,
        message: "High cash reserves - consider investments",
        value: `$${(cash / 1000).toFixed(0)}K`
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    let message = "📊 *ROI Daily Report*\n";
    message += `📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;

    // Summary section
    if (sections.find(s => s.id === "summary")?.enabled) {
      message += "━━━━━━━━━━━━━━━━━━━━\n";
      message += "📈 *EXECUTIVE SUMMARY*\n";
      message += "━━━━━━━━━━━━━━━━━━━━\n\n";
      message += `💰 Revenue: *$${(revenue / 1000000).toFixed(2)}M*\n`;
      message += `✅ Net Profit: *$${(profit / 1000).toFixed(0)}K*\n`;
      message += `📊 Profit Margin: *${profitMargin.toFixed(1)}%*\n`;
      message += `💵 Cash Position: *$${(cash / 1000).toFixed(0)}K*\n\n`;
    }

    // Alerts section
    if (sections.find(s => s.id === "alerts")?.enabled && alerts.length > 0) {
      message += "━━━━━━━━━━━━━━━━━━━━\n";
      message += "🚨 *CRITICAL ALERTS*\n";
      message += "━━━━━━━━━━━━━━━━━━━━\n\n";
      
      alerts.forEach(alert => {
        const emoji = alert.type === "success" ? "✅" :
                     alert.type === "warning" ? "⚠️" :
                     alert.type === "danger" ? "🔴" : "ℹ️";
        
        message += `${emoji} ${alert.message}\n`;
        if (alert.value) message += `   → ${alert.value}\n`;
        message += "\n";
      });
    }

    // Revenue metrics
    if (sections.find(s => s.id === "revenue")?.enabled) {
      message += "━━━━━━━━━━━━━━━━━━━━\n";
      message += "💵 *REVENUE METRICS*\n";
      message += "━━━━━━━━━━━━━━━━━━━━\n\n";
      message += `Total Revenue: $${(revenue / 1000000).toFixed(2)}M\n`;
      message += `Operating Revenue: $${((revenue - data.incomeStatement.operatingExpenses) / 1000).toFixed(0)}K\n`;
      message += `COGS: $${(data.incomeStatement.cogs / 1000).toFixed(0)}K\n\n`;
    }

    // Profit analysis
    if (sections.find(s => s.id === "profit")?.enabled) {
      message += "━━━━━━━━━━━━━━━━━━━━\n";
      message += "📊 *PROFIT ANALYSIS*\n";
      message += "━━━━━━━━━━━━━━━━━━━━\n\n";
      message += `Gross Profit: $${((revenue - data.incomeStatement.cogs) / 1000).toFixed(0)}K\n`;
      message += `Gross Margin: ${(((revenue - data.incomeStatement.cogs) / revenue) * 100).toFixed(1)}%\n`;
      message += `Net Profit: $${(profit / 1000).toFixed(0)}K\n`;
      message += `Net Margin: ${profitMargin.toFixed(1)}%\n\n`;
    }

    // Cash flow
    if (sections.find(s => s.id === "cashflow")?.enabled) {
      message += "━━━━━━━━━━━━━━━━━━━━\n";
      message += "💰 *CASH FLOW STATUS*\n";
      message += "━━━━━━━━━━━━━━━━━━━━\n\n";
      message += `Cash & Equivalents: $${(cash / 1000).toFixed(0)}K\n`;
      message += `Current Ratio: ${currentRatio.toFixed(2)}\n`;
      message += `Quick Ratio: ${((data.balanceSheet.currentAssets - data.balanceSheet.inventory) / data.balanceSheet.currentLiabilities).toFixed(2)}\n\n`;
    }

    // Top products
    if (sections.find(s => s.id === "products")?.enabled) {
      message += "━━━━━━━━━━━━━━━━━━━━\n";
      message += "🏆 *TOP PRODUCTS*\n";
      message += "━━━━━━━━━━━━━━━━━━━━\n\n";
      
      topProducts.forEach((product, idx) => {
        const productRevenue = product.price * (product.unitsSold || 0);
        message += `${idx + 1}. ${product.name}\n`;
        message += `   💰 $${(productRevenue / 1000).toFixed(0)}K revenue\n`;
        message += `   📦 ${(product.unitsSold || 0).toLocaleString()} units\n`;
        message += `   📈 ${product.margin || 0}% margin\n\n`;
      });
    }

    message += "━━━━━━━━━━━━━━━━━━━━\n";
    message += "🚀 *Powered by ROI*\n";
    message += "Return on Insights\n";
    
    return message;
  };

  const whatsappMessage = generateWhatsAppMessage();

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Opening WhatsApp...");
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappMessage);
    toast.success("Report copied to clipboard!");
  };

  // Toggle section
  const toggleSection = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  // Generate mock screenshot data URL
  const generateMockScreenshot = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%2325D366'/%3E%3Ctext x='150' y='100' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3EReport Preview%3C/text%3E%3C/svg%3E";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-8 h-8 text-green-600" />
          <div>
            <h2>WhatsApp Report Share</h2>
            <p className="text-muted-foreground">
              Send automated financial insights directly to your phone
            </p>
          </div>
        </div>
      </div>

      {/* QUICK SHARE BANNER */}
      <Card className="p-6 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Smartphone className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">📱 Instant Mobile Reports</h3>
            <p className="text-white/95 mb-4">
              Get your key financial insights delivered to WhatsApp every {frequency}. 
              Simple, mobile-first, and actionable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-sm text-white/90 mb-1">Next Report</div>
                <div className="text-xl">
                  {frequency === "daily" ? "Tomorrow" : frequency === "weekly" ? "Next Monday" : "Next Month"} @ {reportTime}
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-sm text-white/90 mb-1">Delivery Method</div>
                <div className="text-xl flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-sm text-white/90 mb-1">Recipients</div>
                <div className="text-xl">
                  {phoneNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN - Configuration */}
        <div className="space-y-6">
          
          {/* REPORT SETTINGS */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Report Settings
            </h3>

            {/* Frequency */}
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Delivery Frequency</label>
                <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Daily - Every morning
                      </div>
                    </SelectItem>
                    <SelectItem value="weekly">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Weekly - Every Monday
                      </div>
                    </SelectItem>
                    <SelectItem value="monthly">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Monthly - 1st of month
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time */}
              <div>
                <label className="text-sm mb-2 block">Delivery Time</label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Select value={reportTime} onValueChange={setReportTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM (Recommended)</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-sm mb-2 block">WhatsApp Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                    placeholder="+1 555-0123"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
            </div>
          </Card>

          {/* REPORT SECTIONS */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Report Sections
            </h3>
            
            <div className="space-y-3">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div 
                    key={section.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm">{section.name}</div>
                        {section.id === "alerts" && (
                          <div className="text-xs text-muted-foreground">
                            {alerts.length} active alerts
                          </div>
                        )}
                        {section.id === "products" && (
                          <div className="text-xs text-muted-foreground">
                            Top {topProducts.length} products
                          </div>
                        )}
                      </div>
                    </div>
                    <Switch 
                      checked={section.enabled}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                💡 <strong>Tip:</strong> Enable only the sections you check daily for shorter, more focused reports.
              </p>
            </div>
          </Card>

          {/* QUICK ACTIONS */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={shareToWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Now
              </Button>
              
              <Button 
                onClick={copyToClipboard}
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Report
              </Button>

              <Button 
                variant="outline"
                onClick={() => {
                  const blob = new Blob([whatsappMessage], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ROI-Report-${new Date().toISOString().split('T')[0]}.txt`;
                  a.click();
                  toast.success("Report downloaded!");
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>

              <Button 
                variant="outline"
                onClick={() => {
                  toast.info("QR code generation coming soon!");
                }}
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Alternative Channels */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Also send via:</label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" disabled>
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                  <Badge variant="outline" className="ml-2 text-xs">Coming Soon</Badge>
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <MessageCircle className="w-3 h-3 mr-1" />
                  SMS
                  <Badge variant="outline" className="ml-2 text-xs">Coming Soon</Badge>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN - Preview */}
        <div className="space-y-6">
          
          {/* WHATSAPP PREVIEW */}
          <Card className="p-0 overflow-hidden border-2 border-green-200">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white">WhatsApp Preview</h3>
                  <p className="text-xs text-white/90">How it will look on mobile</p>
                </div>
              </div>
            </div>

            {/* Mock WhatsApp Interface */}
            <div className="p-4 bg-[#E5DDD5]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpattern id=\"pattern\" x=\"0\" y=\"0\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M0 0 L20 20 M20 0 L0 20\" stroke=\"%23d9d9d9\" stroke-width=\"0.5\" opacity=\"0.3\"/%3E%3C/pattern%3E%3Crect width=\"100\" height=\"100\" fill=\"url(%23pattern)\"/%3E%3C/svg%3E')" }}>
              
              {/* Chat header */}
              <div className="bg-white rounded-t-lg p-3 flex items-center gap-3 border-b">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm">ROI Financial Assistant</div>
                  <div className="text-xs text-green-600">Online</div>
                </div>
              </div>

              {/* Message bubble */}
              <div className="bg-white p-4 rounded-b-lg shadow-sm">
                <div className="bg-[#DCF8C6] rounded-lg p-3 max-w-full">
                  <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-gray-800">
                    {whatsappMessage}
                  </pre>
                  <div className="flex justify-end items-center gap-1 mt-2 text-xs text-gray-500">
                    <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Character count */}
              <div className="mt-2 text-center">
                <Badge variant="outline" className="text-xs">
                  {whatsappMessage.length} characters
                </Badge>
              </div>
            </div>
          </Card>

          {/* CURRENT ALERTS */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              Current Alerts ({alerts.length})
            </h3>

            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <p>No critical alerts</p>
                <p className="text-xs mt-1">All metrics within healthy ranges</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, idx) => {
                  const Icon = alert.icon;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border-2 ${
                        alert.type === "success" ? "bg-green-50 border-green-200" :
                        alert.type === "warning" ? "bg-yellow-50 border-yellow-200" :
                        alert.type === "danger" ? "bg-red-50 border-red-200" :
                        "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 flex-shrink-0 ${
                          alert.type === "success" ? "text-green-600" :
                          alert.type === "warning" ? "text-yellow-600" :
                          alert.type === "danger" ? "text-red-600" :
                          "text-blue-600"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm">{alert.message}</p>
                          {alert.value && (
                            <p className={`text-xl mt-1 ${
                              alert.type === "success" ? "text-green-700" :
                              alert.type === "warning" ? "text-yellow-700" :
                              alert.type === "danger" ? "text-red-700" :
                              "text-blue-700"
                            }`}>
                              {alert.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* KEY METRICS SUMMARY */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <h3 className="mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Quick Metrics Overview
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-xs text-muted-foreground mb-1">Revenue</div>
                <div className="text-xl text-green-600">
                  ${(revenue / 1000000).toFixed(2)}M
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-xs text-muted-foreground mb-1">Net Profit</div>
                <div className="text-xl text-blue-600">
                  ${(profit / 1000).toFixed(0)}K
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border">
                <div className="text-xs text-muted-foreground mb-1">Margin</div>
                <div className={`text-xl ${profitMargin >= 20 ? 'text-green-600' : profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {profitMargin.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border">
                <div className="text-xs text-muted-foreground mb-1">Cash</div>
                <div className="text-xl text-purple-600">
                  ${(cash / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </Card>

          {/* FEATURES & BENEFITS */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <h3 className="mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Why WhatsApp Reports?
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Instant Access</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check your business health from anywhere, anytime on your phone
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>No App Required</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uses WhatsApp you already have - no new apps to install
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Actionable Alerts</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified immediately about critical issues that need attention
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Share with Team</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Forward reports to partners, accountants, or investors instantly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Historical Archive</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    All reports saved in chat history for easy comparison
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* SETUP GUIDE */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-green-600" />
          How to Set Up Automated Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="text-sm mb-2">Configure Sections</h4>
            <p className="text-xs text-muted-foreground">
              Choose which metrics you want in your daily report
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="text-sm mb-2">Set Schedule</h4>
            <p className="text-xs text-muted-foreground">
              Pick frequency and time for automatic delivery
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="text-sm mb-2">Add WhatsApp</h4>
            <p className="text-xs text-muted-foreground">
              Enter your WhatsApp number with country code
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mb-3">
              4
            </div>
            <h4 className="text-sm mb-2">Test & Activate</h4>
            <p className="text-xs text-muted-foreground">
              Send a test report, then enable automation
            </p>
          </div>
        </div>
      </Card>

      {/* SAMPLE REPORTS */}
      <Card className="p-6">
        <h3 className="mb-4">📱 Sample Report Types</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <strong className="text-sm">Daily Morning Brief</strong>
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ Yesterday's revenue & profit</li>
              <li>✓ Critical alerts only</li>
              <li>✓ Top 3 products</li>
              <li>✓ Cash position</li>
            </ul>
            <Badge className="mt-3 bg-blue-600">Most Popular</Badge>
          </div>

          <div className="p-4 border-2 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <strong className="text-sm">Weekly Deep Dive</strong>
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ Week-over-week trends</li>
              <li>✓ All financial metrics</li>
              <li>✓ Top 10 products</li>
              <li>✓ Expense breakdown</li>
            </ul>
            <Badge variant="outline" className="mt-3">Recommended</Badge>
          </div>

          <div className="p-4 border-2 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-orange-600" />
              <strong className="text-sm">Monthly Executive</strong>
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ Full P&L summary</li>
              <li>✓ Balance sheet health</li>
              <li>✓ Cash flow analysis</li>
              <li>✓ Strategic recommendations</li>
            </ul>
            <Badge variant="outline" className="mt-3">Comprehensive</Badge>
          </div>
        </div>
      </Card>

      {/* DISCLAIMER */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-yellow-900">
            <p className="mb-2">
              <strong>Privacy & Security:</strong> Reports are sent directly from your browser to WhatsApp. 
              No financial data is stored on external servers. Your WhatsApp number is encrypted and never shared.
            </p>
            <p>
              <strong>Note:</strong> This demo uses mock data. In production, connect your accounting software 
              (QuickBooks, Xero, etc.) for real-time automated reports.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}