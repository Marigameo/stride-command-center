import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { attentionItems } from "@/data/mockData";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

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
  priority: string;
};

const categories = ["Marketing", "Financial Operations", "Sales"];
const priorities = ["High", "Medium", "Low"];

const MyTasks = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [hiddenItems, setHiddenItems] = useState<number[]>([]);
  const [itemsPerCategory, setItemsPerCategory] = useState<Record<string, number>>({});
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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const filteredItems = attentionItems.filter(item => 
    !hiddenItems.includes(item.id) &&
    (selectedCategories.length === 0 || selectedCategories.includes(item.category)) &&
    (selectedPriorities.length === 0 || selectedPriorities.includes(item.priority))
  );

  const renderCategorySection = (category: string) => {
    const categoryItems = filteredItems.filter(item => item.category === category);
    if (categoryItems.length === 0) return null;

    const currentLimit = itemsPerCategory[category] || 6;
    const hasMore = categoryItems.length > currentLimit;
    const itemsToShow = categoryItems.slice(0, currentLimit);

    return (
      <div className="mb-8 transition-all duration-300 ease-in-out">
        <h3 className="text-lg font-semibold mb-4">{category}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itemsToShow.map((item) => (
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
        {hasMore && (
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => setItemsPerCategory(prev => ({
                ...prev,
                [category]: (prev[category] || 6) + 6
              }))}
            >
              View More
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 my-6">
      <section className="px-4 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Tasks</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuGroup>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      toggleCategory(category);
                    }}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      className="mr-2"
                    />
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuGroup>
                {priorities.map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      togglePriority(priority);
                    }}
                  >
                    <Checkbox
                      checked={selectedPriorities.includes(priority)}
                      className="mr-2"
                    />
                    {priority}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {(selectedCategories.length > 0 || selectedPriorities.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((category) => (
              <div key={category} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
                <span className="text-sm">Category: {category}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => toggleCategory(category)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {selectedPriorities.map((priority) => (
              <div key={priority} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
                <span className="text-sm">Priority: {priority}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => togglePriority(priority)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="transition-all duration-300 ease-in-out">
          {filteredItems.length > 0 ? (
            <div className="space-y-12">
              {selectedCategories.length === 0 ? (
                <>
                  {renderCategorySection("Marketing")}
                  {renderCategorySection("Financial Operations")}
                  {renderCategorySection("Sales")}
                </>
              ) : (
                selectedCategories.map(category => renderCategorySection(category))
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 transition-all duration-300 ease-in-out">
              No tasks found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyTasks;
