import { useState } from "react";
import { X, Clock, Users, Bell, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const WaitlistModal = ({ isOpen, onClose, unit }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState(null);
  const [preferences, setPreferences] = useState({
    sms: true,
    email: true,
    app: true,
  });

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please login to join the waiting list");
      onClose();
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/waitlist", {
        unit: unit._id,
        notification_preferences: preferences,
      });
      const data = res.data.data || res.data;
      setPosition(data.position || 1);
      setSuccess(true);
      toast.success("You've joined the waiting list!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join waiting list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {!success ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-7 w-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Join Waiting List
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Unit {unit?.unit_number} is currently{" "}
                {unit?.status === "sold" ? "sold" : "reserved"}
              </p>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  We'll notify you immediately if it becomes available
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  You'll have 24 hours to reserve it
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Joining is completely free
                </li>
              </ul>
            </div>

            {/* Notification Preferences */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                How should we notify you?
              </h3>
              <div className="space-y-2">
                {[
                  { key: "sms", label: "SMS", icon: "📱" },
                  { key: "email", label: "Email", icon: "📧" },
                  { key: "app", label: "App Notification", icon: "🔔" },
                ].map((pref) => (
                  <label
                    key={pref.key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences[pref.key]}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          [pref.key]: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {pref.icon} {pref.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Waiting List"
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              You're on the list!
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Unit {unit?.unit_number}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Your Position</span>
                  <span className="font-bold text-blue-600 text-lg">
                    #{position}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              We'll notify you immediately when this unit becomes available.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
