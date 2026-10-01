import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import {
  FastForward,
  RotateCcw,
  AlertTriangle,
  Zap,
  HelpCircle,
  Play
} from 'lucide-react';

export const SimulationControlBar: React.FC = () => {
  const {
    simulationDate,
    advanceTime,
    resetDemoData,
    settings,
    updateSettings,
    role
  } = useBilling();

  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900/40 text-slate-200 text-xs py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Simulator Badge & Info */}
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold tracking-wide uppercase text-[10px]">
            <Zap className="w-3 h-3 text-amber-400" />
            Billing Simulator Sandbox
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Fast-forward time to test automatic renewals, prorations, and invoice generation.
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Failure Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={settings.enableSimulatedFailures}
              onChange={(e) => updateSettings({ enableSimulatedFailures: e.target.checked })}
              className="rounded border-slate-600 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 bg-slate-900"
            />
            <span className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Simulate Payment Failure
            </span>
          </label>

          {/* Time machine buttons */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => advanceTime(7)}
              className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-indigo-600 hover:text-white text-slate-300 font-medium transition-all"
              title="Jump 7 days forward"
            >
              <FastForward className="w-3 h-3" />
              <span>+7 Days</span>
            </button>
            <div className="w-[1px] h-3 bg-slate-700 my-auto" />
            <button
              onClick={() => advanceTime(30)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white font-medium transition-all"
              title="Jump 30 days forward (triggers monthly cycle auto-renewals!)"
            >
              <Play className="w-3 h-3 text-emerald-400" />
              <span>+30 Days (Renewals)</span>
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo plans, subscriptions, and payments back to initial state?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800 text-slate-400 border border-slate-700 transition-all text-[11px]"
            title="Reset sandbox data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Sandbox</span>
          </button>

          {/* Help Tooltip */}
          <div className="relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              title="How does the simulator work?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {showHelp && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 text-[11px] leading-relaxed text-slate-300 space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  How the Billing Engine Works
                </div>
                <p>
                  • <strong>No Real Money:</strong> All transactions run via mock gateway cards, UPI IDs, and Net Banking.
                </p>
                <p>
                  • <strong>Time Travel:</strong> Click <strong>+30 Days</strong> to advance the date past subscription periods. Active subscriptions will auto-charge and generate renewal invoices!
                </p>
                <p>
                  • <strong>Role Exploration:</strong> Switch between <strong>Admin</strong> (create plans, monitor MRR), <strong>Customer</strong> (subscribe, upgrade, view invoices), and <strong>Finance</strong> (refunds, reconcile).
                </p>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full mt-2 py-1 text-center font-medium text-indigo-400 hover:text-indigo-300 border-t border-slate-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
