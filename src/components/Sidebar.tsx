
import { useAppStore, type Page } from "@/store/appStore";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, BarChart3, ShoppingBag, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar } = useAppStore();

  const menuItems: { id: Page; title: string; icon: React.ReactNode; disabled?: boolean; badge?: string }[] = [
    { id: "commandCenter", title: "Command Centre", icon: <LayoutDashboard size={20} /> },
    { id: "myTasks", title: "My Tasks", icon: <CheckSquare size={20} /> },
    { id: "insights", title: "Insights", icon: <BarChart3 size={20} /> },
    { 
      id: "marketplace", 
      title: "Marketplace", 
      icon: <ShoppingBag size={20} />, 
      disabled: true,
      badge: "Coming Soon"
    },
    { id: "accountSettings", title: "Account Settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10",
        sidebarCollapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && <h1 className="text-lg font-semibold">StriveLabs</h1>}
          <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-gray-100 rounded-md ml-auto"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        
        <nav className="py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => !item.disabled && setCurrentPage(item.id)}
                  disabled={item.disabled}
                  className={cn(
                    "flex items-center w-full px-4 py-2.5 hover:bg-gray-100 hover:text-primary transition-colors",
                    currentPage === item.id ? "text-primary bg-orange-50" : "text-gray-700",
                    item.disabled && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <span className="inline-flex">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className="ml-3 flex items-center justify-between w-full">
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.badge && <Badge variant="outline" className="ml-2 bg-gray-100">{item.badge}</Badge>}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
