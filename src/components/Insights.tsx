import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { TrendingUp, ChevronUp, ChevronDown, BarChart3 } from "lucide-react";
import { performanceMetrics } from "@/data/mockData";
import MiniTrendChart from './MiniTrendChart';
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
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Workforce Insights</h1>
      
      {/* Performance Summary Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Performance Summary (For the quarter)</h2>
        </div>
        
        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enhancedPerformanceMetrics.map((metric) => (
            <Card key={metric.id} className={metric.metric === "Conversion Rate" ? "border-red-300" : ""}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-700 text-sm">{metric.metric}</h3>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className={`text-2xl font-semibold ${metric.metric === "Conversion Rate" ? "text-red-600" : ""}`}>
                    {metric.value}
                  </span>
                  <span className={cn("text-xs font-medium pb-0.5", 
                    metric.trend === "up" ? "text-green-600" : 
                    metric.trend === "down" ? "text-red-600" : 
                    "text-gray-600"
                  )}>
                    {metric.change} (WoW)
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
    </div>
  );
};

export default Insights;
