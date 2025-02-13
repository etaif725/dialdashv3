import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateInitials } from '@/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user, updateUser } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.full_name || '',
      email: user?.email || '',
      phone: '',
      timezone: 'UTC',
      language: 'en',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateUser({
        full_name: data.fullName,
        email: data.email,
      });
      // Show success toast
    } catch (error) {
      // Show error toast
    }
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="p-6 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))] shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-x-6">
          <Avatar className="h-24 w-24 border-2 border-[hsl(var(--primary))] rounded-full">
            <AvatarImage src={user?.user_metadata?.avatar_url || '/default-user.webp'} alt={user?.id} className="object-cover rounded-full" />
            <AvatarFallback className="bg-[hsl(var(--muted))] text-[hsl(var(--primary))] font-semibold rounded-full">
              {generateInitials(user?.full_name || '')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="rounded-full hover:bg-[hsl(var(--accent)/.1)] text-[hsl(var(--primary))] border-[hsl(var(--primary))] hover-lift transition-all duration-300"
            >
              Change Avatar
            </Button>
            <p className="text-sm text-[hsl(var(--muted-foreground))] font-plus-jakarta">
              JPG, GIF or PNG. Max size of 800K
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="p-6 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))] space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="font-plus-jakarta text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              {...form.register('fullName')}
              className="input-field"
              error={!!form.formState.errors.fullName}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="font-plus-jakarta text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              className="input-field"
              error={!!form.formState.errors.email}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="font-plus-jakarta text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              {...form.register('phone')}
              className="input-field"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timezone" className="font-plus-jakarta text-sm font-medium">
              Timezone
            </Label>
            <Input
              id="timezone"
              {...form.register('timezone')}
              className="input-field"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="language" className="font-plus-jakarta text-sm font-medium">
              Language
            </Label>
            <Input
              id="language"
              {...form.register('language')}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-6">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="button-primary hover-lift w-full sm:w-auto font-plus-jakarta"
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}