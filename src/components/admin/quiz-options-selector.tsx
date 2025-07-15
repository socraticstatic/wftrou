import { useLiveQuery } from 'dexie-react-hooks';
import { Check, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/db';

interface QuizOptionsSelectorProps {
  selectedType: string;
  selectedCharacteristics: string[];
  onChange: (characteristics: string[]) => void;
}

export function QuizOptionsSelector({ 
  selectedType,
  selectedCharacteristics,
  onChange
}: QuizOptionsSelectorProps) {
  const questions = useLiveQuery(
    () => db.quizQuestions
      .where('enabled')
      .equals(1)
      .toArray()
      .then(async questions => {
        const sortedQuestions = questions.sort((a, b) => a.order - b.order);
        const questionsWithOptions = await Promise.all(
          sortedQuestions.map(async question => ({
            ...question,
            options: await db.quizOptions
              .where('questionId')
              .equals(question.id)
              .and(opt => opt.enabled)
              .sortBy('order')
          }))
        );
        return questionsWithOptions;
      }),
    []
  );

  if (!questions?.length) return null;

  const handleOptionSelect = (questionId: string, selectedOption: { text: string, tasteProfile: string[] }) => {
    // Get all characteristics from currently selected options in other questions
    const otherQuestionsCharacteristics = questions
      .filter(q => q.id !== questionId)
      .flatMap(q => {
        const selectedOpt = q.options.find(opt => 
          opt.tasteProfile.every(profile => 
            profile === selectedType || selectedCharacteristics.includes(profile)
          )
        );
        return selectedOpt?.tasteProfile || [];
      });

    // Create new set starting with characteristics from other questions
    const newCharacteristics = new Set(
      otherQuestionsCharacteristics.filter(char => char !== selectedType)
    );

    // Add characteristics from newly selected option
    selectedOption.tasteProfile
      .filter(profile => profile !== selectedType)
      .forEach(profile => newCharacteristics.add(profile));

    onChange(Array.from(newCharacteristics));
  };

  // Check which questions have no selection
  const questionsWithoutSelection = questions.filter(q => {
    const questionOptions = q.options.filter(opt => opt.tasteProfile.includes(selectedType));
    return questionOptions.length > 0 && !questionOptions.some(opt => 
      opt.tasteProfile.every(profile => 
        profile === selectedType || selectedCharacteristics.includes(profile)
      )
    );
  });

  return (
    <div className="space-y-6">
      {questionsWithoutSelection.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Please select one option for each question to connect this wine with quiz results
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {questions.map((question, index) => {
          const relevantOptions = question.options.filter(opt => 
            opt.tasteProfile.includes(selectedType)
          );

          if (relevantOptions.length === 0) return null;

          const selectedOption = relevantOptions.find(opt =>
            opt.tasteProfile.every(profile =>
              profile === selectedType || selectedCharacteristics.includes(profile)
            )
          );

          return (
            <Card key={question.id} className="overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-900">
                      Question {index + 1}
                    </h4>
                    <p className="text-sm text-gray-600">{question.text}</p>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${selectedOption 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-rose-50 text-rose-600'
                    }
                  `}>
                    {selectedOption ? '✓ Selected' : 'Selection Required'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relevantOptions.map(option => {
                    const isSelected = option.tasteProfile.every(profile =>
                      profile === selectedType || selectedCharacteristics.includes(profile)
                    );

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(question.id, option)}
                        className={`
                          relative p-4 rounded-lg text-left
                          transition-all duration-200
                          ${isSelected 
                            ? 'bg-rose-50 text-rose-900 ring-2 ring-rose-500 ring-offset-2' 
                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex-shrink-0
                            transition-colors duration-200
                            ${isSelected
                              ? 'bg-rose-600 border-rose-600'
                              : 'border-gray-300'
                            }
                            flex items-center justify-center
                          `}>
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{option.text}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {option.tasteProfile
                                .filter(t => t !== selectedType)
                                .join(', ')}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}