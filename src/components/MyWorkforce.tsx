import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { agentsGlance } from "@/data/mockData";

const MyWorkforce = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Installed Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentsGlance.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{agent.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    agent.status === "Active" ? "bg-green-100 text-green-800" : 
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {agent.currentTask || `Last completed: ${agent.lastCompleted}`}
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{agent.progress}%</span>
                  </div>
                  <Progress value={agent.progress} className="h-2" />
                </div>
                <div className="text-sm font-medium mb-4">{agent.metric}</div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">{agent.cta}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyWorkforce;
