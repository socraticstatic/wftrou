import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { db, type QuizQuestion } from '@/lib/db';
import { OptionList } from './option-list';

interface QuestionItemProps {
  question: QuizQuestion;
}

export function QuestionItem({ question }: QuestionItemProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(question.text);
  const [showOptions, setShowOptions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = async (checked: boolean) => {
    try {
      await db.toggleQuestionEnabled(question.id, checked);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle question',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    try {
      await db.updateQuestion(question.id, { text });
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Question updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update question',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await db.deleteQuestion(question.id);
      toast({
        title: 'Success',
        description: 'Question deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete question',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-4 space-y-4" ref={setNodeRef} style={style}>
      <div className="flex items-start gap-4">
        <button
          className="mt-3 cursor-move touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
              ) : (
                <div
                  className="min-h-[2.5rem] flex items-center"
                  onClick={() => setIsEditing(true)}
                >
                  {question.text}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id={`enabled-${question.id}`}
                  checked={question.enabled}
                  onCheckedChange={handleToggle}
                />
                <Label htmlFor={`enabled-${question.id}`}>Enabled</Label>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowOptions(!showOptions)}
              >
                <Plus className="w-4 h-4" />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showOptions && (
            <OptionList questionId={question.id} />
          )}
        </div>
      </div>
    </Card>
  );
}