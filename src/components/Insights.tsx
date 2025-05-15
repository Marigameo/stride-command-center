import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, TrendingUp, Clock, Brain } from "lucide-react";
import { attentionItems, performanceMetrics, agentsGlance, tasks } from "@/data/mockData";

// Process performance trend data
const getPerformanceTrendData = () => {
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }).reverse();

  return last7Days.map((day, index) => ({
    name: day,
    completionRate: 75 + Math.random() * 20,
    efficiency: 80 + Math.random() * 15,
  }));
};

const performanceTrendData = getPerformanceTrendData();

// Calculate aggregate metrics
const calculateMetrics = () => {
  const totalTasks = tasks.length;
  const criticalTasks = tasks.filter(task => task.impact === "Critical").length;
  const activeAgents = agentsGlance.filter(agent => agent.status === "Active").length;
  const totalAgents = agentsGlance.length;

  return {
    activeAgents,
    totalAgents,
    activePercentage: (activeAgents / totalAgents) * 100,
    criticalTasks,
    totalTasks,
  };
};

const Insights = () => {
  const metrics = calculateMetrics();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Workforce Insights</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Workforce Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Current Workforce Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Active Agents</div>
                  <div className="text-2xl font-semibold text-orange-600">{metrics.activeAgents}/{metrics.totalAgents}</div>
                  <div className="text-sm text-gray-500">{Math.round(metrics.activePercentage)}% Utilization</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Tasks in Progress</div>
                  <div className="text-2xl font-semibold text-blue-600">{metrics.totalTasks}</div>
                  <div className="text-sm text-gray-500">{metrics.criticalTasks} Critical</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Activities</h3>
                <div className="space-y-2">
                  {agentsGlance.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{agent.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        agent.status === "Active" ? "bg-green-100 text-green-800" :
                        agent.status === "Waiting" ? "bg-orange-100 text-orange-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">7-Day Performance Trends</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completionRate" name="Completion Rate" stroke="#ea580c" strokeWidth={2} />
                <Line type="monotone" dataKey="efficiency" name="Efficiency" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Immediate Attention Required */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Needs Your Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attentionItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${item.actionTypeColor}`}>{item.actionType}</div>
                    <div className="text-sm text-gray-600">{item.agentName}</div>
                    <div className={`text-xs ${item.descriptionColor}`}>{item.description}</div>
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    Impact: {item.impact}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Opportunities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Optimization Opportunities</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{metric.metric}</div>
                    <div className="text-xs text-gray-500">{metric.timeline}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{metric.value}</div>
                    <div className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {metric.change}
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Redistribute tasks from high-utilization agents to optimize workload</li>
                  <li>Review and update automation rules for repetitive tasks</li>
                  <li>Consider scaling up agent capacity based on current utilization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
