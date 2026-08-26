Here is a structured, comprehensive prompt you can give to a coding agent (such as Gemini, Claude, or ChatGPT) to build a custom web or mobile application that replicates and automates the full functionality of your financial tracker spreadsheet.Prompt for Coding Agent> **Role:** You are an expert full-stack developer specializing in personal finance applications.
>
> **Task:** Build a full-stack personal finance and net worth tracking web application based on the detailed specifications and data models outlined below.
>
> -----
>
> ### **1. Core App Purpose & Vision**
>
> Build a multi-modular personal finance web app that enables users to track monthly cash flow, budget vs. actual expenses, debt payoff, investment portfolios, payroll deductions, and total net worth across 12 monthly cycles and an annual summary.
>
> -----
>
> ### **2. Data Model & Database Schema**
>
> 1. **Transactions (Variable Spending):**
>
> - `id`, `date`, `description`, `category` (enum: Grocery, Dining, Entertainment, Dogs, Kids, Alcohol, Car, Business, Home, Misc), `tags` (array of strings), `amount`, `is_cash` (boolean), `is_split` (boolean), `notes`.
>
> 2. **Monthly Budgets & Categories:**
>
> - `month_year` (e.g., "2026-01"), `category`, `budgeted_amount`, `actual_amount` (calculated), `variance` (`budgeted - actual`), `split_total` (sum of items flagged `is_split`).
>
> 3. **Fixed & Recurring Expenses:**
>
> - `name` (e.g., Mortgage, Electric, Spotify, Nanny), `category` (Mortgage, Utilities, Home Services, Debt, Subscriptions, Kids), `expected_amount`, `actual_amount`, `due_date`, `is_paid` (boolean), `is_cash` (boolean).
>
> 4. **Credit Cards & Debt Management:**
>
> - `account_name`, `due_date`, `credit_limit`, `starting_balance`, `expected_payment`, `actual_payment`, `interest_accrued`, `ending_balance` (`start - payment + interest`), `rewards_earned`, `notes`.
>
> 5. **Investment & Asset Accounts:**
>
> - `account_name`, `category` (Roth IRA, 401(k), Trading, Savings), `starting_balance`, `contributions`, `ending_balance`, `monthly_return_dollar` (`end - start - contributions`), `monthly_return_percent`, `notes`.
>
> 6. **Payroll & Income Deductions:**
>
> - `gross_income`, `federal_tax`, `ss_tax`, `medicare_tax`, `hsa`, `health_benefits` (Dental, Medical, Vision, Life), `retirement_contributions` (Roth/401k), `take_home_pay` (`gross - taxes - benefits`).
>
> 7. **Net Worth & Long-Term Liabilities:**
>
> - **Assets:** Real Estate Value, Vehicle Value, Investment Balances, Cash Balances.
> - **Liabilities:** Mortgage Principal, Student Loans, Auto Loans, Credit Card Debt.
> - **Equity:** Asset Value - Liability Balance.
>
> -----
>
> ### **3. Key Modules & Functional Features**
>
> #### **A. Monthly Cash Flow Engine**
>
> - **Beginning Cash & End Cash Calculation:**
> - $\\text{Ending Cash} = \\text{Starting Cash} + \\text{Actual Receivables/Income} - \\text{Actual Payables/Cash Expenses}$.
> - Track **Expected vs. Actual** side-by-side for cash starting positions, receivables, and payables.
>
> #### **B. Variable Expense & Split Cost Logging**
>
> - Rapid transaction entry form with auto-date detection, category selection, cash toggle, and split toggle.
> - **Split Expense Logic:** If a transaction is marked `is_split = True`, calculate both the user's portion and track the total combined household expense.
>
> #### **C. Fixed Bills & Debt Tracking**
>
> - Track fixed recurring payments (mortgages, utilities, subscriptions, student loans, car loans).
> - Auto-calculate credit card balances (`Start Debt - Actual Payment + Interest Accrued = End Debt`).
> - Track available credit ($\\text{Total Credit Limits} - \\text{Total Ending Balances}$).
>
> #### **D. Investment & Net Worth Dashboard**
>
> - Track portfolio growth across accounts with automatic calculation of dollar returns and ROI percentage:
> $$\\text{Return %} = \\frac{\\text{Ending Balance} - (\\text{Starting Balance} + \\text{Contributions})}{\\text{Starting Balance} + \\text{Contributions}}$$
> - Real-time Net Worth roll-up combining all bank balances, investment accounts, home value equity, minus active loan balances and credit debt.
>
> #### **E. Multi-Month Navigation & Annual Totals**
>
> - Support 12 discrete monthly views (January to December) + a **Totals / YTD Dashboard** that aggregates monthly spending, income, debt reduction, and net worth progress over time.
>
> -----
>
> ### **4. UI/UX & Visualizations**
>
> - **Dashboard Overview:**
> - **Bar Chart:** Budget vs. Actual spending per expense category.
> - **Pie Chart:** Percentage distribution of spending across categories.
> - **KPI Cards:** Net Worth, Total Available Credit, Cash Ending Balance, Monthly Savings Rate.
> - **Color-Coded Statusing:** Highlight categories exceeding budget in red, under budget in green.
> - **Clean Mobile-Responsive Layout:** Quick-add action buttons for fast expense entry on mobile devices.
>
> -----
>
> ### **5. Tech Stack Requirements**
>
> - **Frontend:** Remix / React with CSS modules, Zustand, React Query and Recharts or Three.js for the budget & net worth visualizations.
> - **Backend / DB:** PostgreSQL (via TypeORM) or Supabase for relational data storage. API layer (GraphQL or node/express, and a DTO pattern for inputs / outputs.)
> - **Authentication:** Should just be a personal app now, so not sure what auth we should use, even though I want to keep the data local and private.
