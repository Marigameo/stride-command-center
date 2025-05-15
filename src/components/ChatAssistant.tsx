
import { useState, useEffect, useRef } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleDot, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
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

// Mock responses for demonstration purposes
const getMockResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("performance") || lowerQuery.includes("trend")) {
    return "Performance trends show a 24% increase in task completion rate over the last 30 days. The average response time has decreased by 12% to 1.8 minutes.";
  } else if (lowerQuery.includes("task completion") || lowerQuery.includes("completion rate")) {
    return "Your current task completion rate is 92% which is above the team average of 85%. Great job keeping up with your tasks!";
  } else if (lowerQuery.includes("agent") || lowerQuery.includes("productivity")) {
    return "Agent productivity metrics show that the Sales agent has completed 45 tasks, Support has completed 35 tasks, and the Technical agent has completed 28 tasks this week.";
  } else if (lowerQuery.includes("insight")) {
    return "Recent insights suggest adjusting task allocation to balance workload across all agents. We recommend increasing training for support agents to reduce response time.";
  } else {
    return "I'm sorry, but that query is beyond the scope of the Strive platform. I can help with insights, performance metrics, and agent productivity. Please try asking about those topics.";
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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getMockResponse(messageContent),
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 3000);
  };

  const handleSuggestionClick = (suggestion: SuggestionPill) => {
    handleSendMessage(suggestion.query);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-[400px] max-w-full right-0 left-auto rounded-none">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <DrawerTitle>Strive Assistant</DrawerTitle>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CircleDot className="h-3 w-3" />
              <span>Active</span>
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
                  I can help you get insights about your platform performance and tasks.
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
                      <p className="text-sm">{message.content}</p>
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
              <p className="text-sm text-muted-foreground mb-3">Suggested queries:</p>
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
