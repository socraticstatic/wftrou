import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CharacteristicSelector } from './characteristic-selector';
import { QuizOptionsSelector } from './quiz-options-selector';
import { TASTE_PROFILES } from '@/lib/constants';

const wineSchema = z.object({
  name: z.string().min(1, 'Wine name is required'),
  type: z.enum(TASTE_PROFILES.types as [string, ...string[]], {
    required_error: 'Wine type is required',
  }),
  region: z.string().min(1, 'Region is required'),
  country: z.string().min(1, 'Country is required'),
  characteristics: z.array(z.string()).min(1, 'At least one characteristic is required'),
  pairings: z.array(z.string()).min(1, 'At least one pairing is required'),
  description: z.string().min(1, 'Description is required'),
});

type WineForm = z.infer<typeof wineSchema>;

interface WineFormProps {
  onSubmit: (data: WineForm) => Promise<void>;
  defaultValues?: Partial<WineForm>;
}

export function WineForm({ onSubmit, defaultValues }: WineFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<WineForm>({
    resolver: zodResolver(wineSchema),
    defaultValues: {
      characteristics: [],
      pairings: [],
      ...defaultValues,
    },
  });

  const characteristics = watch('characteristics');
  const pairings = watch('pairings');
  const type = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Step 1: Basic Wine Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="bg-rose-100 text-rose-600 rounded-full w-6 h-6 flex items-center justify-center font-medium">1</div>
          <h3 className="text-lg font-semibold">Basic Wine Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Wine Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Wine Type</Label>
            <select
              id="type"
              className="w-full h-10 px-3 rounded-md border border-input bg-white"
              {...register('type')}
            >
              <option value="">Select type...</option>
              {TASTE_PROFILES.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input id="region" {...register('region')} />
            {errors.region && (
              <p className="text-sm text-red-500">{errors.region.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register('country')} />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            className="min-h-[100px]"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      <Separator />

      {type ? (
        <>
          {/* Step 2: Quiz Connections */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-rose-100 text-rose-600 rounded-full w-6 h-6 flex items-center justify-center font-medium">2</div>
              <h3 className="text-lg font-semibold">Quiz Result Connections</h3>
            </div>
            
            <QuizOptionsSelector
              selectedType={type}
              selectedCharacteristics={characteristics}
              onChange={(chars) => setValue('characteristics', chars, { shouldValidate: true })}
            />
          </div>

          <Separator />

          {/* Step 3: Search Keywords */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-rose-100 text-rose-600 rounded-full w-6 h-6 flex items-center justify-center font-medium">3</div>
              <h3 className="text-lg font-semibold">Search Keywords</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  Taste & Style Keywords
                  <span className="text-sm text-gray-500 ml-2">(for search results)</span>
                </Label>
                <CharacteristicSelector
                  value={characteristics}
                  onChange={(value) => setValue('characteristics', value, { shouldValidate: true })}
                  type="characteristics"
                  label="Keywords"
                  selectedWineType={type}
                />
                {errors.characteristics && (
                  <p className="text-sm text-red-500">{errors.characteristics.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Food Pairings
                  <span className="text-sm text-gray-500 ml-2">(for search results)</span>
                </Label>
                <CharacteristicSelector
                  value={pairings}
                  onChange={(value) => setValue('pairings', value, { shouldValidate: true })}
                  type="pairings"
                  label="Pairings"
                  selectedWineType={type}
                />
                {errors.pairings && (
                  <p className="text-sm text-red-500">{errors.pairings.message}</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a wine type to continue
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full"
        disabled={!type}
      >
        <Plus className="w-4 h-4 mr-2" />
        {defaultValues ? 'Update Wine' : 'Add Wine'}
      </Button>
    </form>
  );
}