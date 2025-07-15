import { useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, AlertCircle, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const downloadTemplate = () => {
    const templateRows = [
      // Headers
      ['name', 'type', 'region', 'country', 'style', 'flavor', 'pairing', 'characteristics', 'pairings', 'description'].join(','),
      
      // Example Red Wine
      [
        '"Château Margaux"',
        '"red"',
        '"Bordeaux"',
        '"France"',
        '"Bold Red Wine"',
        '"Rich & Complex"',
        '"Red Meats"',
        '"full-bodied, black fruits, complex, tannic"',
        '"red meat, aged cheese"',
        '"A prestigious Bordeaux with remarkable depth and firm tannins"'
      ].join(','),

      // Example White Wine
      [
        '"Chablis Premier Cru"',
        '"white"',
        '"Burgundy"',
        '"France"',
        '"Crisp White Wine"',
        '"Mineral & Crisp"',
        '"Fresh Seafood"',
        '"crisp, mineral, elegant, citrus"',
        '"seafood, light dishes"',
        '"A mineral-driven Chablis with seafood affinity"'
      ].join(','),

      // Example Sparkling Wine
      [
        '"Vintage Champagne"',
        '"sparkling"',
        '"Champagne"',
        '"France"',
        '"Elegant Sparkling Wine"',
        '"Refined & Elegant"',
        '"Fine Cheeses"',
        '"elegant, complex, mineral"',
        '"fine cheese, appetizers"',
        '"A refined Champagne with elegant complexity"'
      ].join(','),

      // Example Dessert Wine
      [
        '"Château d\'Yquem"',
        '"dessert"',
        '"Sauternes"',
        '"France"',
        '"Sweet Dessert Wine"',
        '"Sweet & Fruity"',
        '"Elegant Desserts"',
        '"sweet, rich, honey"',
        '"elegant desserts, blue cheese"',
        '"A classic Sauternes with honeyed richness"'
      ].join(','),

      // Valid Options Reference
      ['""', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['"VALID OPTIONS FOR EACH COLUMN:"', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['"type: red, white, sparkling, or dessert"', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['"style (choose one):"', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Bold Red Wine', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Crisp White Wine', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Elegant Sparkling Wine', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Sweet Dessert Wine', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['"flavor (choose one):"', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Rich & Complex', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Fresh & Light', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Refined & Elegant', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Sweet & Fruity', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Bold & Spicy', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Mineral & Crisp', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Floral & Aromatic', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Smooth & Velvety', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['"pairing (choose one):"', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Red Meats', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Grilled Foods', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Fresh Seafood', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Light Salads', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Fine Cheeses', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Aged Cheeses', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Elegant Desserts', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(','),
      ['- Fresh Fruits', '""', '""', '""', '""', '""', '""', '""', '""', '""'].join(',')
    ].join('\n');

    const blob = new Blob([templateRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wine-import-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (!files[0].name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      setFile(files[0]);
      setError(null);
      setProgress(null);
    }
  };

  const validateWine = (wine: any) => {
    const errors: string[] = [];
    const validTypes = ['red', 'white', 'sparkling', 'dessert'];
    const validStyles = ['Bold Red Wine', 'Crisp White Wine', 'Elegant Sparkling Wine', 'Sweet Dessert Wine'];
    const validFlavors = [
      'Rich & Complex', 'Fresh & Light', 'Refined & Elegant', 'Sweet & Fruity',
      'Bold & Spicy', 'Mineral & Crisp', 'Floral & Aromatic', 'Smooth & Velvety'
    ];
    const validPairings = [
      'Red Meats', 'Grilled Foods', 'Fresh Seafood', 'Light Salads',
      'Fine Cheeses', 'Aged Cheeses', 'Elegant Desserts', 'Fresh Fruits'
    ];

    if (!wine.name?.trim()) errors.push('Name is required');
    if (!validTypes.includes(wine.type?.trim().toLowerCase())) {
      errors.push(`Type must be one of: ${validTypes.join(', ')}`);
    }
    if (!wine.region?.trim()) errors.push('Region is required');
    if (!wine.country?.trim()) errors.push('Country is required');
    if (!validStyles.includes(wine.style?.trim())) {
      errors.push(`Style must be one of: ${validStyles.join(', ')}`);
    }
    if (!validFlavors.includes(wine.flavor?.trim())) {
      errors.push(`Flavor must be one of: ${validFlavors.join(', ')}`);
    }
    if (!validPairings.includes(wine.pairing?.trim())) {
      errors.push(`Pairing must be one of: ${validPairings.join(', ')}`);
    }
    if (!wine.characteristics?.trim()) errors.push('Characteristics are required');
    if (!wine.pairings?.trim()) errors.push('Pairings are required');
    if (!wine.description?.trim()) errors.push('Description is required');

    return errors;
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    setError(null);
    setProgress({ current: 0, total: 0 });

    const wines: any[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: (results) => {
        const row = results.data;
        if (row.name?.trim() && row.type?.trim()) {
          const errors = validateWine(row);
          if (errors.length === 0) {
            wines.push({
              id: crypto.randomUUID(),
              name: row.name.trim(),
              type: row.type.trim().toLowerCase(),
              region: row.region.trim(),
              country: row.country.trim(),
              characteristics: row.characteristics.split(',').map((s: string) => s.trim()),
              pairings: row.pairings.split(',').map((s: string) => s.trim()),
              description: row.description.trim(),
              icon: `${row.type.trim().toLowerCase()}Wine`,
              quiz_options: [row.style.trim(), row.flavor.trim(), row.pairing.trim()]
            });
          } else {
            console.warn(`Validation errors for ${row.name}:`, errors);
          }
        }
      },
      complete: async () => {
        try {
          if (wines.length > 0) {
            await db.bulkAddWines(wines);
            toast({
              title: 'Success',
              description: `${wines.length} wines imported successfully`,
            });
            onOpenChange(false);
          } else {
            setError('No valid wines found in the CSV file');
          }
        } catch (error) {
          console.error('Import error:', error);
          setError(error instanceof Error ? error.message : 'Failed to import wines');
        } finally {
          setImporting(false);
        }
      },
      error: (error) => {
        setError('Failed to parse CSV file: ' + error.message);
        setImporting(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Wines</DialogTitle>
          <DialogDescription>
            Download the template, fill it out, and upload it back to import your wines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>

          <div className="space-y-2">
            <Label htmlFor="file">Upload CSV File</Label>
            <Input
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {progress && (
            <div className="text-sm text-gray-500">
              Processing wines...
            </div>
          )}

          <Button
            onClick={handleImport}
            disabled={!file || importing}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {importing ? 'Importing...' : 'Import Wines'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}