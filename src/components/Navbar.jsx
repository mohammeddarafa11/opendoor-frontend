import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Menu,
  User,
  Building2,
  Bell,
  LogOut,
  LayoutDashboard,
  Heart,
  FileText,
  Settings,
} from "lucide-react";
import logo from "../assets/redLogo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "manager":
        return "/manager";
      case "agent":
        return "/agent";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        scrolled
          ? "shadow-md border-b border-gray-100"
          : "border-b border-gray-200"
      }`}
    >
      <div className="max-w-[1760px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="K Developments" className="h-8 w-auto" />
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Icon */}
            <Link
              to="/units"
              className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </Link>

            {/* Browse Properties Button */}
            {user?.role === "customer" || !user ? (
              <Link
                to="/units"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Building2 className="h-4 w-4" />
                <span>Browse Properties</span>
              </Link>
            ) : null}

            {/* Notifications Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative"
                >
                  <Bell className="h-5 w-5 text-gray-700" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[var(--pcolor1)] rounded-full ring-2 ring-white"></span>
                </button>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-2 border border-gray-300 rounded-full hover:shadow-md transition-all duration-200"
              >
                <Menu className="h-4 w-4 text-gray-700" />
                <div className="w-7 h-7 bg-[var(--pcolor1)] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  ></div>

                  {/* Menu Content */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-scaleIn">
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {user.role}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to={getDashboardLink()}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>

                          {user.role === "customer" && (
                            <>
                              <Link
                                to="/dashboard?tab=wishlist"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Heart className="h-4 w-4" />
                                Wishlist
                              </Link>
                              <Link
                                to="/dashboard?tab=reservations"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <FileText className="h-4 w-4" />
                                Reservations
                              </Link>
                            </>
                          )}

                          <Link
                            to="/dashboard?tab=profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Log out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Sign up
                        </Link>
                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Log in
                        </Link>
                        <div className="border-t border-gray-100 my-2"></div>
                        <Link
                          to="/units"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Browse Properties
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
