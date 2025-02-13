import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getSupabase } from '@/lib/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Eye, EyeOff, Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AppError } from '@/lib/utils/errors';
import type { User } from '@supabase/supabase-js';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyState: z.string().min(2, 'State must be at least 2 characters'),
  companyCountry: z.string().min(2, 'Country must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpSchema = z.infer<typeof signUpSchema>;

const defaultSignInValues: SignInValues = {
  email: '',
  password: '',
};

const defaultSignUpValues: SignUpSchema = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  companyState: '',
  companyCountry: '',
};

type AlertType = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
};

type AuthFormProps = {
  type: 'signin' | 'signup';
};

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { theme, toggleTheme, logo } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [activeTab, setActiveTab] = useState(type);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: defaultSignInValues,
  });

  const signUpForm = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: defaultSignUpValues,
  });

  const updatePasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        // Handle signup
        const { data: authData, error: signUpError } = await getSupabase().auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              organization_id_main: companyName,
              role: 'admin',
              is_admin: true,
              is_user: true,
              is_active: true
            },
          },
        });

        if (signUpError) throw signUpError;
        if (!authData.user) throw new Error('Signup failed');

        // Create company
        const { data: company, error: companyError } = await getSupabase()
          .from('companies')
          .insert([{
            user_id: authData.user.id,
            company_name: companyName,
            company_state: 'Unknown', // Required field
            company_country: 'Unknown', // Required field
            company_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }])
          .select()
          .single();

        if (companyError) throw companyError;

        // Create user profile
        const { error: profileError } = await getSupabase()
          .from('user_profiles')
          .insert([{
            id: authData.user.id,
            email,
            full_name: fullName,
            organization_id_main: company.id,
            role: 'admin', // First user is admin
            is_admin: true,
            is_user: true,
            is_active: true
          }]);

        if (profileError) throw profileError;

        // Create default user settings
        const { error: settingsError } = await getSupabase()
          .from('user_settings')
          .insert([{
            user_id: authData.user.id
          }]);

        if (settingsError) throw settingsError;

        toast.success('Account created successfully!');
        navigate('/');
      } else {
        // Handle signin
        const { error: signInError } = await getSupabase().auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        toast.success('Signed in successfully!');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred');
      
      // Cleanup on error during signup
      if (activeTab === 'signup') {
        const { data } = await getSupabase().auth.getUser();
        if (data?.user) {
          await getSupabase().auth.admin.deleteUser(data.user.id);
        }
      }
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
          
          <Tabs 
            defaultValue={type} 
            className="space-y-6"
            onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}
          >
            <TabsList className="py-6 w-full grid-cols-2 justify-center border border-[hsl(var(--border))] rounded-full bg-[hsl(var(--muted))]">
              <TabsTrigger className="ml-1 w-full p-2 rounded-[var(--radius)] data-[state=active]:bg-[hsl(var(--foreground))] data-[state=active]:text-[hsl(var(--background))] text-[hsl(var(--foreground))]" value="signin">Sign In</TabsTrigger>
              <TabsTrigger className="mr-1 w-full p-2 rounded-[var(--radius)] data-[state=active]:bg-[hsl(var(--foreground))] data-[state=active]:text-[hsl(var(--background))] text-[hsl(var(--foreground))]" value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <Form {...signInForm}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={signInForm.control}
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
                            value={email}
                            onChange={(e) => {
                              field.onChange(e);
                              setEmail(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
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
                              value={password}
                              onChange={(e) => {
                                field.onChange(e);
                                setPassword(e.target.value);
                              }}
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
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signUpForm}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[var(--radius)]"
                            value={fullName}
                            onChange={(e) => {
                              field.onChange(e);
                              setFullName(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
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
                            value={email}
                            onChange={(e) => {
                              field.onChange(e);
                              setEmail(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
                              className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[var(--radius)]"
                              value={password}
                              onChange={(e) => {
                                field.onChange(e);
                                setPassword(e.target.value);
                                updatePasswordStrength(e.target.value);
                              }}
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
                        {/* <div className="space-y-2 mt-2">
                          <p className="text-sm font-medium">Password requirements:</p>
                          <ul className="space-y-1">
                            <li className="text-sm flex items-center">
                              {passwordStrength.length ? (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2" />
                              )}
                              At least 8 characters
                            </li>
                            <li className="text-sm flex items-center">
                              {passwordStrength.uppercase ? (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2" />
                              )}
                              One uppercase letter
                            </li>
                            <li className="text-sm flex items-center">
                              {passwordStrength.lowercase ? (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2" />
                              )}
                              One lowercase letter
                            </li>
                            <li className="text-sm flex items-center">
                              {passwordStrength.number ? (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2" />
                              )}
                              One number
                            </li>
                            <li className="text-sm flex items-center">
                              {passwordStrength.special ? (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2" />
                              )}
                              One special character
                            </li>
                          </ul>
                        </div> */}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[var(--radius)]"
                              value={password}
                              onChange={(e) => {
                                field.onChange(e);
                                setPassword(e.target.value);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                              ) : (
                                <Eye className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your company name"
                            className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[var(--radius)]"
                            value={companyName}
                            onChange={(e) => {
                              field.onChange(e);
                              setCompanyName(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="companyState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter state/province"
                            className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[var(--radius)]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="companyCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter country"
                            className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[var(--radius)]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoading || !signUpForm.formState.isValid}
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
                      'Create Account'
                    )}
                  </Button>

                  <div className="text-sm text-center">
                    <Link to="/login" className="font-medium text-[hsl(var(--primary))] hover:underline">
                      Already have an account? Sign in
                    </Link>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add this JSX at the bottom of the form, before the closing div */}
      {alert && (
        <div className={`animate-in fixed bottom-4 right-4 max-w-md ${
          alert.type === 'error' ? 'alert-error' : 
          alert.type === 'success' ? 'alert-success' : 
          alert.type === 'warning' ? 'alert-warning' : 
          'alert-info'
        }`}>
          <div className="flex items-center gap-2 p-4">
            {alert.type === 'error' ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
