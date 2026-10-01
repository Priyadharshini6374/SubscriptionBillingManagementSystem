import { Plan, Customer, Subscription, Invoice, Payment, Coupon, SystemSettings } from '../types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan_basic',
    name: 'BASIC',
    description: 'Essential tools for solo creators and early-stage projects.',
    price: 299,
    billingCycles: {
      monthly: 299,
      quarterly: 829, // ~8% discount
      yearly: 2990,   // ~17% discount (2 months free)
    },
    trialPeriodDays: 14,
    features: [
      'Up to 5 active projects',
      '5 GB secure cloud storage',
      'Single user license',
      'Standard email support (24-48h)',
      'Basic monthly analytics reports',
      'Community forum access'
    ],
    maxUsers: 1,
    storageLimitGB: 5,
    status: 'active',
    isPopular: false,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'plan_pro',
    name: 'PRO',
    description: 'Designed for scaling startups and dynamic product teams.',
    price: 799,
    billingCycles: {
      monthly: 799,
      quarterly: 2199, // ~9% discount
      yearly: 7990,    // ~17% discount
    },
    trialPeriodDays: 14,
    features: [
      'Up to 25 active projects',
      '50 GB high-speed SSD storage',
      'Up to 5 team member seats',
      'Priority 24/7 ticket & chat support',
      'Advanced MRR & Churn analytics',
      'Custom branding & PDF invoices',
      'REST API & Webhooks access',
      'Automated invoice reminders'
    ],
    maxUsers: 5,
    storageLimitGB: 50,
    status: 'active',
    isPopular: true,
    color: 'from-indigo-600 to-purple-600'
  },
  {
    id: 'plan_business',
    name: 'BUSINESS',
    description: 'Uncapped power, compliance, and dedicated infrastructure.',
    price: 1499,
    billingCycles: {
      monthly: 1499,
      quarterly: 4199, // ~7% discount
      yearly: 14990,   // ~17% discount
    },
    trialPeriodDays: 14,
    features: [
      'Unlimited concurrent projects',
      '500 GB dedicated enterprise storage',
      'Unlimited team member seats',
      'Dedicated Customer Success Manager',
      '99.99% uptime SLA guarantee',
      'Real-time financial audit trails',
      'Custom integrations & SSO (SAML/Okta)',
      'Automated dunning & revenue recovery'
    ],
    maxUsers: 'unlimited',
    storageLimitGB: 500,
    status: 'active',
    isPopular: false,
    color: 'from-violet-600 to-pink-600'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_technova',
    name: 'Alex Rivera',
    email: 'alex@technova.io',
    company: 'TechNova Solutions',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    currentPlanId: 'plan_pro',
    subscriptionId: 'sub_technova_pro',
    joinedDate: '2026-01-15',
    status: 'active',
    address: {
      line1: '402, Innov8 Cyber Park, Sector 48',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      country: 'India'
    },
    usage: {
      projectsUsed: 14,
      projectsLimit: 25,
      storageUsedGB: 28.5,
      storageLimitGB: 50,
      teamSeatsUsed: 4,
      teamSeatsLimit: 5
    }
  },
  {
    id: 'cust_apexcloud',
    name: 'Priya Sharma',
    email: 'priya@apexcloud.co',
    company: 'Apex Cloud Labs',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    currentPlanId: 'plan_business',
    subscriptionId: 'sub_apex_biz',
    joinedDate: '2025-11-10',
    status: 'active',
    address: {
      line1: 'DLF Cyber City, Tower 10B',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      country: 'India'
    },
    usage: {
      projectsUsed: 62,
      projectsLimit: 'unlimited',
      storageUsedGB: 215.2,
      storageLimitGB: 500,
      teamSeatsUsed: 22,
      teamSeatsLimit: 'unlimited'
    }
  },
  {
    id: 'cust_devsprint',
    name: 'Rohan Patel',
    email: 'rohan@devsprint.studio',
    company: 'DevSprint Studios',
    phone: '+91 99223 88441',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    currentPlanId: 'plan_basic',
    subscriptionId: 'sub_devsprint_basic',
    joinedDate: '2026-02-18',
    status: 'active',
    address: {
      line1: '9th Lane, Baner Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      country: 'India'
    },
    usage: {
      projectsUsed: 3,
      projectsLimit: 5,
      storageUsedGB: 2.1,
      storageLimitGB: 5,
      teamSeatsUsed: 1,
      teamSeatsLimit: 1
    }
  },
  {
    id: 'cust_starlight',
    name: 'Ananya Desai',
    email: 'ananya@starlightdigital.agency',
    company: 'Starlight Digital',
    phone: '+91 97333 44556',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    currentPlanId: 'plan_pro',
    subscriptionId: 'sub_starlight_pro',
    joinedDate: '2025-09-20',
    status: 'active',
    address: {
      line1: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India'
    },
    usage: {
      projectsUsed: 21,
      projectsLimit: 25,
      storageUsedGB: 41.8,
      storageLimitGB: 50,
      teamSeatsUsed: 5,
      teamSeatsLimit: 5
    }
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_technova_pro',
    customerId: 'cust_technova',
    planId: 'plan_pro',
    billingCycle: 'monthly',
    status: 'active',
    currentPeriodStart: '2026-09-15',
    currentPeriodEnd: '2026-10-15',
    cancelAtPeriodEnd: false,
    autoRenew: true,
    nextBillingAmount: 799,
    discountApplied: {
      code: 'STARTUP20',
      percentage: 20,
      amount: 159.8
    },
    createdAt: '2026-01-15'
  },
  {
    id: 'sub_apex_biz',
    customerId: 'cust_apexcloud',
    planId: 'plan_business',
    billingCycle: 'yearly',
    status: 'active',
    currentPeriodStart: '2025-11-10',
    currentPeriodEnd: '2026-11-10',
    cancelAtPeriodEnd: false,
    autoRenew: true,
    nextBillingAmount: 14990,
    createdAt: '2025-11-10'
  },
  {
    id: 'sub_devsprint_basic',
    customerId: 'cust_devsprint',
    planId: 'plan_basic',
    billingCycle: 'monthly',
    status: 'trialing',
    currentPeriodStart: '2026-09-25',
    currentPeriodEnd: '2026-10-09',
    trialEnd: '2026-10-09',
    cancelAtPeriodEnd: false,
    autoRenew: true,
    nextBillingAmount: 299,
    createdAt: '2026-09-25'
  },
  {
    id: 'sub_starlight_pro',
    customerId: 'cust_starlight',
    planId: 'plan_pro',
    billingCycle: 'quarterly',
    status: 'past_due',
    currentPeriodStart: '2026-06-20',
    currentPeriodEnd: '2026-09-20',
    cancelAtPeriodEnd: false,
    autoRenew: true,
    nextBillingAmount: 2199,
    createdAt: '2025-09-20'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_1001',
    invoiceNumber: 'INV-2026-0891',
    customerId: 'cust_technova',
    subscriptionId: 'sub_technova_pro',
    planId: 'plan_pro',
    billingCycle: 'monthly',
    subtotal: 799,
    taxRate: 18,
    taxAmount: 143.82,
    discountAmount: 159.8,
    couponCode: 'STARTUP20',
    total: 783.02,
    status: 'paid',
    issueDate: '2026-09-15',
    dueDate: '2026-09-22',
    paidDate: '2026-09-15',
    items: [
      {
        id: 'item_1',
        description: 'PRO Subscription Plan - Monthly Billing (Sep 15 - Oct 15, 2026)',
        quantity: 1,
        unitPrice: 799,
        total: 799
      }
    ]
  },
  {
    id: 'inv_1002',
    invoiceNumber: 'INV-2025-0412',
    customerId: 'cust_apexcloud',
    subscriptionId: 'sub_apex_biz',
    planId: 'plan_business',
    billingCycle: 'yearly',
    subtotal: 14990,
    taxRate: 18,
    taxAmount: 2698.2,
    discountAmount: 0,
    total: 17688.2,
    status: 'paid',
    issueDate: '2025-11-10',
    dueDate: '2025-11-17',
    paidDate: '2025-11-10',
    items: [
      {
        id: 'item_2',
        description: 'BUSINESS Subscription Plan - Annual Billing (Nov 2025 - Nov 2026)',
        quantity: 1,
        unitPrice: 14990,
        total: 14990
      }
    ]
  },
  {
    id: 'inv_1003',
    invoiceNumber: 'INV-2026-0924',
    customerId: 'cust_starlight',
    subscriptionId: 'sub_starlight_pro',
    planId: 'plan_pro',
    billingCycle: 'quarterly',
    subtotal: 2199,
    taxRate: 18,
    taxAmount: 395.82,
    discountAmount: 0,
    total: 2594.82,
    status: 'failed',
    issueDate: '2026-09-20',
    dueDate: '2026-09-27',
    items: [
      {
        id: 'item_3',
        description: 'PRO Subscription Plan - Quarterly Renewal (Sep 2026 - Dec 2026)',
        quantity: 1,
        unitPrice: 2199,
        total: 2199
      }
    ]
  },
  {
    id: 'inv_1004',
    invoiceNumber: 'INV-2026-0811',
    customerId: 'cust_technova',
    subscriptionId: 'sub_technova_pro',
    planId: 'plan_pro',
    billingCycle: 'monthly',
    subtotal: 799,
    taxRate: 18,
    taxAmount: 143.82,
    discountAmount: 159.8,
    couponCode: 'STARTUP20',
    total: 783.02,
    status: 'paid',
    issueDate: '2026-08-15',
    dueDate: '2026-08-22',
    paidDate: '2026-08-15',
    items: [
      {
        id: 'item_4',
        description: 'PRO Subscription Plan - Monthly Billing (Aug 15 - Sep 15, 2026)',
        quantity: 1,
        unitPrice: 799,
        total: 799
      }
    ]
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_9001',
    transactionRef: 'TXN_98412891_SIM',
    invoiceId: 'inv_1001',
    customerId: 'cust_technova',
    amount: 783.02,
    currency: 'INR',
    method: 'card',
    methodDetails: {
      cardBrand: 'Mastercard',
      cardLast4: '4242'
    },
    status: 'succeeded',
    date: '2026-09-15 14:32:10'
  },
  {
    id: 'pay_9002',
    transactionRef: 'TXN_41299812_SIM',
    invoiceId: 'inv_1002',
    customerId: 'cust_apexcloud',
    amount: 17688.2,
    currency: 'INR',
    method: 'netbanking',
    methodDetails: {
      bankName: 'HDFC Corporate Banking'
    },
    status: 'succeeded',
    date: '2025-11-10 10:15:44'
  },
  {
    id: 'pay_9003',
    transactionRef: 'TXN_77612093_SIM',
    invoiceId: 'inv_1003',
    customerId: 'cust_starlight',
    amount: 2594.82,
    currency: 'INR',
    method: 'card',
    methodDetails: {
      cardBrand: 'Visa',
      cardLast4: '0002'
    },
    status: 'failed',
    date: '2026-09-20 09:12:00',
    failureReason: 'Insufficient funds on credit account [SIMULATED_GATEWAY]'
  },
  {
    id: 'pay_9004',
    transactionRef: 'TXN_65123981_SIM',
    invoiceId: 'inv_1004',
    customerId: 'cust_technova',
    amount: 783.02,
    currency: 'INR',
    method: 'upi',
    methodDetails: {
      upiId: 'alexrivera@okhdfcbank'
    },
    status: 'succeeded',
    date: '2026-08-15 11:42:01'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn_startup20',
    code: 'STARTUP20',
    description: '20% off for verified early stage startups',
    discountType: 'percentage',
    discountValue: 20,
    validUntil: '2026-12-31',
    maxUses: 100,
    timesUsed: 34,
    active: true
  },
  {
    id: 'cpn_save500',
    code: 'SAVE500',
    description: 'Flat ₹500 instant discount on Quarterly & Annual plans',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 2000,
    validUntil: '2026-11-30',
    maxUses: 50,
    timesUsed: 12,
    active: true
  },
  {
    id: 'cpn_welcome10',
    code: 'WELCOME10',
    description: '10% welcome discount for new subscribers',
    discountType: 'percentage',
    discountValue: 10,
    validUntil: '2027-01-01',
    maxUses: 500,
    timesUsed: 142,
    active: true
  }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  companyName: 'BillSphere Technologies Pvt. Ltd.',
  companyEmail: 'billing@billsphere.io',
  companyAddress: 'Tower C, Tech Oasis, Koramangala 4th Block, Bengaluru, KA 560034',
  gstin: '29AABCB1234F1Z8',
  currency: 'INR',
  currencySymbol: '₹',
  defaultTaxRate: 18,
  allowTrialWithoutCard: true,
  enableSimulatedFailures: false,
  autoRenewIntervalDays: 30
};
