
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/appStore";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import ChatAssistant from "./ChatAssistant";
import { toast } from "@/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  const [chatOpen, setChatOpen] = useState(false);
  
  const handleOpenChat = () => {
    setChatOpen(true);
    toast({
      title: "Strive Assistant activated",
      description: "Ask questions about insights and platform performance",
    });
  };
  
  return (
    <div className="min-h-screen flex w-full bg-white">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[240px]'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div></div> {/* Left side empty for now */}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleOpenChat}
            >
              <MessageCircle className="w-4 h-4" />
              Ask Strive
            </Button>
          </div>
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
      <ChatAssistant open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
};

export default Layout;
