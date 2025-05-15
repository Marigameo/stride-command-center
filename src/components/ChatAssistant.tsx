import { useState, useEffect, useRef } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleDot, MessageCircle, X } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  componentType?: "text" | "chart" | "table"; // Added component type for rich responses
  data?: any; // Data for the component
};

type SuggestionPill = {
  id: string;
  text: string;
  query: string;
};

const suggestions: SuggestionPill[] = [
  { id: "1", text: "Agent Status", query: "What are my agents currently working on?" },
  { id: "2", text: "Critical Tasks", query: "Show me critical tasks that need attention" },
  { id: "3", text: "Workforce Efficiency", query: "How efficient is my workforce today?" },
  { id: "4", text: "Optimization Tips", query: "How can I optimize my workforce?" },
];

// Updated performance trend data to match the new insights
const performanceTrendData = (() => {
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }).reverse();

  return last7Days.map((day) => ({
    name: day,
    completionRate: 75 + Math.random() * 20,
    efficiency: 80 + Math.random() * 15,
  }));
})();

// Updated task completion data
const taskCompletionData = [
  { category: "Critical", count: 2, status: "Pending" },
  { category: "High Priority", count: 5, status: "In Progress" },
  { category: "Routine", count: 12, status: "Active" },
  { category: "Automated", count: 25, status: "Running" },
];

// Updated agent productivity data to match the new workforce insights
const agentProductivityData = [
  { name: "Keyword Optimizer", efficiency: 92, tasks: 15, status: "Active" },
  { name: "Conversion Funnel", efficiency: 88, tasks: 8, status: "Active" },
  { name: "Books Reconciler", efficiency: 78, tasks: 27, status: "Waiting" },
];

// Updated insights data
const insightsTableData = [
  { insight: "Workforce Utilization", value: "85%", change: "+12%", status: "Optimal" },
  { insight: "Task Completion Rate", value: "92%", change: "+7%", status: "Above Target" },
  { insight: "Average Response Time", value: "1.8 min", change: "-15%", status: "Excellent" },
  { insight: "Automation Rate", value: "78%", change: "+5%", status: "Improving" },
];

// Updated mock responses
const getMockResponse = (query: string): Message => {
  const lowerQuery = query.toLowerCase();
  const id = Date.now() + 1;
  
  if (lowerQuery.includes("working on") || lowerQuery.includes("status")) {
    return {
      id: id.toString(),
      content: "Here's the current status of your AI workforce:",
      role: "assistant",
      timestamp: new Date(),
      componentType: "table",
      data: agentProductivityData.map(agent => ({
        insight: agent.name,
        value: `${agent.tasks} tasks`,
        change: `${agent.efficiency}% efficient`,
        status: agent.status
      }))
    };
  } else if (lowerQuery.includes("critical") || lowerQuery.includes("attention")) {
    return {
      id: id.toString(),
      content: "Here are the tasks requiring immediate attention:",
      role: "assistant",
      timestamp: new Date(),
      componentType: "chart",
      data: {
        type: "bar",
        data: taskCompletionData,
        xKey: "category",
        yKey: "count"
      }
    };
  } else if (lowerQuery.includes("efficient") || lowerQuery.includes("performance")) {
    return {
      id: id.toString(),
      content: "Your workforce efficiency over the last 7 days:",
      role: "assistant",
      timestamp: new Date(),
      componentType: "chart",
      data: {
        type: "line",
        data: performanceTrendData,
        xKey: "name",
        yKey: ["completionRate", "efficiency"]
      }
    };
  } else if (lowerQuery.includes("optimize") || lowerQuery.includes("improvement")) {
    return {
      id: id.toString(),
      content: "Based on current metrics, here are the key areas for optimization:",
      role: "assistant",
      timestamp: new Date(),
      componentType: "table",
      data: [
        { insight: "Task Distribution", value: "Uneven", change: "High priority", status: "Action needed" },
        { insight: "Agent Utilization", value: "85%", change: "Near capacity", status: "Monitor" },
        { insight: "Automation Rules", value: "78%", change: "Can improve", status: "Review" },
        { insight: "Response Time", value: "1.8 min", change: "Optimal", status: "Maintain" }
      ]
    };
  } else {
    return {
      id: id.toString(),
      content: "I can help you monitor and optimize your AI workforce. Try asking about agent status, critical tasks, workforce efficiency, or optimization opportunities.",
      role: "assistant",
      timestamp: new Date(),
      componentType: "text"
    };
  }
};

