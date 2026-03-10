import { Link, useSearchParams } from "react-router-dom";
import { XCircle, RotateCcw, Phone, MessageSquare } from "lucide-react";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const errorMessage =
    searchParams.get("error") || "Your payment could not be processed.";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>

          {/* Common Reasons */}
          <div className="bg-amber-50 rounded-xl p-5 mb-6 text-left">
            <h3 className="font-semibold text-amber-900 mb-2">
              Common reasons:
            </h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Insufficient funds in your account</li>
              <li>• Card declined by your bank</li>
              <li>• Incorrect card details entered</li>
              <li>• Internet connection issue</li>
            </ul>
          </div>

          {/* The unit is NOT lost */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Don't worry!</strong> The unit has not been taken. You can
              try again immediately.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              to="/units"
              className="block w-full bg-white text-gray-700 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Browse Other Units
            </Link>
          </div>

          {/* Contact */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Need assistance? Contact us:
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="tel:19844"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <Phone className="h-4 w-4" />
                19844
              </a>
              <a
                href="https://wa.me/201000000000"
                className="flex items-center gap-1 text-sm text-green-600 hover:underline"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
