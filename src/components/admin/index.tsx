import { useState } from 'react';
import { AdminLayout } from './layout/AdminLayout';
import { WineAdminList } from './wines/WineAdminList';
import { QuizAdminList } from './quiz/QuizAdminList';

type AdminView = 'wines' | 'quiz';

interface AdminPanelProps {
  onExit: () => void;
}

export function AdminPanel({ onExit }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<AdminView>('wines');

  return (
    <AdminLayout onViewChange={setCurrentView} onExit={onExit}>
      {currentView === 'wines' && <WineAdminList />}
      {currentView === 'quiz' && <QuizAdminList />}
    </AdminLayout>
  );
}