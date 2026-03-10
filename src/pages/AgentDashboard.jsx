import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  Users,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Building2,
  Search,
  Plus,
  ChevronRight,
  Loader2,
  MessageSquare,
  FileText,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";

const AgentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingFollowups: 0,
  });
  const [customers, setCustomers] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewFollowup, setShowNewFollowup] = useState(false);
  const [newFollowup, setNewFollowup] = useState({
    customer: "",
    type: "call",
    title: "",
    notes: "",
    scheduled_at: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, customersRes, followupsRes, reservationsRes] =
        await Promise.allSettled([
          api.get("/dashboard/agent-stats"),
          api.get("/admin/users?role=customer"),
          api.get("/followups/today"),
          api.get("/reservations?mine=true"),
        ]);

      if (statsRes.status === "fulfilled")
        setStats(statsRes.value.data.data || statsRes.value.data || stats);
      if (customersRes.status === "fulfilled")
        setCustomers(
          customersRes.value.data.data || customersRes.value.data.users || [],
        );
      if (followupsRes.status === "fulfilled")
        setFollowups(followupsRes.value.data.data || []);
      if (reservationsRes.status === "fulfilled")
        setReservations(
          reservationsRes.value.data.data ||
            reservationsRes.value.data.reservations ||
            [],
        );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const completeFollowup = async (id, outcome) => {
    try {
      await api.patch(`/followups/${id}/complete`, { outcome });
      toast.success("Follow-up completed");
      fetchDashboardData();
    } catch {
      toast.error("Failed to complete follow-up");
    }
  };

  const createFollowup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/followups", newFollowup);
      toast.success("Follow-up created");
      setShowNewFollowup(false);
      setNewFollowup({
        customer: "",
        type: "call",
        title: "",
        notes: "",
        scheduled_at: "",
      });
      fetchDashboardData();
    } catch {
      toast.error("Failed to create follow-up");
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery),
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "customers", label: "Customers", icon: Users },
    { id: "followups", label: "Follow-ups", icon: Phone },
    { id: "reservations", label: "Reservations", icon: Building2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "My Customers",
                  value: stats.totalCustomers || customers.length,
                  icon: Users,
                  color: "blue",
                },
                {
                  label: "Sales This Month",
                  value: stats.totalSales || reservations.length,
                  icon: Target,
                  color: "green",
                },
                {
                  label: "Revenue",
                  value: `${((stats.totalRevenue || 0) / 1_000_000).toFixed(1)}M`,
                  icon: TrendingUp,
                  color: "indigo",
                  suffix: "EGP",
                },
                {
                  label: "Today's Follow-ups",
                  value: followups.length,
                  icon: Phone,
                  color: "amber",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}{" "}
                    {stat.suffix && (
                      <span className="text-sm font-normal text-gray-500">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Today's Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Today's Tasks
              </h2>
              {followups.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">
                  No tasks scheduled for today ✨
                </p>
              ) : (
                <div className="space-y-3">
                  {followups.map((f) => (
                    <div
                      key={f._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            f.type === "call"
                              ? "bg-blue-100 text-blue-600"
                              : f.type === "visit"
                                ? "bg-green-100 text-green-600"
                                : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {f.type === "call" ? (
                            <Phone className="h-4 w-4" />
                          ) : f.type === "visit" ? (
                            <Calendar className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {f.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {f.customer?.name} •{" "}
                            {f.scheduled_at &&
                              format(new Date(f.scheduled_at), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => completeFollowup(f._id, "Completed")}
                        className="text-sm text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        ✓ Done
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">
                          {c.name}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {c.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {c.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            c.is_active !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <a
                            href={`tel:${c.phone}`}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                          <a
                            href={`https://wa.me/${c.phone?.replace(/\D/g, "")}`}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-green-600"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCustomers.length === 0 && (
                <p className="text-center py-8 text-gray-500 text-sm">
                  No customers found
                </p>
              )}
            </div>
          </div>
        )}

        {/* Follow-ups Tab */}
        {activeTab === "followups" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Follow-ups
              </h2>
              <button
                onClick={() => setShowNewFollowup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Follow-up
              </button>
            </div>

            {/* New Follow-up Form */}
            {showNewFollowup && (
              <form
                onSubmit={createFollowup}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="font-semibold mb-4">Create Follow-up</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={newFollowup.customer}
                    onChange={(e) =>
                      setNewFollowup({
                        ...newFollowup,
                        customer: e.target.value,
                      })
                    }
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newFollowup.type}
                    onChange={(e) =>
                      setNewFollowup({
                        ...newFollowup,
                        type: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="call">📞 Call</option>
                    <option value="visit">🏢 Visit</option>
                    <option value="document_followup">📄 Document</option>
                    <option value="payment_reminder">💳 Payment</option>
                    <option value="other">📌 Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Title"
                    required
                    value={newFollowup.title}
                    onChange={(e) =>
                      setNewFollowup({
                        ...newFollowup,
                        title: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="datetime-local"
                    required
                    value={newFollowup.scheduled_at}
                    onChange={(e) =>
                      setNewFollowup({
                        ...newFollowup,
                        scheduled_at: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <textarea
                    placeholder="Notes"
                    value={newFollowup.notes}
                    onChange={(e) =>
                      setNewFollowup({
                        ...newFollowup,
                        notes: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm sm:col-span-2"
                    rows={2}
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewFollowup(false)}
                    className="text-gray-500 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Follow-ups List */}
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {followups.length === 0 ? (
                <p className="text-center py-8 text-gray-500 text-sm">
                  No follow-ups scheduled
                </p>
              ) : (
                followups.map((f) => (
                  <div
                    key={f._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          f.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {f.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {f.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {f.customer?.name} •{" "}
                          {f.scheduled_at
                            ? format(new Date(f.scheduled_at), "MMM d, h:mm a")
                            : ""}
                        </p>
                      </div>
                    </div>
                    {f.status === "pending" && (
                      <button
                        onClick={() => completeFollowup(f._id, "Done")}
                        className="text-sm font-medium text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Reservation #
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Unit
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        {r.reservation_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {r.user?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.unit?.unit_number || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            r.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : r.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {r.createdAt
                          ? format(new Date(r.createdAt), "MMM d, yyyy")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reservations.length === 0 && (
                <p className="text-center py-8 text-gray-500 text-sm">
                  No reservations yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
