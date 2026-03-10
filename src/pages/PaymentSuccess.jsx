import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Download, Home, Phone, Mail } from "lucide-react";
import api from "../services/api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reservationNumber =
    searchParams.get("reservation") || searchParams.get("order");
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    if (reservationNumber) {
      api
        .get(`/reservations/by-number/${reservationNumber}`)
        .then((res) => setReservation(res.data.data || res.data))
        .catch(() => {});
    }
  }, [reservationNumber]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Congratulations!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your unit has been reserved successfully!
          </p>

          {/* Confirmation Details */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
            <div className="space-y-3 text-sm">
              {reservationNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Confirmation #</span>
                  <span className="font-bold text-blue-600 text-base">
                    {reservationNumber}
                  </span>
                </div>
              )}
              {reservation && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Unit</span>
                    <span className="font-medium">
                      {reservation.unit?.unit_number || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-medium text-green-600">
                      {(reservation.reservation_fee || 5000).toLocaleString()}{" "}
                      EGP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium">
                      {new Date(reservation.createdAt).toLocaleDateString(
                        "en-GB",
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-xl p-5 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Check your email for full reservation details
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                An agent will contact you within 24 hours
              </li>
              <li className="flex items-start gap-2">
                <Download className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Your receipt has been sent to your email
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Go to My Dashboard
            </Link>
            <Link
              to="/units"
              className="block w-full bg-white text-gray-700 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Browse More Units
            </Link>
          </div>

          {/* Contact */}
          <p className="mt-6 text-xs text-gray-500">
            Need help? Call us at{" "}
            <a href="tel:19844" className="text-blue-600 font-medium">
              19844
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
