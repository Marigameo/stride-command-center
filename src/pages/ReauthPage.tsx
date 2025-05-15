import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ShieldAlert } from "lucide-react";
import React, { useState } from "react";

const ReauthPage = () => {
  const [isReauthorizing, setIsReauthorizing] = useState(false);
  const [reauthSuccess, setReauthSuccess] = useState(false);
  const { toast } = useToast();

  const handleReauthorize = () => {
    setIsReauthorizing(true);
    // Simulate API call
    setTimeout(() => {
      setIsReauthorizing(false);
      setReauthSuccess(true);
      toast({
        title: "Reauthorization Successful",
        description: "The service has been reauthorized.",
        variant: "default", // Shadcn success is often default or a custom green
      });
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] h-[100vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-3">
            <ShieldAlert size={32} className="text-red-600" />
          </div>
          <CardTitle className="text-2xl">Reauthorization Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            To continue using this service, please reauthorize your account.
          </p>
          {reauthSuccess ? (
            <div className="p-4 bg-green-100 text-green-700 rounded-md">
              Successfully reauthorized!
            </div>
          ) : (
            <Button 
              onClick={handleReauthorize}
              disabled={isReauthorizing}
              className="w-full"
            >
              {isReauthorizing ? "Reauthorizing..." : "Reauthorize Now"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReauthPage; 