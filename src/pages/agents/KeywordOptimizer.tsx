import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table";
import {
    Settings,
    Play,
    BarChart3,
    LayoutDashboard,
    FileSearch,
    ArrowRight,
    Pause,
    CheckCircle,
    XCircle,
    Upload,
    Filter,
    DollarSign,
    Search,
    Tag,
    Info
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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

// Define keyword data for each category
type KeywordItem = {
    id: string;
    searchTerm: string;
    matchedKeyword: string;
    matchType: 'Broad' | 'Phrase' | 'Exact';
    justification: string;
    cost: number;
    selected?: boolean;
    status?: 'approved' | 'rejected';
};

const keywordCategories = {
    'Budget Drainers': [
        { id: 'bd1', searchTerm: 'kids furniture free shipping', matchedKeyword: 'kids furniture', matchType: 'Broad', justification: 'Looking for free shipping, not product quality', cost: 156.78 },
        { id: 'bd2', searchTerm: 'how to build kids furniture', matchedKeyword: 'kids furniture', matchType: 'Broad', justification: 'DIY intent, not purchase intent', cost: 89.45 },
        { id: 'bd3', searchTerm: 'kids furniture dimensions', matchedKeyword: 'kids furniture', matchType: 'Phrase', justification: 'Research phase, not ready to buy', cost: 124.32 },
        { id: 'bd4', searchTerm: 'kids furniture repair', matchedKeyword: 'kids furniture', matchType: 'Phrase', justification: 'Service query, not new purchase', cost: 78.91 },
    ],
    'Low Intent': [
        { id: 'li1', searchTerm: 'what is the best wireless headphone', matchedKeyword: 'wireless headphones', matchType: 'Broad', justification: 'Informational query, early research phase', cost: 45.67 },
        { id: 'li2', searchTerm: 'wireless headphones vs wired', matchedKeyword: 'wireless headphones', matchType: 'Phrase', justification: 'Comparison query, not ready to purchase', cost: 67.89 },
        { id: 'li3', searchTerm: 'top 10 wireless headphones 2023', matchedKeyword: 'wireless headphones', matchType: 'Exact', justification: 'Research phase, looking for options', cost: 34.56 },
        { id: 'li4', searchTerm: 'wireless headphones battery life', matchedKeyword: 'wireless headphones', matchType: 'Broad', justification: 'Feature research, not purchase intent', cost: 56.78 },
        { id: 'li5', searchTerm: 'wireless headphones reviews reddit', matchedKeyword: 'wireless headphones', matchType: 'Broad', justification: 'Seeking opinions, not ready to buy', cost: 43.21 },
    ],
    'Window Shoppers': [
        { id: 'ws1', searchTerm: 'gaming chair price comparison', matchedKeyword: 'gaming chair', matchType: 'Broad', justification: 'Price comparison, not committed', cost: 87.65 },
        { id: 'ws2', searchTerm: 'gaming chair alternatives', matchedKeyword: 'gaming chair', matchType: 'Phrase', justification: 'Looking for other options', cost: 65.43 },
        { id: 'ws3', searchTerm: 'gaming chair discount code', matchedKeyword: 'gaming chair', matchType: 'Phrase', justification: 'Seeking discounts, price sensitive', cost: 54.32 },
        { id: 'ws4', searchTerm: 'cheap gaming chair', matchedKeyword: 'gaming chair', matchType: 'Exact', justification: 'Budget focused, may not convert', cost: 43.21 },
    ],
    'Job Seekers': [
        { id: 'js1', searchTerm: 'e-commerce jobs near me', matchedKeyword: 'e-commerce', matchType: 'Broad', justification: 'Employment intent, not customer', cost: 76.54 },
        { id: 'js2', searchTerm: 'marketing jobs remote', matchedKeyword: 'marketing', matchType: 'Broad', justification: 'Career development, not purchase', cost: 98.76 },
        { id: 'js3', searchTerm: 'digital marketing specialist salary', matchedKeyword: 'digital marketing', matchType: 'Phrase', justification: 'Career research, not customer', cost: 45.67 },
        { id: 'js4', searchTerm: 'e-commerce manager position', matchedKeyword: 'e-commerce', matchType: 'Phrase', justification: 'Job hunting, not customer', cost: 67.89 },
    ]
};

const KeywordOptimizer = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('Budget Drainers');
    const [keywords, setKeywords] = useState<Record<string, KeywordItem[]>>(() => {
        return Object.fromEntries(
            Object.entries(keywordCategories).map(([category, items]) => [
                category,
                items.map(item => ({ ...item, selected: false }))
            ])
        ) as Record<string, KeywordItem[]>;
    });
    
    const [originalKeywords, setOriginalKeywords] = useState<Record<string, KeywordItem[]>>(() => {
        return Object.fromEntries(
            Object.entries(keywordCategories).map(([category, items]) => [
                category,
                items.map(item => ({ ...item, selected: false }))
            ])
        ) as Record<string, KeywordItem[]>;
    });
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [hasSelectedKeywords, setHasSelectedKeywords] = useState(false);

    // Define workflow nodes
    const initialNodesData: Node[] = [
        {
            id: '1',
            type: 'custom',
            data: { label: 'Analyze Google Ads Account', isActive: false, completed: true },
            position: { x: 50, y: 50 },
        },
        {
            id: '2',
            type: 'custom',
            data: { label: 'Identify Negative Keywords', isActive: false, completed: true },
            position: { x: 350, y: 50 },
        },
        {
            id: '3',
            type: 'custom',
            data: { label: 'Categorize by Intent', isActive: false, completed: true },
            position: { x: 700, y: 50 },
        },
        {
            id: '4',
            type: 'custom',
            data: { label: 'Calculate Potential Savings', isActive: false, completed: true },
            position: { x: 1050, y: 50 },
        },
        {
            id: '5',
            type: 'custom',
            data: { label: 'Review & Approve Keywords', isActive: true, completed: false },
            position: { x: 1400, y: 50 },
        },
        {
            id: '6',
            type: 'custom',
            data: { label: 'Upload to Google Ads', isActive: false, completed: false },
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
            style: { stroke: '#22c55e' },
        },
        {
            id: 'e4-5',
            source: '4',
            target: '5',
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#60a5fa' },
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

    // Check if any keywords are selected
    React.useEffect(() => {
        const anySelected = Object.values(keywords).some(categoryKeywords => 
            categoryKeywords.some(keyword => keyword.selected)
        );
        setHasSelectedKeywords(anySelected);
    }, [keywords]);

    // Handle checkbox selection
    const handleSelectKeyword = (id: string) => {
        setKeywords(prev => {
            const newKeywords = { ...prev };
            newKeywords[selectedCategory] = newKeywords[selectedCategory].map(keyword => 
                keyword.id === id ? { ...keyword, selected: !keyword.selected } : keyword
            );
            return newKeywords;
        });
    };

    // Handle approve action
    const handleApprove = () => {
        const selectedKeywords = keywords[selectedCategory].filter(k => k.selected);
        if (selectedKeywords.length === 0) return;

        setKeywords(prev => {
            const newKeywords = { ...prev };
            // Remove approved keywords from the list
            newKeywords[selectedCategory] = newKeywords[selectedCategory]
                .filter(keyword => !keyword.selected);
            return newKeywords;
        });
        
        setApprovedCount(prev => prev + selectedKeywords.length);
        
        toast({
            title: "Keywords Approved",
            description: `${selectedKeywords.length} keywords have been approved as negative keywords.`,
        });
    };

    // Handle reject action
    const handleReject = () => {
        const selectedKeywords = keywords[selectedCategory].filter(k => k.selected);
        if (selectedKeywords.length === 0) return;

        setKeywords(prev => {
            const newKeywords = { ...prev };
            // Remove rejected keywords from the list
            newKeywords[selectedCategory] = newKeywords[selectedCategory]
                .filter(keyword => !keyword.selected);
            return newKeywords;
        });
        
        setRejectedCount(prev => prev + selectedKeywords.length);
        
        toast({
            title: "Keywords Rejected",
            description: `${selectedKeywords.length} keywords have been rejected.`,
        });
    };

    // Handle discard changes
    const handleDiscard = () => {
        setKeywords(JSON.parse(JSON.stringify(originalKeywords)));
        setApprovedCount(0);
        setRejectedCount(0);
        
        toast({
            title: "Changes Discarded",
            description: "All changes have been discarded.",
        });
    };

    // Handle upload to Google Ads
    const handleUpload = () => {
        if (approvedCount + rejectedCount === 0) return;
        
        // Reset the state
        setShowEmptyState(true);
        setApprovedCount(0);
        setRejectedCount(0);
        
        toast({
            title: "Upload Successful",
            description: "Negative keywords have been uploaded to Google Ads.",
            variant: "default",
        });
    };

    // Get match type badge variant
    const getMatchTypeBadge = (matchType: string) => {
        switch (matchType) {
            case 'Broad':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Broad</Badge>;
            case 'Phrase':
                return <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">Phrase</Badge>;
            case 'Exact':
                return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Exact</Badge>;
            default:
                return <Badge variant="secondary">{matchType}</Badge>;
        }
    };

    // Get status badge
    const getStatusBadge = (status?: string) => {
        if (!status) return null;
        
        switch (status) {
            case 'approved':
                return <Badge variant="outlineGreen" className="ml-2">Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive" className="ml-2">Rejected</Badge>;
            default:
                return null;
        }
    };

    // Tooltip content for categories
    const categoryTooltips = {
        'Budget Drainers': 'Keywords with high cost and low ROI',
        'Low Intent': 'Keywords with low purchase intent',
        'Window Shoppers': 'Research queries with low conversion',
        'Job Seekers': 'Employment related search terms'
    };

    return (
        <div className="space-y-8 my-6 relative">
            {/* Headline Section */}
            <section className="px-4">
                <div className="mb-4">
                    <div className="flex items-center gap-3">
                        <img src="/avatars/avatar1.png" alt="Keyword Optimizer" className="w-8 h-8 rounded-full" />
                        <h1 className="text-2xl font-semibold">Keyword Optimizer</h1>
                    </div>
                    <p className="text-gray-600 mt-2">
                        Analyzes your Google Ads account to identify negative keywords that are draining your budget without converting
                    </p>
                </div>

                {/* Progress Card */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-2 mb-4">
                            <div>
                                <span className="font-medium">Optimizing Holiday Campaign</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Potential Savings: $524</span>
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

            {/* Keyword Review Section */}
            <section className="px-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Review Header */}
                            <div className="flex items-center gap-4">
                                <Tag className="w-8 h-8 text-orange-500" />
                                <div>
                                    <h3 className="text-lg font-semibold">Negative Keyword Review</h3>
                                    <p className="text-gray-600">Review and approve negative keywords to optimize your campaign</p>
                                </div>
                            </div>

                            {!showEmptyState && (
                                <>
                                    {/* Category Tabs */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {Object.keys(keywords).map((category) => (
                                            <TooltipProvider key={category}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant={selectedCategory === category ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setSelectedCategory(category)}
                                                            className={`rounded-full ${
                                                                selectedCategory === category 
                                                                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                                                                    : "text-gray-700 hover:bg-orange-50"
                                                            }`}
                                                        >
                                                            {category}
                                                            <Info className="h-4 w-4 ml-1 opacity-70" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{categoryTooltips[category as keyof typeof categoryTooltips]}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))}
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex justify-end mb-4">
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={handleReject}
                                                disabled={!hasSelectedKeywords}
                                                className="gap-1"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Reject Selected
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={handleApprove}
                                                disabled={!hasSelectedKeywords}
                                                className="gap-1"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Approve Selected
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Keywords Table */}
                            {!showEmptyState ? (
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]"></TableHead>
                                                <TableHead>Search Term</TableHead>
                                                <TableHead>Matched Keyword</TableHead>
                                                <TableHead>Match Type</TableHead>
                                                <TableHead>Justification</TableHead>
                                                <TableHead>Cost</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {keywords[selectedCategory].map((keyword) => (
                                                <TableRow 
                                                    key={keyword.id}
                                                    className={`${
                                                        keyword.status === 'approved' 
                                                            ? 'bg-green-50' 
                                                            : keyword.status === 'rejected' 
                                                                ? 'bg-red-50' 
                                                                : ''
                                                    }`}
                                                >
                                                    <TableCell>
                                                        <Checkbox 
                                                            checked={keyword.selected}
                                                            onCheckedChange={() => handleSelectKeyword(keyword.id)}
                                                            disabled={!!keyword.status}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {keyword.searchTerm}
                                                        {getStatusBadge(keyword.status)}
                                                    </TableCell>
                                                    <TableCell>{keyword.matchedKeyword}</TableCell>
                                                    <TableCell>{getMatchTypeBadge(keyword.matchType)}</TableCell>
                                                    <TableCell>{keyword.justification}</TableCell>
                                                    <TableCell className="text-right">${keyword.cost.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm">
                                                            <span className="text-green-600 font-medium">{approvedCount} approved</span>
                                                            <span className="mx-2">•</span>
                                                            <span className="text-red-600 font-medium">{rejectedCount} rejected</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={handleDiscard}
                                                                disabled={approvedCount + rejectedCount === 0}
                                                                className="gap-1"
                                                            >
                                                                Discard Changes
                                                            </Button>
                                                            <Button 
                                                                variant="default" 
                                                                size="sm"
                                                                onClick={handleUpload}
                                                                disabled={approvedCount + rejectedCount === 0}
                                                                className="gap-1 bg-orange-500 hover:bg-orange-600"
                                                            >
                                                                <Upload className="h-4 w-4" />
                                                                Upload to Google Ads
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">All Keywords Processed</h3>
                                    <p className="text-gray-600 max-w-md mb-6">
                                        Your negative keywords have been successfully uploaded to Google Ads. 
                                        Your campaign is now optimized for better performance.
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowEmptyState(false)}
                                        className="gap-2"
                                    >
                                        <Search className="h-4 w-4" />
                                        Find More Keywords
                                    </Button>
                                </div>
                            )}
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
                            onClick={() => navigate('/agents/keyword-optimizer/settings')}
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

export default KeywordOptimizer;