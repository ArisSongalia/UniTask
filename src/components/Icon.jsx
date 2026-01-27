import React, { useState } from "react";
import * as FeatherIcons from "react-feather";
import { UserProfile } from "./modal-group/Modal";
import defaultUserIcon from "../assets/default-icon.png";

/* ---------------- ICON CORE ---------------- */

function FeatherIcon({ name, className = "", size = 16, style = {} }) {
  const IconComponent =
    FeatherIcons[
      name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
    ];

  if (!IconComponent) return null;

  return <IconComponent className={className} size={size} style={style} />;
}

/* ---------------- ICON ACTION ---------------- */

function IconAction({
  className = "",
  dataFeather = "edit-2",
  actionText = "",
  style = {},
  iconOnClick,
  text = "",
}) {
  return (
    <section
      className={`flex rounded-full gap-2 items-center justify-center
        w-fit h-fit cursor-pointer shrink-0 bg-green-50 text-green-900
        hover:bg-green-700 hover:text-white p-[6px]
        active:bg-green-700 focus:outline-none ${className}`}
      aria-label={actionText}
      onClick={(e) => {
        e.stopPropagation();
        iconOnClick?.();
      }}
    >
      <FeatherIcon
        name={dataFeather}
        className="group-hover:text-white"
        size={16}
        style={style}
      />

      {text && (
        <span className="text-xs font-semibold pr-1">
          {text}
        </span>
      )}
    </section>
  );
}

/* ---------------- ICON ---------------- */

function Icon({
  className = "",
  dataFeather = "edit-2",
  actionText = "",
  style = {},
}) {
  return (
    <span
      className={`p-2 flex items-center justify-center text-green-900 w-8 h-8 ${className}`}
      aria-label={actionText}
    >
      <FeatherIcon
        name={dataFeather}
        size={16}
        style={style}
      />
    </span>
  );
}

/* ---------------- ICON USER ---------------- */

function IconUser({ user = {}, className = "" }) {
  const [showUserProfile, setShowUserProfile] = useState(false);

  return (
    <div
      className={`hover:cursor-pointer border rounded-full h-7 w-7
        hover:border-green-500 ${className}`}
      onClick={() => setShowUserProfile(prev => !prev)}
    >
      <img
        src={user.photoURL || defaultUserIcon}
        alt="User"
        className="h-full w-full rounded-full"
      />

      {showUserProfile && (
        <UserProfile
          user={user}
          closeModal={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
}

/* ---------------- ICON TEXT ---------------- */

function IconText({ text = "", className = "", border = false }) {
  const baseClass = border
    ? "text-xs bg-green-50 p-1 w-fit font-semibold border border-green-500 text-slate-800"
    : "text-xs bg-slate-100 p-1 w-fit font-semibold text-slate-800";

  return (
    <span className={`${baseClass} rounded-sm ${className}`}>
      {text}
    </span>
  );
}

/* ---------------- EXPORTS ---------------- */

export default Icon;
export { IconAction, IconUser, IconText };
