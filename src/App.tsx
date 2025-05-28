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
import BooksReconcilerReview from "@/pages/agents/BooksReconcilerReview";
import BlogContentStrategizer from "@/pages/agents/BlogContentStrategizer";
import BlogContentStrategizerSettings from "@/pages/agents/BlogContentStrategizerSettings";
import { useEffect } from "react";
import ConversionFunnelOptimizer from "./pages/agents/ConversionFunnelOptimizer";
import KeywordOptimizer from "./pages/agents/KeywordOptimizer";

const queryClient = new QueryClient();

// External agent URLs
const AGENT_URLS = {
  keywordOptimizer: "https://keyword-optimizer.vercel.app/",
  conversionFunnel: "https://kzmkh0380c33wiacads9.lite.vusercontent.net/"
};

// Component to handle external redirects
const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.open(to, '_blank');
    window.history.back(); // Go back to previous page after opening new tab
  }, [to]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Opening external page...</h2>
        <p className="text-gray-600">If nothing happens, <a href={to} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">click here</a></p>
      </div>
    </div>
  );
};

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
            
            {/* Agent Review Pages */}
            <Route path="/agents/keyword-optimizer" element={<KeywordOptimizer/>} />
            <Route path="/agents/conversion-funnel-optimizer" element={<ConversionFunnelOptimizer/>} />
            <Route path="/agents/books-reconciler" element={<BooksReconcilerReview />} />
            <Route path="/agents/blog-content-strategizer" element={<BlogContentStrategizer />} />
            <Route path="/agents/blog-content-strategizer/settings" element={<BlogContentStrategizerSettings />} />

            {/* Reauth page inside layout */}
            <Route path="/reauth/:service" element={<ReauthPage />} />
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
