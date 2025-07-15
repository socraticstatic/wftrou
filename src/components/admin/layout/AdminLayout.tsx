import { Settings } from 'lucide-react';
import { AdminNav } from './AdminNav';

interface AdminLayoutProps {
  children: React.ReactNode;
  onViewChange: (view: 'wines' | 'quiz') => void;
  onExit: () => void;
}

export function AdminLayout({ children, onViewChange, onExit }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-neutral-50 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b border-rose-100 dark:border-rose-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-rose-200">
                Wine Admin
              </h1>
            </div>
            <AdminNav onViewChange={onViewChange} onExit={onExit} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}