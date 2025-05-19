import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BlogContentStrategizerSettings = () => {
  return (
    <div className="space-y-8 my-6 p-4">
      <h1 className="text-2xl font-semibold">Blog Content Strategizer Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Brand Guidelines Upload */}
          <div className="space-y-2">
            <Label htmlFor="brandGuidelines">Brand Guidelines</Label>
            <div className="grid w-full items-center gap-1.5">
              <div className="flex items-center p-4 space-x-4 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Brand Guidelines.docx</p>
                    <p className="text-xs text-muted-foreground">Word Document</p>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative"
                    onClick={() => document.getElementById('brandGuidelines')?.click()}
                  >
                    Change File
                  </Button>
                  <Input
                    id="brandGuidelines"
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log('Selected file:', file.name);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Brand USP */}
          <div className="space-y-2">
            <Label htmlFor="brandUsp">Brand USP</Label>
            <Textarea
              id="brandUsp"
              placeholder="Enter your brand's unique selling proposition"
              defaultValue="Massive scalability and breadth of offerings as value"
              className="min-h-[100px]"
            />
          </div>

          {/* Target Persona */}
          <div className="space-y-2">
            <Label htmlFor="targetPersona">Target Persona</Label>
            <Textarea
              id="targetPersona"
              placeholder="Describe your target audience"
              defaultValue="SMB vendors looking to start selling online"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogContentStrategizerSettings;
