import { Link, useLocation } from "react-router-dom";
import { useAppStore, type Page } from "@/store/appStore";
import { cn } from "@/lib/utils";
import { MonitorCog, Lightbulb, Store, UsersRound, Settings, ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();
  const menuItems: { id: Page; title: string; icon: React.ReactNode; disabled?: boolean; badge?: string; route: string }[] = [
    { id: "commandCenter", title: "Command Center", icon: <MonitorCog size={20} />, route: "/command-center" },
    { id: "myWorkforce", title: "My Workforce", icon: <UsersRound size={20} />, route: "/my-workforce" },
    { id: "myTasks", title: "My Tasks", icon: <ClipboardList size={20} />, route: "/my-tasks" },
    { id: "insights", title: "Insights", icon: <Lightbulb size={20} />, route: "/insights" },
    {
      id: "marketplace",
      title: "Marketplace",
      icon: <Store size={20} />,
      disabled: true,
      badge: "Coming Soon",
      route: "/marketplace"
    },
    { id: "accountSettings", title: "Account Settings", icon: <Settings size={20} />, route: "/account-settings" },
  ];

  const isActive = (route: string) => {
    if (route === "/command-center") {
      return location.pathname === route;
    }
    return location.pathname.startsWith(route);
  };

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
                <Link
                  to={item.route}
                  tabIndex={item.disabled ? -1 : 0}
                  className={cn(
                    "flex items-center w-full px-4 py-2.5 hover:bg-gray-100 hover:text-primary transition-colors",
                    isActive(item.route) ? "text-primary bg-orange-50" : "text-gray-700",
                    item.disabled && "cursor-not-allowed pointer-events-none"
                  )}
                  aria-disabled={item.disabled}
                >
                  <span className={cn(
                    "inline-flex",
                    sidebarCollapsed && "w-full justify-center",
                    item.disabled && "opacity-60"
                  )}>{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className="ml-3 flex items-center justify-between w-full">
                      <span className={cn("text-sm font-medium", item.disabled && "opacity-60")}>{item.title}</span>
                      {item.badge && <Badge variant="outlineGreen" className="ml-2 text-[9px]">{item.badge}</Badge>}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
