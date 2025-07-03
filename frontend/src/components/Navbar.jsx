import { Link } from "react-router-dom";
import { UseAuthStore } from "../store/UseAuthStore.js";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

// Accept onProfileClick as a prop
const Navbar = ({ onProfileClick }) => {
  const { logout, authUser } = UseAuthStore();

  return (
    <header className="fixed w-full top-0 z-50">
      {/* Glassmorphic navbar with DaisyUI colors */}
      <div className="bg-base-100/60 backdrop-blur border-b border-base-300 shadow-md">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 relative z-10">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                to="/"
                className="flex items-center gap-3 hover:scale-105 transition-all group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  BingeChat
                </h1>
              </Link>
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Settings */}
              {/* This link can remain as a route if you have a dedicated settings page */}
              <Link
                to="/settings"
                className="group relative flex items-center gap-2 px-4 py-2 bg-base-200/60 hover:bg-base-300 border border-base-300 hover:border-base-content/20 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <Settings className="w-4 h-4 text-base-content group-hover:text-primary transition-colors" />
                <span className="hidden sm:inline text-base-content group-hover:text-primary text-sm font-medium">
                  Settings
                </span>
              </Link>

              {authUser && (
                <>
                  {/* Profile Button - now triggers onProfileClick */}
                  <button
                    onClick={() => onProfileClick && onProfileClick(authUser)} // Pass authUser to open own profile
                    className="group relative flex items-center gap-2 px-4 py-2 bg-base-200/60 hover:bg-base-300 border border-base-300 hover:border-base-content/20 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <User className="w-4 h-4 text-base-content group-hover:text-secondary transition-colors" />
                    <span className="hidden sm:inline text-base-content group-hover:text-secondary text-sm font-medium">
                      Profile
                    </span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="group relative flex items-center gap-2 px-4 py-2 bg-base-200/60 hover:bg-error/20 border border-base-300 hover:border-error/40 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <LogOut className="w-4 h-4 text-base-content group-hover:text-error transition-colors" />
                    <span className="hidden sm:inline text-base-content group-hover:text-error text-sm font-medium">
                      Logout
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent"></div>
    </header>
  );
};

export default Navbar;
