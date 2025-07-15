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
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import { QuestionItem } from './question-item';
import { ImportDialog } from './import-dialog';

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  enabled: z.boolean().default(true),
});

type QuestionForm = z.infer<typeof questionSchema>;

export function QuizManager() {
  const { toast } = useToast();
  const [showImport, setShowImport] = useState(false);
  
  const questions = useLiveQuery(
    () => db.quizQuestions.orderBy('order').toArray(),
    []
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      enabled: true,
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onSubmit = async (data: QuestionForm) => {
    try {
      await db.addQuestion(data);
      reset();
      toast({
        title: 'Success',
        description: 'Question added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add question',
        variant: 'destructive',
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = questions?.findIndex(q => q.id === active.id);
    const newIndex = questions?.findIndex(q => q.id === over.id);
    
    if (oldIndex === undefined || newIndex === undefined || !questions) return;
    
    const newQuestions = arrayMove(questions, oldIndex, newIndex);
    
    try {
      await db.updateQuestionOrder(
        newQuestions.map((q, i) => ({ id: q.id, order: i }))
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reorder questions',
        variant: 'destructive',
      });
    }
  };

  if (!questions) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quiz Questions</h2>
        <Button
          onClick={() => setShowImport(true)}
          variant="outline"
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">New Question</Label>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                id="text"
                placeholder="Enter question text..."
                {...register('text')}
              />
              {errors.text && (
                <p className="text-sm text-red-500 mt-1">{errors.text.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch id="enabled" {...register('enabled')} />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
            <Button type="submit" className="gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map(q => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {questions.map(question => (
              <QuestionItem
                key={question.id}
                question={question}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ImportDialog
        open={showImport}
        onOpenChange={setShowImport}
      />
    </div>
  );
}