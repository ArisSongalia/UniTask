import { useState } from "react";
import ModalOverlay from "../ModalOverlay";
import { IconTitleSection } from "../TitleSection";
import axios from "axios";


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
                  ? "bg-violet-700 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setPlanType("monthly")}
            >
              Monthly
            </button>

            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                planType === "yearly"
                  ? "bg-violet-700 text-white"
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

        <SubscriptionForm
          text={`Upgrade to ${planType === "monthly" ? "Monthly" : "Yearly"} Pro`}
          planType={planType}
          className='w-full py-3 rounded-xl bg-violet-700 text-white font-semibold hover:shadow-lg border border-violet-700 hover:shadow-blue-500/50"'
        />

        <p className="text-sm text-gray-400 text-center mt-4">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </ModalOverlay>
  );
}

function SubscriptionForm({planType, text, className=""}) {

  const handleCheckout = async () => {
    const response = await axios.post(
      "https://untroublesome-vaulted-vennie.ngrok-free.dev/api/create-checkout",
      { planType: planType }
    );

    window.location.href = response.data.checkout_url;
  };

  return (
    <button onClick={handleCheckout} className={className}>
      {text}
    </button>
  );
}



export { UnlockPro }