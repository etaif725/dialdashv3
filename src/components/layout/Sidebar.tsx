import { cn } from '@/lib/utils';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  X,
  LogOut,
  Moon,
  Sun,
  Zap,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Analytics', to: '/analytics', icon: BarChart3 },
  { name: 'AI Employees', to: '/ai-employees', icon: MessageSquare },
  { name: 'Marketplace', to: '/marketplace', icon: MessageSquare },
  { name: 'Leads', to: '/leads', icon: Users },
  { name: 'Calendar', to: '/calendar', icon: Calendar },
  { name: 'Settings', to: '/settings', icon: Settings },
];

export const Sidebar = ({ onClose }: SidebarProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme, logo } = useTheme();
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState('FREE');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData } = await getSupabase()
          .from('users')
          .select('plan, credits')
          .eq('id', user?.id)
          .single();
        
        if (userData) {
          setPlan(userData.plan);
          setCredits(userData.credits);
        } else {
          setPlan('Free');
          setCredits(500);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setPlan('FREE');
        setCredits(500);
      }
    };

    fetchUserData();
  }, [user]);

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
    <div className="flex h-full flex-col bg-[hsl(var(--background))]">
      <div className="flex items-center justify-between flex-shrink-0 px-6 pt-6 mb-8">
        <img 
          src={logo} 
          alt="DialWise" 
          className="h-12 w-auto" 
        />
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3.5 text-md font-medium rounded-lg transition-colors duration-200',
                'hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]',
                isActive && 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-plus-jakarta font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="flex-shrink-0 mx-4 mb-4">
        <div className="p-4 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-md font-medium">Credits Available</span>
            <span className="text-sm font-semibold">{credits}</span>
          </div>
          <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2">
            <div 
              className="bg-[hsl(var(--primary))] h-2 rounded-full" 
              style={{ width: `${Math.min((credits / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {plan !== 'PRO' && plan !== 'ENTERPRISE' && (
        <div className="flex-shrink-0 mx-4 mb-4">
          <div className="p-4 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-sm mb-3">Get unlimited credits and premium features</p>
            <button 
              className="w-full py-2 px-4 rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors duration-200"
              onClick={() => window.location.href = '/settings/billing'}
            >
              <span className="flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                Upgrade Now
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-shrink-0 mx-4 mb-6">
        <div className="p-4 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className="h-12 w-12 rounded-full object-cover border border-[hsl(var(--border))]"
                  src="/default-user.webp"
                  alt="Avatar"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[hsl(var(--success))] border-2 border-[hsl(var(--background))]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold font-plus-jakarta text-[hsl(var(--foreground))]">
                  {user?.user_metadata?.full_name || 'CRM User'}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] font-outfit">
                  {plan} Plan
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="ghost"
              className="p-2.5 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};