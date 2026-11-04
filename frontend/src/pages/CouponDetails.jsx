import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconCoupons, IconEdit } from "../components/Icons";

function CouponDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/coupons/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Coupon not found");
        }
        return response.json();
      })
      .then((data) => {
        setCoupon(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load coupon details.");
        setLoading(false);
      });
  }, [id]);

  const remainingUses =
    coupon?.maxUses === null || coupon?.maxUses === undefined
      ? "Unlimited"
      : Math.max(coupon.maxUses - (coupon.usedCount || 0), 0);

  const discountText =
    coupon?.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% OFF`
      : `₹${Number(coupon?.discountValue || 0).toLocaleString("en-IN")} OFF`;

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <BackButton to="/coupons" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconCoupons className="w-6 h-6 text-purple-400" />
                  Coupon #{id}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Promo voucher rules and real-time redemption counter
                </p>
              </div>
            </div>

            {coupon && (
              <button
                onClick={() => navigate(`/coupons/edit/${coupon.id}`)}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <IconEdit className="w-3.5 h-3.5" />
                <span>Edit Coupon</span>
              </button>
            )}
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving coupon voucher..." />
            </GlassCard>
          ) : !coupon ? (
            <GlassCard className="p-8 text-center text-slate-400">
              Coupon record not found.
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10 space-y-6">
              {/* Promo Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono font-black text-xl tracking-wider">
                    {coupon.code}
                  </span>
                  <div>
                    <p className="text-base font-bold text-white">{discountText}</p>
                    <p className="text-xs text-slate-400">Promotion Type: {coupon.discountType}</p>
                  </div>
                </div>

                <div>
                  <GlassBadge status={coupon.status} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Used Count
                  </span>
                  <p className="text-xl font-bold text-white">{coupon.usedCount || 0}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Times redeemed</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Remaining Quota
                  </span>
                  <p className="text-xl font-bold text-sky-400">{remainingUses}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cap: {coupon.maxUses || "Unlimited"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Expiration Date
                  </span>
                  <p className="text-sm font-semibold text-white mt-1">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "No Expiration"}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => navigate("/coupons")}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ← Back to Coupons
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default CouponDetails;
