# Health Plan Comparison Tool

## Overview
A Next.js 16 web application for comparing health insurance plans across 2025-2026. Users can browse plans, model costs based on their expected healthcare usage, and compare plans side-by-side. Features accurate plan data from the 2025 (Cigna) and 2026 (Oxford) benefits guides.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **UI Components**: Headless UI, Heroicons
- **Charts**: Recharts
- **PDF Export**: jsPDF

## Project Structure
- `src/app/` - Next.js app router pages
  - `page.tsx` - Home page with plan overview
  - `plans/` - Plan browsing and details
  - `model/` - Cost modeling tool
  - `compare/` - Plan comparison
  - `whats-new/` - Year-over-year changes
  - `admin/` - Admin interface
  - `auth/login/` - Login page
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and business logic
  - `store.ts` - Zustand state management
  - `costCalculator.ts` - Healthcare cost calculations
  - `pdfExport.ts` - PDF generation
  - `utils.ts` - Formatting and helper functions
- `src/data/` - Static plan data
- `src/types/` - TypeScript type definitions

## Key Features
1. **Plan Browsing**: View all available health plans for 2025 and 2026
2. **Cost Modeling**: Adjust personal variables (expected doctor visits, prescriptions, etc.) to estimate annual costs
3. **Plan Comparison**: Side-by-side comparison of selected plans
4. **Year-over-Year Analysis**: See changes between 2025 and 2026 plans
5. **PDF Export**: Export plan comparisons and cost breakdowns
6. **Authentication**: Demo login system (admin/user roles)

## Plan Data Structure
- **2025 Plans** (Cigna): Basic Plan (HRA), Buy-Up Plan, Value Plan
- **2026 Plans** (Oxford): Basic A - Liberty HSA, Basic B - Metro HSA + HRA, Buy-Up Plan - Freedom, Value Plan - Liberty

### Type System Notes
- **Copays**: Can be `number` or `'deductible'` (for services requiring deductible first)
- **Premiums**: Supports income tiers for Value plans (<$200k vs >$200k)
- **Enrollment Types**: `single`, `couple`, `employeeChild`, `family`
- **Rx Tiers**: `tier1`, `tier2`, `tier3` with optional `deductible` field

## Authentication
Demo credentials:
- Admin: `admin@company.com` / `admin123`
- User: `user@company.com` / `user123`

## Running Locally
The application runs on port 5000:
```bash
npm run dev
```

## Replit Configuration
- **Port**: 5000 (required for Replit webview)
- **Host**: 0.0.0.0 (allows proxy access)
- **Allowed Origins**: Configured in next.config.ts for Replit iframe compatibility

## Recent Changes
- December 4, 2024: Major UI upgrade and data updates
  - Updated all plan data with accurate 2025 and 2026 benefits information
  - Comprehensive UI redesign with professional styling
  - New type system supporting income-based premiums and copay union types
  - Professional header with BenefitsCompare branding
  - Modern hero section and stat cards
  - Updated all components for new data structure
  - Fixed hydration issues with client-side mounting
  - Added safe percentage calculations and copay formatting utilities

- December 4, 2024: Initial Replit setup
  - Configured Next.js to run on port 5000
  - Set host to 0.0.0.0 for Replit compatibility
  - Configured workflow for automatic server startup
  - Dependencies installed and verified

## Notes
- This is a client-side application with no backend database
- All plan data is stored in `src/data/plans.ts`
- Cost calculations happen client-side using Zustand for state management
- Authentication is simulated (not connected to a real auth service)
- Uses `mounted` state pattern to prevent hydration mismatches with client-side store data
