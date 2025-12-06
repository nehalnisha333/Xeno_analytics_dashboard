
# XENO DASHBOARD

An advanced analytical dashboard for comprehensive financial intelligence and business insights. Built with React, TypeScript, and modern UI components to provide actionable financial analytics for businesses.

## 🚀 Features

### 📊 Dashboard Overview
The main dashboard provides a comprehensive overview of your business financial health with key metrics and visualizations:
- **Financial Health Metrics**: Gross Profit Margin, Net Profit Margin, Cash Conversion Cycle
- **Sales Performance**: Revenue trends, order metrics, customer acquisition data
- **Operational KPIs**: Key performance indicators across all business functions
- **Interactive Charts**: Line charts, bar charts, and trend visualizations using Recharts
- **Real-time Data**: Dynamic calculations and safe mathematical operations

### 📈 Analytics Section

#### Core KPIs
- **Revenue Metrics**: Total revenue, growth rates, and period-over-period comparisons
- **Profitability Analysis**: Gross margins, net margins, and profitability trends
- **Efficiency Ratios**: Asset utilization and operational efficiency indicators
- **Growth Indicators**: Year-over-year growth and trend analysis

#### Financial Ratios
- **Liquidity Ratios**: Current ratio, quick ratio, cash ratio
- **Profitability Ratios**: Return on assets, return on equity, profit margins
- **Efficiency Ratios**: Inventory turnover, receivables turnover, payables turnover
- **Leverage Ratios**: Debt-to-equity, debt ratio, interest coverage
- **Interactive Ratio Charts**: Visual representation of ratio trends over time

#### ABC Analysis
- **Product Categorization**: A-class (high-value), B-class (medium-value), C-class (low-value) products
- **Revenue Distribution**: Pareto analysis (80/20 rule) for product performance
- **Customer Segmentation**: ABC classification for customer revenue contribution
- **Expense Analysis**: Cost categorization and optimization opportunities

#### Unit Economics
- **Customer Acquisition Cost (CAC)**: Marketing spend per customer
- **Customer Lifetime Value (LTV)**: Long-term customer value calculations
- **LTV/CAC Ratio**: Profitability assessment of customer relationships
- **Break-even Analysis**: Unit economics and pricing optimization
- **Enhanced Unit Economics**: Advanced calculations with contribution margins

#### Profit Pulse
- **Real-time Profit Tracking**: Live profit monitoring and alerts
- **Margin Analysis**: Gross and net profit margin tracking
- **Cost Structure Analysis**: Fixed vs variable cost breakdowns
- **Profit Optimization**: Recommendations for profit improvement

### 🛒 Sales & Marketing

#### Sales Metrics
- **Revenue Analytics**: Monthly revenue trends and forecasting
- **Order Analysis**: Order volume, average order value, conversion rates
- **Customer Metrics**: New customer acquisition, retention rates, churn analysis
- **Marketing ROI**: Campaign performance and return on marketing spend

#### Seasonal Trend Detector
- **Seasonal Pattern Recognition**: Automated detection of seasonal trends
- **Trend Visualization**: Interactive charts showing seasonal patterns
- **Forecasting**: Predictive analytics for seasonal demand
- **Business Planning**: Seasonal adjustment recommendations

#### Marketing Readiness Score
- **Marketing Effectiveness**: Comprehensive marketing performance scoring
- **Channel Analysis**: Performance across different marketing channels
- **Budget Optimization**: Marketing spend efficiency analysis
- **ROI Tracking**: Return on investment for marketing campaigns

#### Vendor/Client Dependency Map
- **Relationship Mapping**: Visual representation of business relationships
- **Dependency Analysis**: Critical vendor and client relationships
- **Risk Assessment**: Supply chain and client dependency risks
- **Network Visualization**: Interactive maps of business connections

### ⚙️ Operations

#### Operational Metrics
- **Process Efficiency**: Operational performance indicators
- **Cost Analysis**: Operational cost breakdowns and trends
- **Productivity Metrics**: Employee and process productivity tracking
- **Quality Indicators**: Defect rates and quality control metrics

