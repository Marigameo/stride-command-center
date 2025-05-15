
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tasks } from "@/data/mockData";

const MyTasks = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-500">{task.actionType}</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.impact === "High" ? "bg-orange-100 text-orange-800" : 
                  task.impact === "Medium" ? "bg-blue-100 text-blue-800" : 
                  task.impact === "Critical" ? "bg-red-100 text-red-800" : 
                  "bg-gray-100 text-gray-800"
                }`}>
                  {task.impact}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700">
                  {task.agentLogo}
                </div>
                <div>
                  <div className="font-medium">{task.agentName}</div>
                  <div className="text-xs text-gray-500">Due: {task.dueDate}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{task.description}</p>
            </CardContent>
            <CardFooter className="flex gap-2 bg-gray-50 border-t">
              <Button className="flex-1">{task.primaryCta}</Button>
              <Button variant="outline" className="flex-1">{task.secondaryCta}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
