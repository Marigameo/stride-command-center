import Layout from "@/components/Layout";
import { useAppStore } from "@/store/appStore";
import CommandCenter from "@/components/CommandCenter";
import MyWorkforce from "@/components/MyWorkforce";
import MyTasks from "@/components/MyTasks";
import Insights from "@/components/Insights";
import AccountSettings from "@/components/AccountSettings";

const Index = () => {
  const currentPage = useAppStore((state) => state.currentPage);

  // Render the appropriate component based on the current page
  const renderContent = () => {
    switch (currentPage) {
      case "commandCenter":
        return <CommandCenter />;
      case "myWorkforce":
        return <MyWorkforce />;
      case "myTasks":
        return <MyTasks />;
      case "insights":
        return <Insights />;
      case "accountSettings":
        return <AccountSettings />;
      case "marketplace":
        return (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-3">Marketplace</h1>
              <p className="text-gray-600">Coming soon! Our marketplace will feature agent templates and extensions.</p>
            </div>
          </div>
        );
      default:
        return <CommandCenter />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default Index;
