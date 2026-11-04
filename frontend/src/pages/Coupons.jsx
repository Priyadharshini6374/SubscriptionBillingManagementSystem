import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconCoupons, IconPlus, IconSearch, IconEye, IconEdit } from "../components/Icons";

function Coupons() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/coupons`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load coupons");
      }

      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      setError(err.message || "Failed to fetch coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${Number(coupon.discountValue)}% OFF`;
    }
    return `₹${Number(coupon.discountValue).toLocaleString("en-IN")} OFF`;
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconCoupons className="w-6 h-6 text-purple-400" />
                Coupons & Discounts
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage promotional discount vouchers, redemption caps, and validity
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/coupons/create")}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchCoupons} />}

        {/* Search */}
        <div className="mb-6 max-w-md relative">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coupons by promo code..."
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-500"
          />
        </div>

        {/* Content Table */}
        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving coupon configurations..." />
          </GlassCard>
        ) : coupons.length === 0 ? (
          <EmptyState
            icon={IconCoupons}
            title="No promotional coupons found"
            description="Create promotional codes with percentage or fixed fee discounts to boost subscription sales."
            actionText="+ Create Coupon"
            onAction={() => navigate("/coupons/create")}
          />
        ) : filteredCoupons.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-slate-400">
            No coupons match your search query.
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Promo Code</th>
                    <th className="px-6 py-4">Benefit</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Usage Count</th>
                    <th className="px-6 py-4">Expiration</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCoupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Code */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono font-bold tracking-wider text-xs">
                          {coupon.code}
                        </span>
                      </td>

                      {/* Benefit */}
                      <td className="px-6 py-4 font-bold text-white">
                        {formatDiscount(coupon)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <GlassBadge status={coupon.status} />
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-4 text-slate-300">
                        <span className="font-semibold text-white">{coupon.usedCount || 0}</span>
                        <span className="text-slate-500"> / {coupon.maxUses || "Unlimited"}</span>
                      </td>

                      {/* Expiration */}
                      <td className="px-6 py-4 text-slate-400">
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "No expiry"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/coupons/${coupon.id}`)}
                            className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <IconEye className="w-3.5 h-3.5 text-purple-400" />
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => navigate(`/coupons/edit/${coupon.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                            title="Edit coupon"
                          >
                            <IconEdit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Showing {filteredCoupons.length} of {coupons.length} coupons</span>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default Coupons;
