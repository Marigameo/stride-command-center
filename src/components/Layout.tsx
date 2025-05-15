import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/appStore";
import { Button } from "./ui/button";
import { MessageCircle, Sparkles } from "lucide-react";
import ChatAssistant from "./ChatAssistant";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  const [chatOpen, setChatOpen] = useState(false);
  
  const handleOpenChat = () => {
    setChatOpen(true);
  };
  
  return (
    <div className="min-h-screen flex w-full bg-white">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[240px]'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div></div> {/* Left side empty for now */}
            <Button 
              size="sm" 
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-white hover:from-orange-600 hover:via-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-gradient-x font-medium px-4 py-2 rounded-full border border-orange-400/30"
              onClick={handleOpenChat}
            >
              <Sparkles className="w-4 h-4" />
              Ask Strive AI
            </Button>
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </main>
      <ChatAssistant open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
};

export default Layout;
