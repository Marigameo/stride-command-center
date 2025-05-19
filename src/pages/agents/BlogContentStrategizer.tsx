import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Settings, 
  Play, 
  BarChart3, 
  LayoutDashboard, 
  FileSearch,
  ArrowRight,
  Pause
} from "lucide-react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge, 
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { VerticalMarquee } from "@/components/magicui/vertical-marquee";

// Shimmer effect component
const Shimmer = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="animate-shimmer absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full"></div>
  </div>
);

// Custom node component for workflow steps
const CustomNode = ({ data }: { data: { label: string; isActive: boolean; completed?: boolean } }) => {
  return (
    <div className={`w-48 px-4 py-3 shadow-md rounded-md border-2 transition-all ${
      data.isActive 
        ? 'bg-transparent border-blue-400 hover:border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
        : data.completed 
          ? 'bg-transparent border-green-300 hover:border-green-200 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
          : 'bg-transparent border-gray-200/50 hover:border-gray-300/50'
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="flex items-center">
        <div className={`rounded-full w-2 h-2 mr-2 ${
          data.isActive 
            ? 'bg-blue-500' 
            : data.completed 
              ? 'bg-green-500' 
              : 'bg-gray-300'
        }`} />
        <div className={`text-sm font-medium ${
          data.isActive 
            ? 'text-blue-500 font-semibold text-glow' 
            : data.completed 
              ? 'text-green-500 text-glow' 
              : 'text-gray-500'
        }`}>
          {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

// Node types definition
const nodeTypes = {
  custom: CustomNode,
};

const BlogContentStrategizer = () => {
  const navigate = useNavigate();
  const [accordionOpen, setAccordionOpen] = useState(false);

  // Define workflow nodes with increased spacing
  const initialNodesData: Node[] = [
    {
      id: '1',
      type: 'custom',
      data: { label: 'Parse Competitor Blog Posts', isActive: false, completed: true },
      position: { x: 50, y: 50 },
    },
    {
      id: '2',
      type: 'custom',
      data: { label: 'Extract Properties & Keywords from Posts', isActive: false, completed: true },
      position: { x: 350, y: 50 },
    },
    {
      id: '3',
      type: 'custom',
      data: { label: 'Synthesize across Competing Posts', isActive: false, completed: true },
      position: { x: 700, y: 50 },
    },
    {
      id: '4',
      type: 'custom',
      data: { label: 'Recommend Blog Outline', isActive: true, completed: false },
      position: { x: 1050, y: 50 },
    },
    {
      id: '5',
      type: 'custom',
      data: { label: 'Tune Sections to Brand Guidelines', isActive: false, completed: false },
      position: { x: 1400, y: 50 },
    },
    {
      id: '6',
      type: 'custom',
      data: { label: 'Publish as Content Strategy', isActive: false, completed: false },
      position: { x: 1750, y: 50 },
    }
  ];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesData);

  // Define edges between nodes
  const initialEdgesData: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#22c55e' },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#22c55e' },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#60a5fa' },
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#64748b' },
    },
    {
      id: 'e5-6',
      source: '5',
      target: '6',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#64748b' },
    },
  ];
  
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesData);

  // Workflow steps for animation
  const workflowSteps = [
    'Parse Competitor Blog Posts',
    'Extract Properties & Keywords from Posts',
    'Synthesize across Competing Posts',
    'Recommend Blog Outline',
    'Tune Sections to Brand Guidelines',
    'Publish as Content Strategy'
  ];

  // Current active step (0-based index)
  const activeStepIndex = 3; // "Recommend Blog Outline" is active

  return (
    <div className="space-y-8 my-6 relative">
      {/* Headline Section */}
      <section className="px-4">
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <img src="/avatars/avatar4.png" alt="Blog Content Strategizer" className="w-8 h-8 rounded-full" />
            <h1 className="text-2xl font-semibold">Blog Content Strategizer</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Researches your competitors' blog posts for a set of keywords to recommend a post outline and strategy to outrank their articles
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2 mb-4">
              <div>
                <span className="font-medium">Creating outline for Amazon Marketplace</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">5 blog posts to be picked</span>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2 [&>div]:bg-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* Workflow Accordion */}
        <Card className="mb-8 border-orange-100 hover:border-orange-200 transition-colors">
          <Accordion 
            type="single" 
            collapsible 
            value={accordionOpen ? "workflow" : ""}
            onValueChange={(value) => setAccordionOpen(value === "workflow")}
          >
            <AccordionItem value="workflow" className="border-b-0">
              <div className="flex items-center justify-between p-2">
                <AccordionTrigger className="py-2 hover:no-underline flex-grow">
                  <span className="ml-4 text-base font-medium">Workflow Stages</span>
                </AccordionTrigger>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                  onClick={() => setAccordionOpen(!accordionOpen)}
                >
                  {accordionOpen ? (
                    <ArrowRight className="h-5 w-5 rotate-90" />
                  ) : (
                    <ArrowRight className="h-5 w-5 -rotate-90" />
                  )}
                </Button>
              </div>
              <AccordionContent>
                <div className="border rounded-lg p-4 bg-gray-50 border-orange-100">
                  <div style={{ height: 300 }} className="workflow-container">
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      nodeTypes={nodeTypes}
                      fitView
                      minZoom={0.1}
                      maxZoom={1.5}
                      attributionPosition="bottom-left"
                      nodesDraggable={true}
                      nodesConnectable={true}
                      elementsSelectable={true}
                      defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                        style: { strokeWidth: 2 }
                      }}
                    >
                      <Background />
                      <Controls />
                    </ReactFlow>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </section>

      {/* Center Stage - Sequential Steps */}
      <section className="px-4 py-8">
        <Card>
          <CardContent className="p-0">
            <div className="h-[600px] relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
              <VerticalMarquee 
                speed={50} 
                className="h-full" 
                activeIndex={activeStepIndex}
              >
                {workflowSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-6 rounded-lg border ${
                      index > activeStepIndex 
                        ? 'border-gray-100/20 bg-gray-50/50' 
                        : 'border-gray-200/20 bg-card'
                    } text-card-foreground shadow-sm mb-8`}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          index < activeStepIndex 
                            ? 'bg-green-100' 
                            : index === activeStepIndex 
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                        }`}>
                          {index < activeStepIndex ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className={`w-2 h-2 rounded-full ${
                              index === activeStepIndex 
                                ? 'bg-blue-500' 
                                : 'bg-gray-400'
                            }`} />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className={`text-lg ${
                          index === activeStepIndex 
                            ? 'font-semibold text-primary' 
                            : index > activeStepIndex
                              ? 'font-medium text-gray-500'
                              : 'font-medium'
                        }`}>
                          {step}
                          {index === activeStepIndex && (
                            <span className="ml-2 text-sm text-muted-foreground">(In Progress)</span>
                          )}
                        </h3>
                      </div>
                      {index < activeStepIndex ? (
                        <div className="flex-shrink-0">
                          <span className="text-sm text-green-500 font-medium">Completed</span>
                        </div>
                      ) : index > activeStepIndex && (
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-400 font-medium">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </VerticalMarquee>
            </div>
          </CardContent>
        </Card>
      </section>

      <style>{`
        @keyframes sequential-reveal {
          0% {
            transform: translate(-50%, 30px) scale(0.95);
            opacity: 0;
            filter: blur(4px);
          }
          50% {
            opacity: 0.5;
            filter: blur(2px);
          }
          100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
            filter: brightness(1) blur(0px);
          }
          50% {
            opacity: 0.8;
            filter: brightness(1.2) blur(1px);
          }
        }

        @keyframes processing-dots {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-sequential-reveal {
          animation: sequential-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .text-glow {
          text-shadow: 0 0 10px rgba(255,255,255,0.7),
                     0 0 20px rgba(255,255,255,0.5),
                     0 0 30px rgba(255,255,255,0.3);
        }

        .processing-step {
          position: relative;
          overflow: hidden;
        }

        .processing-step::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: translateX(-100%);
          animation: shimmer 1.5s infinite;
        }

        .processing-dot {
          animation: processing-dots 1s infinite;
        }

        .processing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .processing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 backdrop-blur-md rounded-full p-1.5 px-4 flex items-center gap-2 shadow-xl border border-orange-300/30">
          <div className="relative group">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full w-10 h-10"
              onClick={() => navigate('/agents/blog-content-strategizer/settings')}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Configure</span>
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Configure
            </div>
          </div>
          
          <div className="relative group">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full w-10 h-10">
              <Pause className="h-5 w-5" />
              <span className="sr-only">Pause</span>
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Pause
            </div>
          </div>
          
          <div className="relative group">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full w-10 h-10">
              <BarChart3 className="h-5 w-5" />
              <span className="sr-only">Default Metrics</span>
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Default Metrics
            </div>
          </div>
          
          <div className="relative group">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full w-10 h-10">
              <LayoutDashboard className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Dashboard
            </div>
          </div>
          
          <div className="relative group">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full w-10 h-10">
              <FileSearch className="h-5 w-5" />
              <span className="sr-only">Audit Trail</span>
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Audit Trail
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContentStrategizer;