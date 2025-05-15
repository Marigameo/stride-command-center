
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/appStore";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  
  return (
    <div className="min-h-screen flex w-full bg-white">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[240px]'} p-6`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
