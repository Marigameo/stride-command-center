import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { agentsGlance } from "@/data/mockData";
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
import { Filter, X, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Updated type to reflect changes in mockData (no lucideIcon)
type AgentGlanceItem = Omit<typeof agentsGlance[0], 'lucideIcon'>;

const categories = ["Marketing", "Financial Operations", "Sales"];
const statuses = ["Active", "Idle", "Waiting"];

const MyWorkforce = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [itemsPerCategory, setItemsPerCategory] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const handleCta = (url: string | undefined) => {
    if (!url) return;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const filteredAgents = agentsGlance.filter(agent => 
    (selectedCategories.length === 0 || selectedCategories.includes(agent.category)) &&
    (selectedStatuses.length === 0 || selectedStatuses.includes(agent.status))
  );

  const renderCategorySection = (category: string) => {
    const categoryAgents = filteredAgents.filter(agent => agent.category === category);
    if (categoryAgents.length === 0) return null;

    const currentLimit = itemsPerCategory[category] || 6;
    const hasMore = categoryAgents.length > currentLimit;
    const itemsToShow = categoryAgents.slice(0, currentLimit);

    return (
      <div className="mb-8 transition-all duration-300 ease-in-out">
        <h3 className="text-lg font-semibold mb-4">{category}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itemsToShow.map((agent: AgentGlanceItem) => (
            <Card key={agent.id} className="transition-all duration-300 ease-in-out hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={agent.agentLogo} 
                        alt={agent.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=random`;
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-base">{agent.name}</h3>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", 
                    agent.status === "Active" ? "bg-green-100 text-green-800" : 
                    agent.status === "Idle" ? "bg-blue-100 text-blue-800" : 
                    "bg-orange-100 text-orange-800"
                  )}>
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
                <Button variant="outline" size="sm" onClick={() => handleCta(agent.agentPageUrl)}>{agent.cta}</Button>
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
    <div className="space-y-8">
      <section className="px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Workforce</h2>
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
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuGroup>
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      toggleStatus(status);
                    }}
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      className="mr-2"
                    />
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {(selectedCategories.length > 0 || selectedStatuses.length > 0) && (
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
            {selectedStatuses.map((status) => (
              <div key={status} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
                <span className="text-sm">Status: {status}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => toggleStatus(status)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="transition-all duration-300 ease-in-out">
          {filteredAgents.length > 0 ? (
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
              No agents found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyWorkforce;
