import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
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
import { useAuth } from "@/context/AuthContext";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  console.log(logout);

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
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive
                          ? "bg-oma-gold text-black font-medium"
                          : "text-oma-gold hover:bg-oma-gold/10"
                      }`
                    }
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                  <NavLink
                    to="/members"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive
                          ? "bg-oma-gold text-black font-medium"
                          : "text-oma-gold hover:bg-oma-gold/10"
                      }`
                    }
                  >
                    <Users size={18} />
                    <span>Members</span>
                  </NavLink>
                  <NavLink
                    to="/add-member"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive
                          ? "bg-oma-gold text-black font-medium"
                          : "text-oma-gold hover:bg-oma-gold/10"
                      }`
                    }
                  >
                    <UserPlus size={18} />
                    <span>Add Member</span>
                  </NavLink>
                  <NavLink
                    to="/add-signature"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive
                          ? "bg-oma-gold text-black font-medium"
                          : "text-oma-gold hover:bg-oma-gold/10"
                      }`
                    }
                  >
                    <UploadIcon size={18} />
                    <span>Add Signature</span>
                  </NavLink>
                  <NavLink
                    to="/verify"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive
                          ? "bg-oma-gold text-black font-medium"
                          : "text-oma-gold hover:bg-oma-gold/10"
                      }`
                    }
                  >
                    <Barcode size={18} />
                    <span>Verify ID</span>
                  </NavLink>
                  <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive
                          ? "bg-oma-gold text-black font-medium"
                          : "text-oma-gold hover:bg-oma-gold/10"
                      }`
                    }
                  >
                    <ChartBar size={18} />
                    <span>Transactions</span>
                  </NavLink>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto">
            <div className="px-3 py-2">
              <Button
                variant="outline"
                className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => logout()}
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
