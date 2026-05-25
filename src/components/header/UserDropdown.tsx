import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuthContext } from "~/context/AuthContext";
import Button from "../ui/button/Button";
import { Settings, LogOut, ChevronDown, User } from "lucide-react";
import { getAvatarColor, getInitials } from "~/utils/avatar";

export default function UserDropdown() {
  const { logout, user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() { setIsOpen(!isOpen); }
  function closeDropdown() { setIsOpen(false); }

  const initial = getInitials(user?.name);

  const avatarColor = getAvatarColor(user?.name);


  // ── Build full URL for profile picture ──────────────────────────────────
  const profilePicUrl = user?.profile_picture
    ? `${import.meta.env.VITE_API_BASE_URL}/${user.profile_picture}`
    : null;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400"
      >
        {/* ── Avatar: show image if available, else colored initial ── */}
        {profilePicUrl ? (
          <img
            src={profilePicUrl}
            alt={user?.name ?? "User"}
            className="mr-3 h-11 w-11 rounded-full object-cover shrink-0"
          />
        ) : (
          <span
            className={`mr-3 flex items-center justify-center rounded-full h-11 w-11 text-white font-semibold shrink-0 ${avatarColor}`}
          >
            {initial}
          </span>
        )}

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.name || "User"}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* User Info */}
        <div className="mb-2">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>

        {/* My Profile - visible to ALL roles */}
        <ul className="flex flex-col gap-1 pt-1 pb-2 border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-1 font-medium rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              <User size={18} />
              My Profile
            </DropdownItem>
          </li>
        </ul>

        {/* Settings - Admin only */}
        {user?.role === "admin" && (
          <ul className="flex flex-col gap-1 pt-1 pb-3 border-b border-gray-200 dark:border-gray-800">
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                to="/settings"
                className="flex items-center gap-3 px-3 font-medium rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              >
                <Settings size={18} />
                Settings
              </DropdownItem>
            </li>
          </ul>
        )}

        {/* Logout */}
        <Button
          onClick={() => { logout(); closeDropdown(); }}
          className="flex items-center gap-2 justify-center"
        >
          <LogOut size={18} />
          Sign out
        </Button>
      </Dropdown>
    </div>
  );
}