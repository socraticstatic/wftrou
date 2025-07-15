import { useState } from 'react';
import { Wine, GlassWater, Sparkles, Candy, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { db, type Wine as WineType } from '@/lib/db';
import { events } from '@/lib/events';

const iconComponents = {
  redWine: Wine,
  whiteWine: GlassWater,
  sparklingWine: Sparkles,
  dessertWine: Candy,
};

interface WineListProps {
  wines: WineType[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function WineList({ wines, total, page, pageSize, onPageChange }: WineListProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<WineType>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteWineId, setDeleteWineId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredWines = wines.filter(wine => 
    wine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wine.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wine.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(total / pageSize);

  const handleEdit = (wine: WineType) => {
    setEditingId(wine.id);
    setEditData({
      ...wine,
      characteristics: wine.characteristics.join(', '),
      pairings: wine.pairings.join(', '),
    });
  };

  const handleSave = async (id: string) => {
    try {
      const updatedWine = {
        ...editData,
        characteristics: (editData.characteristics as string).split(',').map(s => s.trim()),
        pairings: (editData.pairings as string).split(',').map(s => s.trim()),
      };

      await db.updateWine(id, updatedWine);
      setEditingId(null);
      events.emit('wine:updated', { id, ...updatedWine });
      
      toast({
        title: 'Success',
        description: 'Wine updated successfully',
      });
    } catch (error) {
      console.error('Failed to update wine:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wine',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteWineId) return;
    
    setIsDeleting(true);
    try {
      await db.deleteWine(deleteWineId);
      events.emit('wine:deleted', deleteWineId);
      
      // If we're on a page with only one item and it's not the first page,
      // go back one page
      if (filteredWines.length === 1 && page > 1) {
        onPageChange(page - 1);
      }
      
      toast({
        title: 'Success',
        description: 'Wine deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete wine:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete wine',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteWineId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold">Wine List ({total} total)</h3>
        <Input
          type="search"
          placeholder="Search wines..."
          className="w-full sm:w-auto sm:max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid gap-4">
        {filteredWines.map((wine) => {
          const IconComponent = iconComponents[wine.icon as keyof typeof iconComponents];
          const isEditing = editingId === wine.id;

          return (
            <Card key={wine.id} className="p-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-rose-50 rounded-lg text-rose-600">
                  {IconComponent && <IconComponent className="w-8 h-8" />}
                </div>

                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={editData.name}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Wine name"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          value={editData.region}
                          onChange={e => setEditData({ ...editData, region: e.target.value })}
                          placeholder="Region"
                        />
                        <Input
                          value={editData.country}
                          onChange={e => setEditData({ ...editData, country: e.target.value })}
                          placeholder="Country"
                        />
                      </div>
                      <Input
                        value={editData.characteristics}
                        onChange={e => setEditData({ ...editData, characteristics: e.target.value })}
                        placeholder="Characteristics (comma-separated)"
                      />
                      <Input
                        value={editData.pairings}
                        onChange={e => setEditData({ ...editData, pairings: e.target.value })}
                        placeholder="Pairings (comma-separated)"
                      />
                      <textarea
                        value={editData.description}
                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                        placeholder="Description"
                        className="w-full p-2 border rounded-md"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleSave(wine.id)}>Save</Button>
                        <Button variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold">{wine.name}</h3>
                        <p className="text-sm text-gray-600">
                          {wine.region}, {wine.country}
                        </p>
                      </div>
                      <p className="text-sm">{wine.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {wine.characteristics.map((char) => (
                          <span
                            key={char}
                            className="px-2 py-1 text-xs bg-rose-50 text-rose-600 rounded-full"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleEdit(wine)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setDeleteWineId(wine.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteWineId} onOpenChange={() => setDeleteWineId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this wine? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}