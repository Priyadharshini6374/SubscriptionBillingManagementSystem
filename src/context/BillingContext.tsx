import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  BillingCycle,
  Plan,
  Customer,
  Subscription,
  Invoice,
  Payment,
  Coupon,
  SystemSettings,
  ActivityNotification,
  PaymentMethodType,
  CustomerUsage
} from '../types';
import {
  INITIAL_PLANS,
  INITIAL_CUSTOMERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_COUPONS,
  DEFAULT_SETTINGS
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface BillingContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentCustomerId: string;
  setCurrentCustomerId: (id: string) => void;
  currentCustomer: Customer | undefined;
  
  // Data
  plans: Plan[];
  customers: Customer[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  payments: Payment[];
  coupons: Coupon[];
  settings: SystemSettings;
  notifications: ActivityNotification[];
  simulationDate: string;
  toasts: ToastState[];

  // Modal helpers
  viewingInvoice: Invoice | null;
  setViewingInvoice: (invoice: Invoice | null) => void;
  
  // Actions
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Plans
  createPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, updates: Partial<Plan>) => void;
  togglePlanStatus: (id: string) => void;
  deletePlan: (id: string) => boolean;

  // Customers
  createCustomer: (customer: Omit<Customer, 'id' | 'joinedDate' | 'usage'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  updateCustomerUsage: (customerId: string, usage: Partial<CustomerUsage>) => void;

  // Subscriptions
  subscribeToPlan: (params: {
    customerId: string;
    planId: string;
    billingCycle: BillingCycle;
    paymentMethod: PaymentMethodType;
    methodDetails: any;
    couponCode?: string;
    simulateFailure?: boolean;
  }) => { success: boolean; error?: string; invoice?: Invoice };
  
  changePlan: (subscriptionId: string, newPlanId: string, newCycle?: BillingCycle) => void;
  cancelSubscription: (subscriptionId: string, reason: string, immediate?: boolean) => void;
  reactivateSubscription: (subscriptionId: string) => void;
  pauseSubscription: (subscriptionId: string) => void;
  resumeSubscription: (subscriptionId: string) => void;

  // Payments & Refunds
  processRefund: (paymentId: string, amount: number, reason: string) => boolean;
  retryPayment: (invoiceId: string, paymentMethod: PaymentMethodType, methodDetails: any) => boolean;
  markInvoicePaid: (invoiceId: string) => void;

  // Coupons
  createCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, amount: number) => { valid: boolean; discountAmount: number; coupon?: Coupon; error?: string };

  // Settings
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Time machine simulation
  advanceTime: (days: number) => void;
  triggerManualRenewal: (subscriptionId: string, forceFail?: boolean) => void;
  resetDemoData: () => void;

  // Financial Analytics
  analytics: {
    mrr: number;
    arr: number;
    totalRevenue: number;
    netRevenue: number;
    totalRefunds: number;
    activeSubscriptionsCount: number;
    trialingSubscriptionsCount: number;
    pastDueSubscriptionsCount: number;
    cancelledSubscriptionsCount: number;
    churnRate: number;
    arpu: number;
  };
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLANS: 'billsphere_plans_v1',
  CUSTOMERS: 'billsphere_customers_v1',
  SUBSCRIPTIONS: 'billsphere_subscriptions_v1',
  INVOICES: 'billsphere_invoices_v1',
  PAYMENTS: 'billsphere_payments_v1',
  COUPONS: 'billsphere_coupons_v1',
  SETTINGS: 'billsphere_settings_v1',
  NOTIFICATIONS: 'billsphere_notifications_v1',
  SIM_DATE: 'billsphere_sim_date_v1',
  ROLE: 'billsphere_active_role_v1',
  CUST_ID: 'billsphere_active_cust_id_v1',
};

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & current customer
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'admin';
  });

  const [currentCustomerId, setCurrentCustomerIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CUST_ID) || 'cust_technova';
  });

  // State data with localStorage persistence
  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [simulationDate, setSimulationDate] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SIM_DATE) || '2026-10-01';
  });

  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif_1',
        title: 'Platform Initialized',
        message: 'Subscription & Billing sandbox is ready with simulated payment engine.',
        timestamp: 'Just now',
        type: 'info',
        read: false
      }
    ];
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUST_ID, currentCustomerId);
  }, [currentCustomerId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIM_DATE, simulationDate);
  }, [simulationDate]);

  // Current customer helper
  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === currentCustomerId) || customers[0];
  }, [customers, currentCustomerId]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const newNotif: ActivityNotification = {
      id: 'notif_' + Date.now(),
      title,
      message,
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 24)]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Role Switcher wrapper
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    showToast(`Switched workspace role to ${newRole.toUpperCase()}`, 'info');
  };

  const setCurrentCustomerId = (id: string) => {
    setCurrentCustomerIdState(id);
    const cust = customers.find(c => c.id === id);
    if (cust) {
      showToast(`Switched customer context to ${cust.name} (${cust.company})`, 'info');
    }
  };

  // Plan Management CRUD
  const createPlan = (newPlanData: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...newPlanData,
      id: 'plan_' + newPlanData.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4),
    };
    setPlans(prev => [...prev, newPlan]);
    addNotification('Plan Created', `New plan "${newPlan.name}" was added at ₹${newPlan.price}/month.`, 'success');
    showToast(`Plan "${newPlan.name}" created successfully!`, 'success');
  };

  const updatePlan = (id: string, updates: Partial<Plan>) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Plan updated successfully', 'success');
  };

  const togglePlanStatus = (id: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'active' ? 'inactive' : 'active';
        showToast(`Plan "${p.name}" is now ${nextStatus}`, 'info');
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const deletePlan = (id: string): boolean => {
    const isPlanInUse = subscriptions.some(s => s.planId === id && (s.status === 'active' || s.status === 'trialing'));
    if (isPlanInUse) {
      showToast('Cannot delete plan with active or trialing subscribers! Deactivate it instead.', 'error');
      return false;
    }
    setPlans(prev => prev.filter(p => p.id !== id));
    showToast('Plan removed successfully', 'success');
    return true;
  };

  // Customer Management
  const createCustomer = (customerData: Omit<Customer, 'id' | 'joinedDate' | 'usage'>): Customer => {
    const newCust: Customer = {
      ...customerData,
      id: 'cust_' + Date.now().toString(36),
      joinedDate: simulationDate,
      usage: {
        projectsUsed: 0,
        projectsLimit: 5,
        storageUsedGB: 0,
        storageLimitGB: 5,
        teamSeatsUsed: 1,
        teamSeatsLimit: 1
      }
    };
    setCustomers(prev => [...prev, newCust]);
    showToast(`Customer ${newCust.name} added`, 'success');
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Customer profile updated', 'success');
  };

  const updateCustomerUsage = (customerId: string, usage: Partial<CustomerUsage>) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          usage: { ...c.usage, ...usage }
        };
      }
      return c;
    }));
    showToast('Usage updated', 'info');
  };

  // Coupon Validator
  const validateCoupon = (code: string, amount: number) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);
    
    if (!coupon) {
      return { valid: false, discountAmount: 0, error: 'Invalid or expired coupon code' };
    }

    if (coupon.validUntil < simulationDate) {
      return { valid: false, discountAmount: 0, error: 'Coupon has expired' };
    }

    if (coupon.timesUsed >= coupon.maxUses) {
      return { valid: false, discountAmount: 0, error: 'Coupon usage limit exceeded' };
    }

    if (coupon.minOrderValue && amount < coupon.minOrderValue) {
      return { valid: false, discountAmount: 0, error: `Minimum order value of ₹${coupon.minOrderValue} required` };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(amount, coupon.discountValue);
    }

    return {
      valid: true,
      discountAmount: Number(discount.toFixed(2)),
      coupon
    };
  };

  const createCoupon = (couponData: Omit<Coupon, 'id' | 'timesUsed'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      code: couponData.code.trim().toUpperCase(),
      id: 'cpn_' + Date.now().toString(36),
      timesUsed: 0
    };
    setCoupons(prev => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created!`, 'success');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon deleted', 'info');
  };

  // Helper date add
  const addDaysToDate = (dateStr: string, days: number): string => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const getCycleDays = (cycle: BillingCycle): number => {
    switch (cycle) {
      case 'monthly': return 30;
      case 'quarterly': return 90;
      case 'yearly': return 365;
    }
  };

  // Subscription Checkout / Payment Flow (Simulated Gateway)
  const subscribeToPlan = ({
    customerId,
    planId,
    billingCycle,
    paymentMethod,
    methodDetails,
    couponCode,
    simulateFailure = false
  }: {
    customerId: string;
    planId: string;
    billingCycle: BillingCycle;
    paymentMethod: PaymentMethodType;
    methodDetails: any;
    couponCode?: string;
    simulateFailure?: boolean;
  }) => {
    const plan = plans.find(p => p.id === planId);
    const customer = customers.find(c => c.id === customerId);

    if (!plan || !customer) {
      return { success: false, error: 'Invalid plan or customer ID' };
    }

    const subtotal = plan.billingCycles[billingCycle];
    let discountAmount = 0;
    let validatedCoupon: Coupon | undefined;

    if (couponCode) {
      const val = validateCoupon(couponCode, subtotal);
      if (val.valid) {
        discountAmount = val.discountAmount;
        validatedCoupon = val.coupon;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = Number(((discountedSubtotal * settings.defaultTaxRate) / 100).toFixed(2));
    const totalAmount = Number((discountedSubtotal + taxAmount).toFixed(2));

    const invoiceId = 'inv_' + Date.now();
    const invoiceNum = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const subId = 'sub_' + customerId.replace('cust_', '') + '_' + Date.now().toString(36);

    const periodDays = getCycleDays(billingCycle);
    const periodStart = simulationDate;
    const periodEnd = addDaysToDate(simulationDate, periodDays);

    if (simulateFailure) {
      // Create failed invoice & failed payment
      const failedInvoice: Invoice = {
        id: invoiceId,
        invoiceNumber: invoiceNum,
        customerId,
        subscriptionId: subId,
        planId,
        billingCycle,
        subtotal,
        taxRate: settings.defaultTaxRate,
        taxAmount,
        discountAmount,
        couponCode: validatedCoupon?.code,
        total: totalAmount,
        status: 'failed',
        issueDate: simulationDate,
        dueDate: addDaysToDate(simulationDate, 7),
        items: [
          {
            id: 'item_' + Date.now(),
            description: `${plan.name} Plan - ${billingCycle.toUpperCase()} Billing (${periodStart} to ${periodEnd})`,
            quantity: 1,
            unitPrice: subtotal,
            total: subtotal
          }
        ]
      };

      const failedPayment: Payment = {
        id: 'pay_' + Date.now(),
        transactionRef: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase() + '_FAIL',
        invoiceId,
        customerId,
        amount: totalAmount,
        currency: settings.currency,
        method: paymentMethod,
        methodDetails,
        status: 'failed',
        date: `${simulationDate} ${new Date().toTimeString().split(' ')[0]}`,
        failureReason: 'Transaction declined by issuer bank (Simulated Test Failure)'
      };

      setInvoices(prev => [failedInvoice, ...prev]);
      setPayments(prev => [failedPayment, ...prev]);
      addNotification('Payment Failed', `Simulated charge of ₹${totalAmount} for ${customer.company} was declined.`, 'error');
      showToast('Payment declined: Simulated bank failure', 'error');

      return { success: false, error: 'Payment declined by issuer bank (Simulated failure)', invoice: failedInvoice };
    }

    // Success flow
    const paidInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: invoiceNum,
      customerId,
      subscriptionId: subId,
      planId,
      billingCycle,
      subtotal,
      taxRate: settings.defaultTaxRate,
      taxAmount,
      discountAmount,
      couponCode: validatedCoupon?.code,
      total: totalAmount,
      status: 'paid',
      issueDate: simulationDate,
      dueDate: addDaysToDate(simulationDate, 7),
      paidDate: simulationDate,
      items: [
        {
          id: 'item_' + Date.now(),
          description: `${plan.name} Plan - ${billingCycle.toUpperCase()} Billing (${periodStart} to ${periodEnd})`,
          quantity: 1,
          unitPrice: subtotal,
          total: subtotal
        }
      ]
    };

    const succeededPayment: Payment = {
      id: 'pay_' + Date.now(),
      transactionRef: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase() + '_SIM',
      invoiceId,
      customerId,
      amount: totalAmount,
      currency: settings.currency,
      method: paymentMethod,
      methodDetails,
      status: 'succeeded',
      date: `${simulationDate} ${new Date().toTimeString().split(' ')[0]}`
    };

    const newSubscription: Subscription = {
      id: subId,
      customerId,
      planId,
      billingCycle,
      status: 'active',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      autoRenew: true,
      nextBillingAmount: plan.billingCycles[billingCycle],
      discountApplied: validatedCoupon ? {
        code: validatedCoupon.code,
        percentage: validatedCoupon.discountType === 'percentage' ? validatedCoupon.discountValue : undefined,
        amount: discountAmount
      } : undefined,
      createdAt: simulationDate
    };

    // Update coupon usage count
    if (validatedCoupon) {
      setCoupons(prev => prev.map(c => c.id === validatedCoupon!.id ? { ...c, timesUsed: c.timesUsed + 1 } : c));
    }

    // Cancel old active subscriptions for this customer if any
    setSubscriptions(prev => {
      const updated = prev.map(s => {
        if (s.customerId === customerId && s.status === 'active') {
          return { ...s, status: 'cancelled' as const, cancelledAt: simulationDate, cancellationReason: 'Upgraded/Changed plan' };
        }
        return s;
      });
      return [newSubscription, ...updated];
    });

    // Update customer's current plan and limits
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          currentPlanId: planId,
          subscriptionId: subId,
          usage: {
            ...c.usage,
            projectsLimit: plan.name === 'BUSINESS' ? 'unlimited' : plan.features.some(f => f.includes('25')) ? 25 : 5,
            storageLimitGB: plan.storageLimitGB,
            teamSeatsLimit: plan.maxUsers
          }
        };
      }
      return c;
    }));

    setInvoices(prev => [paidInvoice, ...prev]);
    setPayments(prev => [succeededPayment, ...prev]);

    addNotification(
      'New Subscription Active',
      `${customer.company} subscribed to ${plan.name} (${billingCycle}) for ₹${totalAmount}.`,
      'success'
    );
    showToast(`Subscribed to ${plan.name} plan successfully!`, 'success');

    return { success: true, invoice: paidInvoice };
  };

  // Change Plan / Upgrade / Downgrade
  const changePlan = (subscriptionId: string, newPlanId: string, newCycle?: BillingCycle) => {
    const sub = subscriptions.find(s => s.id === subscriptionId);
    const newPlan = plans.find(p => p.id === newPlanId);
    if (!sub || !newPlan) return;

    const cycle = newCycle || sub.billingCycle;
    const oldPlan = plans.find(p => p.id === sub.planId);

    setSubscriptions(prev => prev.map(s => {
      if (s.id === subscriptionId) {
        return {
          ...s,
          planId: newPlanId,
          billingCycle: cycle,
          nextBillingAmount: newPlan.billingCycles[cycle]
        };
      }
      return s;
    }));

    setCustomers(prev => prev.map(c => {
      if (c.id === sub.customerId) {
        return {
          ...c,
          currentPlanId: newPlanId,
          usage: {
            ...c.usage,
            storageLimitGB: newPlan.storageLimitGB,
            teamSeatsLimit: newPlan.maxUsers
          }
        };
      }
      return c;
    }));

    addNotification(
      'Subscription Updated',
      `Plan changed from ${oldPlan?.name || 'Previous'} to ${newPlan.name} (${cycle}).`,
      'info'
    );
    showToast(`Plan successfully updated to ${newPlan.name}!`, 'success');
  };

  // Cancel Subscription
  const cancelSubscription = (subscriptionId: string, reason: string, immediate: boolean = false) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subscriptionId) {
        return {
          ...s,
          cancelAtPeriodEnd: !immediate,
          status: immediate ? 'cancelled' : s.status,
          cancelledAt: simulationDate,
          cancellationReason: reason,
          autoRenew: false
        };
      }
      return s;
    }));

    if (immediate) {
      const sub = subscriptions.find(s => s.id === subscriptionId);
      if (sub) {
        setCustomers(prev => prev.map(c => c.id === sub.customerId ? { ...c, currentPlanId: undefined } : c));
      }
    }

    addNotification('Subscription Cancelled', `Subscription cancelled. Reason: "${reason}"`, 'warning');
    showToast(immediate ? 'Subscription cancelled immediately.' : 'Subscription scheduled to cancel at end of billing cycle.', 'info');
  };

  const reactivateSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subscriptionId) {
        return {
          ...s,
          cancelAtPeriodEnd: false,
          status: 'active',
          cancelledAt: undefined,
          cancellationReason: undefined,
          autoRenew: true
        };
      }
      return s;
    }));
    showToast('Subscription reactivated! Auto-renew is restored.', 'success');
  };

  const pauseSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, status: 'paused', autoRenew: false } : s));
    showToast('Subscription paused. Billing and usage suspended.', 'warning');
  };

  const resumeSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, status: 'active', autoRenew: true } : s));
    showToast('Subscription resumed.', 'success');
  };

  // Process Refund (Finance Manager action)
  const processRefund = (paymentId: string, amount: number, reason: string): boolean => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) {
      showToast('Payment transaction not found', 'error');
      return false;
    }

    if (payment.status !== 'succeeded') {
      showToast('Only successful payments can be refunded', 'error');
      return false;
    }

    const currentRefunded = payment.refundedAmount || 0;
    if (currentRefunded + amount > payment.amount) {
      showToast(`Cannot refund more than remaining payment amount (₹${payment.amount - currentRefunded})`, 'error');
      return false;
    }

    const newRefundedAmount = currentRefunded + amount;
    const isFullRefund = newRefundedAmount >= payment.amount;

    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: isFullRefund ? 'refunded' : p.status,
          refundedAmount: newRefundedAmount,
          refundReason: reason
        };
      }
      return p;
    }));

    if (isFullRefund) {
      setInvoices(prev => prev.map(inv => inv.id === payment.invoiceId ? { ...inv, status: 'refunded' } : inv));
    }

    addNotification('Refund Processed', `Refund of ₹${amount} issued for ${payment.transactionRef}. Reason: ${reason}`, 'warning');
    showToast(`Refund of ₹${amount} processed successfully!`, 'success');
    return true;
  };

  // Retry Failed Payment
  const retryPayment = (invoiceId: string, paymentMethod: PaymentMethodType, methodDetails: any): boolean => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return false;

    const newPayment: Payment = {
      id: 'pay_' + Date.now(),
      transactionRef: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase() + '_RETRY',
      invoiceId,
      customerId: invoice.customerId,
      amount: invoice.total,
      currency: settings.currency,
      method: paymentMethod,
      methodDetails,
      status: 'succeeded',
      date: `${simulationDate} ${new Date().toTimeString().split(' ')[0]}`
    };

    setPayments(prev => [newPayment, ...prev]);
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'paid', paidDate: simulationDate } : inv));

    // If subscription was past_due, restore to active
    if (invoice.subscriptionId) {
      setSubscriptions(prev => prev.map(s => s.id === invoice.subscriptionId ? { ...s, status: 'active' } : s));
    }

    showToast(`Payment of ₹${invoice.total} succeeded! Invoice marked as paid.`, 'success');
    addNotification('Payment Recovered', `Invoice ${invoice.invoiceNumber} paid via retry.`, 'success');
    return true;
  };

  const markInvoicePaid = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: 'paid', paidDate: simulationDate } : i));
    
    // Create record in payments
    const newPayment: Payment = {
      id: 'pay_' + Date.now(),
      transactionRef: 'TXN_MANUAL_' + Date.now().toString(36).toUpperCase(),
      invoiceId,
      customerId: invoice.customerId,
      amount: invoice.total,
      currency: settings.currency,
      method: 'netbanking',
      methodDetails: { bankName: 'Manual Admin Reconciliation' },
      status: 'succeeded',
      date: `${simulationDate} 12:00:00`
    };
    setPayments(prev => [newPayment, ...prev]);

    if (invoice.subscriptionId) {
      setSubscriptions(prev => prev.map(s => s.id === invoice.subscriptionId ? { ...s, status: 'active' } : s));
    }

    showToast(`Invoice ${invoice.invoiceNumber} marked as Paid`, 'success');
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Platform settings saved', 'success');
  };

  // Time Machine Simulator
  const advanceTime = (days: number) => {
    const newDate = addDaysToDate(simulationDate, days);
    setSimulationDate(newDate);

    let renewedCount = 0;
    let failedCount = 0;
    let cancelledCount = 0;

    // Check subscriptions needing renewal or expiry
    const newInvoices: Invoice[] = [];
    const newPayments: Payment[] = [];

    setSubscriptions(prevSubs => {
      return prevSubs.map(sub => {
        // If subscription is due for action
        if (sub.status === 'active' && sub.currentPeriodEnd <= newDate) {
          if (sub.cancelAtPeriodEnd) {
            cancelledCount++;
            return {
              ...sub,
              status: 'cancelled' as const,
              cancelledAt: newDate
            };
          }

          if (sub.autoRenew) {
            const plan = plans.find(p => p.id === sub.planId);
            if (!plan) return sub;

            const cycleDays = getCycleDays(sub.billingCycle);
            const nextPeriodEnd = addDaysToDate(sub.currentPeriodEnd, cycleDays);
            const subtotal = plan.billingCycles[sub.billingCycle];
            const tax = Number(((subtotal * settings.defaultTaxRate) / 100).toFixed(2));
            const total = Number((subtotal + tax).toFixed(2));

            const invId = 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
            const invNum = 'INV-' + new Date(newDate).getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

            // Simulate occasional payment failure if enabled in settings
            const willFail = settings.enableSimulatedFailures && Math.random() < 0.25;

            if (willFail) {
              failedCount++;
              const failInv: Invoice = {
                id: invId,
                invoiceNumber: invNum,
                customerId: sub.customerId,
                subscriptionId: sub.id,
                planId: sub.planId,
                billingCycle: sub.billingCycle,
                subtotal,
                taxRate: settings.defaultTaxRate,
                taxAmount: tax,
                discountAmount: 0,
                total,
                status: 'failed',
                issueDate: newDate,
                dueDate: addDaysToDate(newDate, 7),
                items: [
                  {
                    id: 'item_' + Date.now(),
                    description: `Automatic Renewal - ${plan.name} (${sub.billingCycle})`,
                    quantity: 1,
                    unitPrice: subtotal,
                    total: subtotal
                  }
                ]
              };
              newInvoices.push(failInv);

              newPayments.push({
                id: 'pay_' + Date.now(),
                transactionRef: 'TXN_FAIL_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                invoiceId: invId,
                customerId: sub.customerId,
                amount: total,
                currency: settings.currency,
                method: 'card',
                methodDetails: { cardBrand: 'Visa', cardLast4: '4242' },
                status: 'failed',
                date: `${newDate} 00:00:00`,
                failureReason: 'Recurring charge declined (Simulated card expiry)'
              });

              return {
                ...sub,
                status: 'past_due' as const
              };
            } else {
              renewedCount++;
              const successInv: Invoice = {
                id: invId,
                invoiceNumber: invNum,
                customerId: sub.customerId,
                subscriptionId: sub.id,
                planId: sub.planId,
                billingCycle: sub.billingCycle,
                subtotal,
                taxRate: settings.defaultTaxRate,
                taxAmount: tax,
                discountAmount: 0,
                total,
                status: 'paid',
                issueDate: newDate,
                dueDate: addDaysToDate(newDate, 7),
                paidDate: newDate,
                items: [
                  {
                    id: 'item_' + Date.now(),
                    description: `Automatic Renewal - ${plan.name} (${sub.billingCycle})`,
                    quantity: 1,
                    unitPrice: subtotal,
                    total: subtotal
                  }
                ]
              };
              newInvoices.push(successInv);

              newPayments.push({
                id: 'pay_' + Date.now(),
                transactionRef: 'TXN_RENEW_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                invoiceId: invId,
                customerId: sub.customerId,
                amount: total,
                currency: settings.currency,
                method: 'card',
                methodDetails: { cardBrand: 'Mastercard', cardLast4: '8888' },
                status: 'succeeded',
                date: `${newDate} 00:00:00`
              });

              return {
                ...sub,
                currentPeriodStart: sub.currentPeriodEnd,
                currentPeriodEnd: nextPeriodEnd,
                status: 'active' as const
              };
            }
          }
        }
        return sub;
      });
    });

    if (newInvoices.length > 0) {
      setInvoices(prev => [...newInvoices, ...prev]);
    }
    if (newPayments.length > 0) {
      setPayments(prev => [...newPayments, ...prev]);
    }

    addNotification(
      'Simulation Time Advanced',
      `Clock moved forward by ${days} days to ${newDate}. Auto-renewed: ${renewedCount}, Failed: ${failedCount}, Cancelled: ${cancelledCount}`,
      'info'
    );
    showToast(`Advanced ${days} days to ${newDate}. ${renewedCount} renewals processed.`, 'info');
  };

  // Trigger immediate manual renewal
  const triggerManualRenewal = (subscriptionId: string, forceFail: boolean = false) => {
    const sub = subscriptions.find(s => s.id === subscriptionId);
    if (!sub) return;

    const plan = plans.find(p => p.id === sub.planId);
    const customer = customers.find(c => c.id === sub.customerId);
    if (!plan || !customer) return;

    const cycleDays = getCycleDays(sub.billingCycle);
    const nextPeriodEnd = addDaysToDate(sub.currentPeriodEnd, cycleDays);
    const subtotal = plan.billingCycles[sub.billingCycle];
    const tax = Number(((subtotal * settings.defaultTaxRate) / 100).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const invId = 'inv_' + Date.now();
    const invNum = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    if (forceFail) {
      const failInv: Invoice = {
        id: invId,
        invoiceNumber: invNum,
        customerId: sub.customerId,
        subscriptionId: sub.id,
        planId: sub.planId,
        billingCycle: sub.billingCycle,
        subtotal,
        taxRate: settings.defaultTaxRate,
        taxAmount: tax,
        discountAmount: 0,
        total,
        status: 'failed',
        issueDate: simulationDate,
        dueDate: addDaysToDate(simulationDate, 7),
        items: [{ id: 'item_' + Date.now(), description: `Manual Renewal Failure Test - ${plan.name}`, quantity: 1, unitPrice: subtotal, total: subtotal }]
      };
      setInvoices(prev => [failInv, ...prev]);
      setPayments(prev => [{
        id: 'pay_' + Date.now(),
        transactionRef: 'TXN_TEST_FAIL_' + Date.now().toString(36).toUpperCase(),
        invoiceId: invId,
        customerId: sub.customerId,
        amount: total,
        currency: settings.currency,
        method: 'card',
        methodDetails: { cardBrand: 'Visa', cardLast4: '0000' },
        status: 'failed',
        date: `${simulationDate} ${new Date().toTimeString().split(' ')[0]}`,
        failureReason: 'Card declined by user simulation request'
      }, ...prev]);

      setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, status: 'past_due' } : s));
      showToast('Simulated renewal payment failed! Status set to Past Due.', 'warning');
    } else {
      const successInv: Invoice = {
        id: invId,
        invoiceNumber: invNum,
        customerId: sub.customerId,
        subscriptionId: sub.id,
        planId: sub.planId,
        billingCycle: sub.billingCycle,
        subtotal,
        taxRate: settings.defaultTaxRate,
        taxAmount: tax,
        discountAmount: 0,
        total,
        status: 'paid',
        issueDate: simulationDate,
        dueDate: addDaysToDate(simulationDate, 7),
        paidDate: simulationDate,
        items: [{ id: 'item_' + Date.now(), description: `Manual Renewal - ${plan.name} (${sub.billingCycle})`, quantity: 1, unitPrice: subtotal, total: subtotal }]
      };
      setInvoices(prev => [successInv, ...prev]);
      setPayments(prev => [{
        id: 'pay_' + Date.now(),
        transactionRef: 'TXN_MANUAL_RENEW_' + Date.now().toString(36).toUpperCase(),
        invoiceId: invId,
        customerId: sub.customerId,
        amount: total,
        currency: settings.currency,
        method: 'card',
        methodDetails: { cardBrand: 'Visa', cardLast4: '4242' },
        status: 'succeeded',
        date: `${simulationDate} ${new Date().toTimeString().split(' ')[0]}`
      }, ...prev]);

      setSubscriptions(prev => prev.map(s => {
        if (s.id === subscriptionId) {
          return {
            ...s,
            currentPeriodStart: s.currentPeriodEnd,
            currentPeriodEnd: nextPeriodEnd,
            status: 'active'
          };
        }
        return s;
      }));
      showToast(`Subscription for ${customer.company} renewed successfully until ${nextPeriodEnd}!`, 'success');
    }
  };

  const resetDemoData = () => {
    localStorage.clear();
    setPlans(INITIAL_PLANS);
    setCustomers(INITIAL_CUSTOMERS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setCoupons(INITIAL_COUPONS);
    setSettings(DEFAULT_SETTINGS);
    setSimulationDate('2026-10-01');
    setRoleState('admin');
    setCurrentCustomerIdState('cust_technova');
    setNotifications([
      {
        id: 'notif_reset',
        title: 'Demo Data Restored',
        message: 'All subscription data and analytics reset to default state.',
        timestamp: 'Just now',
        type: 'info',
        read: false
      }
    ]);
    showToast('Platform reset to initial demo state', 'info');
  };

  // Financial Analytics Computation
  const analytics = useMemo(() => {
    // MRR Calculation: sum of monthly equivalent for all active subscriptions
    let mrr = 0;
    let activeCount = 0;
    let trialingCount = 0;
    let pastDueCount = 0;
    let cancelledCount = 0;

    subscriptions.forEach(sub => {
      if (sub.status === 'active') {
        activeCount++;
        const plan = plans.find(p => p.id === sub.planId);
        if (plan) {
          if (sub.billingCycle === 'monthly') {
            mrr += plan.billingCycles.monthly;
          } else if (sub.billingCycle === 'quarterly') {
            mrr += plan.billingCycles.quarterly / 3;
          } else if (sub.billingCycle === 'yearly') {
            mrr += plan.billingCycles.yearly / 12;
          }
        }
      } else if (sub.status === 'trialing') {
        trialingCount++;
      } else if (sub.status === 'past_due') {
        pastDueCount++;
      } else if (sub.status === 'cancelled') {
        cancelledCount++;
      }
    });

    const arr = mrr * 12;

    // Gross Revenue from Succeeded Payments
    let totalRevenue = 0;
    let totalRefunds = 0;

    payments.forEach(pay => {
      if (pay.status === 'succeeded' || pay.status === 'refunded') {
        totalRevenue += pay.amount;
      }
      if (pay.refundedAmount) {
        totalRefunds += pay.refundedAmount;
      }
    });

    const netRevenue = Math.max(0, totalRevenue - totalRefunds);
    const totalCustomersWithSubs = activeCount + trialingCount + pastDueCount + cancelledCount;
    const churnRate = totalCustomersWithSubs > 0 ? Number(((cancelledCount / totalCustomersWithSubs) * 100).toFixed(1)) : 0;
    const arpu = activeCount > 0 ? Number((mrr / activeCount).toFixed(2)) : 0;

    return {
      mrr: Math.round(mrr),
      arr: Math.round(arr),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      netRevenue: Number(netRevenue.toFixed(2)),
      totalRefunds: Number(totalRefunds.toFixed(2)),
      activeSubscriptionsCount: activeCount,
      trialingSubscriptionsCount: trialingCount,
      pastDueSubscriptionsCount: pastDueCount,
      cancelledSubscriptionsCount: cancelledCount,
      churnRate,
      arpu
    };
  }, [subscriptions, plans, payments]);

  return (
    <BillingContext.Provider
      value={{
        role,
        setRole,
        currentCustomerId,
        setCurrentCustomerId,
        currentCustomer,
        plans,
        customers,
        subscriptions,
        invoices,
        payments,
        coupons,
        settings,
        notifications,
        simulationDate,
        toasts,
        viewingInvoice,
        setViewingInvoice,
        showToast,
        removeToast,
        markNotificationRead,
        clearAllNotifications,
        createPlan,
        updatePlan,
        togglePlanStatus,
        deletePlan,
        createCustomer,
        updateCustomer,
        updateCustomerUsage,
        subscribeToPlan,
        changePlan,
        cancelSubscription,
        reactivateSubscription,
        pauseSubscription,
        resumeSubscription,
        processRefund,
        retryPayment,
        markInvoicePaid,
        createCoupon,
        toggleCouponStatus,
        deleteCoupon,
        validateCoupon,
        updateSettings,
        advanceTime,
        triggerManualRenewal,
        resetDemoData,
        analytics
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};
