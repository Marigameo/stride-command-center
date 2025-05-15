import { useAppStore, type Page } from "@/store/appStore";
import { cn } from "@/lib/utils";
import { MonitorCog, Lightbulb, Store, UsersRound, Settings, ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";


const Sidebar = () => {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar } = useAppStore();

  const menuItems: { id: Page; title: string; icon: React.ReactNode; disabled?: boolean; badge?: string }[] = [
    { id: "commandCenter", title: "Command Center", icon: <MonitorCog size={20} /> },
    { id: "myWorkforce", title: "My Workforce", icon: <UsersRound size={20} /> },
    { id: "myTasks", title: "My Tasks", icon: <ClipboardList size={20} /> },
    { id: "insights", title: "Insights", icon: <Lightbulb size={20} /> },
    { 
      id: "marketplace", 
      title: "Marketplace", 
      icon: <Store size={20} />, 
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
          <div className="flex items-center">
            {!sidebarCollapsed && (
              <img 
                src="/strivelabs-logo.svg" 
                alt="StriveLabs" 
                style={{
                  width: 120,
                  height: 40,
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
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
                    item.disabled && "cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "inline-flex",
                    sidebarCollapsed && "w-full justify-center",
                    item.disabled && "opacity-60"
                  )}>{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className="ml-3 flex items-center justify-between w-full">
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.badge && <Badge variant="outlineGreen" className="ml-2 text-[9px]">{item.badge}</Badge>}
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
