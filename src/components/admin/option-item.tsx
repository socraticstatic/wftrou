import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { db, type QuizOption } from '@/lib/db';

interface OptionItemProps {
  option: QuizOption;
}

export function OptionItem({ option }: OptionItemProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(option.text);
  const [profile, setProfile] = useState(option.tasteProfile.join(', '));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = async (checked: boolean) => {
    try {
      await db.toggleOptionEnabled(option.id, checked);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle option',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    try {
      await db.updateOption(option.id, {
        text,
        tasteProfile: profile.split(',').map(s => s.trim()),
      });
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Option updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update option',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await db.deleteOption(option.id);
      toast({
        title: 'Success',
        description: 'Option deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete option',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200"
    >
      <button
        className="cursor-move touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Option text..."
            />
            <Input
              value={profile}
              onChange={e => setProfile(e.target.value)}
              placeholder="Taste profile (comma-separated)..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="min-h-[2rem] flex items-center"
            onClick={() => setIsEditing(true)}
          >
            <span className="font-medium">{option.text}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({option.tasteProfile. join(', ')})
            </span>
          </div>
        )}
      </div>

      <Switch
        checked={option.enabled}
        onCheckedChange={handleToggle}
      />

      <Button
        variant="destructive"
        size="icon"
        onClick={handleDelete}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
}