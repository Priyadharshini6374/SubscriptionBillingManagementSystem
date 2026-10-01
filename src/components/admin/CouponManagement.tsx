import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { Coupon } from '../../types';
import { Tag, Plus, Check, X, Trash2, Power, Clock, Percent, DollarSign } from 'lucide-react';

export const CouponManagement: React.FC = () => {
  const { coupons, createCoupon, toggleCouponStatus, deleteCoupon, simulationDate } = useBilling();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minOrder, setMinOrder] = useState<number>(500);
  const [maxDiscount, setMaxDiscount] = useState<number>(1000);
  const [validUntil, setValidUntil] = useState('2027-01-01');
  const [maxUses, setMaxUses] = useState<number>(100);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    createCoupon({
      code: code.trim().toUpperCase(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: minOrder > 0 ? Number(minOrder) : undefined,
      maxDiscount: discountType === 'percentage' && maxDiscount > 0 ? Number(maxDiscount) : undefined,
      validUntil,
      maxUses: Number(maxUses),
      active: true
    });

    setIsModalOpen(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs text-slate-500">
            Create discount codes to incentivize new customer conversions and tier upgrades
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((coupon) => {
          const isExpired = coupon.validUntil < simulationDate;

          return (
            <div
              key={coupon.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all ${
                !coupon.active || isExpired ? 'opacity-65 border-dashed border-slate-300 dark:border-slate-700' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-base tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      {coupon.code}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isExpired
                      ? 'bg-rose-50 text-rose-700'
                      : coupon.active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isExpired ? 'Expired' : coupon.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                  </span>
                  <span className="text-xs text-slate-400 uppercase font-bold">OFF</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 min-h-[32px]">
                  {coupon.description}
                </p>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-500">
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{coupon.validUntil}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Redemptions:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{coupon.timesUsed} / {coupon.maxUses}</span>
                  </div>
                  {coupon.minOrderValue && (
                    <div className="flex justify-between">
                      <span>Min Order:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">₹{coupon.minOrderValue}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => toggleCouponStatus(coupon.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    coupon.active
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{coupon.active ? 'Disable' : 'Enable'}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete coupon ${coupon.code}?`)) {
                      deleteCoupon(coupon.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create Promotional Discount
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH30, STARTUP500"
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short note about who this promo applies to"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Value {discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Max Usages</label>
                  <input
                    type="number"
                    min={1}
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
