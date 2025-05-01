
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MemberProvider } from "@/contexts/MemberContext";

import MainLayout from "./components/layout/MainLayout";
import MembersListPage from "./pages/MembersListPage";
import AddMemberPage from "./pages/AddMemberPage";
import MemberDetailPage from "./pages/MemberDetailPage";
import EditMemberPage from "./pages/EditMemberPage";
import VerifyIdPage from "./pages/VerifyIdPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MemberProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<MembersListPage />} />
              <Route path="/add-member" element={<AddMemberPage />} />
              <Route path="/members/:id" element={<MemberDetailPage />} />
              <Route path="/members/:id/edit" element={<EditMemberPage />} />
              <Route path="/verify" element={<VerifyIdPage />} />
              <Route path="/verify/:id" element={<VerifyIdPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MemberProvider>
  </QueryClientProvider>
);

export default App;
