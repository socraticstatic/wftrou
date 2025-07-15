import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { QuizManager } from '@/components/admin/quiz-manager';
import { ImportDialog } from '@/components/admin/import-dialog';

export function QuizAdminList() {
  const [showImport, setShowImport] = useState(false);
  
  const questions = useLiveQuery(
    () => db.quizQuestions.orderBy('order').toArray(),
    []
  );

  if (!questions) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quiz Management</h2>
        <Button
          onClick={() => setShowImport(true)}
          variant="outline"
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Import Questions
        </Button>
      </div>

      <QuizManager />

      <ImportDialog
        open={showImport}
        onOpenChange={setShowImport}
      />
    </div>
  );
}