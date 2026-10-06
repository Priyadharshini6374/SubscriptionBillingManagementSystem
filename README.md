Subscription Billing Management System

This project can be designed as an intermediate-level SaaS subscription and billing platform. The goal is to simulate how platforms manage customers, subscription plans, billing cycles, invoices, payments, renewals, cancellations, and revenue.

It should not require real payment integration. The interns can build a simulated payment system.

1. Project Objective

Build a platform where a company can define subscription plans and customers can subscribe to them.

Example:

                    SUBSCRIPTION PLATFORM

Admin
  │
  ├── Create Plans
  ├── Manage Customers
  ├── View Subscriptions
  ├── View Payments
  ├── Manage Invoices
  └── View Revenue Analytics
                    │
                    ▼
                 Customer
                    │
             Select a Plan
                    │
                    ▼
              Subscription
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       Invoice             Payment
          │                   │
          └─────────┬─────────┘
                    ▼
              Subscription
                 Active
                    │
                    ▼
                 Renewal
2. User Roles

Use three roles.

Admin

Full access.

Admin
 ├── Dashboard
 ├── Plans
 ├── Customers
 ├── Subscriptions
 ├── Invoices
 ├── Payments
 ├── Coupons
 ├── Revenue Analytics
 └── Settings
Customer

Customers can:

Customer
 ├── Dashboard
 ├── Browse Plans
 ├── Subscribe
 ├── Current Subscription
 ├── Payment History
 ├── Invoices
 ├── Change Plan
 └── Cancel Subscription
Finance Manager

Optional third role.

Can access:

Finance Manager
 ├── Payments
 ├── Invoices
 ├── Revenue
 ├── Refunds
 └── Reports

But cannot modify system settings or users.

3. Subscription Plans

Admin should be able to create plans.

Example:

                    PLANS

┌────────────┐  ┌────────────┐  ┌────────────┐
│   BASIC    │  │    PRO     │  │  BUSINESS  │
│            │  │            │  │            │
│ ₹299/month │  │ ₹799/month │  │ ₹1,499/mo  │
│            │  │            │  │            │
│ 5 Projects │  │ 25 Projects│  │ Unlimited  │
│ 5 GB       │  │ 50 GB      │  │ 500 GB     │
│            │  │            │  │            │
│ [Subscribe]│  │ [Subscribe]│  │ [Subscribe]│
└────────────┘  └────────────┘  └────────────┘

Each plan should have:

Plan
 ├── Name
 ├── Description
 ├── Price
 ├── Billing Cycle
 ├── Trial Period
 ├── Features
 ├── Maximum Users
 ├── Storage Limit
 └── Status

Billing cycles:

Monthly
Quarterly
Yearly
4. Plan Management

Admin can:

Create plan
Edit plan
Activate/deactivate plan
Change pricing
Add/remove features
Set trial period
Set usage limits