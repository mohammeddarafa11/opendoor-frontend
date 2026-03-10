import { useState, useMemo } from "react";
import { Calculator, TrendingDown } from "lucide-react";

const PaymentCalculator = ({ totalPrice }) => {
  const [downPaymentPct, setDownPaymentPct] = useState(5);
  const [years, setYears] = useState(4);

  const plan = useMemo(() => {
    const reservationFee = 5000;
    const downPayment = Math.round(totalPrice * (downPaymentPct / 100));
    const months = years * 12;
    const financed = totalPrice - downPayment - reservationFee;
    const monthly = Math.round(financed / months);

    return { reservationFee, downPayment, months, financed, monthly };
  }, [totalPrice, downPaymentPct, years]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
        <Calculator className="h-5 w-5 text-blue-600" />
        Payment Calculator
      </h3>

      {/* Down Payment Slider */}
      <div className="mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Down Payment</span>
          <span className="font-semibold text-blue-600">
            {downPaymentPct}% ({plan.downPayment.toLocaleString()} EGP)
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={50}
          step={5}
          value={downPaymentPct}
          onChange={(e) => setDownPaymentPct(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>5%</span>
          <span>50%</span>
        </div>
      </div>

      {/* Years Selector */}
      <div className="mb-5">
        <span className="text-sm text-gray-600 block mb-2">
          Installment Period
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[2, 3, 4, 5].map((y) => (
            <button
              key={y}
              onClick={() => setYears(y)}
              className={`py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                years === y
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {y} Years
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Reservation Fee</span>
          <span className="font-medium">
            {plan.reservationFee.toLocaleString()} EGP
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Down Payment</span>
          <span className="font-medium">
            {plan.downPayment.toLocaleString()} EGP
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Financed Amount</span>
          <span className="font-medium">
            {plan.financed.toLocaleString()} EGP
          </span>
        </div>
        <hr className="border-blue-200" />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Monthly Payment</p>
            <p className="text-xs text-gray-500">for {plan.months} months</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {plan.monthly.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">EGP/month</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
        <TrendingDown className="h-3 w-3" />
        Higher down payment = lower monthly installments
      </p>
    </div>
  );
};

export default PaymentCalculator;
