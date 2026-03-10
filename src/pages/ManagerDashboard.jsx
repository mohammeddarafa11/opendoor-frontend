import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  useManagerDashboard,
  useReservations,
  useUnits,
  useWaitlists,
  useAgents,
  useUpdateReservation,
  useNotifyWaitlist,
} from "../hooks/useUnits";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  TrendingUp,
  BarChart3,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  UserCheck,
  DollarSign,
  Layers,
  AlertTriangle,
  Phone,
} from "lucide-react";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // React Query hooks
  const { data: stats, isLoading: loadingStats } = useManagerDashboard();
  const { data: reservations = [], isLoading: loadingRes } = useReservations();
  const { data: unitsData } = useUnits({ limit: 100 });
  const units = unitsData?.data || unitsData?.units || [];
  const { data: waitlists = [] } = useWaitlists();
  const { data: agents = [] } = useAgents();

  const updateRes = useUpdateReservation();
  const notifyWait = useNotifyWaitlist();

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "reservations", label: "Reservations", icon: Building2 },
    { id: "units", label: "Units", icon: Layers },
    { id: "waitlist", label: "Waitlist", icon: Clock },
    { id: "agents", label: "Agents", icon: Users },
  ];

  const statusBadge = (status) => {
    const map = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-amber-100 text-amber-700",
      cancelled: "bg-red-100 text-red-700",
      available: "bg-green-100 text-green-700",
      reserved: "bg-blue-100 text-blue-700",
      sold: "bg-purple-100 text-purple-700",
      active: "bg-blue-100 text-blue-700",
      notified: "bg-green-100 text-green-700",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-700"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Manager Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back, {user?.name}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl border border-gray-200 p-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {loadingStats ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Units",
                      value: stats?.totalUnits || units.length,
                      icon: Building2,
                      bg: "bg-blue-100",
                      fg: "text-blue-600",
                    },
                    {
                      label: "Available",
                      value:
                        stats?.availableUnits ||
                        units.filter((u) => u.status === "available").length,
                      icon: CheckCircle2,
                      bg: "bg-green-100",
                      fg: "text-green-600",
                    },
                    {
                      label: "Total Reservations",
                      value: stats?.totalReservations || reservations.length,
                      icon: Layers,
                      bg: "bg-purple-100",
                      fg: "text-purple-600",
                    },
                    {
                      label: "Revenue",
                      value: `${((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M`,
                      icon: DollarSign,
                      bg: "bg-amber-100",
                      fg: "text-amber-600",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-white rounded-xl border border-gray-200 p-5"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}
                      >
                        <s.icon className={`w-5 h-5 ${s.fg}`} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {s.value}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent reservations */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Recent Reservations
                  </h2>
                  {reservations.slice(0, 5).map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {r.reservation_number} —{" "}
                          {r.customer?.name || "Customer"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Unit {r.unit?.unit_number} •{" "}
                          {r.createdAt
                            ? format(new Date(r.createdAt), "MMM d")
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {(
                            r.total_price ||
                            r.unit?.total_price ||
                            0
                          ).toLocaleString()}{" "}
                          EGP
                        </span>
                        {statusBadge(r.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* RESERVATIONS */}
        {activeTab === "reservations" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                All Reservations
              </h2>
            </div>
            {loadingRes ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {[
                        "ID",
                        "Customer",
                        "Unit",
                        "Agent",
                        "Amount",
                        "Status",
                        "Date",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr
                        key={r._id}
                        className="border-t border-gray-50 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">
                          {r.reservation_number}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {r.customer?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          #{r.unit?.unit_number}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {r.assigned_agent?.name || "Unassigned"}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {(
                            r.total_price ||
                            r.unit?.total_price ||
                            0
                          ).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">{statusBadge(r.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {r.createdAt
                            ? format(new Date(r.createdAt), "MMM d, yyyy")
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {r.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateRes.mutate(
                                      {
                                        id: r._id,
                                        data: { status: "confirmed" },
                                      },
                                      {
                                        onSuccess: () =>
                                          toast.success("Confirmed"),
                                      },
                                    )
                                  }
                                  className="text-green-600 hover:bg-green-50 p-1.5 rounded"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    updateRes.mutate(
                                      {
                                        id: r._id,
                                        data: { status: "cancelled" },
                                      },
                                      {
                                        onSuccess: () =>
                                          toast.success("Cancelled"),
                                      },
                                    )
                                  }
                                  className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* UNITS */}
        {activeTab === "units" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">All Units</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {["Unit #", "Type", "Area", "Price", "Floor", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium">
                        <Link
                          to={`/units/${u._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {u.unit_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                        {u.property_type || u.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {u.area_sqm || u.area} m²
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {(u.total_price || u.price || 0).toLocaleString()} EGP
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {u.floor ?? "—"}
                      </td>
                      <td className="px-4 py-3">{statusBadge(u.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WAITLIST */}
        {activeTab === "waitlist" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Waitlist Management
              </h2>
            </div>
            {waitlists.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No waitlist entries</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {[
                        "Customer",
                        "Unit",
                        "Position",
                        "Status",
                        "Date",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {waitlists.map((w) => (
                      <tr
                        key={w._id}
                        className="border-t border-gray-50 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {w.user?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          #{w.unit?.unit_number}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-blue-600">
                          #{w.position}
                        </td>
                        <td className="px-4 py-3">{statusBadge(w.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {w.createdAt
                            ? format(new Date(w.createdAt), "MMM d, yyyy")
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {w.status === "active" && (
                            <button
                              onClick={() =>
                                notifyWait.mutate(w._id, {
                                  onSuccess: () =>
                                    toast.success("User notified!"),
                                  onError: (err) =>
                                    toast.error(
                                      err.response?.data?.message || "Failed",
                                    ),
                                })
                              }
                              className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm"
                            >
                              <Bell className="h-3.5 w-3.5" /> Notify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* AGENTS */}
        {activeTab === "agents" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Agents</h2>
            </div>
            {agents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No agents found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {agents.map((a) => (
                  <div
                    key={a._id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{a.name}</p>
                        <p className="text-xs text-gray-500">{a.email}</p>
                      </div>
                    </div>
                    {a.phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {a.phone}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
