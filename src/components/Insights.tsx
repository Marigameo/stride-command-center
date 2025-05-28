import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import { TrendingUp, ChevronUp, ChevronDown, BarChart3, Brain, MessageSquare } from "lucide-react";
import { agentsGlance as agents, performanceMetrics } from "@/data/mockData"; // Add performanceMetrics to import
import MiniTrendChart from './MiniTrendChart';
import ChatAssistant from "./ChatAssistant";
import { cn } from '@/lib/utils';

// Process performance trend data for interactive chart
const getPerformanceTrendData = () => {
  const last30Days = [...Array(30)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }).reverse();

  return last30Days.map((day, index) => {
    const randomFactor = Math.sin(index / 5) * 0.2 + 0.9;
    const costSaved = 200 + Math.round(Math.random() * 100 * randomFactor);
    const taskCompletion = 75 + Math.round(Math.random() * 20 * randomFactor);
    const acceptanceRate = 90 + Math.round(Math.random() * 10 * randomFactor);
    const conversionRate = 2 + Math.random() * 1.5 * randomFactor;
    
    return {
      name: day,
      costSaved,
      taskCompletion,
      acceptanceRate,
      conversionRate: conversionRate.toFixed(1),
    };
  });
};

const performanceTrendData = getPerformanceTrendData();

// Define Agent Insights data with enhanced styling
const agentInsights = [
  {
    id: 1,
    insight: "Impressions are up 10% this week",
    agent: "Keyword Optimizer",
    trend: "up",
    change: "+10%",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-500",
    icon: ChevronUp
  },
  {
    id: 2,
    insight: "Approval Rate is up 1.5% this week",
    agent: "Books Reconciler",
    trend: "up",
    change: "+1.5%",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
    icon: ChevronUp
  },
  {
    id: 3,
    insight: "100% Approval Rate for Product Campaigns",
    agent: "Keyword Optimizer",
    trend: "up",
    change: "+100%",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconColor: "text-purple-500",
    icon: ChevronUp
  },
  {
    id: 4,
    insight: "CTR down 5% for Competitor Campaigns over the last 4 weeks",
    agent: "Keyword Optimizer",
    trend: "down",
    change: "-5%",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-500",
    icon: ChevronDown
  }
];

// Enhanced performance metrics with conversion rate
const enhancedPerformanceMetrics = [
  ...performanceMetrics,
  {
    id: 4,
    metric: "Conversion Rate",
    trend: "down",
    value: "-9%",
    change: "-34%",
    timeline: "This Week"
  }
];

const workforceMetrics = [
  {
    id: 1,
    metric: "Total Cost Saved",
    value: "$7,489",
    change: "+14%",
    trend: "up",
    timeline: "WoW"
  },
  {
    id: 2,
    metric: "Task Completion",
    value: "89%",
    change: "+5%",
    trend: "up",
    timeline: "WoW"
  },
  {
    id: 3,
    metric: "Acceptance Rate",
    value: "95%",
    change: "+2%",
    trend: "up",
    timeline: "WoW"
  },
  {
    id: 4,
    metric: "Conversion Rate",
    value: "-9%",
    change: "-34%",
    trend: "down",
    timeline: "WoW"
  }
];

const weeklyTrendData = [
  { week: 'Week 1', costSaved: 6200, taskCompletion: 82, acceptanceRate: 91, conversionRate: 12 },
  { week: 'Week 2', costSaved: 6800, taskCompletion: 85, acceptanceRate: 92, conversionRate: 8 },
  { week: 'Week 3', costSaved: 7100, taskCompletion: 87, acceptanceRate: 94, conversionRate: 4 },
  { week: 'Week 4', costSaved: 7489, taskCompletion: 89, acceptanceRate: 95, conversionRate: -9 },
];

// Custom tooltip for the interactive chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-md shadow-md">
        <p className="font-medium text-gray-800">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm text-gray-700">{entry.name}: </span>
              <span className="text-sm font-medium">
                {entry.name === "Cost Saved" ? `$${entry.value}` : 
                 entry.name === "Conversion Rate" ? `${entry.value}%` : 
                 `${entry.value}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Insights = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Group agents by category
  const agentsByCategory = agents.reduce((acc, agent) => {
    if (!acc[agent.category]) {
      acc[agent.category] = [];
    }
    acc[agent.category].push(agent);
    return acc;
  }, {});

  // Calculate category-specific insights
  const categoryInsights = Object.keys(agentsByCategory).map(category => ({
    category,
    activeAgents: agentsByCategory[category].filter(a => a.status === 'Active').length,
    totalAgents: agentsByCategory[category].length,
    efficiency: Math.round(Math.random() * 20 + 80) // Mock efficiency score
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Workforce Insights</h1>
        <Button
          onClick={() => setChatOpen(true)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Ask Strive AI
        </Button>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoryInsights.map((cat) => (
          <Card key={cat.category}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{cat.category}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Agents</span>
                  <span className="font-medium">{cat.activeAgents}/{cat.totalAgents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficiency</span>
                  <span className="font-medium text-green-600">{cat.efficiency}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Updated Performance Metrics Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Workforce Performance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {workforceMetrics.map((metric) => (
            <Card key={metric.id} className={metric.trend === "down" ? "border-red-300" : ""}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-700 text-sm">{metric.metric}</h3>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className={`text-2xl font-semibold ${metric.trend === "down" ? "text-red-600" : ""}`}>
                    {metric.value}
                  </span>
                  <span className={cn("text-xs font-medium pb-0.5", 
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {metric.change} ({metric.timeline})
                  </span>
                </div>
                <MiniTrendChart 
                  trend={metric.trend as 'up' | 'down' | 'stable'} 
                  change={metric.change} 
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Trend Chart */}
        <Card className="p-6">
          <h3 className="font-medium text-gray-700 mb-4">Weekly Performance Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="costSaved" 
                  name="Cost Saved ($)" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="taskCompletion" 
                  name="Task Completion (%)" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="acceptanceRate" 
                  name="Acceptance Rate (%)" 
                  stroke="#a855f7" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="conversionRate" 
                  name="Conversion Rate (%)" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Agent Insights Section - Enhanced with better styling */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Agent Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agentInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card 
                key={insight.id} 
                className={cn("border-l-4 transition-all hover:shadow-md", insight.borderColor)}
              >
                <CardContent className="pt-6">
                  <div className={cn("flex items-center justify-between p-4 rounded-lg", insight.bgColor)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn("p-1 rounded-full", insight.iconColor, "bg-white")}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-sm font-medium">{insight.insight}</div>
                      </div>
                      <div className="ml-6 mt-2">
                        <div className="text-base font-semibold text-gray-800">{insight.agent}</div>
                        <div className={cn("text-sm font-medium mt-1", 
                          insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {insight.change}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <ChatAssistant 
        open={chatOpen} 
        onOpenChange={setChatOpen}
        selectedAgent={selectedAgent}
      />
    </div>
  );
};

export default Insights;
