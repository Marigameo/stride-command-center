import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/appStore";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  
  return (
    <div className="min-h-screen flex w-full bg-white">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[240px]'}`}>
        <div className="p-6 flex flex-col h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
