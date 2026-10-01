import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { Plan, BillingCycle, PaymentMethodType } from '../../types';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Smartphone,
  Landmark,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  X,
  Lock,
  Sparkles,
  QrCode
} from 'lucide-react';

interface CheckoutModalProps {
  plan: Plan;
  initialCycle?: BillingCycle;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  initialCycle = 'monthly',
  onClose,
  onSuccess
}) => {
  const {
    currentCustomerId,
    currentCustomer,
    settings,
    subscribeToPlan,
    validateCoupon,
    setViewingInvoice
  } = useBilling();

  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const [method, setMethod] = useState<PaymentMethodType>('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [testFail, setTestFail] = useState(false);

  // Card form states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(currentCustomer?.name || 'Alex Rivera');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // UPI state
  const [upiId, setUpiId] = useState(`${currentCustomer?.email.split('@')[0] || 'alex'}@okhdfcbank`);

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Pricing math
  const subtotal = plan.billingCycles[cycle];
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number(((taxableAmount * settings.defaultTaxRate) / 100).toFixed(2));
  const total = Number((taxableAmount + tax).toFixed(2));

  // Cycle savings label
  const getCycleSavings = () => {
    if (cycle === 'yearly') {
      const regularYear = plan.billingCycles.monthly * 12;
      const saved = regularYear - plan.billingCycles.yearly;
      return `Save ₹${saved.toLocaleString('en-IN')} (2 months free!)`;
    }
    if (cycle === 'quarterly') {
      const regularQuarter = plan.billingCycles.monthly * 3;
      const saved = regularQuarter - plan.billingCycles.quarterly;
      return `Save ₹${saved.toLocaleString('en-IN')}`;
    }
    return null;
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponCode.trim()) return;

    const res = validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setAppliedCoupon({
        code: res.coupon!.code,
        discountAmount: res.discountAmount
      });
      setCouponError(null);
    } else {
      setCouponError(res.error || 'Invalid coupon code');
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      let methodDetails = {};
      if (method === 'card') {
        methodDetails = {
          cardBrand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
          cardLast4: cardNumber.replace(/\D/g, '').slice(-4) || '4242'
        };
      } else if (method === 'upi') {
        methodDetails = { upiId };
      } else {
        methodDetails = { bankName: selectedBank };
      }

      const res = subscribeToPlan({
        customerId: currentCustomerId,
        planId: plan.id,
        billingCycle: cycle,
        paymentMethod: method,
        methodDetails,
        couponCode: appliedCoupon?.code,
        simulateFailure: testFail
      });

      setIsProcessing(false);

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onSuccess) onSuccess();
        onClose();
        if (res.invoice) {
          setViewingInvoice(res.invoice);
        }
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Simulated Checkout & Subscription
              </h2>
              <p className="text-[11px] text-slate-500">
                100% Mock Payment Sandbox • No real card charged
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitPayment} className="p-6 space-y-6">
          
          {/* Step 1: Plan Summary & Billing Cycle selection */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Target Plan
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {plan.name} Plan
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {plan.description}
                </p>
              </div>

              {/* Cycle Toggle */}
              <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
                {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCycle(c)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                      cycle === c
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {getCycleSavings() && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                {getCycleSavings()}
              </div>
            )}
          </div>

          {/* Step 2: Payment Method Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Simulated Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-semibold gap-1.5 ${
                  method === 'card'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-semibold gap-1.5 ${
                  method === 'upi'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('netbanking')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-semibold gap-1.5 ${
                  method === 'netbanking'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Landmark className="w-5 h-5" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Method Inputs */}
            <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              {method === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Mock Card Details</span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                      Test Card Auto-Filled
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white flex items-center justify-center shrink-0">
                      <QrCode className="w-full h-full text-slate-800" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Scan with any UPI App
                      </p>
                      <p className="text-[11px] text-slate-500">
                        GPay, PhonePe, Paytm, or enter your VPA / UPI ID below
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="space-y-3">
                  <label className="text-[11px] text-slate-500 block">Select Corporate or Retail Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    You will be redirected to a simulated bank authorization page.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Coupon Code Input */}
          <div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code (e.g. STARTUP20, SAVE500)"
                  className="w-full pl-9 pr-3 py-2 text-xs uppercase font-mono tracking-wider rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <div className="mt-2 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <span className="flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  Code {appliedCoupon.code} applied (-₹{appliedCoupon.discountAmount})
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-emerald-700 dark:text-emerald-300 hover:underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {couponError}
              </p>
            )}
          </div>

          {/* Step 4: Breakdown and Order Totals */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Plan Base ({cycle}):</span>
              <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Discount:</span>
                <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>GST ({settings.defaultTaxRate}%):</span>
              <span className="font-mono">₹{tax.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white">
              <span>Total Payable Now:</span>
              <span className="text-base font-mono text-indigo-600 dark:text-indigo-400">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Test Sandbox Simulation Option */}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Simulate Bank Failure
                </span>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Test the dunning flow and past-due notification
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={testFail}
              onChange={(e) => setTestFail(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {isProcessing ? 'Authorizing Mock Payment...' : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
