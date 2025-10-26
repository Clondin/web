# Real Estate Underwriting Platform

A comprehensive web application for analyzing real estate investment properties with detailed financial metrics and investment analysis.

## Features

### Property Analysis
- **Property Details**: Input property information including address, type, purchase price, ARV, closing costs, and rehab budget
- **Financing Options**: Configure loan parameters including down payment, interest rate, term, and loan type
- **Income Tracking**: Add multiple income streams (rental income, parking, laundry, etc.)
- **Expense Management**: Track all operating expenses (taxes, insurance, maintenance, utilities, etc.)

### Financial Metrics

The platform automatically calculates key investment metrics:

#### Investment Overview
- Total Investment Required
- Down Payment Amount
- Loan Amount
- Monthly Mortgage Payment (P&I)

#### Cash Flow Analysis
- Gross Monthly Income
- Total Monthly Expenses
- Net Operating Income (NOI)
- Monthly & Annual Cash Flow

#### Performance Metrics
- **Cap Rate**: Measures property profitability (Target: 8%+)
- **Cash on Cash Return**: Annual return on invested capital (Target: 10%+)
- **Debt Service Coverage Ratio (DSCR)**: Income vs debt payments (Target: 1.25+)
- **Gross Rent Multiplier**: Property value vs gross income
- **5-Year ROI**: Projected return including appreciation

### Additional Features
- **Data Persistence**: Automatically saves your work to browser local storage
- **Export/Import**: Save and load underwriting analyses as JSON files
- **Deal Assessment**: Automated deal quality analysis with color-coded metrics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage Guide

### 1. Enter Property Details
Start by entering the basic property information:
- Property address and type
- Purchase price
- After Repair Value (ARV)
- Closing costs
- Rehabilitation budget

### 2. Configure Financing
Set up your loan parameters:
- Choose loan type (Conventional, FHA, VA, Commercial, Hard Money)
- Enter down payment percentage
- Set interest rate and loan term

### 3. Add Income Sources
Click "Add Income" to add revenue streams:
- Rental income
- Parking fees
- Laundry income
- Storage fees
- Other income sources

### 4. Add Operating Expenses
Click "Add Expense" to track costs:
- Property taxes
- Insurance
- Property management
- Maintenance & repairs
- Utilities
- HOA fees
- Vacancy allowance

### 5. Review Analysis
The platform automatically calculates and displays:
- Investment requirements
- Cash flow projections
- Key performance metrics
- Deal quality assessment

### 6. Save Your Work
- Data automatically saves to your browser
- Use "Export Data" to save as JSON file
- Use "Import Data" to load previous analyses
- Use "Reset All" to start fresh

## Metric Benchmarks

### Cap Rate
- **8%+**: Excellent
- **5-8%**: Good
- **Below 5%**: Below market

### Cash on Cash Return
- **10%+**: Excellent
- **6-10%**: Good
- **Below 6%**: Below market

### Debt Service Coverage Ratio
- **1.25+**: Excellent (preferred by lenders)
- **1.0-1.25**: Acceptable
- **Below 1.0**: Warning - insufficient income

### Gross Rent Multiplier
- **4-7**: Typical range (lower is better)
- **Below 4**: Excellent value
- **Above 7**: May be overpriced

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS custom properties
- **Local Storage** - Data persistence

## File Structure

```
web/
├── src/
│   ├── components/
│   │   ├── PropertyForm.tsx       # Property details form
│   │   ├── FinancingForm.tsx      # Financing configuration
│   │   ├── IncomeExpenseForm.tsx  # Income/expense management
│   │   └── MetricsSummary.tsx     # Financial metrics display
│   ├── utils/
│   │   └── calculations.ts        # Financial calculation logic
│   ├── types.ts                   # TypeScript interfaces
│   ├── App.tsx                    # Main application component
│   ├── App.css                    # Application styles
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                 # Vite configuration
└── README.md                      # This file
```

## Calculations Reference

### Monthly Mortgage Payment
```
M = P[r(1+r)^n]/[(1+r)^n-1]
Where:
M = Monthly payment
P = Principal (loan amount)
r = Monthly interest rate
n = Number of payments
```

### Cap Rate
```
Cap Rate = (Net Operating Income / Property Value) × 100
```

### Cash on Cash Return
```
CoC = (Annual Cash Flow / Total Cash Invested) × 100
```

### Debt Service Coverage Ratio
```
DSCR = Net Operating Income / Annual Debt Service
```

### Net Operating Income
```
NOI = Gross Income - Operating Expenses
(Does not include debt service)
```

### Cash Flow
```
Cash Flow = Gross Income - Operating Expenses - Debt Service
```

## Disclaimer

This tool provides estimates for educational and analytical purposes only. The calculations and metrics are based on the data you provide and standard financial formulas. Always consult with qualified financial advisors, real estate professionals, and legal counsel before making investment decisions.

Factors not included in this analysis:
- Tax implications
- Appreciation rate variations
- Market fluctuations
- Unexpected expenses
- Vacancy rates beyond your estimates
- Local market conditions
- Economic changes

## License

MIT License - feel free to use this tool for your real estate analysis needs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue in the GitHub repository.
