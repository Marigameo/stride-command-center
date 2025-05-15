
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
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { attentionItems, performanceMetrics, agentsGlance } from "@/data/mockData";

const CommandCenter = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Attention Required</h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {attentionItems.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-500">{item.actionType}</div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.impact === "High" ? "bg-orange-100 text-orange-800" : 
                        item.impact === "Medium" ? "bg-blue-100 text-blue-800" : 
                        item.impact === "Critical" ? "bg-red-100 text-red-800" : 
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {item.impact}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700">
                        {item.agentLogo}
                      </div>
                      <div className="font-medium">{item.agentName}</div>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1">{item.primaryCta}</Button>
                    <Button variant="outline" className="flex-1">{item.secondaryCta}</Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
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
                  <span className={`text-sm ${
                    metric.trend === "up" ? "text-green-600" : 
                    metric.trend === "down" ? "text-red-600" : 
                    "text-gray-600"
                  }`}>
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

export default CommandCenter;
