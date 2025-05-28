import React, { useState } from 'react';
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
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Settings,
    Play,
    BarChart3,
    LayoutDashboard,
    FileSearch,
    ArrowRight,
    Pause,
    TrendingDown,
    AlertTriangle
} from "lucide-react";
import ReactFlow, {
    Background,
    Controls,
    Handle,
    Node,
    Edge,
    Position,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

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

// Update trend data to match the 8-week average of 4 leads
const trendData = [
    { week: 'Week 1', leads: 5 },
    { week: 'Week 2', leads: 4 },
    { week: 'Week 3', leads: 6 },
    { week: 'Week 4', leads: 4 },
    { week: 'Week 5', leads: 3 },
    { week: 'Week 6', leads: 4 },
    { week: 'Week 7', leads: 4 },
    { week: 'Week 8', leads: 2 },  // Current week showing 50% decline
];

const ConversionFunnelOptimizer = () => {
    const navigate = useNavigate();
    const [accordionOpen, setAccordionOpen] = useState(false);

    // Define workflow nodes
    const initialNodesData: Node[] = [
        {
            id: '1',
            type: 'custom',
            data: { label: 'Define Target Conversion Goal', isActive: false, completed: true },
            position: { x: 50, y: 50 },
        },
        {
            id: '2',
            type: 'custom',
            data: { label: 'Collect User Journey Data (Analytics, Heatmaps, Surveys)', isActive: false, completed: true },
            position: { x: 350, y: 50 },
        },
        {
            id: '3',
            type: 'custom',
            data: { label: 'Identify Conversion Drop-Off Points', isActive: false, completed: true },
            position: { x: 700, y: 50 },
        },
        {
            id: '4',
            type: 'custom',
            data: { label: 'Monitor Test Results & Analyze Performance', isActive: false, completed: true },
            position: { x: 1050, y: 50 },
        },
        {
            id: '5',
            type: 'custom',
            data: { label: 'Implement Winning Variations & Iterate', isActive: false, completed: true },
            position: { x: 1400, y: 50 },
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
         style: { stroke: '#22c55e' },
       },
       {
         id: 'e4-5',
         source: '4',
         target: '5',
         type: 'smoothstep',
         animated: true,
         style: { stroke: '#22c55e' },
       },
       {
         id: 'e5-6',
         source: '5',
         target: '6',
         type: 'smoothstep',
         animated: true,
         style: { stroke: '#64748b' },
       },
     ];

    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesData);

    return (
        <div className="space-y-8 my-6 relative">
            {/* Headline Section */}
            <section className="px-4">
                <div className="mb-4">
                    <div className="flex items-center gap-3">
                        <img src="/avatars/avatar2.png" alt="Conversion Funnel Optimizer" className="w-8 h-8 rounded-full" />
                        <h1 className="text-2xl font-semibold">Conversion Funnel Optimizer</h1>
                    </div>
                    <p className="text-gray-600 mt-2">
                        Analyzes your conversion funnel to identify drop-off points and recommends A/B tests to improve conversion rates
                    </p>
                </div>

                {/* Progress Card */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-2 mb-4">
                            <div>
                                <span className="font-medium">Analyzing Google Competitors Funnel</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Conversion Goal: Lead Generation</span>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>15%</span>
                            </div>
                            <Progress value={15} className="h-2 [&>div]:bg-orange-500" />
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

            {/* Anomaly Details Section */}
            <section className="px-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Anomaly Header */}
                            <div className="flex items-center gap-4">
                                <AlertTriangle className="w-8 h-8 text-amber-500" />
                                <div>
                                    <h3 className="text-lg font-semibold">Conversion Anomaly Detected</h3>
                                    <p className="text-gray-600">Google Competitors Lead Generation</p>
                                </div>
                            </div>

                            {/* Updated Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="p-4 border-red-100">
                                    <h4 className="text-sm text-gray-600">Current Leads</h4>
                                    <div className="text-2xl font-bold mt-1">2</div>
                                    <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                                        <TrendingDown className="w-4 h-4" />
                                        <span>-50% vs 8-wk avg -75% WoW</span>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <h4 className="text-sm text-gray-600">8-Week Average</h4>
                                    <div className="text-2xl font-bold mt-1">4 leads</div>
                                    <div className="text-sm text-gray-500 mt-2">14th percentile</div>
                                </Card>

                                <Card className="p-4">
                                    <h4 className="text-sm text-gray-600">Trend Analysis</h4>
                                    <div className="text-amber-500 font-medium mt-1">Moderate Decline</div>
                                    <div className="text-sm text-gray-500 mt-2">2nd consecutive week decrease</div>
                                </Card>
                            </div>

                            {/* Trend Chart */}
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="week" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="leads"
                                            stroke="#f97316"
                                            strokeWidth={2}
                                            dot={{ fill: '#f97316', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Floating Dock Navigation */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 backdrop-blur-md rounded-full p-1.5 px-4 flex items-center gap-2 shadow-xl border border-orange-300/30">
                    <div className="relative group">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                            onClick={() => navigate('/agents/conversion-funnel-optimizer/settings')}
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

            {/* ...same styles as BlogContentStrategizer... */}
        </div>
    );
};

export default ConversionFunnelOptimizer;
