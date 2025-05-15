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
import { ArrowDown, ArrowUp, Minus, AlertTriangle, LucideProps, FileSearch2, Filter, BookOpenText } from "lucide-react";
import { attentionItems, performanceMetrics, agentsGlance } from "@/data/mockData";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Define a type for Lucide icon components
type LucideIconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

// Helper to get Lucide icon component by name
const getLucideIcon = (iconName: string): LucideIconComponent | null => {
  switch (iconName) {
    case 'FileSearch2': return FileSearch2;
    case 'Funnel': return Filter;
    case 'BookOpenText': return BookOpenText;
    default: return null;
  }
};

const CommandCenter = () => {
  const [hiddenItems, setHiddenItems] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleCta = (action: string | undefined, url: string | undefined, itemId: number) => {
    if (!action) return;

    switch (action) {
      case 'navigateToAgent':
        if (url) window.location.href = url;
        break;
      case 'hideCard':
        setHiddenItems(prev => [...prev, itemId]);
        break;
      case 'navigateToReauth':
        if (url) navigate(url);
        break;
      default:
        console.warn('Unknown CTA action:', action);
    }
  };

  const visibleAttentionItems = attentionItems.filter(item => !hiddenItems.includes(item.id));

  return (
    <div className="space-y-8">
      <section className="overflow-x-hidden">
        <h2 className="text-xl font-semibold mb-4">Attention Required</h2>
        {visibleAttentionItems.length > 0 ? (
          <div className="relative px-4">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {visibleAttentionItems.map((item) => {
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
                      <Card className={cn("flex flex-col h-[250px]", hiddenItems.includes(item.id) && "invisible")}>
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
                          <Button className="flex-1" onClick={() => handleCta(item.primaryCtaAction, item.agentPageUrl || item.reauthPageUrl, item.id)}>{item.primaryCta}</Button>
                          <Button variant="outline" className="flex-1" onClick={() => handleCta(item.secondaryCtaAction, item.agentPageUrl || item.reauthPageUrl, item.id)}>{item.secondaryCta}</Button>
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

      <section>
        <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.map((metric) => (
            <Card key={metric.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">{metric.metric}</h3>
                  <span className="flex items-center">
                    {metric.trend === "up" ? (
                      <ArrowUp size={16} className="text-green-500" />
                    ) : metric.trend === "down" ? (
                      <ArrowDown size={16} className="text-red-500" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">{metric.value}</span>
                  <span className={`text-sm ${metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{metric.timeline}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Agents at-a-glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentsGlance.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{agent.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${agent.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
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

export default CommandCenter;
