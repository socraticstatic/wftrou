import { WineSearch } from '@/components/wine-search';
import { AdminPanel } from '@/components/admin';
import { ThemeToggle } from '@/components/theme-toggle';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDbSync } from '@/hooks/use-db-sync';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Initialize database sync
  useDbSync();

  if (showAdmin) {
    return <AdminPanel onExit={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-neutral-50 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <main className="flex-1 px-4 py-8 pb-24">
        <WineSearch />
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-sm text-gray-500 dark:text-rose-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2">
          <span>Micah Boswell, Copyright 2024 into perpetuity</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAdmin(true)}
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4 text-gray-400 dark:text-rose-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors" />
            <span className="sr-only">Admin Panel</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}