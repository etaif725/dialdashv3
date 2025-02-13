import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { generateInitials } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { getSupabase } from '@/lib/supabase/client';
import { useNavigate } from 'react-router-dom';

export const UserNav = () => {
  const { user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      
      // First clear local storage
      if (typeof window !== 'undefined') {
        window.localStorage.clear(); // Clear all storage to be thorough
      }

      // Then sign out from Supabase
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;

      // Force reload the page to clear all state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full hover-lift transition-all duration-300"
        >
          <Avatar className="h-10 w-10 ring-2 ring-[hsl(var(--ring))] ring-offset-2 ring-offset-[hsl(var(--background))]">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url} 
              alt={user?.user_metadata?.full_name?.split(' ')[0]}
              className="object-cover"
            />
            <AvatarFallback className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
              {generateInitials(user?.user_metadata?.full_name?.split(' ')[0])}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 p-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] shadow-lg animate-in" 
        align="end" 
        forceMount
        sideOffset={12}
      >
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-2">
            <p className="text-lg font-semibold leading-none text-[hsl(var(--foreground))] font-plus-jakarta">
              {user?.user_metadata?.full_name}
            </p>
            <p className="text-sm leading-none text-[hsl(var(--muted-foreground))] font-outfit">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 bg-[hsl(var(--border))]" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] my-1 font-outfit">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] my-1 font-outfit">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] my-1 font-outfit">
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-2 bg-[hsl(var(--border))]" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] font-outfit disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4" />
          <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;