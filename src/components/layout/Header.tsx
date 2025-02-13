import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from './UserNav';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  type: 'changelog' | 'admin' | 'system';
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'changelog',
      title: 'New Features Released',
      message: 'Check out our latest AI improvements and UI updates',
      date: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'admin',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Saturday 2 AM EST',
      date: new Date(),
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'changelog':
        return 'bg-[hsl(var(--info)/.15)] text-[hsl(var(--info))] border-[hsl(var(--info)/.2)]';
      case 'admin':
        return 'bg-[hsl(var(--warning)/.15)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/.2)]';
      case 'system':
        return 'bg-[hsl(var(--purple)/.15)] text-[hsl(var(--purple))] border-[hsl(var(--purple)/.2)]';
    }
  };

  return (
    <header className="sticky top-0 bg-[hsl(var(--background))] border-b border-[hsl(var(--border))]">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 lg:hidden rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors duration-200"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <form className="hidden md:flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-full rounded-lg bg-[hsl(var(--background))] border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
          </div>
        </form>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors duration-200"
            aria-label="Notifications"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[hsl(var(--destructive))]" />
            )}
          </Button>
          <UserNav />
        </div>
      </div>

      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-[625px] glass-effect max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b border-[hsl(var(--border))] pb-4 sticky top-0 z-10">
            <DialogTitle className="text-xl font-semibold font-plus-jakarta text-[hsl(var(--foreground))]">
              Notifications
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4 max-h-[calc(90vh-8rem)]">
            <div className="space-y-4 py-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] 
                    shadow-sm hover:shadow-md hover:bg-[hsl(var(--muted)/.5)] 
                    transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-plus-jakarta text-[hsl(var(--foreground))] line-clamp-1">
                      {notification.title}
                    </h4>
                    <Badge 
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ml-2 
                        hover:opacity-80 transition-opacity duration-200 ${getNotificationColor(notification.type)}`}
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] font-outfit line-clamp-3 
                    leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] font-outfit mt-2.5 
                    opacity-70 hover:opacity-100 transition-opacity duration-200">
                    {notification.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </header>
  );
};