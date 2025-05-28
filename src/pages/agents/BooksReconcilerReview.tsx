import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Check, X, Upload, Maximize2, Minimize2, Settings, Play, BarChart3, LayoutDashboard, FileSearch, ArrowRight, Pause } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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

// Mock data for bills
const billsData = [
  {
    id: 1,
    imageUrl: "/bills/bill-1.jpg",
    amount: 398.00,
    vendor: "Gujarat Freight Tools",
    date: "2024-03-20",
    status: "pending"
  },
  {
    id: 2,
    imageUrl: "/bills/bill-2.png",
    amount: 968.00,
    vendor: "Sleek Bill - Nirmal Vijay",
    date: "2025-01-23",
    status: "pending"
  },
  {
    id: 3,
    imageUrl: "/bills/bill-3.webp",
    amount: 2563.00,
    vendor: "Hindustan Uniliver",
    date: "2023-07-15",
    status: "pending"
  }
];

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

const nodeTypes = {
    custom: CustomNode,
};

const BooksReconcilerReview = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState(billsData);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);

    // Define workflow nodes
    const initialNodesData: Node[] = [
        {
            id: '1',
            type: 'custom',
            data: { label: 'Extract Bill Data', isActive: false, completed: true },
            position: { x: 50, y: 50 },
        },
        {
            id: '2',
            type: 'custom',
            data: { label: 'Match with Transactions', isActive: false, completed: true },
            position: { x: 350, y: 50 },
        },
        {
            id: '3',
            type: 'custom',
            data: { label: 'Review & Verify', isActive: true, completed: false },
            position: { x: 650, y: 50 },
        },
        {
            id: '4',
            type: 'custom',
            data: { label: 'Upload to Zoho', isActive: false, completed: false },
            position: { x: 950, y: 50 },
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
            style: { stroke: '#60a5fa' },
        },
        {
            id: 'e3-4',
            source: '3',
            target: '4',
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#64748b' },
        }
    ];

    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesData);

    const handleApprove = (billId: number) => {
        setBills(bills.map(bill => 
          bill.id === billId ? { ...bill, status: 'approved' } : bill
        ));
    };

    const handleReject = (billId: number) => {
        setBills(bills.map(bill => 
          bill.id === billId ? { ...bill, status: 'rejected' } : bill
        ));
    };

    const handleUploadToZoho = async () => {
        setUploading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setUploading(false);
        // Here you would typically make an API call to Zoho Books
    };

    const pendingBills = bills.filter(bill => bill.status === 'pending');
    const approvedBills = bills.filter(bill => bill.status === 'approved');
    const rejectedBills = bills.filter(bill => bill.status === 'rejected');
    const progress = ((approvedBills.length + rejectedBills.length) / bills.length) * 100;

    return (
        <div className="space-y-8 my-6 relative">
            {/* Headline Section */}
            <section className="px-4">
                <div className="mb-4">
                    <div className="flex items-center gap-3">
                        <img src="/avatars/avatar2.png" alt="Books Reconciler" className="w-8 h-8 rounded-full" />
                        <h1 className="text-2xl font-semibold">Books Reconciler</h1>
                    </div>
                    <p className="text-gray-600 mt-2">
                        Automatically reconciles bills with bank transactions and prepares them for Zoho Books
                    </p>
                </div>

                {/* Progress Card */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-2 mb-4">
                            <div>
                                <span className="font-medium">March 2024 Reconciliation</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">
                                    {pendingBills.length} bills pending review
                                </span>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2 [&>div]:bg-orange-500" />
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

            {/* Main Content Section */}
            <section className="px-4">
                {pendingBills.length > 0 ? (
                    <Card className={`p-6 transition-all duration-300 ${isFullScreen ? 'fixed inset-4 z-50 bg-background' : ''}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-center flex-1">
                                <h2 className="text-lg font-medium">Review Bills</h2>
                                <p className="text-sm text-gray-500">
                                    {currentIndex + 1} of {pendingBills.length} pending bills
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className="ml-4"
                            >
                                {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                            </Button>
                        </div>
                        
                        <Carousel
                            className={`w-full mx-auto ${isFullScreen ? 'max-w-6xl' : 'max-w-4xl'}`}
                        >
                            <CarouselContent>
                                {pendingBills.map((bill) => (
                                    <CarouselItem key={bill.id}>
                                        <div className="space-y-6">
                                            <div className="relative aspect-[3/4] w-full max-h-[80vh]">
                                                <img 
                                                    src={bill.imageUrl} 
                                                    alt={`Bill from ${bill.vendor}`}
                                                    className="w-full h-full object-contain rounded-lg border bg-gray-50"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="space-y-1">
                                                    <span className="text-sm text-gray-500">Vendor</span>
                                                    <p className="font-medium">{bill.vendor}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-sm text-gray-500">Amount</span>
                                                    <p className="font-medium">Rs.{bill.amount.toFixed(2)}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-sm text-gray-500">Date</span>
                                                    <p className="font-medium">{bill.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <Button
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApprove(bill.id)}
                                                >
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() => handleReject(bill.id)}
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {pendingBills.length > 1 && (
                                <>
                                    <CarouselPrevious className={isFullScreen ? 'left-4' : ''} />
                                    <CarouselNext className={isFullScreen ? 'right-4' : ''} />
                                </>
                            )}
                        </Carousel>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="py-6 text-center text-gray-500">
                            No pending bills to review
                        </CardContent>
                    </Card>
                )}

                {approvedBills.length > 0 && (
                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            className="gap-2"
                            onClick={handleUploadToZoho}
                            disabled={uploading}
                        >
                            <Upload className="w-4 h-4" />
                            {uploading ? "Uploading to Zoho..." : `Upload ${approvedBills.length} Bills to Zoho`}
                        </Button>
                    </div>
                )}
            </section>

            {/* Floating Dock Navigation */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 backdrop-blur-md rounded-full p-1.5 px-4 flex items-center gap-2 shadow-xl border border-orange-300/30">
                    <div className="relative group">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                            onClick={() => navigate('/agents/books-reconciler/settings')}
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                    </div>
                    
                    {/* Additional dock buttons can be added here */}
                </div>
            </div>
        </div>
    );
};

export default BooksReconcilerReview;