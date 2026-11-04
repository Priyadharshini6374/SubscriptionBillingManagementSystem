import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconCustomers } from "../components/Icons";

function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/customers/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load customer.");
        return;
      }

      setFormData({
        name: data.name || "",
        email: data.email || "",
        status: data.status === "INACTIVE" ? "Inactive" : "Active",
      });
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Customer name is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          status: formData.status.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update customer.");
        return;
      }

      navigate("/customers");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton to="/customers" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconCustomers className="w-6 h-6 text-sky-400" />
                  Edit Customer #{id}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Update customer identity, email address, or account status
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Loading customer details..." />
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Customer Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                    required
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Account Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                  >
                    <option value="Active" className="bg-slate-900 text-white">Active</option>
                    <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/customers")}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default EditCustomer;
