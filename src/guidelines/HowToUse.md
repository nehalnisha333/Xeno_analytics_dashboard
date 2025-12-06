# Finance Analytics Platform - User Guide

## How to Calculate KPIs for Dashboard

### 1. Data Collection & Upload

#### Step 1: Gather Your Raw Data
Collect the following financial data from your accounting system:

**Balance Sheet Data:**
- Cash & Cash Equivalents
- Inventory Value
- Accounts Receivable
- Current Liabilities
- Long-term Debt

**Income Statement Data:**
- Total Revenue
- Cost of Goods Sold (COGS)
- Operating Expenses
- Interest Expense
- Taxes

**Operational Data:**
- Number of Employees
- Monthly Inventory Levels
- Units Sold
- Number of Orders/Transactions

**Sales & Marketing Data:**
- Monthly Orders
- New Customers Acquired
- Marketing Spend
- Product-wise Revenue & Costs

#### Step 2: Choose Your Input Method

**Option A: File Upload (Recommended)**
1. Navigate to the "Data Input" tab
2. Click on "File Upload"
3. Download the CSV template
4. Fill in your data using Excel or Google Sheets
5. Upload the completed file
6. System automatically validates and imports data

**Option B: Manual Entry**
1. Navigate to the "Data Input" tab
2. Click on "Manual Entry"
3. Fill in the web form with your financial data
4. Click "Update Data & Calculate KPIs"
5. All KPIs are instantly recalculated

**Option C: Use Sample Data**
1. Download the sample data from the Templates tab
2. Use it to test the system
3. Replace with your actual data when ready

### 2. Automatic KPI Calculation

Once data is uploaded, the system automatically calculates:

#### A. Financial Health KPIs (5 metrics)
- **Gross Profit Margin** = (Revenue - COGS) / Revenue × 100
- **Net Profit Margin** = Net Profit / Revenue × 100
- **Current Ratio** = Current Assets / Current Liabilities
- **Debt-to-Equity Ratio** = Total Debt / Equity
- **Cash Conversion Cycle** = DIO + DSO - DPO

#### B. Sales & Revenue KPIs (5 metrics)
- **Revenue Growth Rate** = (Current Revenue - Previous Revenue) / Previous Revenue × 100
- **Average Order Value (AOV)** = Total Revenue / Number of Orders
- **Customer Acquisition Cost (CAC)** = Marketing Spend / New Customers
- **Customer Lifetime Value (CLV)** = Avg Purchase × Frequency × Retention Period
- **ABC Analysis** = Product ranking by revenue contribution

#### C. Operational Efficiency KPIs (4 metrics)
- **Inventory Turnover** = COGS / Average Inventory
- **Unit Economics** = Selling Price - Variable Cost per Unit
- **Expense Ratio** = Total Expenses / Revenue × 100
- **Employee Productivity** = Revenue / Number of Employees

#### D. Growth & Predictive KPIs (3 metrics)
- **Projected Revenue** = Linear regression on historical trends
- **Break-even Point** = Fixed Costs / (Selling Price - Variable Cost per Unit)
- **Cash Runway** = Current Cash / Monthly Burn Rate

### 3. Intelligent Visualization

The platform provides:

#### Trend Charts (Line & Area Charts)
- Revenue growth over time
- Cash flow trends
- Expense ratio trends
- Profitability trends

#### Composition Charts (Pie Charts)
- Product revenue contribution
- Expense breakdown
- Asset allocation

#### Ratio & KPI Cards
- Quick-glance metric cards
- Color-coded status indicators
- Comparison to benchmarks

#### Gauges & Progress Bars
- Performance against targets
- Goal tracking
- Completion metrics

### 4. Alert Highlighting System

The platform uses a traffic light system:

#### 🟢 Green (Good)
**Criteria:** KPI meets or exceeds benchmark
**Examples:**
- Net Profit Margin ≥ 10%
- Current Ratio ≥ 2.0
- Inventory Turnover ≥ 6x
- Revenue Growth ≥ 10%

**Action:** Maintain current performance

#### 🟠 Orange (Warning)
**Criteria:** KPI below target but acceptable
**Examples:**
- Net Profit Margin 5-10%
- Current Ratio 1.5-2.0
- Inventory Turnover 4-6x
- Revenue Growth 5-10%

**Action:** Monitor closely, look for improvement opportunities

#### 🔴 Red (Critical)
**Criteria:** KPI significantly below target
**Examples:**
- Net Profit Margin < 5%
- Current Ratio < 1.5
- Inventory Turnover < 4x
- Cash Runway < 6 months

**Action:** Immediate intervention required

### 5. Using the Dashboard Tabs

