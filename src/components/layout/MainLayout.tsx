import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Users,
  Barcode,
  UserPlus,
  LogOut,
  LayoutDashboard,
  ChartBar,
  UploadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimeBasedGreeting } from "./TimeBasedGreeting";
import { useAuth } from "@/context/AuthContext"; // ✅ Make sure this path is correct

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, logout } = useAuth();
console.log(isAuthenticated)
  // 🔐 Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // ⛔ Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-oma-gold/30">
          <div className="p-4 border-b border-oma-gold/30">
            <h1 className="text-2xl font-bold text-oma-gold">OMA</h1>
            <p className="text-sm text-oma-gold/70">Member Hub</p>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="space-y-1 py-2">
                  <SidebarLink
                    to="/dashboard"
                    icon={<LayoutDashboard size={18} />}
                    label="Dashboard"
                  />
                  <SidebarLink
                    to="/members"
                    icon={<Users size={18} />}
                    label="Members"
                  />
                  <SidebarLink
                    to="/add-member"
                    icon={<UserPlus size={18} />}
                    label="Add Member"
                  />
                  <SidebarLink
                    to="/add-signature"
                    icon={<UploadIcon size={18} />}
                    label="Add Signature"
                  />
                  <SidebarLink
                    to="/verify"
                    icon={<Barcode size={18} />}
                    label="Verify ID"
                  />
                  <SidebarLink
                    to="/transactions"
                    icon={<ChartBar size={18} />}
                    label="Transactions"
                  />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="mt-auto">
            <div className="px-3 py-2">
              <Button
                variant="outline"
                className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={logout} // ✅ Hooked to logout
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
            <div className="p-4 border-t border-oma-gold/30">
              <p className="text-xs text-oma-gold/70 mb-2">
                © 2025 OMA Member Hub
              </p>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 text-oma-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SidebarTrigger>
              <div className="flex items-center gap-3">
                <TimeBasedGreeting />
                <h1 className="text-xl font-semibold text-gray-800">
                  Member Hub
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                Admin Mode
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

// 🧩 Sidebar link helper component
const SidebarLink = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md ${
        isActive
          ? "bg-oma-gold text-black font-medium"
          : "text-oma-gold hover:bg-oma-gold/10"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);
