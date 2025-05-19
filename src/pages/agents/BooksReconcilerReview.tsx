import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Check, X, Upload, Maximize2, Minimize2 } from "lucide-react";

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

const BooksReconcilerReview = () => {
  const [bills, setBills] = useState(billsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Books Reconciler Review</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Total Bills</h3>
            <p className="text-2xl font-bold">{bills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold text-orange-600">{pendingBills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-green-600">{approvedBills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">{rejectedBills.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bill Review Carousel */}
      {pendingBills.length > 0 ? (
        <Card className={`p-6 transition-all duration-300 Rs.{isFullScreen ? 'fixed inset-4 z-50 bg-background' : ''}`}>
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
            className={`w-full mx-auto Rs.{isFullScreen ? 'max-w-6xl' : 'max-w-4xl'}`}
          >
            <CarouselContent>
              {pendingBills.map((bill) => (
                <CarouselItem key={bill.id}>
                  <div className="space-y-6">
                    <div className="relative aspect-[3/4] w-full max-h-[80vh]">
                      <img 
                        src={bill.imageUrl} 
                        alt={`Bill from Rs.{bill.vendor}`}
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

      {/* Upload to Zoho Section */}
      {approvedBills.length > 0 && (
        <div className="flex justify-center">
          <Button
            size="lg"
            className="gap-2"
            onClick={handleUploadToZoho}
            disabled={uploading}
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading to Zoho..." : `Upload Rs.{approvedBills.length} Bills to Zoho`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BooksReconcilerReview; 