export type UserRole = 'admin' | 'customer' | 'finance';

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'cancelled' 
  | 'paused' 
  | 'expired';

export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type PaymentStatus = 'succeeded' | 'failed' | 'refunded' | 'processing';

export type PaymentMethodType = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface PlanFeature {
  id: string;
  name: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number; // Base monthly price in INR (₹)
  billingCycles: {
    monthly: number;
    quarterly: number; // usually ~5-10% discount
    yearly: number;    // usually ~20% discount (2 months free)
  };
  trialPeriodDays: number;
  features: string[];
  maxUsers: number | 'unlimited';
  storageLimitGB: number;
  status: 'active' | 'inactive';
  isPopular?: boolean;
  color?: string;
}

export interface CustomerUsage {
  projectsUsed: number;
  projectsLimit: number | 'unlimited';
  storageUsedGB: number;
  storageLimitGB: number;
  teamSeatsUsed: number;
  teamSeatsLimit: number | 'unlimited';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  avatar?: string;
  currentPlanId?: string;
  subscriptionId?: string;
  joinedDate: string;
  status: 'active' | 'suspended';
  address?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  usage: CustomerUsage;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  cancellationReason?: string;
  autoRenew: boolean;
  nextBillingAmount: number;
  discountApplied?: {
    code: string;
    percentage?: number;
    amount: number;
  };
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  subscriptionId?: string;
  planId?: string;
  billingCycle?: BillingCycle;
  subtotal: number;
  taxRate: number; // percentage (e.g. 18 for GST)
  taxAmount: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
}

export interface Payment {
  id: string;
  transactionRef: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  methodDetails: {
    cardBrand?: string;
    cardLast4?: string;
    upiId?: string;
    bankName?: string;
  };
  status: PaymentStatus;
  date: string;
  failureReason?: string;
  refundedAmount?: number;
  refundReason?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 20 for 20% or 200 for ₹200
  minOrderValue?: number;
  maxDiscount?: number;
  validUntil: string;
  maxUses: number;
  timesUsed: number;
  active: boolean;
}

export interface SystemSettings {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  gstin: string;
  currency: 'INR' | 'USD' | 'EUR';
  currencySymbol: string;
  defaultTaxRate: number; // e.g. 18%
  allowTrialWithoutCard: boolean;
  enableSimulatedFailures: boolean;
  autoRenewIntervalDays: number;
}

export interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
}
