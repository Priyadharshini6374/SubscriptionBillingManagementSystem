import React, { useState, useEffect } from 'react';
import { BillingProvider, useBilling } from './context/BillingContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { SimulationControlBar } from './components/simulator/SimulationControlBar';
import { InvoiceModal } from './components/invoice/InvoiceModal';
import { ToastContainer } from './components/common/ToastContainer';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PlanManagement } from './components/admin/PlanManagement';
import { CustomerList } from './components/admin/CustomerList';
import { SubscriptionList } from './components/admin/SubscriptionList';
import { InvoiceList } from './components/admin/InvoiceList';
import { PaymentList } from './components/admin/PaymentList';
import { CouponManagement } from './components/admin/CouponManagement';
import { RevenueAnalytics } from './components/admin/RevenueAnalytics';
import { SettingsView } from './components/admin/SettingsView';

// Customer Views
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { BrowsePlans } from './components/customer/BrowsePlans';
import { CurrentSubscription } from './components/customer/CurrentSubscription';
import { CustomerInvoices } from './components/customer/CustomerInvoices';
import { CustomerPaymentHistory } from './components/customer/CustomerPaymentHistory';

// Finance Views
import { FinanceDashboard } from './components/finance/FinanceDashboard';
import { RefundManagement } from './components/finance/RefundManagement';
import { FinancialReports } from './components/finance/FinancialReports';

const AppContent: React.FC = () => {
  const { role } = useBilling();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Reset tab to dashboard when role changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  const renderContent = () => {
    if (role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard onNavigate={setActiveTab} />;
        case 'plans':
          return <PlanManagement />;
        case 'customers':
          return <CustomerList />;
        case 'subscriptions':
          return <SubscriptionList />;
        case 'invoices':
          return <InvoiceList />;
        case 'payments':
          return <PaymentList />;
        case 'coupons':
          return <CouponManagement />;
        case 'analytics':
          return <RevenueAnalytics />;
        case 'settings':
          return <SettingsView />;
        default:
          return <AdminDashboard onNavigate={setActiveTab} />;
      }
    }

    if (role === 'customer') {
      switch (activeTab) {
        case 'dashboard':
          return <CustomerDashboard onNavigate={setActiveTab} />;
        case 'plans':
          return <BrowsePlans />;
        case 'subscription':
          return <CurrentSubscription onNavigate={setActiveTab} />;
        case 'invoices':
          return <CustomerInvoices />;
        case 'history':
          return <CustomerPaymentHistory />;
        default:
          return <CustomerDashboard onNavigate={setActiveTab} />;
      }
    }

    if (role === 'finance') {
      switch (activeTab) {
        case 'dashboard':
          return <FinanceDashboard onNavigate={setActiveTab} />;
        case 'payments':
          return <PaymentList />;
        case 'invoices':
          return <InvoiceList />;
        case 'revenue':
          return <RevenueAnalytics />;
        case 'refunds':
          return <RefundManagement />;
        case 'reports':
          return <FinancialReports />;
        default:
          return <FinanceDashboard onNavigate={setActiveTab} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Simulator Sandbox Control Bar */}
      <SimulationControlBar />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Role-Aware Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
          {renderContent()}
        </main>

      </div>

      {/* Modals & Overlays */}
      <InvoiceModal />
      <ToastContainer />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BillingProvider>
      <AppContent />
    </BillingProvider>
  );
};

export default App;
