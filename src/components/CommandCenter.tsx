import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowDown, ArrowUp, Minus, AlertTriangle, LucideProps, FileSearch2, Filter, BookOpenText, ArrowRight } from "lucide-react";
import { attentionItems, performanceMetrics, agentsGlance } from "@/data/mockData";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import MiniTrendChart from './MiniTrendChart';
import { useAppStore } from '@/store/appStore';

// Local type definitions based on mockData structure
// Ensuring trend is correctly typed for PerformanceMetricItem
const samplePerformanceMetric = {
    id: 0,
    metric: "",
    trend: "stable" as "up" | "down" | "stable", // Explicitly type trend here
    value: "",
    change: "",
    timeline: ""
};
type PerformanceMetricItem = typeof samplePerformanceMetric;
type AttentionItem = typeof attentionItems[0];
type AgentGlanceItem = typeof agentsGlance[0];

type LucideIconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

const getLucideIcon = (iconName: string): LucideIconComponent | null => {
  switch (iconName) {
    case 'FileSearch2': return FileSearch2;
    case 'Funnel': return Filter;
    case 'BookOpenText': return BookOpenText;
    case 'AlertTriangle': return AlertTriangle;
    default: return null;
  }
};

const CommandCenter = () => {
  const [hiddenItems, setHiddenItems] = useState<number[]>([]);
  const navigate = useNavigate();
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);

  const handleCta = (action: string | undefined, url: string | undefined, itemId?: number) => {
    if (!action) return;
    switch (action) {
      case 'navigateToAgent':
        if (url) navigate(url);
        break;
      case 'hideCard':
        if (itemId !== undefined) setHiddenItems(prev => [...prev, itemId]);
        break;
      case 'navigateToReauth':
        navigate('/reauth/google');
        break;
      default: console.warn('Unknown CTA action:', action);
    }
  };

  const visibleAttentionItems = attentionItems.filter(item => !hiddenItems.includes(item.id));

  return (
    <div className="space-y-8 my-6">
      <section className="overflow-x-hidden px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Attention Required</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary px-0 font-medium group hover:bg-transparent focus:bg-transparent"
            onClick={() => navigate('/my-tasks')}
          >
            View All
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
        {visibleAttentionItems.length > 0 ? (
          <div className="relative">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-4">
                {visibleAttentionItems.map((item: AttentionItem) => {
                  const IconComponent = item.lucideIcon ? getLucideIcon(item.lucideIcon) : null;
                  return (
                    <CarouselItem 
                      key={item.id} 
                      className={cn(
                        "pl-4 md:basis-1/2 lg:basis-1/3 transition-all duration-300 ease-out",
                        hiddenItems.includes(item.id) ? 'opacity-0 max-h-0 scale-y-90 !p-0 !m-0 border-none' : 'opacity-100 max-h-[500px] scale-y-100' 
                      )}
                      style={{ transformOrigin: 'top' }}
                    >
                      <Card className={cn("flex flex-col h-[250px]", hiddenItems.includes(item.id) && "invisible")} >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className={cn("text-sm font-medium", item.actionTypeColor)}>{item.actionType}</div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.impact === "High" ? "bg-orange-100 text-orange-600" : item.impact === "Medium" ? "bg-blue-100 text-blue-800" : item.impact === "Critical" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                              {item.impact}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex items-center gap-3 my-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700 text-lg">
                              {IconComponent ? <IconComponent size={24} /> : item.agentLogo}
                            </div>
                            <div className="font-medium text-base">{item.agentName}</div>
                          </div>
                          <p className={cn("mt-6 font-medium text-sm", item.descriptionColor)}>{item.description}</p>
                        </CardContent>
                        <CardFooter className="flex gap-2 mt-auto border-t pt-4">
                          <Button className="flex-1" onClick={() => handleCta(item.primaryCtaAction, item.agentPageUrl)}>{item.primaryCta}</Button>
                          <Button variant="outline" className="flex-1" onClick={() => handleCta(item.secondaryCtaAction, item.agentPageUrl, item.id)}>{item.secondaryCta}</Button>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              {visibleAttentionItems.length > 1 && (
                <>
                  <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white border-2 hover:bg-gray-100 hover:border-gray-300 z-10" />
                  <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white border-2 hover:bg-gray-100 hover:border-gray-300 z-10" />
                </>
              )}
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No items requiring attention.
          </div>
        )}
      </section>

      <section className="px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Performance Summary</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary px-0 font-medium group hover:bg-transparent focus:bg-transparent"
            onClick={() => navigate('/insights')}
          >
            Explore Insights
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric: PerformanceMetricItem) => (
            <Card key={metric.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-700 text-sm">{metric.metric}</h3>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-semibold">{metric.value}</span>
                  <span className={cn("text-xs font-medium pb-0.5", metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-gray-600")}>
                    {metric.change}
                  </span>
                </div>
                <MiniTrendChart trend={metric.trend as "up" | "down" | "stable"} change={metric.change} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Agents at-a-glance</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary px-0 font-medium group hover:bg-transparent focus:bg-transparent"
            onClick={() => navigate('/my-workforce')}
          >
            View Workforce
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentsGlance.map((agent: AgentGlanceItem) => {
            const IconComponent = agent.lucideIcon ? getLucideIcon(agent.lucideIcon) : null;
            return (
              <Card key={agent.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-lg">
                        {IconComponent ? <IconComponent size={24} className="text-gray-600"/> : agent.agentLogo}
                      </div>
                      <h3 className="font-medium text-base">{agent.name}</h3>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", agent.status === "Active" ? "bg-green-100 text-green-800" : agent.status === "Idle" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800")}>
                      {agent.status}
                    </span>
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
                  <Button variant="outline" size="sm" onClick={() => handleCta(agent.ctaAction, agent.agentPageUrl)}>{agent.cta}</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default CommandCenter;