#### Tab 1: Data Input
- Upload CSV/Excel files
- Manual data entry
- Download templates
- View data checklist

#### Tab 2: Dashboard
- Executive summary
- Key metrics overview
- Quick alerts
- Performance highlights

#### Tab 3: Core KPIs
- 5 essential financial health metrics
- Detailed formulas
- Benchmark comparisons
- Actionable recommendations

#### Tab 4: Sales Metrics
- Revenue growth analysis
- Customer value metrics (CAC, CLV)
- AOV tracking
- ABC product analysis summary

#### Tab 5: Operations
- Inventory turnover
- Unit economics
- Expense ratio
- Employee productivity

#### Tab 6: Growth
- Revenue forecasting
- Break-even analysis
- Cash runway
- Predictive insights

#### Tab 7: Ratios
- Liquidity ratios
- Profitability ratios
- Efficiency ratios
- Leverage ratios

#### Tab 8: ABC Analysis
- Product performance ranking
- Revenue contribution
- Focus recommendations

#### Tab 9: Units
- Unit-level profitability
- Product mix analysis
- Margin analysis

#### Tab 10: Forecast
- Multi-year projections
- Scenario planning
- Growth modeling

#### Tab 11: CMA
- Credit monitoring
- Bank reporting
- Working capital analysis

### 6. Tools & Integration

**Recommended Tools for Data Collection:**
- **Excel/Google Sheets:** Manual tracking and template filling
- **QuickBooks/Xero:** Export financial statements
- **Tally:** Generate reports and export to CSV
- **Zoho Books:** Financial data export
- **Power BI/Tableau:** For advanced users, export to CSV first
- **Metabase:** SQL query results to CSV

**Export Format:**
- CSV (Comma-Separated Values) - Preferred
- Excel (.xlsx, .xls) - Supported
- Monthly or quarterly data recommended

### 7. Best Practices

#### Data Collection
✅ Update data monthly for accurate trends
✅ Ensure consistent formatting (no currency symbols)
✅ Use the same date format throughout
✅ Double-check calculations before upload
✅ Keep historical data for at least 12 months

#### Using Insights
✅ Review alerts weekly
✅ Compare KPIs to industry benchmarks
✅ Track month-over-month changes
✅ Use forecasts for planning
✅ Share insights with stakeholders

#### Data Quality
✅ Reconcile with accounting records
✅ Validate imported data
✅ Review outliers and anomalies
✅ Update employee count regularly
✅ Track inventory accurately

### 8. Common Use Cases

**Scenario 1: Monthly Financial Review**
1. Upload latest month's data
2. Check Dashboard for overview
3. Review Core KPIs for health check
4. Investigate any red/orange alerts
5. Generate action plan

**Scenario 2: Investor Presentation**
1. Review Growth metrics
2. Check Projections tab
3. Export key charts
4. Highlight strong KPIs
5. Address concerns

**Scenario 3: Cost Reduction Initiative**
1. Check Expense Ratio in Operations
2. Review ABC Analysis for low performers
3. Analyze Unit Economics
4. Identify optimization opportunities
5. Monitor progress monthly

**Scenario 4: Bank Loan Application**
1. Navigate to CMA Report
2. Review liquidity ratios
3. Check profitability trends
4. Prepare cash flow projections
5. Export required reports

### 9. Troubleshooting

**Issue: Data upload failed**
- Check file format (CSV preferred)
- Ensure headers are in first row
- Remove currency symbols and commas
- Verify all required fields are filled

**Issue: KPIs showing incorrect values**
- Verify source data accuracy
- Check for data entry errors
- Ensure consistent units (e.g., all in USD)
- Review calculation formulas in tooltips

**Issue: Charts not displaying**
- Refresh the browser
- Check if data is complete
- Ensure minimum data points exist (at least 3-6 months)

### 10. Support & Resources

**Getting Help:**
- Hover over ℹ️ icons for formula explanations
- Check the Templates tab for examples
- Review the data checklist
- Use sample data to understand format

**Next Steps:**
1. Start with sample data
2. Upload one month of real data
3. Verify calculations
4. Gradually add historical data
5. Set up monthly update routine

---

## Quick Start Checklist

- [ ] Gather financial statements (Balance Sheet, P&L)
- [ ] Collect operational data (employees, inventory, orders)
- [ ] Download CSV template from Data Input tab
- [ ] Fill in template with your data
- [ ] Upload and validate
- [ ] Review auto-calculated KPIs
- [ ] Check for alerts
- [ ] Create action plan based on insights
- [ ] Set monthly review schedule

---

**Remember:** The platform automatically calculates all KPIs. You only need to provide raw data, and the system handles the rest!