#### Cash Flow Predictor
- **Cash Flow Forecasting**: Predictive cash flow modeling
- **Working Capital Analysis**: Cash conversion cycle optimization
- **Liquidity Planning**: Short-term cash flow management
- **Scenario Planning**: Multiple cash flow scenarios and stress testing

#### Expense Optimization Map
- **Expense Categorization**: Fixed vs variable expense analysis
- **Cost Reduction Opportunities**: Identification of optimization areas
- **Budget Variance Analysis**: Actual vs budgeted expense tracking
- **Cost Control Recommendations**: Actionable expense reduction strategies

### 📋 Planning & Reports

#### Financial Projections
- **Revenue Forecasting**: Multi-year revenue projections
- **Expense Planning**: Detailed expense forecasting models
- **Profit Projections**: Net profit and margin forecasting
- **Scenario Analysis**: Best-case, worst-case, and most likely scenarios

#### CMA Report (Comparative Market Analysis)
- **Market Positioning**: Industry benchmarking and positioning
- **Competitive Analysis**: Market share and competitive landscape
- **Growth Opportunities**: Market expansion and growth strategies
- **Investment Recommendations**: Strategic investment planning

#### Product Pricing Advisor
- **Dynamic Pricing**: Market-based pricing recommendations
- **Cost-Plus Pricing**: Pricing based on cost structures
- **Competitive Pricing**: Pricing relative to market competitors
- **Price Optimization**: Profit maximization through optimal pricing

#### Smart Tax Health Check
- **Tax Compliance**: Automated tax compliance monitoring
- **Tax Optimization**: Legal tax minimization strategies
- **Tax Planning**: Year-round tax planning and forecasting
- **Audit Preparation**: Tax audit readiness and documentation

#### Credit & Loan Recommender
- **Creditworthiness Assessment**: Comprehensive credit scoring
- **Loan Recommendations**: Suitable loan products and terms
- **Interest Rate Analysis**: Competitive rate comparisons
- **Repayment Planning**: Loan repayment scheduling and cash flow impact

### 📥 Data & Alerts

#### Data Input
- **Financial Data Entry**: Comprehensive financial data input forms
- **Product Management**: Product catalog and pricing management
- **Customer Data**: Customer relationship and transaction data
- **Bulk Data Import**: CSV and Excel data import capabilities

#### WhatsApp Report Sharing
- **Automated Reports**: Scheduled financial report generation
- **WhatsApp Integration**: Direct report sharing via WhatsApp
- **Custom Report Templates**: Tailored reporting formats
- **Stakeholder Communication**: Automated stakeholder updates

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives with Tailwind CSS
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React
- **State Management**: React hooks
- **Styling**: Tailwind CSS with custom design system
- **Form Handling**: React Hook Form
- **Date Handling**: React Day Picker

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "ROI - Return on Insights (Copy)"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 🚀 Usage

1. **Dashboard**: Start with the main dashboard for an overview of your financial health
2. **Navigation**: Use the top navigation menu to access different analysis modules
3. **Data Input**: Use the Data Input section to update your financial data
4. **Analysis**: Explore various analytical tools across different business functions
5. **Reports**: Generate and share reports using the WhatsApp integration

## 📊 Data Structure

The application uses mock financial data including:
- Balance Sheet (assets, liabilities, equity)
- Income Statement (revenue, costs, expenses)
- Sales Data (monthly performance metrics)
- Customer Metrics (acquisition, retention, lifetime value)
- Product Catalog (pricing, costs, categories)
- Expense Categories (fixed vs variable costs)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── [feature]/      # Feature-specific components
├── lib/                # Utilities and mock data
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- **Original Design**: [Figma Design](https://www.figma.com/design/gM1HxiB38bzamZNBp2Cpjx/ROI---Return-on-Insights--Copy-)
- **React**: [React Documentation](https://react.dev/)
- **Vite**: [Vite Documentation](https://vitejs.dev/)
- **Tailwind CSS**: [Tailwind Documentation](https://tailwindcss.com/)
- **Recharts**: [Recharts Documentation](https://recharts.org/)  