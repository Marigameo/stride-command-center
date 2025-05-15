import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReauthPage from "./pages/ReauthPage";
import CommandCenter from "@/components/CommandCenter";
import MyTasks from "@/components/MyTasks";
import Insights from "@/components/Insights";
import MyWorkforce from "@/components/MyWorkforce";
import AccountSettings from "@/components/AccountSettings";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main app layout with sidebar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/command-center" replace />} />
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/my-workforce" element={<MyWorkforce />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/marketplace" element={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-center"><h1 className="text-2xl font-semibold mb-3">Marketplace</h1><p className="text-gray-600">Coming soon! Our marketplace will feature agent templates and extensions.</p></div></div>} />
          </Route>
          {/* Special routes outside layout */}
          <Route path="/reauth/:service" element={<ReauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
