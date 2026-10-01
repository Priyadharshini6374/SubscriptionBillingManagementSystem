# BillSphere - SaaS Subscription & Billing Management System

An intermediate-to-advanced level SaaS subscription, billing, and revenue lifecycle management platform built with **React**, **TypeScript**, and **Tailwind CSS**.

The platform provides a realistic simulation of how modern SaaS companies manage recurring billing cycles, pricing tiers, payment gateways, prorated upgrades, automatic renewals, past-due dunning, invoice reconciliation, and financial reporting.

---

## ⚡ Key Highlights & Architecture

### 1. Three Distinct Role Personas (Switchable in 1-Click)
- 👑 **Admin**:
  - **Executive Dashboard**: Real-time MRR (Monthly Recurring Revenue), ARR, Net Collections, Active Subscribers, and Churn Rate.
  - **Plan Management (Full CRUD)**: Create, edit, toggle active/inactive status, adjust pricing across billing cycles (Monthly, Quarterly, Yearly), set free trial periods (e.g., 14 days), configure feature lists, and set storage/seat limits.
  - **Customer Accounts**: View customer details, usage meters (projects, storage, team members), and account statuses.
  - **Subscription Registry**: Audit live subscriber contracts, trigger manual renewals, pause/resume, or cancel contracts.
  - **Invoice Ledger**: Review generated invoices, mark pending invoices as paid, and preview printable PDF-style tax invoices.
  - **Payment Logs**: Full audit stream of simulated gateway authorizations, card debits, UPI transactions, and refund actions.
  - **Coupons & Promo Codes**: Publish percentage (`%`) or fixed (`₹`) discounts with expiration dates and usage limits.
  - **Revenue Analytics**: Visual MRR trajectory charts, revenue yield by tier, and contract cycle distributions.
  - **System Settings**: Business details, GSTIN number, default 18% tax rate, base currency (₹ INR default, $ USD, € EUR), and sandbox parameters.

- 👤 **Customer** (e.g., Alex Rivera / TechNova Solutions):
  - **Self-Serve Dashboard**: Current subscription status badge, renewal countdown, recurring price, and resource consumption progress bars.
  - **Browse Plans & Pricing Catalog**: Interactive pricing table with **Monthly**, **Quarterly** (Save ~8%), and **Yearly** (2 Months Free!) toggles.
  - **Simulated Payment Gateway**:
    - 💳 **Credit/Debit Card**: Card preview, test card auto-fill, and simulated validation.
    - 📱 **UPI / QR**: Simulated QR code scan or custom VPA (`username@okhdfcbank`).
    - 🏦 **Net Banking**: Selection of major Indian retail/corporate banks.
    - 🏷️ **Coupon Redemptions**: Real-time promo code validation (e.g., `STARTUP20`, `SAVE500`, `WELCOME10`).
    - 🧪 **Test Failure Sandbox Mode**: Toggle "Simulate Bank Failure" to test past-due and dunning behavior!
  - **Current Subscription Controls**: Upgrade/downgrade tiers, switch billing cycles, pause subscription, or cancel with reason logging.
  - **Invoices & Receipts**: View, download, and print official GST tax invoices.
  - **Payment History**: Transaction logs and authorization references.

- 💼 **Finance Manager**:
  - **Financial Dashboard**: Gross revenue collections, net realized cashflow, outstanding dunning receivables, and refund rates.
  - **Refunds & Disputes**: Issue full or partial refunds on successful payments with audit reason logging.
  - **Reconciliation & Tax**: Reconcile invoices with bank ledger entries.
  - **Export Reports**: One-click download of real **CSV** and **JSON** files:
    - `transactions_report.csv`
    - `invoices_gst_ledger.csv`
    - `subscriptions_audit.csv`
  - **Restricted Access**: Guaranteed security boundaries preventing modification of plans, user passwords, or platform settings.

---

### 2. Time Machine & Billing Simulator Sandbox
- **⏩ +7 Days**: Advance the simulated clock forward by 1 week.
- **⏩ +30 Days (Renewals)**: Fast-forward time past subscription periods. Active subscriptions automatically trigger renewal runs, generating new invoices and charging mock payment methods!
- **⚠️ Simulate Payment Failure**: Induce simulated payment failures during batch renewal to test how the system transitions accounts into **Past Due** status and triggers invoice retry flows.
- **🔄 Reset Sandbox**: Restore all demo plans, subscriptions, customers, and invoices back to clean initial states with a single click.

---

## 🛠️ Technology Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom fonts (`Plus Jakarta Sans` & `JetBrains Mono`)
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti
- **Build Tool**: Vite 5
- **Persistence**: LocalStorage with automatic state synchronization

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.
