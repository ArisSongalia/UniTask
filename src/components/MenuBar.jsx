import { useState } from "react";
import { EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import Icon from "./Icon";
import ModalOverlay from "./ModalOverlay";
import { IconTitleSection } from "./TitleSection";
import { useLayout } from "../context/LayoutContext";

const GOOGLE_PROVIDER_ID = "google.com";

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-green-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function MenuSection({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-green-600 px-2 mb-1">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

// ─── Row with toggle ──────────────────────────────────────────────────────────

function SettingRow({ dataFeather, label, sublabel, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100 flex-shrink-0">
          <Icon dataFeather={dataFeather} className="w-3.5 h-3.5 text-green-700" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-tight">{label}</p>
          {sublabel && <p className="text-xs text-gray-400 leading-tight mt-0.5">{sublabel}</p>}
        </div>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

// ─── Row as button (no toggle) ────────────────────────────────────────────────

function ActionRow({ dataFeather, label, sublabel, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
        danger ? "hover:bg-red-50" : "hover:bg-green-50"
      }`}
    >
      <div className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ${
        danger ? "bg-red-100" : "bg-green-100"
      }`}>
        <Icon dataFeather={dataFeather} className={`w-3.5 h-3.5 ${danger ? "text-red-500" : "text-green-700"}`} />
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-medium leading-tight ${danger ? "text-red-500" : "text-gray-800"}`}>{label}</p>
        {sublabel && <p className="text-xs text-gray-400 leading-tight mt-0.5">{sublabel}</p>}
      </div>
    </button>
  );
}

function DeleteAccountModal({ onClose }) {
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", color: "" });

  const user = auth.currentUser;
  const providerIds = user?.providerData?.map((provider) => provider.providerId) || [];
  const isGoogleUser = providerIds.includes(GOOGLE_PROVIDER_ID);
  const email = user?.email || "";

  const handleDelete = async () => {
    if (!user) {
      setMessage({ text: "No user signed in.", color: "red" });
      return;
    }

    if (confirmText.trim().toUpperCase() !== "DELETE") {
      setMessage({ text: "Type DELETE to confirm.", color: "red" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", color: "" });

    try {
      if (isGoogleUser) {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        if (!password) {
          throw new Error("Password is required for re-authentication.");
        }
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
      }

      await user.delete();
      await auth.signOut();
      setMessage({ text: "Account deleted.", color: "green" });
      setTimeout(onClose, 600);
    } catch (error) {
      setMessage({ text: error.message || "Failed to delete account.", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <div className="flex flex-col bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <IconTitleSection
          title="Delete Account"
          dataFeather="x"
          iconOnClick={onClose}
          className="mb-2"
        />

        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-700">
            This permanently deletes your account. Type DELETE to continue.
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          {!isGoogleUser && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          )}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>

        {message.text && (
          <p className="text-xs mt-3" style={{ color: message.color }}>
            {message.text}
          </p>
        )}
      </div>
    </ModalOverlay>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function MenuBar({ closeModal }) {
  const { compactView, toggleCompactView, largeText, toggleLargeText } = useLayout();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prefs, setPrefs] = useState({
    notifications: true,
    emailUpdates: false,
  });

  const toggle = (key) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const notificationSettings = [
    {
      key: "notifications",
      dataFeather: "bell",
      label: "Push Notifications",
      sublabel: "Get notified about task updates",
    },
    {
      key: "emailUpdates",
      dataFeather: "mail",
      label: "Email Updates",
      sublabel: "Receive weekly project summaries",
    },
  ];

  const displaySettings = [
    {
      dataFeather: "layout",
      label: "Compact View",
      sublabel: "Show more items with less spacing",
      enabled: compactView,
      onChange: toggleCompactView,
    },
    {
      dataFeather: "type",
      label: "Increase Font Size",
      sublabel: "Make text easier to read",
      enabled: largeText,
      onChange: toggleLargeText,
    },
  ];

  const accountActions = [
    {
      dataFeather: "user",
      label: "Delete Account",
      danger: true,
      onClick: () => setShowDeleteModal(true),
    },
    {
      dataFeather: "log-out",
      label: "Sign Out",
      onClick: () => auth.signOut(),
      danger: true,
    },
  ];

  return (
    <ModalOverlay onClick={closeModal}>
      <div
        className="z-50 absolute h-full left-0 max-w-sm w-full bg-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {showDeleteModal && (
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        )}
        {/* Header */}
        <div className="border-b border-gray-100">
          <IconTitleSection
            iconOnClick={closeModal}
            dataFeather="x"
            title="Menu"
            className="px-4 py-5 gap-4"
            titleClassName="text-lg font-merriweather"
            flipped
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">

          <MenuSection label="Notifications">
            {notificationSettings.map((item) => (
              <SettingRow
                key={item.key}
                dataFeather={item.dataFeather}
                label={item.label}
                sublabel={item.sublabel}
                enabled={prefs[item.key]}
                onChange={() => toggle(item.key)}
              />
            ))}
          </MenuSection>

          <MenuSection label="Display">
            {displaySettings.map((item) => (
              <SettingRow
                key={item.label}
                dataFeather={item.dataFeather}
                label={item.label}
                sublabel={item.sublabel}
                enabled={item.enabled}
                onChange={item.onChange}
              />
            ))}
          </MenuSection>

          <MenuSection label="Account">
            {accountActions.map((item) => (
              <ActionRow
                key={item.label}
                dataFeather={item.dataFeather}
                label={item.label}
                sublabel={item.sublabel}
                onClick={item.onClick}
                danger={item.danger}
              />
            ))}
          </MenuSection>

        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-[10px] text-gray-400 text-center">
            TaskFlow · v1.0.0
          </p>
        </div>
      </div>
    </ModalOverlay>
  );
}

export default MenuBar;