import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, X, RefreshCcw, Ban } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

const brandFormSchema = z.object({
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  brandDescription: z.string().min(10, {
    message: "Brand description must be at least 10 characters.",
  }),
  geographiesServed: z.array(z.string()).min(1, {
    message: "Please select at least one geography.",
  }),
  competitors: z.string(),
});

const connectionsFormSchema = z.object({
  googleAds: z.boolean(),
  googleDrive: z.boolean(),
  zohoBooks: z.boolean(),
  hubspot: z.boolean(),
  slack: z.boolean(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;
type ConnectionsFormValues = z.infer<typeof connectionsFormSchema>;

const geographies = ["USA", "Central America", "Canada", "India"];

// Connection data with more details
const connections = [
  {
    id: "googleAds",
    name: "Google Ads",
    logo: "https://www.gstatic.com/images/branding/product/2x/ads_48dp.png",
    description: "Manage your advertising campaigns",
    isActive: true,
    lastAuth: "2024-02-15",
  },
  {
    id: "googleDrive",
    name: "Google Drive",
    logo: "https://ssl.gstatic.com/images/branding/product/2x/drive_48dp.png",
    description: "Access and store files",
    isActive: true,
    lastAuth: "2024-03-01",
  },
  {
    id: "zohoBooks",
    name: "Zoho Books",
    logo: "https://zoho.codafish.net/wp-content/uploads/2022/08/books-512-1.png",
    description: "Financial management and accounting",
    isActive: false,
    lastAuth: "2024-01-20",
  },
  {
    id: "hubspot",
    name: "Hubspot",
    logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
    description: "CRM and marketing automation",
    isActive: true,
    lastAuth: "2024-03-10",
  },
  {
    id: "slack",
    name: "Slack",
    logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
    description: "Team communication and notifications",
    isActive: true,
    lastAuth: "2024-02-28",
  },
];

const AccountSettings = () => {
  const [competitors, setCompetitors] = useState<string[]>([
    "Microsoft",
    "Apple",
    "Amazon",
    "Meta",
    "OpenAI"
  ]);
  const [competitorInput, setCompetitorInput] = useState("");
  const navigate = useNavigate();

  const brandForm = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      company: "Google",
      brandDescription: "Google's mission is to organize the world's information and make it universally accessible and useful. Since our founding in 1998, Google has grown by leaps and bounds. From offering search in a single language we now offer dozens of products and services—including various forms of advertising and web applications for all kinds of tasks—in scores of languages.",
      geographiesServed: ["USA", "Canada", "India"],
      competitors: "",
    },
  });

  const connectionsForm = useForm<ConnectionsFormValues>({
    resolver: zodResolver(connectionsFormSchema),
    defaultValues: {
      googleAds: false,
      googleDrive: false,
      zohoBooks: false,
      hubspot: false,
      slack: false,
    },
  });

  const handleCompetitorKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && competitorInput.trim()) {
      e.preventDefault();
      addCompetitor();
    }
  };

  const addCompetitor = () => {
    if (competitorInput.trim()) {
      // Split by commas and filter out empty strings
      const newCompetitors = competitorInput
        .split(',')
        .map(comp => comp.trim())
        .filter(comp => comp.length > 0);
      
      // Add all new competitors
      setCompetitors([...competitors, ...newCompetitors]);
      setCompetitorInput("");
    }
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  function onBrandSubmit(data: BrandFormValues) {
    console.log("Brand data submitted:", data);
    toast({
      title: "Brand details updated",
      description: "Your brand information has been saved successfully.",
    });
  }

  function onConnectionsSubmit(data: ConnectionsFormValues) {
    console.log("Connections settings submitted:", data);
    toast({
      title: "Connections updated",
      description: "Your connection preferences have been saved.",
    });
  }

  const handleReauth = (connectionId: string) => {
    navigate('/reauth');
  };

  const handleRevoke = (connectionId: string) => {
    toast({
      title: "Access Revoked",
      description: `Access to ${connectionId} has been revoked.`,
    });
  };

  return (
    <div className="space-y-8 my-6">
      <h1 className="text-2xl font-semibold">Account Settings</h1>

      <Tabs defaultValue="brand" className="space-y-4">
        <TabsList>
          <TabsTrigger value="brand">Brand Details</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="brand">
          <Card>
            <CardHeader>
              <CardTitle>Brand Details</CardTitle>
              <CardDescription>
                Configure your brand information and market presence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...brandForm}>
                <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-6">
                  <FormField
                    control={brandForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={brandForm.control}
                    name="brandDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your brand and its unique value proposition"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={brandForm.control}
                    name="geographiesServed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Geographies Served</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-4">
                            {geographies.map((geography) => (
                              <div key={geography} className="flex items-center space-x-2">
                                <Switch
                                  checked={field.value.includes(geography)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, geography]
                                      : field.value.filter((g) => g !== geography);
                                    field.onChange(newValue);
                                  }}
                                />
                                <span>{geography}</span>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Competitors</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        value={competitorInput}
                        onChange={(e) => setCompetitorInput(e.target.value)}
                        onKeyDown={handleCompetitorKeyDown}
                        placeholder="Add competitors (comma-separated or press Enter)"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addCompetitor}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {competitors.map((competitor, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {competitor}
                          <button
                            type="button"
                            onClick={() => removeCompetitor(index)}
                            className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </FormItem>

                  <Button type="submit">Save Brand Details</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={connection.logo}
                        alt={`${connection.name} logo`}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${connection.name}&background=random`;
                        }}
                      />
                      <div>
                        <CardTitle className="text-lg">{connection.name}</CardTitle>
                        <CardDescription>{connection.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={connection.isActive ? "default" : "secondary"}>
                      {connection.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 mb-4">
                    Last authenticated: {connection.lastAuth}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleReauth(connection.id)}
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reauthorize
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRevoke(connection.id)}
                    >
                      <Ban className="h-4 w-4" />
                      Revoke
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
