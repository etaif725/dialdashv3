import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const companySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyEmail: z.string().email('Invalid email address'),
  companyPhone: z.string().optional(),
  companyWebsite: z.string().url().optional(),
  companyAddress: z.string().optional(),
  companyCity: z.string().optional(),
  companyState: z.string().optional(),
  companyCountry: z.string().optional(),
  companyPostalCode: z.string().optional(),
  companyDescription: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export function CompanySettings() {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      companyWebsite: '',
      companyAddress: '',
      companyCity: '',
      companyState: '',
      companyCountry: '',
      companyPostalCode: '',
      companyDescription: '',
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      // TODO: Implement company update logic
      console.log(data);
    } catch (error) {
      // Show error toast
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-in">
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">Company Name</Label>
            <Input
              id="companyName"
              {...form.register('companyName')}
              className="input-field"
              error={!!form.formState.errors.companyName}
            />
            {form.formState.errors.companyName && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {form.formState.errors.companyName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">Company Email</Label>
            <Input
              id="companyEmail"
              type="email"
              {...form.register('companyEmail')}
              className="input-field"
              error={!!form.formState.errors.companyEmail}
            />
            {form.formState.errors.companyEmail && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {form.formState.errors.companyEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPhone" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">Company Phone</Label>
            <Input
              id="companyPhone"
              type="tel"
              {...form.register('companyPhone')}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyWebsite" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">Website</Label>
            <Input
              id="companyWebsite"
              type="url"
              {...form.register('companyWebsite')}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">Address</Label>
            <Input
              id="companyAddress"
              {...form.register('companyAddress')}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCity" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">City</Label>
            <Input
              id="companyCity"
              {...form.register('companyCity')}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyState" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">State/Province</Label>
            <Input
              id="companyState"
              {...form.register('companyState')}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCountry" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">Country</Label>
            <Input
              id="companyCountry"
              {...form.register('companyCountry')}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPostalCode" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">Postal Code</Label>
            <Input
              id="companyPostalCode"
              {...form.register('companyPostalCode')}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="companyDescription" className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]">Company Description</Label>
          <Textarea
            id="companyDescription"
            {...form.register('companyDescription')}
            className="input-field min-h-[100px]"
          />
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
      </div>
    </form>
  );
}