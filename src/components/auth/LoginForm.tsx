import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInValues = z.infer<typeof signInSchema>;

const defaultSignInValues: SignInValues = {
  email: '',
  password: '',
};

export function LoginForm() {
  const { theme, toggleTheme, logo } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: defaultSignInValues,
  });

  const handleSubmit = async (values: SignInValues) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      navigate('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Geometric pattern background with floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[hsl(var(--background))] opacity-90">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Subtle noise texture overlay */}
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
              <div className="flex justify-end">
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

          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-[hsl(var(--foreground))]">
              Sign in to your account
            </h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 space-y-6">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[var(--radius)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                          ) : (
                            <Eye className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="flex justify-end">
                      <Link 
                        to="/forgot-password"
                        className="text-sm text-[hsl(var(--primary))] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
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
                  'Sign In'
                )}
              </Button>

              <div className="text-sm text-center">
                <Link to="/register" className="font-medium text-[hsl(var(--primary))] hover:underline">
                  Don't have an account? Sign up
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
} 