import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { auth } from "../../config/firebase";
import Button from "../Button";
import ModalOverlay from "../ModalOverlay";
import { IconTitleSection } from "../TitleSection";
import { onAuthStateChanged } from "firebase/auth";


function UnlockPro({ closeModal }) {
  const [planType, setPlanType] = useState("monthly");

  const prices = {
    monthly: 500,
    yearly: 5000,
  };

  return (
    <ModalOverlay>
      <div className="absolute bg-white h-fit max-w-screen-md w-full p-4 rounded-md">
        <IconTitleSection title="Pro Plan" dataFeather="x" iconOnClick={closeModal} />

        <div className="flex justify-center mb-4">
          <span className="bg-violet-700 text-white text-xs px-3 py-1 rounded-full tracking-wide">
            🚀 PRO PLAN
          </span>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">
          Unlock Uni Pro
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Supercharge your workflow with AI-powered features and unlimited creativity.
        </p>

        {/* Plan Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-full flex">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                planType === "monthly"
                  ? "bg-green-700 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setPlanType("monthly")}
            >
              Monthly
            </button>

            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                planType === "yearly"
                  ? "bg-green-700 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setPlanType("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Dynamic Price */}
        <div className="text-center mb-6">
          <span className="text-4xl font-extrabold">
            ₱{prices[planType]}
          </span>
          <span className="text-gray-500">
            {planType === "monthly" ? "/month" : "/year"}
          </span>

          {planType === "yearly" && (
            <p className="text-sm text-green-600 mt-2">
              Save 28% with yearly billing 🎉
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✔</span>
            AI-powered tools
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✔</span>
            Create unlimited projects
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✔</span>
            Faster processing & priority access
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✔</span>
            Early access to new features
          </li>
        </ul>

        <SubscriptionFormButton
          text={`Upgrade to ${planType === "monthly" ? "Monthly" : "Yearly"} Pro`}
          planType={planType}
        />

        <p className="text-sm text-gray-400 text-center mt-4">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </ModalOverlay>
  );
}

function SubscriptionFormButton({ planType, text, className="" }) {
  const user = auth.currentUser;

  const handleCheckout = async () => {
    if(!user) return
    const response = await axios.post(
      "https://untroublesome-vaulted-vennie.ngrok-free.dev/api/create-checkout",
      { planType: planType, userId: user.uid }
    );

    window.location.href = response.data.checkout_url;
  };

  return (
    <Button onClick={handleCheckout} className={className} text={text} />

  );
}

function PaymentResultsModal({ result, closeModal }) {
  const isSuccess = result === "success";
  const [searchParams] = useSearchParams();
  const planType = searchParams.get("plan");


  return (
    <ModalOverlay>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center gap-6">

        <IconTitleSection
          iconOnClick={closeModal}
          dataFeather="x"
          title="Payment Result"
        />

        {/* Status Icon */}
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <span
            className={`text-3xl ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {isSuccess ? "✓" : "!"}
          </span>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">
            {isSuccess
              ? "Payment Successful 🎉"
              : "Payment Failed"}
          </h2>

          <p className="text-gray-500 text-sm">
            {isSuccess
              ? "Your subscription has been activated. Enjoy all Pro features."
              : "Something went wrong during the payment process."}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col w-full gap-2 mt-2">
          {isSuccess ? (
            <Button
              text="Return to Unitask"
              onClick={closeModal}
              className="w-full rounded-lg"
              dataFeather=""
            />
          ) : (
            <>
              <SubscriptionFormButton text={"Try Payment Again"} planType={planType} />
            </>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}


export { PaymentResultsModal, UnlockPro };

