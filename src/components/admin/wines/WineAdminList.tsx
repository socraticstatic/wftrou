import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { events } from '@/lib/events';
import { WineList } from '@/components/admin/wine-list';
import { WineForm } from '@/components/admin/wine-form';
import { ImportDialog } from '@/components/admin/wine-import-dialog';

export function WineAdminList() {
  const [showImport, setShowImport] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [page, setPage] = useState(1);
  const [forceUpdate, setForceUpdate] = useState(0);
  const pageSize = 20;
  
  // Force refresh when database changes
  useEffect(() => {
    const handleDbChanged = () => {
      setForceUpdate(prev => prev + 1);
    };

    events.on('db:changed', handleDbChanged);
    return () => {
      events.off('db:changed', handleDbChanged);
    };
  }, []);
  
  const result = useLiveQuery(
    () => db.getAllWines(page, pageSize),
    [page, forceUpdate]
  );

  const wines = result?.wines || [];
  const total = result?.total || 0;

  const handleAddWine = async (data: any) => {
    try {
      await db.addWine(data);
      setShowAddForm(false);
      events.emit('db:changed');
    } catch (error) {
      console.error('Failed to add wine:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wine Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddForm(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Wine
          </Button>
          <Button
            onClick={() => setShowImport(true)}
            variant="outline"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Wines
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-rose-100">
          <WineForm onSubmit={handleAddWine} />
        </div>
      )}

      <WineList 
        wines={wines} 
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      <ImportDialog
        open={showImport}
        onOpenChange={setShowImport}
      />
    </div>
  );
}