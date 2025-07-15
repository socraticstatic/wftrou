import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import type { QuizOption } from '@/lib/db';

interface QuizPreviewProps {
  type: string;
  characteristics: string[];
  matchingOptions: QuizOption[];
}

export function QuizPreview({ type, characteristics, matchingOptions }: QuizPreviewProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-rose-50/50 border-rose-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600">
            <Check className="w-4 h-4" />
            <span className="font-medium">
              This wine will appear in quiz results for:
            </span>
          </div>
          <ul className="space-y-2 pl-6">
            {matchingOptions.map(option => (
              <li key={option.id} className="text-gray-600">
                <span className="font-medium">When user selects:</span> {option.text}
                <div className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Matching profiles:</span>{' '}
                  {option.tasteProfile
                    .filter(profile => type === profile || characteristics.includes(profile))
                    .join(', ')}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}