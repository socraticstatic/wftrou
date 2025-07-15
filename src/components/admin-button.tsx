import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

interface AdminButtonProps {
  onToggle: () => void;
  isActive: boolean;
}

export function AdminButton({ onToggle, isActive }: AdminButtonProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) return null;

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onToggle}
      className={`
        h-10 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-200
        ${isActive 
          ? 'border-rose-300 dark:border-rose-600 text-rose-600 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-900/30'
          : 'border-rose-100 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/30'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <Settings className={`h-4 w-4 ${isActive ? 'text-rose-600 dark:text-rose-300' : 'text-rose-600 dark:text-rose-300'}`} />
        <span className="text-sm text-rose-600 dark:text-rose-300">
          {isActive ? 'Exit Admin' : 'Admin'}
        </span>
      </div>
    </Button>
  );
}