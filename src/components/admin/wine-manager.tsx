import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db, type Wine } from '@/lib/db';
import { WineForm } from './wine-form';
import { WineList } from './wine-list';
import { ImportDialog } from './wine-import-dialog';

export function WineManager() {
  const { toast } = useToast();
  const [showImport, setShowImport] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  
  const result = useLiveQuery(
    () => db.getAllWines(page, pageSize),
    [page]
  );

  const wines = result?.wines || [];
  const total = result?.total || 0;

  const handleSubmit = async (data: Omit<Wine, 'id' | 'icon'>) => {
    try {
      await db.wines.add({
        ...data,
        id: crypto.randomUUID(),
        icon: `${data.type}Wine`,
      });

      toast({
        title: 'Success',
        description: 'Wine added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add wine',
        variant: 'destructive',
      });
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/wine-import-template.csv';
    link.download = 'wine-import-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // Ensure database is initialized
    db.initializeIfEmpty();
  }, []);

  if (!result) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wine Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
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

      <div className="bg-white p-6 rounded-lg border border-rose-100">
        <WineForm onSubmit={handleSubmit} />
      </div>

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