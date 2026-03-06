import { useState } from "react";
import { auth } from "../config/firebase";
import Icon, { IconText } from "./Icon";
import ModalOverlay from "./ModalOverlay";
import { IconTitleSection } from "./TitleSection";
import { UserProfile } from "./modal-group/SharedModals";


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
      <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 px-2 mb-1">
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

// ─── Main component ───────────────────────────────────────────────────────────

function MenuBar({ closeModal }) {
  const user = auth.currentUser;

  const [prefs, setPrefs] = useState({
    notifications: true,
    emailUpdates: false,
    soundEffects: false,
    compactView: false,
    showDeadlines: true,
    autoArchive: false,
  });

  const toggle = (key) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ModalOverlay onClick={closeModal}>
      <div
        className="z-50 absolute h-full left-0 max-w-sm w-full bg-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100">
          <IconTitleSection
            iconOnClick={closeModal}
            dataFeather="x"
            title="Menu"
            className="px-4 py-3"
            titleClassName="text-lg font-merriweather"
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">

          <MenuSection label="Notifications">
            <SettingRow
              dataFeather="bell"
              label="Push Notifications"
              sublabel="Get notified about task updates"
              enabled={prefs.notifications}
              onChange={() => toggle("notifications")}
            />
            <SettingRow
              dataFeather="mail"
              label="Email Updates"
              sublabel="Receive weekly project summaries"
              enabled={prefs.emailUpdates}
              onChange={() => toggle("emailUpdates")}
            />
            <SettingRow
              dataFeather="volume-2"
              label="Sound Effects"
              sublabel="Play sounds on task completion"
              enabled={prefs.soundEffects}
              onChange={() => toggle("soundEffects")}
            />
          </MenuSection>

          <MenuSection label="Display">
            <SettingRow
              dataFeather="layout"
              label="Compact View"
              sublabel="Show more items with less spacing"
              enabled={prefs.compactView}
              onChange={() => toggle("compactView")}
            />
            <SettingRow
              dataFeather="clock"
              label="Show Deadlines"
              sublabel="Display due dates on task cards"
              enabled={prefs.showDeadlines}
              onChange={() => toggle("showDeadlines")}
            />
          </MenuSection>

          <MenuSection label="Tasks">
            <SettingRow
              dataFeather="archive"
              label="Auto-Archive Finished"
              sublabel="Archive completed tasks after 7 days"
              enabled={prefs.autoArchive}
              onChange={() => toggle("autoArchive")}
            />
          </MenuSection>

          <MenuSection label="Account">
            <ActionRow
              dataFeather="user"
              label="Edit Profile"
              sublabel="Update your name and photo"
              onClick={() => {}}
            />
            <ActionRow
              dataFeather="lock"
              label="Change Password"
              sublabel="Update your login credentials"
              onClick={() => {}}
            />
            <ActionRow
              dataFeather="log-out"
              label="Sign Out"
              danger
              onClick={() => auth.signOut()}
            />
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