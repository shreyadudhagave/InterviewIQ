import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { ServerUrl } from "../App";

function PaymentSuccess() {
  const navigate = useNavigate();
  useEffect(() => {
    const refreshUser = async () => {
      try {
        await axios.get(`${ServerUrl}/api/user/current-user`, {
          withCredentials: true,
        });
      } catch (err) {
        console.log(err);
      }
    };

    refreshUser();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase.
          <br />
          Your credits will be added to your account shortly.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
