import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import {
  useMyReservations,
  useMyWaitlist,
  useMyWishlist,
  useMyPayments,
  useCancelReservation,
  useLeaveWaitlist,
  useRemoveWishlist,
} from "../hooks/useUnits";
import api from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  Home,
  Heart,
  Clock,
  CreditCard,
  User,
  Building2,
  XCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  Trash2,
  Eye,
  ChevronRight,
  Bell,
  FileText,
  AlertTriangle,
} from "lucide-react";

/* ── Tokens ── */
const T = {
  brand: "var(--pcolor1)",
  dark: "var(--pcolor2)",
  mid: "var(--pcolor3)",
  bg: "#f7f7f7",
  white: "#ffffff",
  border: "#ebebeb",
  text: "var(--pcolor2)",
  muted: "#717171",
  faint: "#b0b0b0",
  heading: "var(--fontFamilyHeading)",
  body: "var(--fontFamilyNormal)",
};

/* ── Status badge ── */
const STATUS = {
  confirmed: { bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a" },
  completed: { bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a" },
  notified: { bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a" },
  pending: { bg: "#fffbeb", color: "#d97706", dot: "#d97706" },
  active: { bg: "#eff6ff", color: "#2563eb", dot: "#2563eb" },
  cancelled: { bg: "#fff1f2", color: "var(--pcolor1)", dot: "var(--pcolor1)" },
  refunded: { bg: "#faf5ff", color: "#7c3aed", dot: "#7c3aed" },
};
function Badge({ status }) {
  const s = STATUS[status] || { bg: "#f4f4f4", color: "#717171", dot: "#aaa" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        fontFamily: T.body,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

/* ── Avatar ── */
function Av({ name, size = 40 }) {
  const initials = (name || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg,var(--pcolor1),var(--pcolor3))`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: T.heading,
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* ── Empty state ── */
function Empty({ icon: Icon, text, link, linkText }) {
  return (
    <div
      style={{
        background: T.white,
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
        }}
      >
        <Icon size={22} color={T.faint} />
      </div>
      <p
        style={{
          color: T.muted,
          fontSize: 15,
          fontFamily: T.body,
          margin: "0 0 10px",
        }}
      >
        {text}
      </p>
      {link && (
        <Link
          to={link}
          style={{
            color: T.brand,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: T.body,
          }}
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}

/* ── Spinner ── */
function Spin() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}
    >
      <Loader2
        size={28}
        color="var(--pcolor1)"
        style={{ animation: "_dspin 1s linear infinite" }}
      />
    </div>
  );
}

/* ── Section header ── */
function SectionHead({ title, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <h2
        style={{
          fontFamily: T.heading,
          fontSize: 22,
          fontWeight: 600,
          color: T.text,
          margin: 0,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {action}
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, icon: Icon, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: T.white,
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: onClick ? "pointer" : "default",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: accent + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={18} color={accent} />
      </div>
      <div>
        <p
          style={{
            fontSize: 26,
            fontWeight: 700,
            fontFamily: T.heading,
            color: T.text,
            margin: 0,
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: 12,
            color: T.muted,
            fontFamily: T.body,
            margin: "4px 0 0",
            lineHeight: 1.3,
          }}
        >
          {label}
        </p>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════
   PROFILE TAB
══════════════════════════════════════ */
function ProfileTab({ user }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    national_id: user?.national_id || "",
  });
  const upd = useMutation({
    mutationFn: (data) => api.put("/auth/me", data),
    onSuccess: () => {
      toast.success("Profile updated");
      setEditing(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });
  const pFields = [
    { key: "name", label: "Full Name", icon: User },
    { key: "phone", label: "Phone", icon: Phone },
    { key: "address", label: "Address", icon: MapPin },
    { key: "national_id", label: "National ID", icon: FileText },
  ];
  return (
    <div>
      <SectionHead
        title="My Profile"
        action={
          <button
            onClick={() => (editing ? upd.mutate(form) : setEditing(true))}
            disabled={upd.isPending}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 10,
              border: `1.5px solid ${editing ? "transparent" : T.border}`,
              background: editing ? T.brand : "transparent",
              color: editing ? "#fff" : T.muted,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: T.body,
              cursor: "pointer",
            }}
          >
            {upd.isPending ? (
              <Loader2
                size={14}
                style={{ animation: "_dspin 1s linear infinite" }}
              />
            ) : editing ? (
              <Save size={14} />
            ) : (
              <Edit size={14} />
            )}
            {editing ? "Save changes" : "Edit"}
          </button>
        }
      />

      {/* Banner */}
      <div
        style={{
          background: `linear-gradient(120deg,var(--pcolor2) 0%,var(--pcolor3) 100%)`,
          borderRadius: 16,
          padding: "22px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <Av name={user?.name} size={56} />
        <div>
          <p
            style={{
              fontFamily: T.heading,
              fontSize: 18,
              fontWeight: 600,
              color: "#fff",
              margin: 0,
            }}
          >
            {user?.name}
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              fontFamily: T.body,
              margin: "3px 0 0",
            }}
          >
            {user?.email}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div
        style={{
          background: T.white,
          borderRadius: 16,
          border: `1px solid ${T.border}`,
          padding: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: 18,
        }}
      >
        {pFields.map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 700,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontFamily: T.body,
                marginBottom: 7,
              }}
            >
              <Icon size={11} />
              {label}
            </label>
            {editing ? (
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1.5px solid ${T.border}`,
                  fontSize: 14,
                  fontFamily: T.body,
                  color: T.text,
                  background: "#fafafa",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = T.brand;
                  e.target.style.boxShadow = "0 0 0 2px rgba(205,54,45,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = T.border;
                  e.target.style.boxShadow = "none";
                }}
              />
            ) : (
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: user?.[key] ? T.text : T.faint,
                  fontFamily: T.body,
                  padding: "10px 12px",
                  background: "#fafafa",
                  borderRadius: 10,
                }}
              >
                {user?.[key] || "—"}
              </p>
            )}
          </div>
        ))}
        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 700,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              fontFamily: T.body,
              marginBottom: 7,
            }}
          >
            <Mail size={11} />
            Email
          </label>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: T.text,
              fontFamily: T.body,
              padding: "10px 12px",
              background: "#fafafa",
              borderRadius: 10,
            }}
          >
            {user?.email || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════ */
export default function CustomerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");

  const { data: reservations = [], isLoading: loadRes } = useMyReservations();
  const { data: waitlist = [], isLoading: loadWait } = useMyWaitlist();
  const { data: wishlist = [], isLoading: loadWish } = useMyWishlist();
  const { data: payments = [], isLoading: loadPay } = useMyPayments();

  const cancelRes = useCancelReservation();
  const leaveWait = useLeaveWaitlist();
  const removeWish = useRemoveWishlist();

  const hasNotified = waitlist.some((w) => w.status === "notified");

  const TABS = [
    { id: "overview", label: "Home", icon: Home },
    { id: "reservations", label: "Reservations", icon: Building2 },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "waitlist", label: "Waiting", icon: Clock },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="dash-root">
      {/* ── Desktop sidebar ── */}
      <aside className="dash-sidebar">
        {/* User card */}
        <div className="dash-user-card">
          <Av name={user?.name} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: T.heading,
                fontSize: 14,
                fontWeight: 600,
                color: T.text,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name}
            </p>
            <p
              style={{
                fontSize: 12,
                color: T.faint,
                fontFamily: T.body,
                margin: "2px 0 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>

        <nav className="dash-nav">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            const dot = id === "waitlist" && hasNotified;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`dash-nav-btn ${active ? "dash-nav-btn--active" : ""}`}
              >
                <Icon size={17} />
                <span>{label}</span>
                {dot && <span className="dash-nav-dot" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="dash-main">
        {/* Notified banner */}
        {hasNotified && (
          <div className="dash-alert">
            <div className="dash-alert-icon">
              <AlertTriangle size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: T.heading,
                  fontSize: 15,
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 2px",
                }}
              >
                🎉 A unit is ready for you!
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: T.muted,
                  fontFamily: T.body,
                  margin: 0,
                }}
              >
                You have 24 hours to reserve it.
              </p>
            </div>
            <button
              onClick={() => setTab("waitlist")}
              className="dash-alert-btn"
            >
              View now →
            </button>
          </div>
        )}

        {/* ═══ OVERVIEW ═══ */}
        {tab === "overview" && (
          <div className="dash-section">
            <div>
              <h1
                style={{
                  fontFamily: T.heading,
                  fontSize: 24,
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 4px",
                  letterSpacing: "-0.02em",
                }}
              >
                Hey, {user?.name?.split(" ")[0]} 👋
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: T.muted,
                  fontFamily: T.body,
                  margin: 0,
                }}
              >
                Here's your activity summary.
              </p>
            </div>

            {/* Stats grid */}
            <div className="dash-stats-grid">
              <StatCard
                label="Active reservations"
                icon={Building2}
                accent="#2563eb"
                onClick={() => setTab("reservations")}
                value={
                  reservations.filter(
                    (r) => r.status === "confirmed" || r.status === "pending",
                  ).length
                }
              />
              <StatCard
                label="Saved properties"
                icon={Heart}
                accent="var(--pcolor1)"
                onClick={() => setTab("wishlist")}
                value={wishlist.length}
              />
              <StatCard
                label="Waiting lists"
                icon={Clock}
                accent="#d97706"
                onClick={() => setTab("waitlist")}
                value={waitlist.length}
              />
              <StatCard
                label="Payments made"
                icon={CreditCard}
                accent="#16a34a"
                onClick={() => setTab("payments")}
                value={payments.filter((p) => p.status === "completed").length}
              />
            </div>

            {/* Recent reservations */}
            <div
              style={{
                background: T.white,
                borderRadius: 16,
                border: `1px solid ${T.border}`,
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <h2
                  style={{
                    fontFamily: T.heading,
                    fontSize: 17,
                    fontWeight: 600,
                    color: T.text,
                    margin: 0,
                  }}
                >
                  Recent Reservations
                </h2>
                <button
                  onClick={() => setTab("reservations")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 13,
                    color: T.brand,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: T.body,
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  See all <ChevronRight size={13} />
                </button>
              </div>
              {reservations.length > 0 ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {reservations.slice(0, 3).map((r) => (
                    <div
                      key={r._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        background: T.bg,
                        borderRadius: 12,
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "#eff6ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Building2 size={16} color="#2563eb" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 14,
                              fontWeight: 600,
                              color: T.text,
                              fontFamily: T.body,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {r.unit?.property_type || "Unit"} —{" "}
                            {r.unit?.unit_number || "N/A"}
                          </p>
                          <p
                            style={{
                              margin: "2px 0 0",
                              fontSize: 12,
                              color: T.muted,
                              fontFamily: T.body,
                            }}
                          >
                            {(
                              r.total_price ||
                              r.unit?.total_price ||
                              0
                            ).toLocaleString()}{" "}
                            EGP
                          </p>
                        </div>
                      </div>
                      <Badge status={r.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <Building2
                    size={28}
                    color={T.faint}
                    style={{ margin: "0 auto 8px", display: "block" }}
                  />
                  <p
                    style={{
                      color: T.muted,
                      fontSize: 14,
                      fontFamily: T.body,
                      margin: "0 0 8px",
                    }}
                  >
                    No reservations yet
                  </p>
                  <Link
                    to="/units"
                    style={{
                      color: T.brand,
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: T.body,
                    }}
                  >
                    Browse units →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ RESERVATIONS ═══ */}
        {tab === "reservations" && (
          <div className="dash-section">
            <SectionHead title="My Reservations" />
            {loadRes ? (
              <Spin />
            ) : reservations.length === 0 ? (
              <Empty
                icon={Building2}
                text="No reservations yet"
                link="/units"
                linkText="Browse Units →"
              />
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {reservations.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      background: T.white,
                      borderRadius: 14,
                      border: `1px solid ${T.border}`,
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 11,
                          background: "#eff6ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Building2 size={19} color="#2563eb" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 5,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: T.brand,
                              fontFamily: T.body,
                            }}
                          >
                            {r.reservation_number}
                          </span>
                          <Badge status={r.status} />
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 600,
                            color: T.text,
                            fontFamily: T.body,
                          }}
                        >
                          {r.unit?.property_type || "Unit"} —{" "}
                          {r.unit?.unit_number || "N/A"}
                        </p>
                        <p
                          style={{
                            margin: "3px 0 0",
                            fontSize: 13,
                            color: T.muted,
                            fontFamily: T.body,
                          }}
                        >
                          {(
                            r.total_price ||
                            r.unit?.total_price ||
                            0
                          ).toLocaleString()}{" "}
                          EGP
                          {r.createdAt &&
                            ` · ${format(new Date(r.createdAt), "MMM d, yyyy")}`}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        {r.unit?._id && (
                          <Link
                            to={`/units/${r.unit._id}`}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: T.muted,
                            }}
                          >
                            <Eye size={16} />
                          </Link>
                        )}
                        {(r.status === "pending" ||
                          r.status === "confirmed") && (
                          <button
                            onClick={() => {
                              if (window.confirm("Cancel reservation?"))
                                cancelRes.mutate(
                                  { id: r._id, reason: "Customer request" },
                                  {
                                    onSuccess: () => toast.success("Cancelled"),
                                    onError: (e) =>
                                      toast.error(
                                        e.response?.data?.message || "Failed",
                                      ),
                                  },
                                );
                            }}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: T.muted,
                            }}
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ WISHLIST ═══ */}
        {tab === "wishlist" && (
          <div className="dash-section">
            <SectionHead title="Saved Properties" />
            {loadWish ? (
              <Spin />
            ) : wishlist.length === 0 ? (
              <Empty
                icon={Heart}
                text="No saved properties yet"
                link="/units"
                linkText="Browse units →"
              />
            ) : (
              <div className="wish-grid">
                {wishlist.map((w) => (
                  <div
                    key={w._id}
                    style={{
                      background: T.white,
                      borderRadius: 14,
                      border: `1px solid ${T.border}`,
                      overflow: "hidden",
                    }}
                  >
                    {/* Card thumb */}
                    <div
                      style={{
                        height: 130,
                        background: "linear-gradient(135deg,#f0f0f0,#e0e0e0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <Building2 size={28} color={T.faint} />
                      <button
                        onClick={() =>
                          removeWish.mutate(w._id, {
                            onSuccess: () => toast.success("Removed"),
                            onError: (e) =>
                              toast.error(
                                e.response?.data?.message || "Failed",
                              ),
                          })
                        }
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.92)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Heart
                          size={14}
                          fill="var(--pcolor1)"
                          color="var(--pcolor1)"
                        />
                      </button>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 600,
                          color: T.text,
                          fontFamily: T.body,
                        }}
                      >
                        Unit {w.unit?.unit_number || "N/A"}
                      </p>
                      <p
                        style={{
                          margin: "3px 0 0",
                          fontSize: 13,
                          color: T.muted,
                          fontFamily: T.body,
                        }}
                      >
                        {w.unit?.property_type} ·{" "}
                        {w.unit?.area_sqm || w.unit?.area} m²
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 8,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 700,
                            color: T.brand,
                            fontFamily: T.heading,
                          }}
                        >
                          {(
                            w.unit?.total_price ||
                            w.unit?.price ||
                            0
                          ).toLocaleString()}{" "}
                          EGP
                        </p>
                        {w.unit?._id && (
                          <Link
                            to={`/units/${w.unit._id}`}
                            style={{
                              fontSize: 13,
                              color: T.brand,
                              fontWeight: 600,
                              fontFamily: T.body,
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            View <ChevronRight size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ WAITLIST ═══ */}
        {tab === "waitlist" && (
          <div className="dash-section">
            <SectionHead title="Waiting Lists" />
            {loadWait ? (
              <Spin />
            ) : waitlist.length === 0 ? (
              <Empty icon={Clock} text="Not on any waiting lists" />
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {waitlist.map((w) => (
                  <div
                    key={w._id}
                    style={{
                      background: w.status === "notified" ? "#fff8f8" : T.white,
                      borderRadius: 14,
                      border: `1px solid ${w.status === "notified" ? "#fecaca" : T.border}`,
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      {/* Position badge */}
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 11,
                          flexShrink: 0,
                          background:
                            w.status === "notified" ? T.brand : "#f7f7f7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: T.heading,
                            fontSize: 16,
                            fontWeight: 700,
                            color: w.status === "notified" ? "#fff" : T.muted,
                          }}
                        >
                          #{w.position}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: 5 }}>
                          <Badge status={w.status} />
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 600,
                            color: T.text,
                            fontFamily: T.body,
                          }}
                        >
                          Unit {w.unit?.unit_number || "N/A"}
                        </p>
                        <p
                          style={{
                            margin: "3px 0 0",
                            fontSize: 13,
                            color: T.muted,
                            fontFamily: T.body,
                          }}
                        >
                          {w.unit?.property_type} ·{" "}
                          {(
                            w.unit?.total_price ||
                            w.unit?.price ||
                            0
                          ).toLocaleString()}{" "}
                          EGP
                        </p>
                        {w.status === "notified" && (
                          <div
                            style={{
                              marginTop: 12,
                              padding: "12px 14px",
                              borderRadius: 10,
                              background: `linear-gradient(120deg,var(--pcolor1) 0%,var(--pcolor3) 100%)`,
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 8px",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#fff",
                                fontFamily: T.body,
                              }}
                            >
                              🎉 Ready to reserve!
                            </p>
                            <Link
                              to={`/checkout/${w.unit?._id}`}
                              style={{
                                display: "inline-block",
                                padding: "7px 16px",
                                borderRadius: 8,
                                background: "#fff",
                                color: T.brand,
                                fontSize: 13,
                                fontWeight: 700,
                                fontFamily: T.body,
                                textDecoration: "none",
                              }}
                            >
                              Reserve Now →
                            </Link>
                          </div>
                        )}
                      </div>
                      {w.status === "active" && (
                        <button
                          onClick={() => {
                            if (window.confirm("Leave waiting list?"))
                              leaveWait.mutate(w._id, {
                                onSuccess: () => toast.success("Removed"),
                                onError: (e) =>
                                  toast.error(
                                    e.response?.data?.message || "Failed",
                                  ),
                              });
                          }}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: T.muted,
                            flexShrink: 0,
                          }}
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ PAYMENTS ═══ */}
        {tab === "payments" && (
          <div className="dash-section">
            <SectionHead title="Payment History" />
            {loadPay ? (
              <Spin />
            ) : payments.length === 0 ? (
              <Empty icon={CreditCard} text="No payments yet" />
            ) : (
              <>
                {/* Mobile: card list */}
                <div className="pay-cards">
                  {payments.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        background: T.white,
                        borderRadius: 14,
                        border: `1px solid ${T.border}`,
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "#f0fdf4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CreditCard size={17} color="#16a34a" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: 14,
                              fontWeight: 700,
                              color: T.text,
                              fontFamily: T.heading,
                            }}
                          >
                            {p.amount?.toLocaleString()} EGP
                          </p>
                          <Badge status={p.status} />
                        </div>
                        <p
                          style={{
                            margin: "3px 0 0",
                            fontSize: 12,
                            color: T.muted,
                            fontFamily: T.body,
                            textTransform: "capitalize",
                          }}
                        >
                          {p.payment_type?.replace(/_/g, " ")} ·{" "}
                          {p.payment_method?.replace(/_/g, " ")}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: 12,
                            color: T.faint,
                            fontFamily: T.body,
                          }}
                        >
                          {p.paid_at || p.createdAt
                            ? format(
                                new Date(p.paid_at || p.createdAt),
                                "MMM d, yyyy",
                              )
                            : "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop: table */}
                <div className="pay-table-wrap">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          background: T.bg,
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        {["Type", "Amount", "Method", "Status", "Date"].map(
                          (h) => (
                            <th
                              key={h}
                              style={{
                                textAlign: "left",
                                padding: "11px 16px",
                                fontSize: 11,
                                fontWeight: 700,
                                color: T.muted,
                                fontFamily: T.body,
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                              }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr
                          key={p._id}
                          style={{
                            borderBottom:
                              i < payments.length - 1
                                ? `1px solid ${T.border}`
                                : "none",
                          }}
                        >
                          <td
                            style={{
                              padding: "13px 16px",
                              fontSize: 14,
                              color: T.text,
                              fontFamily: T.body,
                              textTransform: "capitalize",
                            }}
                          >
                            {p.payment_type?.replace(/_/g, " ")}
                          </td>
                          <td
                            style={{
                              padding: "13px 16px",
                              fontSize: 14,
                              fontWeight: 700,
                              color: T.text,
                              fontFamily: T.heading,
                            }}
                          >
                            {p.amount?.toLocaleString()} EGP
                          </td>
                          <td
                            style={{
                              padding: "13px 16px",
                              fontSize: 13,
                              color: T.muted,
                              fontFamily: T.body,
                              textTransform: "capitalize",
                            }}
                          >
                            {p.payment_method?.replace(/_/g, " ")}
                          </td>
                          <td style={{ padding: "13px 16px" }}>
                            <Badge status={p.status} />
                          </td>
                          <td
                            style={{
                              padding: "13px 16px",
                              fontSize: 13,
                              color: T.muted,
                              fontFamily: T.body,
                            }}
                          >
                            {p.paid_at || p.createdAt
                              ? format(
                                  new Date(p.paid_at || p.createdAt),
                                  "MMM d, yyyy",
                                )
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══ PROFILE ═══ */}
        {tab === "profile" && (
          <div className="dash-section">
            <ProfileTab user={user} />
          </div>
        )}

        {/* Mobile bottom safe space */}
        <div className="dash-mobile-spacer" />
      </main>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="dash-bottom-bar">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          const dot = id === "waitlist" && hasNotified;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`dash-bottom-btn ${active ? "dash-bottom-btn--active" : ""}`}
            >
              <span style={{ position: "relative", display: "flex" }}>
                <Icon size={22} />
                {dot && <span className="dash-bottom-dot" />}
              </span>
              <span className="dash-bottom-label">{label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @keyframes _dspin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* Root layout */
        .dash-root {
          min-height: 100vh;
          background: #f7f7f7;
          font-family: var(--fontFamilyNormal);
          padding-top: 64px; /* fixed Navbar height */
          display: flex;
        }

        /* Desktop sidebar */
        .dash-sidebar {
          display: none;
        }

        /* Main content */
        .dash-main {
          flex: 1;
          min-width: 0;
          padding: 16px 16px 0;
          max-width: 100%;
        }

        /* Section wrapper */
        .dash-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 16px;
        }

        /* Stats grid */
        .dash-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Wishlist grid */
        .wish-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        /* Payments - show cards on mobile, table on desktop */
        .pay-cards { display: flex; flex-direction: column; gap: 10px; }
        .pay-table-wrap { display: none; background: #fff; border-radius: 16px; border: 1px solid #ebebeb; overflow: hidden; }

        /* Alert banner */
        .dash-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff8f8;
          border: 1px solid #fecaca;
          border-radius: 14px;
          padding: 14px 16px;
          flex-wrap: wrap;
        }
        .dash-alert-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--pcolor1);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .dash-alert-btn {
          padding: 8px 16px; border-radius: 10px;
          background: var(--pcolor1); color: #fff;
          border: none; cursor: pointer;
          font-size: 13px; font-weight: 700;
          font-family: var(--fontFamilyNormal);
          white-space: nowrap;
        }

        /* Mobile bottom bar */
        .dash-bottom-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid #ebebeb;
          display: flex;
          z-index: 50;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .dash-bottom-btn {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 3px;
          padding: 10px 4px 8px;
          background: none; border: none; cursor: pointer;
          color: #b0b0b0;
          transition: color 0.15s;
        }
        .dash-bottom-btn--active { color: var(--pcolor1); }
        .dash-bottom-label {
          font-size: 10px; font-weight: 600;
          font-family: var(--fontFamilyNormal);
          line-height: 1;
        }
        .dash-bottom-dot {
          position: absolute; top: -2px; right: -4px;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--pcolor1);
          border: 2px solid #fff;
        }
        .dash-mobile-spacer { height: 80px; }

        /* User card */
        .dash-user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 16px;
          border-bottom: 1px solid #ebebeb;
        }

        /* Desktop sidebar nav */
        .dash-nav {
          display: flex; flex-direction: column; gap: 2px;
          padding: 8px;
        }
        .dash-nav-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px; border: none;
          background: transparent; color: #717171;
          font-size: 14px; font-weight: 500;
          font-family: var(--fontFamilyNormal);
          cursor: pointer; transition: all 0.15s;
          width: 100%; text-align: left;
          position: relative;
        }
        .dash-nav-btn:hover { background: #f4f4f4; }
        .dash-nav-btn--active { background: var(--pcolor1) !important; color: #fff !important; font-weight: 600; }
        .dash-nav-dot {
          margin-left: auto; width: 8px; height: 8px;
          border-radius: 50%; background: var(--pcolor1);
        }
        .dash-nav-btn--active .dash-nav-dot { background: rgba(255,255,255,0.7); }

        /* ── RESPONSIVE ── */
        @media (min-width: 640px) {
          .dash-stats-grid { grid-template-columns: repeat(4,1fr); }
          .wish-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (min-width: 900px) {
          .dash-sidebar {
            display: flex;
            flex-direction: column;
            width: 220px;
            flex-shrink: 0;
            background: #fff;
            border-right: 1px solid #ebebeb;
            position: sticky;
            top: 64px;
            height: calc(100vh - 64px);
            overflow-y: auto;
          }
          .dash-main {
            padding: 28px 28px 40px;
          }
          .dash-bottom-bar { display: none; }
          .dash-mobile-spacer { display: none; }
          .pay-cards { display: none; }
          .pay-table-wrap { display: block; }
          .wish-grid { grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); }
        }

        @media (min-width: 1200px) {
          .dash-main { padding: 32px 40px 48px; max-width: 900px; }
        }
      `}</style>
    </div>
  );
}
