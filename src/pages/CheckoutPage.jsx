import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useUnit,
  useCreateReservation,
  useCreatePayment,
} from "../hooks/useUnits";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  Shield,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const CheckoutPage = () => {
  const { unitId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    national_id: user?.national_id || "",
  });

  // Fetch unit via React Query
  const { data: unit, isLoading, isError } = useUnit(unitId);

  // Mutations
  const createReservation = useCreateReservation();
  const createPayment = useCreatePayment();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      return toast.error("Please agree to the terms and conditions");
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.national_id
    ) {
      return toast.error("Please fill in all fields");
    }

    try {
      // Create reservation
      const reservation = await createReservation.mutateAsync({
        unit: unitId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_national_id: formData.national_id,
        payment_method: paymentMethod,
      });

      // Create payment for reservation fee
      const payment = await createPayment.mutateAsync({
        reservation: reservation._id || reservation.reservation?._id,
        amount: reservationFee,
        payment_type: "reservation_fee",
        payment_method: paymentMethod,
      });

      // If payment returns a redirect URL (e.g., Paymob)
      if (payment.redirect_url || payment.payment_url) {
        window.location.href = payment.redirect_url || payment.payment_url;
        return;
      }

      toast.success("Reservation created successfully!");
      navigate("/payment/success", {
        state: {
          reservation: reservation,
          payment: payment,
        },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create reservation",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !unit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <AlertTriangle className="h-16 w-16 text-amber-400" />
        <p className="text-gray-500 text-lg">Unit not found</p>
        <Link to="/units" className="text-blue-600 hover:underline text-sm">
          ← Browse units
        </Link>
      </div>
    );
  }

  if (unit.status !== "available") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <AlertTriangle className="h-16 w-16 text-amber-400" />
        <p className="text-gray-700 text-lg font-semibold">
          This unit is no longer available
        </p>
        <p className="text-gray-500 text-sm">Status: {unit.status}</p>
        <Link
          to="/units"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Browse Available Units
        </Link>
      </div>
    );
  }

  const totalPrice = unit.total_price || unit.price || 0;
  const reservationFee = 50000;
  const downPayment = Math.round(totalPrice * 0.1);
  const installmentMonths = 48;
  const monthlyInstallment = Math.round(
    (totalPrice - downPayment) / installmentMonths,
  );

  const isSubmitting = createReservation.isPending || createPayment.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Complete Your Reservation
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: "name",
                    label: "Full Name",
                    type: "text",
                    icon: User,
                  },
                  {
                    key: "email",
                    label: "Email",
                    type: "email",
                    icon: Mail,
                  },
                  {
                    key: "phone",
                    label: "Phone",
                    type: "tel",
                    icon: Phone,
                  },
                  {
                    key: "national_id",
                    label: "National ID",
                    type: "text",
                    icon: FileText,
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                      <field.icon className="h-3.5 w-3.5" /> {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={formData[field.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "card", label: "Credit Card" },
                  { value: "bank_transfer", label: "Bank Transfer" },
                  { value: "cash", label: "Cash" },
                ].map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setPaymentMethod(m.value)}
                    className={`p-4 border-2 rounded-xl text-sm font-medium transition-all ${
                      paymentMethod === m.value
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-blue-600 font-medium">
                    terms and conditions
                  </span>
                  , including the reservation fee policy and installment plan. I
                  understand the reservation fee of{" "}
                  <strong>{reservationFee.toLocaleString()} EGP</strong> is
                  non-refundable.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !agreed}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl text-base font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" /> Pay{" "}
                  {reservationFee.toLocaleString()} EGP & Reserve
                </>
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {unit.title || `Unit ${unit.unit_number}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {unit.property_type} • {unit.area_sqm || unit.area} m²
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Price</span>
                  <span className="font-medium">
                    {totalPrice.toLocaleString()} EGP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reservation Fee</span>
                  <span className="font-medium">
                    {reservationFee.toLocaleString()} EGP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Down Payment (10%)</span>
                  <span className="font-medium">
                    {downPayment.toLocaleString()} EGP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Monthly ({installmentMonths} mo)
                  </span>
                  <span className="font-medium">
                    {monthlyInstallment.toLocaleString()} EGP
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-base font-bold">
                  <span>Due Today</span>
                  <span className="text-blue-600">
                    {reservationFee.toLocaleString()} EGP
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Your unit will be reserved immediately after payment
                  confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
