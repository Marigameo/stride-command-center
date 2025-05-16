import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { agentsGlance } from "@/data/mockData";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Updated type to reflect changes in mockData (no lucideIcon)
type AgentGlanceItem = Omit<typeof agentsGlance[0], 'lucideIcon'>;

const MyWorkforce = () => {
  const navigate = useNavigate();
  const handleCta = (url: string | undefined) => {
    if (!url) return; // Add a check for undefined url
    // Check if the URL is an external link (starts with http or https)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      // For internal links, use react-router-dom's navigate
      navigate(url);
    }
  };
  return (
    <div className="space-y-8">
      <section className="px-4">
        <h2 className="text-xl font-semibold mb-4">My Workforce</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentsGlance.map((agent: AgentGlanceItem) => {
            return (
              <Card key={agent.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-lg overflow-hidden">
                        <img src={agent.agentLogo} alt={agent.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-medium text-base">{agent.name}</h3>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", agent.status === "Active" ? "bg-green-100 text-green-800" : agent.status === "Idle" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800")}>{agent.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 mt-6 truncate" title={agent.currentTask || (agent.lastCompleted ? `Last: ${agent.lastCompleted}` : '')}>
                    {agent.currentTask ? (
                      <>
                        <span className="font-semibold">Current Task:</span> {agent.currentTask}
                      </>
                    ) : agent.lastCompleted ? (
                      <>
                        <span className="font-semibold">Last Completed:</span> {agent.lastCompleted}
                      </>
                    ) : (
                      'No current task'
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mb-6 truncate" title={agent.metric}>
                    <span className="font-semibold">Metric:</span> {agent.metric}
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{agent.progress}%</span>
                    </div>
                    <Progress value={agent.progress} className="h-2 [&>div]:bg-orange-500" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-3 pb-3 pr-4">
                  <Button variant="outline" size="sm" onClick={() => handleCta(agent.agentPageUrl)}>{agent.cta}</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MyWorkforce;
