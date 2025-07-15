import { useState } from 'react';
import Papa from 'papaparse';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      handleImport(files[0]);
    }
  };

  const handleImport = (file: File) => {
    Papa.parse(file, {
      complete: async (results) => {
        try {
          const questions = results.data
            .filter((row: any) => row.question && row.options)
            .map((row: any) => ({
              text: row.question,
              enabled: true,
            }));

          await db.importQuestions(questions);
          
          toast({
            title: 'Success',
            description: 'Questions imported successfully',
          });
          
          onOpenChange(false);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to import questions',
            variant: 'destructive',
          });
        }
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Questions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">CSV File</Label>
            <div className="flex gap-2">
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>CSV should have the following columns:</p>
            <ul className="list-disc list-inside mt-2">
              <li>question (text)</li>
              <li>options (comma-separated)</li>
              <li>taste_profiles (JSON array)</li>
            </ul>
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Upload className="w-4 h-4" />
              <span>{file.name}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}