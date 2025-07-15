import { Wine, BookOpen, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminNavProps {
  onViewChange: (view: 'wines' | 'quiz') => void;
  onExit: () => void;
}

export function AdminNav({ onViewChange, onExit }: AdminNavProps) {
  return (
    <nav className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={() => onViewChange('wines')}
        className="text-gray-600 hover:text-gray-900 dark:text-rose-300 dark:hover:text-rose-200"
      >
        <Wine className="w-4 h-4 mr-2" />
        Wines
      </Button>
      <Button
        variant="ghost"
        onClick={() => onViewChange('quiz')}
        className="text-gray-600 hover:text-gray-900 dark:text-rose-300 dark:hover:text-rose-200"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Quiz
      </Button>
      <Button
        variant="ghost"
        className="text-gray-600 hover:text-gray-900 dark:text-rose-300 dark:hover:text-rose-200"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Help
      </Button>
      <Button
        variant="outline"
        onClick={onExit}
        className="ml-4 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/30"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Exit Admin
      </Button>
    </nav>
  );
}