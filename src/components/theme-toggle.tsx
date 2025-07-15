import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

export function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => setDarkMode(!darkMode)}
      className="h-10 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-rose-100 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all duration-200"
    >
      {darkMode ? (
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-rose-600 dark:text-rose-300" />
          <span className="text-sm text-rose-600 dark:text-rose-300">Light Mode</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-rose-600" />
          <span className="text-sm text-rose-600">Dark Mode</span>
        </div>
      )}
    </Button>
  );
}