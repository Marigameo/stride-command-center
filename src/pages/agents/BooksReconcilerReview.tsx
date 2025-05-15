import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Check, X, Upload } from "lucide-react";

// Mock data for bills
const billsData = [
  {
    id: 1,
    imageUrl: "/bills/GST-Bill-Format-47.webp",
    amount: 524.99,
    vendor: "Office Supplies Co",
    date: "2024-03-15",
    status: "pending"
  },
  {
    id: 2,
    imageUrl: "/bills/1.webp",
    amount: 1299.99,
    vendor: "Tech Equipment Ltd",
    date: "2024-03-14",
    status: "pending"
  },
  {
    id: 3,
    imageUrl: "/bills/Tax-Invoice-272.jpg",
    amount: 749.50,
    vendor: "Marketing Services Inc",
    date: "2024-03-13",
    status: "pending"
  }
];

const BooksReconcilerReview = () => {
  const [bills, setBills] = useState(billsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

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
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium">Review Bills</h2>
            <p className="text-sm text-gray-500">
              {currentIndex + 1} of {pendingBills.length} pending bills
            </p>
          </div>
          
          <Carousel
            className="w-full max-w-xl mx-auto"
          >
            <CarouselContent>
              {pendingBills.map((bill) => (
                <CarouselItem key={bill.id}>
                  <div className="space-y-6">
                    <img 
                      src={bill.imageUrl} 
                      alt={`Bill from ${bill.vendor}`}
                      className="w-full h-[500px] object-cover rounded-lg border"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Vendor:</span>
                        <span className="font-medium">{bill.vendor}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-medium">${bill.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{bill.date}</span>
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
                <CarouselPrevious />
                <CarouselNext />
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
            {uploading ? "Uploading to Zoho..." : `Upload ${approvedBills.length} Bills to Zoho`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BooksReconcilerReview; 