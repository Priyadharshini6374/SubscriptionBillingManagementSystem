import React from "react";
import { IconAlertCircle } from "./Icons";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Top Left Indigo Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-[128px]" />
      {/* Center Right Purple Glow */}
      <div className="absolute top-1/4 -right-40 h-[32rem] w-[32rem] rounded-full bg-purple-600/12 blur-[140px]" />
      {/* Bottom Center Electric Blue Glow */}
      <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[130px]" />
    </div>
  );
}

export function GlassBadge({ status, label }) {
  const s = (status || "").toUpperCase();
  const display = label || status || "Unknown";

  let colorClasses = "bg-slate-500/15 text-slate-300 border-slate-500/25";
  let dotClass = "bg-slate-400";

  if (["ACTIVE", "SUCCESS", "COMPLETED", "PAID"].includes(s)) {
    colorClasses = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    dotClass = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]";
  } else if (["TRIAL", "IN_TRIAL", "PROCESSING"].includes(s)) {
    colorClasses = "bg-sky-500/15 text-sky-300 border-sky-500/30";
    dotClass = "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]";
  } else if (["PENDING", "PAST_DUE", "OPEN"].includes(s)) {
    colorClasses = "bg-amber-500/15 text-amber-300 border-amber-500/30";
    dotClass = "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]";
  } else if (["CANCELLED", "FAILED", "EXPIRED", "UNPAID", "OVERDUE"].includes(s)) {
    colorClasses = "bg-rose-500/15 text-rose-300 border-rose-500/30";
    dotClass = "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]";
  } else if (["REFUNDED"].includes(s)) {
    colorClasses = "bg-purple-500/15 text-purple-300 border-purple-500/30";
    dotClass = "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${colorClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {display}
    </span>
  );
}

export function GlassCard({ children, className = "", hover = false }) {
  return (
    <div className={`glass-card rounded-2xl ${hover ? "glass-card-hover" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="glass-card rounded-2xl p-12 text-center border border-white/10 max-w-lg mx-auto my-8">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.2)]">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-400 tracking-wide">{text}</p>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-950/40 backdrop-blur-md p-4 text-rose-300 flex items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <IconAlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
