import ModalOverlay from "../../ModalOverlay";
import { IconTitleSection } from "../../TitleSection";


export function UnlockPro({ closeModal }) {
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


        <div className="text-center mb-6">
          <span className="text-4xl font-extrabold">$6.99</span>
          <span className="text-gray-500">/month</span>
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

        <button className="w-full py-3 rounded-xl bg-violet-700 text-white font-semibold hover:shadow-lg border border-violet-700  hover:shadow-blue-500/50">
          Upgrade to Pro
        </button>

        <p className="text-sm text-gray-400 text-center mt-4">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </ModalOverlay>
  )
}