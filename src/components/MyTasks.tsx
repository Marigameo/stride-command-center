import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { attentionItems } from "@/data/mockData";
import { FileSearch2, Filter, BookOpenText, AlertTriangle, LucideProps } from "lucide-react";
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

// Helper for Lucide icon
const getLucideIcon = (iconName: string) => {
  switch (iconName) {
    case 'FileSearch2': return FileSearch2;
    case 'Funnel': return Filter;
    case 'BookOpenText': return BookOpenText;
    case 'AlertTriangle': return AlertTriangle;
    default: return null;
  }
};

type AttentionItem = typeof attentionItems[0];

const MyTasks = () => {
  const [hiddenItems, setHiddenItems] = useState<number[]>([]);
  const handleHide = (id: number) => setHiddenItems(prev => [...prev, id]);

  return (
    <div className="space-y-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attentionItems.filter(item => !hiddenItems.includes(item.id)).map((item: AttentionItem) => {
          const IconComponent = item.lucideIcon ? getLucideIcon(item.lucideIcon) : null;
          return (
            <Card key={item.id} className={cn("flex flex-col h-[250px] transition-all duration-300 ease-in-out", hiddenItems.includes(item.id) ? 'opacity-0 max-h-0 scale-y-0 !p-0 !m-0 border-none' : 'opacity-100 max-h-[500px] scale-y-100')} style={{ transformOrigin: 'top' }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={cn("text-sm font-medium", item.actionTypeColor)}>{item.actionType}</div>
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
                <Button className="flex-1">{item.primaryCta}</Button>
                <Button variant="outline" className="flex-1" onClick={() => handleHide(item.id)}>{item.secondaryCta}</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyTasks;
