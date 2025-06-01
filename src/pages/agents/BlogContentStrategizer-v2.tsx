import React, { useState, useEffect } from 'react';
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
import { toast } from "@/components/ui/use-toast";
import { DraggableSections } from "@/components/DraggableSections";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  XCircle,
  Info,
  AlertCircle,
  ChevronRight,
  Plus,
  X
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

// Timeline Step Card
const TimelineCard = ({
  title,
  time,
  details,
  status
}: {
  title: string;
  time: string;
  details: string[];
  status: 'completed' | 'current' | 'pending' | 'failed';
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
    <div className={`flex gap-6 transition-all duration-300 ${status === 'pending' ? 'opacity-50' : 'opacity-100'
      }`}>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 flex items-center justify-center">
          {status === 'current' ? (
            <img src="/agentic.gif" alt="Agent Processing" className="w-10 h-10 object-contain" />

          ) : (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
              {status === 'completed' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          )}
        </div>
        <div className={`w-0.5 h-full ${status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
          }`} />
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <h3 className={`font-medium ${status === 'current' ? 'text-blue-600' :
              status === 'completed' ? 'text-green-600' :
                'text-gray-600'
            }`}>
            {title}
          </h3>
          {time && (
            <span className="text-sm text-gray-500">{time}</span>
          )}
          {getStatusBadge(status)}
        </div>
        <div className="space-y-2">
          {details.map((detail, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg flex items-center text-sm ${status === 'current'
                  ? 'bg-blue-50 border border-blue-100 text-blue-700'
                  : 'bg-gray-50 text-gray-600'
                }`}
            >
              {getIcon(detail)}
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tool Badge Component
const ToolBadge = ({ name, logoUrl, onRemove }: { name: string; logoUrl: string; onRemove?: () => void }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors">
    <img src={logoUrl} alt={name} className="w-5 h-5" />
    <span className="text-sm font-medium">{name}</span>
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </div>
);

// Custom node component for workflow steps
const CustomNode = ({ data }: {
  data: {
    label: string;
    isActive: boolean;
    completed?: boolean;
    isPaused?: boolean;
    description: string;
    logs: string[];
    timestamp?: string;
  }
}) => {
  return (
    <TooltipProvider>
      <div className={`w-80 px-5 py-4 shadow-md rounded-md border-2 transition-all ${
        data.isActive
          ? data.isPaused
            ? 'bg-white border-yellow-400 hover:border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
            : 'bg-white border-blue-400 hover:border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : data.completed
            ? 'bg-white border-green-300 hover:border-green-200 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
            : 'bg-white border-gray-200/50 hover:border-gray-300/50'
      }`}>
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-400"
          style={{ top: -8 }}
        />

        <div className="flex items-start gap-3">
          {/* Status indicator */}
          <div className="mt-1">
            {data.isActive ? (
              data.isPaused ? (
                <Pause className="w-5 h-5 text-yellow-500" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              )
            ) : data.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {/* Title and badge */}
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm font-medium truncate max-w-[150px] ${
                data.isActive
                  ? data.isPaused
                    ? 'text-yellow-500 font-semibold'
                    : 'text-blue-500 font-semibold'
                  : data.completed
                    ? 'text-green-500'
                    : 'text-gray-500'
              }`}>
                {data.label}
              </div>

              <div className="flex items-center gap-2">
                {/* Status badge */}
                {data.isActive ? (
                  data.isPaused ? (
                    <div className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap">Paused</div>
                  ) : (
                    <div className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">Processing</div>
                  )
                ) : data.completed ? (
                  <div className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 whitespace-nowrap">Completed</div>
                ) : (
                  <div className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500 whitespace-nowrap">Queued</div>
                )}

                {/* Settings icon */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Configure step</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{data.description}</p>

            {/* Logs with tooltip */}
            {data.logs.length > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <div className="flex-1 truncate max-w-[180px]">
                  {data.logs[0]}
                </div>
                {data.timestamp && (
                  <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 whitespace-nowrap">{data.timestamp}</span>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-md p-0">
                    <Card>
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium">Logs:</h4>
                          {data.logs.map((log, idx) => (
                            <div key={idx} className="text-xs">
                              {log}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-400"
          style={{ bottom: -8 }}
        />
      </div>
    </TooltipProvider>
  );
};

// Node types definition
const nodeTypes = {
  custom: CustomNode,
};

type Section = {
  id: string;
  title: string;
  subsections: string[];
};

const BlogContentStrategizerV2 = () => {
  const navigate = useNavigate();
  // Set accordion to be open by default
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOutlineApproved, setIsOutlineApproved] = useState(false);
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: '1. Introduction',
      subsections: [
        'Overview of Amazon Marketplace',
        'Current challenges for sellers',
        'Article purpose and value proposition'
      ]
    },
    {
      id: '2',
      title: '2. Amazon Marketplace Landscape',
      subsections: [
        'Market size and growth trends',
        'Key player analysis',
        'Competitive dynamics'
      ]
    },
    {
      id: '3',
      title: '3. Seller Success Strategies',
      subsections: [
        'Product listing optimization',
        'Pricing strategies',
        'Inventory management'
      ]
    },
    {
      id: '4',
      title: '4. Performance Optimization',
      subsections: [
        'SEO and visibility tactics',
        'Conversion rate optimization',
        'Customer feedback management'
      ]
    },
    {
      id: '5',
      title: '5. Future Outlook',
      subsections: [
        'Emerging trends in e-commerce',
        'Technology integration opportunities',
        'Strategic recommendations'
      ]
    }
  ]);

  const handleApproveOutline = () => {
    setIsOutlineApproved(true);

    // Show success toast
    toast({
      title: "Outline Approved",
      description: "The outline has been approved and the content is being optimized.",
      variant: "default",
    });

    // Update workflow steps to show progress
    const updatedWorkflowSteps = [...workflowSteps];
    const currentStepIndex = updatedWorkflowSteps.findIndex(step => step.status === 'current');

    if (currentStepIndex !== -1) {
      // Mark current step as completed
      updatedWorkflowSteps[currentStepIndex] = {
        ...updatedWorkflowSteps[currentStepIndex],
        status: 'completed',
        logs: ['Outline approved by user'],
        timestamp: 'Just now'
      };

      // Activate next step if exists
      if (currentStepIndex < updatedWorkflowSteps.length - 1) {
        updatedWorkflowSteps[currentStepIndex + 1] = {
          ...updatedWorkflowSteps[currentStepIndex + 1],
          status: 'current',
          logs: [
            'Tuning sections to match brand guidelines',
            'Optimizing content for SEO',
            'Generating meta descriptions'
          ]
        };
      }

      setWorkflowSteps(updatedWorkflowSteps);

      // Update nodes to reflect the new state
      const updatedNodes = nodes.map((node, index) => {
        if (index === currentStepIndex) {
          return {
            ...node,
            data: {
              ...node.data,
              isActive: false,
              completed: true,
              isPaused: false,
              logs: ['Outline approved by user'],
              timestamp: 'Just now'
            }
          };
        } else if (index === currentStepIndex + 1) {
          return {
            ...node,
            data: {
              ...node.data,
              isActive: true,
              completed: false,
              isPaused: false,
              logs: [
                'Tuning sections to match brand guidelines',
                'Optimizing content for SEO',
                'Generating meta descriptions'
              ],
              timestamp: 'Just now'
            }
          };
        }
        return node;
      });

      // Update edges to reflect the new state
      const updatedEdges = edges.map((edge, index) => {
        if (index === currentStepIndex) {
          return {
            ...edge,
            animated: false,
            style: { stroke: '#22c55e', strokeWidth: 2 }
          };
        } else if (index === currentStepIndex + 1) {
          return {
            ...edge,
            animated: true,
            style: { stroke: '#60a5fa', strokeWidth: 2 }
          };
        }
        return edge;
      });

      setNodes(updatedNodes);
      setEdges(updatedEdges);
    }
  };

  const handleModifyStructure = () => {
    if (isEditMode) {
      // Save changes when exiting edit mode
      toast({
        title: "Changes Saved",
        description: "The outline structure has been updated.",
        variant: "default",
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSectionsChange = (newSections: Section[]) => {
    setSections(newSections.map((section, index) => ({
      ...section,
      title: section.title.replace(/^\d+\.\s*/, `${index + 1}. `)
    })));
  };

  // Workflow steps data
  const [workflowSteps, setWorkflowSteps] = useState([
    {
      title: 'Parse Competitor Blog Posts',
      status: 'completed' as const,
      description: 'Analyze and extract content from competitor blog posts',
      logs: ['Analyzed 5 competitor articles', 'Extracted 1,200 words of relevant content'],
      timestamp: '12m'
    },
    {
      title: 'Extract Properties & Keywords',
      status: 'completed' as const,
      description: 'Identify key topics and generate keyword clusters',
      logs: ['Identified 24 key topics', 'Generated keyword clusters with 85% relevance'],
      timestamp: '8m'
    },
    {
      title: 'Synthesize across Competing Posts',
      status: 'completed' as const,
      description: 'Create content overlap matrix and identify unique angles',
      logs: ['Created content overlap matrix', 'Identified 6 unique angles'],
      timestamp: '3m'
    },
    {
      title: 'Recommend Blog Outline',
      status: 'current' as const,
      description: 'Generate optimal section structure and keyword placement',
      logs: [
        'Analyzing content gaps in competitor articles...',
        'Generating optimal section structure...',
        'Evaluating keyword placement strategies...'
      ],
      timestamp: '32s'
    },
    {
      title: 'Tune Sections to Brand Guidelines',
      status: 'pending' as const,
      description: 'Adjust content to match brand voice and style',
      logs: ['Waiting to start'],
      timestamp: '-'
    },
    {
      title: 'Publish as Content Strategy',
      status: 'pending' as const,
      description: 'Finalize and publish the content strategy',
      logs: ['Waiting to start'],
      timestamp: '-'
    },
  ]);

  // Define workflow nodes with vertical layout and increased spacing
  const initialNodesData: Node[] = [
    {
      id: '1',
      type: 'custom',
      data: {
        label: 'Parse Competitor Blog Posts',
        isActive: false,
        completed: true,
        isPaused: false,
        description: 'Analyze and extract content from competitor blog posts',
        logs: ['Analyzed 5 competitor articles', 'Extracted 1,200 words of relevant content'],
        timestamp: '12m'
      },
      position: { x: 250, y: 50 },
    },
    {
      id: '2',
      type: 'custom',
      data: {
        label: 'Extract Properties & Keywords',
        isActive: false,
        completed: true,
        isPaused: false,
        description: 'Identify key topics and generate keyword clusters',
        logs: ['Identified 24 key topics', 'Generated keyword clusters with 85% relevance'],
        timestamp: '8m'
      },
      position: { x: 250, y: 250 },
    },
    {
      id: '3',
      type: 'custom',
      data: {
        label: 'Synthesize across Competing Posts',
        isActive: false,
        completed: true,
        isPaused: false,
        description: 'Create content overlap matrix and identify unique angles',
        logs: ['Created content overlap matrix', 'Identified 6 unique angles'],
        timestamp: '3m'
      },
      position: { x: 250, y: 450 },
    },
    {
      id: '4',
      type: 'custom',
      data: {
        label: 'Recommend Blog Outline',
        isActive: true,
        completed: false,
        isPaused: false,
        description: 'Generate optimal section structure and keyword placement',
        logs: [
          'Analyzing content gaps in competitor articles...',
          'Generating optimal section structure...',
          'Evaluating keyword placement strategies...'
        ],
        timestamp: '32s'
      },
      position: { x: 250, y: 650 },
    },
    {
      id: '5',
      type: 'custom',
      data: {
        label: 'Tune Sections to Brand Guidelines',
        isActive: false,
        completed: false,
        isPaused: false,
        description: 'Adjust content to match brand voice and style',
        logs: ['Waiting to start'],
        timestamp: '-'
      },
      position: { x: 250, y: 850 },
    },
    {
      id: '6',
      type: 'custom',
      data: {
        label: 'Publish as Content Strategy',
        isActive: false,
        completed: false,
        isPaused: false,
        description: 'Finalize and publish the content strategy',
        logs: ['Waiting to start'],
        timestamp: '-'
      },
      position: { x: 250, y: 1050 },
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesData);

  // Define edges between nodes (vertical connections) with improved styling and arrow markers
  const initialEdgesData: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#22c55e', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#22c55e',
      },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#22c55e', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#22c55e',
      },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#60a5fa', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#60a5fa',
      },
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#64748b', strokeWidth: 1.5, strokeDasharray: '4,4' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: '#64748b',
      },
    },
    {
      id: 'e5-6',
      source: '5',
      target: '6',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#64748b', strokeWidth: 1.5, strokeDasharray: '4,4' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: '#64748b',
      },
    },
  ];

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesData);

  // Available connections from AccountSettings with connected status
  const [connections, setConnections] = useState([
    { id: "research", name: "Research", logo: "/tool-logos/globe.svg", connected: true },
    { id: "grammarly", name: "Grammarly", logo: "/tool-logos/grammarly.svg", connected: true },
    { id: "images", name: "Images", logo: "/tool-logos/database-zap.svg", connected: true },
    { id: "surfer", name: "Surfer", logo: "/tool-logos/surfer.png", connected: true },
    { id: "googleAds", name: "Google Ads", logo: "https://www.gstatic.com/images/branding/product/2x/ads_48dp.png", connected: false },
    { id: "googleDrive", name: "Google Drive", logo: "https://ssl.gstatic.com/images/branding/product/2x/drive_48dp.png", connected: false },
    { id: "zohoBooks", name: "Zoho Books", logo: "https://zoho.codafish.net/wp-content/uploads/2022/08/books-512-1.png", connected: false },
    { id: "hubspot", name: "Hubspot", logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png", connected: false },
    { id: "slack", name: "Slack", logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png", connected: false },
  ]);

  const handleRemoveTool = (toolId: string) => {
    setConnections(connections.map(conn => 
      conn.id === toolId ? { ...conn, connected: false } : conn
    ));
    setSelectedTool("");
  };

  const handleAddTool = () => {
    if (selectedTool) {
      setConnections(connections.map(conn => 
        conn.id === selectedTool ? { ...conn, connected: true } : conn
      ));
      setSelectedTool("");
    }
  };

  // Get connected tools for display
  const connectedTools = connections.filter(conn => conn.connected);

  // Get available tools for dropdown
  const availableTools = connections.filter(conn => !conn.connected);

  const [isToolSettingsOpen, setIsToolSettingsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>("");

  const [isPaused, setIsPaused] = useState(false);

  // Handle pause/resume
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    
    // Update workflow steps
    const updatedWorkflowSteps = workflowSteps.map(step => {
      if (step.status === 'current') {
        return {
          ...step,
          logs: isPaused 
            ? [
                'Analyzing content gaps in competitor articles...',
                'Generating optimal section structure...',
                'Evaluating keyword placement strategies...'
              ]
            : ['Execution paused', 'Click resume to continue processing...'],
          timestamp: isPaused ? '32s' : 'Paused'
        };
      }
      return step;
    });
    
    setWorkflowSteps(updatedWorkflowSteps);

    // Update nodes to reflect paused state
    const updatedNodes = nodes.map(node => {
      if (node.data.isActive) {
        return {
          ...node,
          data: {
            ...node.data,
            isPaused: !isPaused,
            logs: isPaused 
              ? [
                  'Analyzing content gaps in competitor articles...',
                  'Generating optimal section structure...',
                  'Evaluating keyword placement strategies...'
                ]
              : ['Execution paused', 'Click resume to continue processing...'],
            timestamp: isPaused ? '32s' : 'Paused'
          }
        };
      }
      return node;
    });
    
    // Update edges to reflect paused state
    const updatedEdges = edges.map(edge => {
      if (edge.animated) {
        return {
          ...edge,
          animated: isPaused ? false : true,
          style: {
            ...edge.style,
            stroke: isPaused ? '#64748b' : '#60a5fa',
            strokeWidth: isPaused ? 1.5 : 2,
            strokeDasharray: isPaused ? '4,4' : undefined
          }
        };
      }
      return edge;
    });
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  return (
    <div className="space-y-6 my-6 relative">
      {/* Header Section */}
      <section className="px-4 space-y-6">
        {/* 1. Agent Outline - Not in a card */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <img src="/avatars/avatar4.png" alt="Blog Content Strategizer" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl font-semibold">Blog Content Strategizer</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Researches your competitors' blog posts for a set of keywords to recommend a post outline and strategy to outrank their articles
          </p>
        </div>

        {/* Combined card for task details, tools, and status */}
        <Card className="border-orange-100">
          <CardContent className="pt-6 space-y-6">
            {/* 2. Current Task */}
            <div>
              <h2 className="text-lg font-medium mb-3">Current Task</h2>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-medium">Creating outline for Amazon Marketplace</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">5 blog posts to be picked</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              {/* 3. Connected Tools */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium">Connected Tools</h2>
                <Dialog open={isToolSettingsOpen} onOpenChange={setIsToolSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configure Tools</DialogTitle>
                      <DialogDescription>
                        Add or remove tools for this workflow
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Current Tools */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Current Tools</h3>
                        <div className="flex flex-wrap gap-2">
                          {connectedTools.map((tool) => (
                            <ToolBadge
                              key={tool.id}
                              name={tool.name}
                              logoUrl={tool.logo}
                              onRemove={() => handleRemoveTool(tool.id)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Add New Tool */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Add New Tool</h3>
                        <div className="flex gap-2">
                          <Select value={selectedTool} onValueChange={setSelectedTool}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select a tool" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTools.map((connection) => (
                                <SelectItem key={connection.id} value={connection.id}>
                                  <div className="flex items-center gap-2">
                                    <img src={connection.logo} alt={connection.name} className="w-4 h-4" />
                                    <span>{connection.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleAddTool}
                            disabled={!selectedTool}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2">
                {connectedTools.map((tool, index) => (
                  <ToolBadge key={index} name={tool.name} logoUrl={tool.logo} />
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              {/* 4. Agent Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/agentic.gif" alt="Agent Processing" className="w-10 h-10 object-contain" />
                  <div>
                    <h2 className="text-lg font-medium">
                      {isOutlineApproved 
                        ? 'Tuning Sections to Brand Guidelines' 
                        : isPaused 
                          ? 'Execution Paused'
                          : 'Recommending Blog Outline'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {isOutlineApproved 
                        ? 'Optimizing content structure and enhancing SEO elements...'
                        : isPaused
                          ? 'Click resume to continue processing...'
                          : 'Analyzing content gaps in competitor articles...'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Started</div>
                  <div className="text-sm text-gray-600">2 hours ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Workflow Execution Section - Expanded by default */}
      <section className="px-4">
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
                  <span className="ml-4 text-base font-medium">Workflow Execution</span>
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
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2 [&>div]:bg-orange-500" />
                  </div>

                  {/* Controls */}
                  <div className="flex justify-between mb-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`flex items-center gap-2 ${
                        isPaused 
                          ? 'text-green-600 border-green-200 hover:bg-green-50' 
                          : 'text-orange-600 border-orange-200 hover:bg-orange-50'
                      }`}
                      onClick={handlePauseResume}
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4" />
                          <span>Pause</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate('/agents/blog-content-strategizer/settings')}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Vertical ReactFlow Workflow Diagram */}
                  <div style={{ height: 1200 }} className="workflow-container">
                    <div className="relative w-full h-full pointer-events-none">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        fitView
                        minZoom={1}
                        maxZoom={1}
                        zoomOnScroll={false}
                        panOnScroll={false}
                        panOnDrag={false}
                        zoomOnDoubleClick={false}
                        zoomOnPinch={false}
                        attributionPosition="bottom-left"
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={false}
                        defaultEdgeOptions={{
                          type: 'smoothstep',
                          animated: true,
                          style: { strokeWidth: 2 }
                        }}
                      >
                        <Background />
                        <Controls showInteractive={false} />
                      </ReactFlow>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </section>

      {/* Main Stage - Content Outline */}
      <section className="px-4 py-8" id="main-stage">
        <Card>
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {isOutlineApproved ? 'Tuning Content to Brand Guidelines' : 'Content Outline Generated'}
              </h2>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-orange-800 mb-2">Overview</h3>
                <p className="text-gray-700">
                  {isOutlineApproved 
                    ? 'The AI is now optimizing the content structure to match brand guidelines, enhancing SEO elements, and generating meta descriptions. This step ensures the content aligns with your brand voice while maximizing search engine visibility.'
                    : 'This outline is designed to outrank competing articles on "Amazon Marketplace" by providing more comprehensive coverage, addressing key gaps in competitor content, and incorporating high-value keywords. The structure balances technical depth with accessibility and includes unique angles missing from competitor posts.'}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  {isOutlineApproved ? 'Content Outline' : 'Proposed Article Structure'}
                </h3>

                {isOutlineApproved ? (
                  <div className="space-y-8">
                    <div className="p-6 bg-green-50 border border-green-100 rounded-xl">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-green-800">
                            Outline Approved
                          </h3>
                          <div className="mt-1 text-sm text-green-700">
                            <p>Your outline has been approved. The AI is now optimizing the content for SEO.</p>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center text-sm text-green-600">
                              <Clock className="h-4 w-4 mr-1.5" />
                              <span>Estimated completion: 5 minutes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline with Agent Animation */}
                    <div className="space-y-0">
                      {workflowSteps.map((step, index) => (
                        <TimelineCard
                          key={step.title}
                          title={step.title}
                          time={step.timestamp}
                          details={step.logs}
                          status={step.status}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`space-y-4 ${isEditMode ? 'bg-gray-50 p-4 rounded-lg' : ''}`}>
                    {isEditMode ? (
                      <DraggableSections
                        sections={sections}
                        onSectionsChange={handleSectionsChange}
                      />
                    ) : (
                      sections.map((section) => (
                        <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{section.title}</h4>
                              <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {section.subsections.length} {section.subsections.length === 1 ? 'subsection' : 'subsections'}
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                              {section.subsections.map((subsection, idx) => (
                                <li key={idx}>{subsection}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* CTAs */}
              {!isOutlineApproved && (
                <div className="flex gap-4 justify-center">
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleApproveOutline}
                    disabled={isEditMode}
                  >
                    Approve Outline
                  </Button>
                  <Button
                    variant={isEditMode ? "default" : "outline"}
                    className={isEditMode ? "bg-green-600 hover:bg-green-700 text-white" : "border-orange-200 text-orange-600 hover:bg-orange-50"}
                    onClick={handleModifyStructure}
                  >
                    {isEditMode ? 'Apply Changes' : 'Modify Structure'}
                  </Button>
                </div>
              )}
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

export default BlogContentStrategizerV2;