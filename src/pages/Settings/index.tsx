import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { CompanySettings } from '@/components/settings/CompanySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { IntegrationSettings } from '@/components/settings/IntegrationSettings';
import { CredentialsApiSettings } from '@/components/settings/CredentialsApi';

export function Settings() {
  return (
    <div className="space-y-4 md:space-y-6 animate-in">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 glass-effect">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-1">
            Manage your account settings
          </p>
        </div>
      </div>

      <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
        <Tabs defaultValue="profile" className="p-4 md:p-6">
          <TabsList className="w-full flex gap-2 flex-nowrap bg-[hsl(var(--muted))] px-1.5 py-6 rounded-full">
            <TabsTrigger 
              value="profile" 
              className="flex-1 rounded-full px-4 py-2 text-[hsl(var(--muted-foreground))] data-[state=active]:bg-[hsl(var(--background))] data-[state=active]:text-[hsl(var(--primary))] transition-all duration-300 hover:text-[hsl(var(--primary))]"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="company" 
              className="flex-1 rounded-full px-4 py-2 text-[hsl(var(--muted-foreground))] data-[state=active]:bg-[hsl(var(--background))] data-[state=active]:text-[hsl(var(--primary))] transition-all duration-300 hover:text-[hsl(var(--primary))]"
            >
              Company
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex-1 rounded-full px-4 py-2 text-[hsl(var(--muted-foreground))] data-[state=active]:bg-[hsl(var(--background))] data-[state=active]:text-[hsl(var(--primary))] transition-all duration-300 hover:text-[hsl(var(--primary))]"
            >
              Notifications
            </TabsTrigger>
            {/*<TabsTrigger 
              value="integrations" 
              className="flex-1 rounded-full px-4 py-2 text-[hsl(var(--muted-foreground))] data-[state=active]:bg-[hsl(var(--background))] data-[state=active]:text-[hsl(var(--primary))] transition-all duration-300 hover:text-[hsl(var(--primary))]"
            >
              Integrations
            </TabsTrigger> */}
            <TabsTrigger 
              value="credentials" 
              className="flex-1 rounded-full px-4 py-2 text-[hsl(var(--muted-foreground))] data-[state=active]:bg-[hsl(var(--background))] data-[state=active]:text-[hsl(var(--primary))] transition-all duration-300 hover:text-[hsl(var(--primary))]"
            >
              Credentials
            </TabsTrigger>
          </TabsList>
          <div className="mt-4 md:mt-6 flex flex-col md:grid">
            <TabsContent value="profile" className="animate-in">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="company" className="animate-in">
              <CompanySettings />
            </TabsContent>
            <TabsContent value="notifications" className="animate-in">
              <NotificationSettings />
            </TabsContent>
            {/* <TabsContent value="integrations" className="animate-in">
              <IntegrationSettings />
            </TabsContent> */}
            <TabsContent value="credentials" className="animate-in">
              <CredentialsApiSettings />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}