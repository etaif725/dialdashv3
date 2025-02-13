import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { getSupabase } from '@/lib/supabase/client';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const defaultValues: ForgotPasswordValues = {
  email: '',
};

export function ForgotPwForm() {
  const { theme, toggleTheme, logo } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setIsLoading(true);
    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email');
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to send reset password email');
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(var(--background))] opacity-90">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          transform: 'scale(1.5)'
        }}></div>
      </div>

      <div className="max-w-md w-full relative">
        <div className="bg-[hsl(var(--background))] backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-[hsl(var(--border))]">
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="Dialwise.ai Logo" className="mr-2" />
            <div className="flex-1 flex justify-center">
              <div className="flex justify-end pl-6">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-[var(--radius)] hover:bg-[hsl(var(--accent))] transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-[hsl(var(--foreground))]" />
                  ) : (
                    <Moon className="h-5 w-5 text-[hsl(var(--foreground))]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            {/* <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Forgot Password</h2> */}
            <p className="text-[hsl(var(--muted-foreground))] mt-2">Enter your email to receive a password reset link</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[var(--radius)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
                         rounded-[var(--radius)] font-medium shadow-lg hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transform transition-all duration-200 hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-t-[hsl(var(--primary-foreground))] border-r-[hsl(var(--primary-foreground))] border-b-[hsl(var(--primary-foreground))] border-l-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="text-[hsl(var(--primary))] hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}