// Loading states to simulate processing
const loadingStates = [
  "Gathering information...",
  "Analyzing data...",
  "Processing insights...",
  "Generating response..."
];

const ChatAssistant = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingStates.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const assistantMessage = getMockResponse(messageContent);
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 3000);
  };

  const handleSuggestionClick = (suggestion: SuggestionPill) => {
    handleSendMessage(suggestion.query);
  };

  const handleClose = () => {
    // Reset to default state when closing
    setMessages([]);
    setInput("");
    onOpenChange(false);
  };

  // Helper function to render the appropriate component based on message type
  const renderMessageComponent = (message: Message) => {
    if (message.role === "user" || !message.componentType || message.componentType === "text") {
      return <p className="text-sm">{message.content}</p>;
    }
    
    if (message.componentType === "chart") {
      const { type, data, xKey, yKey } = message.data;
      const chartHeight = 200;
      
      return (
        <div className="w-full">
          <p className="text-sm mb-2">{message.content}</p>
          <div className="bg-white rounded-md p-2 mt-2 border">
            <ResponsiveContainer width="100%" height={chartHeight}>
              {type === "line" ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xKey} />
                  <YAxis />
                  <Tooltip />
                  {Array.isArray(yKey) ? (
                    yKey.map((key, index) => (
                      <Line 
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={index === 0 ? "#ea580c" : "#3b82f6"}
                        strokeWidth={2}
                      />
                    ))
                  ) : (
                    <Line type="monotone" dataKey={yKey} stroke="#ea580c" strokeWidth={2} />
                  )}
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xKey} />
                  <YAxis />
                  <Tooltip />
                  {Array.isArray(yKey) ? (
                    yKey.map((key, index) => (
                      <Bar 
                        key={key} 
                        dataKey={key} 
                        fill={index === 0 ? "#ea580c" : "#e2e8f0"} 
                      />
                    ))
                  ) : (
                    <Bar dataKey={yKey} fill="#ea580c" />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    if (message.componentType === "table") {
      return (
        <div className="w-full">
          <p className="text-sm mb-2">{message.content}</p>
          <div className="bg-white rounded-md mt-2 border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Change/Efficiency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {message.data.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{row.insight}</TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell className={
                      row.change.includes('+') ? 'text-green-600' : 
                      row.change.includes('-') ? 'text-red-600' : 
                      'text-gray-600'
                    }>
                      {row.change}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        row.status === 'Active' ? 'bg-green-100 text-green-800' :
                        row.status === 'Waiting' ? 'bg-orange-100 text-orange-800' :
                        row.status === 'Action needed' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }
    
    return <p className="text-sm">{message.content}</p>;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-[400px] max-w-full right-0 left-auto rounded-none">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/strivelabs-logo.svg"
                alt="StriveLabs"
                style={{ width: 120, height: 40, objectFit: 'contain' }}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CircleDot className="h-3 w-3" />
                <span>Ready</span>
              </div>
              <DrawerClose onClick={handleClose}>
                <X className="h-4 w-4" />
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>
        <div className="flex flex-col h-[calc(100vh-140px)]">
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <MessageCircle className="h-12 w-12 text-primary/20 mb-4" />
                <h3 className="text-lg font-medium mb-2">Welcome to Strive Assistant</h3>
                <p className="text-muted-foreground mb-6">
                  I can help you get insights about your agents & tasks
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-muted"
                      }`}
                    >
                      {renderMessageComponent(message)}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
                        <div className="animate-pulse h-2 w-2 bg-primary rounded-full" style={{ animationDelay: "0.2s" }}></div>
                        <div className="animate-pulse h-2 w-2 bg-primary rounded-full" style={{ animationDelay: "0.4s" }}></div>
                        <span className="text-sm text-gray-600 ml-1">{loadingStates[loadingStep]}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {messages.length === 0 && (
            <div className="p-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t mt-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something about insights..."
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                Send
              </Button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatAssistant;
