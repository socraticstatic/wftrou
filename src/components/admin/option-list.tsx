import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import { OptionItem } from './option-item';

const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  tasteProfile: z.string().min(1, 'Taste profile is required'),
});

type OptionForm = z.infer<typeof optionSchema>;

interface OptionListProps {
  questionId: string;
}

export function OptionList({ questionId }: OptionListProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  
  const options = useLiveQuery(
    () => db.quizOptions
      .where('questionId')
      .equals(questionId)
      .sortBy('order'),
    [questionId]
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OptionForm>({
    resolver: zodResolver(optionSchema),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onSubmit = async (data: OptionForm) => {
    try {
      await db.addOption({
        questionId,
        text: data.text,
        tasteProfile: data.tasteProfile.split(',').map(s => s.trim()),
        enabled: true,
      });
      reset();
      setShowForm(false);
      toast({
        title: 'Success',
        description: 'Option added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add option',
        variant: 'destructive',
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = options?.findIndex(o => o.id === active.id);
    const newIndex = options?.findIndex(o => o.id === over.id);
    
    if (oldIndex === undefined || newIndex === undefined || !options) return;
    
    const newOptions = arrayMove(options, oldIndex, newIndex);
    
    try {
      await db.updateOptionOrder(
        newOptions.map((o, i) => ({ id: o.id, order: i }))
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reorder options',
        variant: 'destructive',
      });
    }
  };

  if (!options) return null;

  return (
    <div className="space-y-4 pl-4 border-l-2 border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Options</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Option
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Option text..."
              {...register('text')}
            />
            {errors.text && (
              <p className="text-sm text-red-500">{errors.text.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Taste profile (comma-separated)..."
              {...register('tasteProfile')}
            />
            {errors.tasteProfile && (
              <p className="text-sm text-red-500">{errors.tasteProfile.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={options.map(o => o.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {options.map(option => (
              <OptionItem
                key={option.id}
                option={option}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}