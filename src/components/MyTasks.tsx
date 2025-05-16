import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { attentionItems } from "@/data/mockData";
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AttentionItem = Omit<typeof attentionItems[0], 'lucideIcon'>;

const MyTasks = () => {
  const [hiddenItems, setHiddenItems] = useState<number[]>([]);
  const navigate = useNavigate();

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

  return (
    <div className="space-y-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attentionItems.filter(item => !hiddenItems.includes(item.id)).map((item: AttentionItem) => {
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
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700 text-lg overflow-hidden">
                    <img src={item.agentLogo} alt={item.agentName} className="w-full h-full object-cover" />
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
          );
        })}
      </div>
    </div>
  );
};

export default MyTasks;
