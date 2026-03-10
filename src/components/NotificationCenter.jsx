import { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Users,
  FileText,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import api from "../services/api";

const iconMap = {
  reservation_confirmed: CheckCircle2,
  payment_received: CreditCard,
  payment_reminder: AlertTriangle,
  waitlist_notified: Users,
  waitlist_joined: Users,
  document_request: FileText,
  agent_assigned: Users,
  default: Bell,
};

const colorMap = {
  reservation_confirmed: "text-green-600 bg-green-100",
  payment_received: "text-green-600 bg-green-100",
  payment_reminder: "text-amber-600 bg-amber-100",
  payment_overdue: "text-red-600 bg-red-100",
  waitlist_notified: "text-blue-600 bg-blue-100",
  waitlist_joined: "text-blue-600 bg-blue-100",
  document_request: "text-purple-600 bg-purple-100",
  default: "text-gray-600 bg-gray-100",
};

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/activity-logs?limit=20");
      setNotifications(res.data.data || []);
    } catch {
      // Fallback: empty
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/activity-logs/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silent fail
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-14 w-96 max-h-[70vh] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-xs text-blue-600 hover:underline"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = iconMap[notif.action] || iconMap.default;
            const colors = colorMap[notif.action] || colorMap.default;

            return (
              <div
                key={notif._id}
                className={`flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  !notif.read ? "bg-blue-50/30" : ""
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colors}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium capitalize">
                    {notif.action?.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {notif.details}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
