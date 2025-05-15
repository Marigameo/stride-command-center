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
  { id: "1", text: "Show performance trends", query: "Show me performance trends" },
  { id: "2", text: "Task completion rate", query: "What's my task completion rate?" },
  { id: "3", text: "Agent productivity", query: "How's agent productivity this week?" },
  { id: "4", text: "Recent insights", query: "Give me recent insights" },
];

// Performance trend data
const performanceTrendData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 300 },
  { month: "Mar", value: 600 },
  { month: "Apr", value: 800 },
  { month: "May", value: 500 },
  { month: "Jun", value: 900 },
  { month: "Jul", value: 750 },
];

// Task completion data
const taskCompletionData = [
  { week: "Week 1", rate: 82 },
  { week: "Week 2", rate: 86 },
  { week: "Week 3", rate: 90 },
  { week: "Week 4", rate: 92 },
];

// Agent productivity data
const agentProductivityData = [
  { name: "Sales", completed: 45, pending: 10 },
  { name: "Support", completed: 35, pending: 15 },
  { name: "Technical", completed: 28, pending: 5 },
  { name: "Marketing", completed: 22, pending: 12 },
];

// Insights data
const insightsTableData = [
  { insight: "Response time", value: "1.8 min", change: "-12%" },
  { insight: "Task completion rate", value: "92%", change: "+7%" },
  { insight: "Customer satisfaction", value: "4.7/5", change: "+0.2" },
  { insight: "Agent efficiency", value: "89%", change: "+5%" },
];

// Mock responses for demonstration purposes
const getMockResponse = (query: string): Message => {
  const lowerQuery = query.toLowerCase();
  const id = Date.now() + 1;
  
  if (lowerQuery.includes("performance") || lowerQuery.includes("trend")) {
    return {
      id: id.toString(),
      content: "Performance trends show a 24% increase in task completion rate over the last 30 days.",
      role: "assistant",
      timestamp: new Date(),
      componentType: "chart",
      data: {
        type: "line",
        data: performanceTrendData,
        xKey: "month",
        yKey: "value",
      }
    };
  } else if (lowerQuery.includes("task completion") || lowerQuery.includes("completion rate")) {
    return {
      id: id.toString(),
      content: "Your current task completion rate is 92% which is above the team average of 85%. Great job keeping up with your tasks!",
      role: "assistant",
      timestamp: new Date(),
      componentType: "chart",
      data: {
        type: "bar",
        data: taskCompletionData,
        xKey: "week",
        yKey: "rate",
      }
    };
  } else if (lowerQuery.includes("agent") || lowerQuery.includes("productivity")) {
    return {
      id: id.toString(),
      content: "Agent productivity metrics show the distribution of completed and pending tasks across different agent roles.",
      role: "assistant",
      timestamp: new Date(),
      componentType: "chart",
      data: {
        type: "bar",
        data: agentProductivityData,
        xKey: "name",
        yKey: ["completed", "pending"],
      }
    };
  } else if (lowerQuery.includes("insight")) {
    return {
      id: id.toString(),
      content: "Here are the recent insights from the platform:",
      role: "assistant",
      timestamp: new Date(),
      componentType: "table",
      data: insightsTableData,
    };
  } else {
    return {
      id: id.toString(),
      content: "I'm sorry, but that query is beyond the scope of the Strive platform. I can help with insights, performance metrics, and agent productivity. Please try asking about those topics.",
      role: "assistant",
      timestamp: new Date(),
      componentType: "text",
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
                  <Line type="monotone" dataKey={yKey} stroke="#ea580c" strokeWidth={2} />
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
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {message.data.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{row.insight}</TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell className={row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {row.change}
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
