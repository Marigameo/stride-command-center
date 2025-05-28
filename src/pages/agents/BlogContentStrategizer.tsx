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
  Pause,
  CheckCircle,
  Clock,
  FileText,
  ListChecks,
  Loader2,
  XCircle
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

// AI Agent Loader Animation
const AgentLoader = () => (
  <div className="relative w-12 h-12 flex items-center justify-center"> {/* Increased size from 8 to 12 */}
    <img 
      src="/agentic.gif" 
      alt="AI Processing"
      className="w-full h-full object-contain"
      style={{ 
        filter: 'hue-rotate(200deg) brightness(1.2)',  // Makes the gif more bluish to match the theme
        mixBlendMode: 'screen' 
      }}
    />
  </div>
);

// Timeline Step Card
const TimelineCard = ({ title, time, details, status }: {
  title: string;
  time: string;
  details: string[];
  status: 'completed' | 'current' | 'pending' | 'failed'; // Added 'failed' status
}) => {
  // Function to determine the icon based on the detail content
  const getIcon = (detail: string) => {
    if (detail.toLowerCase().includes('analyzed') || detail.toLowerCase().includes('extracted')) {
      return <FileText className="w-4 h-4 mr-2 text-gray-500" />;
    } else if (detail.toLowerCase().includes('identified') || detail.toLowerCase().includes('generated')) {
      return <ListChecks className="w-4 h-4 mr-2 text-gray-500" />;
    } else if (detail.toLowerCase().includes('analyzing') || detail.toLowerCase().includes('generating') || detail.toLowerCase().includes('evaluating')) {
      return <Loader2 className="w-4 h-4 mr-2 text-gray-500 animate-spin" />;
    } else {
      return <Clock className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };

  // Function to determine the status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</div>;
      case 'current':
        return <div className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">In Progress</div>;
      case 'pending':
        return <div className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">Queued</div>;
      case 'failed':
        return <div className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Failed</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`flex gap-6 transition-all duration-500 ${
      status === 'pending' ? 'opacity-50 blur-[1px]' : 'opacity-100'
    }`}>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 flex items-center justify-center">
          {status === 'current' ? (
            <AgentLoader />
          ) : (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {status === 'completed' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          )}
        </div>
        <div className="w-0.5 h-full bg-gray-200" />
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <h3 className={`font-medium ${status === 'current' ? 'text-blue-600' : ''}`}>{title}</h3>
          <span className="text-sm text-gray-500">{time}</span>
          {getStatusBadge(status)} {/* Render status badge */}
        </div>
        <div className="space-y-3">
          {details.map((detail, idx) => (
            <Card key={idx} className={`p-3 border flex items-center ${
              status === 'current' ? 'border-blue-100 shadow-blue-100/50' : ''
            }`}>
              {getIcon(detail)} {/* Render icon based on detail */}
              <p className="text-sm text-gray-600">{detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
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

  // Timeline data
  const timelineSteps = [
    {
      title: 'Parse Competitor Blog Posts',
      time: '12 mins ago',
      details: ['Analyzed 5 competitor articles', 'Extracted 1,200 words of relevant content'],
      status: 'completed' as const
    },
    {
      title: 'Extract Properties & Keywords',
      time: '8 mins ago',
      details: ['Identified 24 key topics', 'Generated keyword clusters with 85% relevance'],
      status: 'completed' as const
    },
    {
      title: 'Synthesize across Competing Posts',
      time: '3 mins ago',
      details: ['Created content overlap matrix', 'Identified 6 unique angles'],
      status: 'completed' as const
    },
    {
      title: 'Recommend Blog Outline',
      time: 'In progress',
      details: [
        'Analyzing content gaps in competitor articles...',
        'Generating optimal section structure...',
        'Evaluating keyword placement strategies...'
      ],
      status: 'current' as const
    },
    {
      title: 'Tune Sections to Brand Guidelines',
      time: 'Pending',
      details: ['Waiting to start'],
      status: 'pending' as const
    },
    {
      title: 'Publish as Content Strategy',
      time: 'Pending',
      details: ['Waiting to start'],
      status: 'pending' as const
    },
  ];

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

      {/* Center Stage - Timeline View */}
      <section className="px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="max-h-[600px] overflow-y-auto timeline-container">
              {timelineSteps.map((step, index) => (
                <div
                  key={index}
                  className="animate-timeline-entry"
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  <TimelineCard {...step} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes agent-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }

        @keyframes agent-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }

        @keyframes timeline-entry {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-agent-pulse {
          animation: agent-pulse 1.5s ease-in-out infinite;
        }

        .animate-agent-ring {
          animation: agent-ring 1.5s ease-in-out infinite;
        }

        .animate-timeline-entry {
          animation: timeline-entry 0.5s ease-out forwards;
        }

        .timeline-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .timeline-container::-webkit-scrollbar {
          width: 6px;
        }

        .timeline-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .timeline-container::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
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