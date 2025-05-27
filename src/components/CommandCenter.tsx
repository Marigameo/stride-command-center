import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { attentionItems } from "@/data/mockData";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type AttentionItem = {
  id: number;
  actionType: string;
  agentName: string;
  agentLogo: string;
  impact: string;
  primaryCta: string;
  secondaryCta: string;
  description: string;
  actionTypeColor: string;
  descriptionColor: string;
  agentPageUrl: string;
  primaryCtaAction: string;
  secondaryCtaAction: string;
  category: string;
  showInCommandCenter?: boolean;
};

const categories = ["All", "Marketing", "Financial Operations", "Sales"];

const CommandCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hiddenItems, setHiddenItems] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleCta = (action: string | undefined, url: string | undefined, itemId?: number) => {
    if (!action) return;
    switch (action) {
      case 'navigateToAgent':
        if (url) {
          if (url.startsWith('http')) {
            window.open(url, '_blank');
          } else {
            navigate(url);
          }
        }
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

  const filteredItems = attentionItems.filter(item => 
    !hiddenItems.includes(item.id) &&
    (item.showInCommandCenter ?? true) && 
    (selectedCategory === "All" || item.category === selectedCategory)
  );

  const renderCategorySection = (category: string) => {
    const categoryItems = filteredItems.filter(item => item.category === category);
    if (categoryItems.length === 0) return null;

    return (
      <div className="my-12 transition-all duration-300 ease-in-out">
        <h3 className="text-lg font-semibold mb-4">{category}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryItems.map((item: AttentionItem) => (
            <Card key={item.id} className="flex flex-col h-[250px] transition-all duration-300 ease-in-out hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={cn("text-sm font-medium", item.actionTypeColor)}>{item.actionType}</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.impact === "High" ? "bg-orange-100 text-orange-600" :
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
                  <div className="relative w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.agentLogo} 
                      alt={item.agentName} 
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.agentName)}&background=random`;
                      }}
                    />
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
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 my-6">
      <section className="px-4 mb-8">
        <div className="flex justify-between items-center mb-6">
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

        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "min-w-[80px] rounded-full transition-all duration-200 ease-in-out",
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-muted/50"
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {filteredItems.length > 0 ? (
            <div className="space-y-8">
              {selectedCategory === "All" ? (
                <>
                  {renderCategorySection("Marketing")}
                  {renderCategorySection("Financial Operations")}
                  {renderCategorySection("Sales")}
                </>
              ) : (
                renderCategorySection(selectedCategory)
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 transition-all duration-300 ease-in-out">
              No items requiring attention.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CommandCenter;
