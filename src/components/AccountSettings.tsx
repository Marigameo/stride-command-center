
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  taskReminders: z.boolean(),
  marketingEmails: z.boolean(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmNewPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

const AccountSettings = () => {
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "strive_admin",
      email: "admin@strivelabs.com",
      name: "Admin User",
    },
  });

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      marketingEmails: false,
    },
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Profile data submitted:", data);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    console.log("Notification settings submitted:", data);
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    console.log("Security settings submitted:", data);
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  }

  function onDeleteAccount() {
    toast({
      title: "Account deletion requested",
      description: "Your account deletion request has been submitted for processing.",
      variant: "destructive",
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account information and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email address" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you'll receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                  <FormField
                    control={notificationsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>Receive updates via email.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={notificationsForm.control}
                    name="pushNotifications"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel className="text-base">Push Notifications</FormLabel>
                          <FormDescription>Receive notifications in-app.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={notificationsForm.control}
                    name="taskReminders"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel className="text-base">Task Reminders</FormLabel>
                          <FormDescription>Get reminders for upcoming tasks.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={notificationsForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
                          <FormDescription>Receive marketing and promotional emails.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit">Save Preferences</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences and account access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="mt-4 space-y-4">
                      <FormField
                        control={securityForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Update Password</Button>
                    </form>
                  </Form>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Add an extra layer of security to your account.
                  </p>
                  <Button variant="outline">Set Up 2FA</Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <Button variant="destructive" onClick={onDeleteAccount}>Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
