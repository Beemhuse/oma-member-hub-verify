import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import SignupPage from "./pages/Signup";
import TransactionDetailPage from "./pages/TransactionDetailPage";
import AddSignaturePage from "./pages/AddSignature";
import { useState } from "react";
import api from "./lib/axios";

// api()
const App = () => {
    const [refreshKey, setRefreshKey] = useState(Date.now());

  return (

  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/members" element={<MembersListPage />} />
          <Route path="/add-member" element={<AddMemberPage />} />
          <Route path="/add-signature" element={<AddSignaturePage 
          key={refreshKey}  onRefresh={() => setRefreshKey(Date.now())}/>} />
          <Route path="/members/:id" element={<MemberDetailPage />} />
          <Route path="/members/:id/edit" element={<EditMemberPage />} />
          <Route path="/verify/" element={<VerifyIdPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
  )
}


export default App;
