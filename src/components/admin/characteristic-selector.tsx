import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TASTE_PROFILES } from '@/lib/constants';

// Define contradictory characteristics and pairings
const CONTRADICTORY_PAIRS = {
  characteristics: [
    ['light', 'full-bodied', 'medium-bodied'],
    ['dry', 'sweet'],
    ['crisp', 'rich'],
    ['fresh', 'complex'],
    ['red fruits', 'black fruits', 'citrus', 'tropical'],
  ],
  pairings: [
    // Meat contradictions
    ['red meat', 'light dishes'],
    ['seafood', 'red meat'],
    
    // Cooking style contradictions
    ['grilled', 'light dishes'],
    ['smoked', 'light dishes'],
    ['roasted', 'light dishes'],
    
    // Dish type contradictions
    ['spicy food', 'light dishes'],
    ['desserts', 'red meat'],
    ['desserts', 'seafood'],
    ['desserts', 'spicy food'],
    
    // Cheese contradictions
    ['blue cheese', 'light dishes'],
    ['aged cheese', 'light dishes'],
    
    // Light vs Heavy contradictions
    ['appetizers', 'red meat'],
    ['salads', 'red meat'],
    ['vegetables', 'red meat'],
  ]
};

interface CharacteristicSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  type: 'characteristics' | 'pairings';
  label: string;
  selectedWineType?: string;
}

export function CharacteristicSelector({ 
  value, 
  onChange, 
  type, 
  label,
  selectedWineType 
}: CharacteristicSelectorProps) {
  const [open, setOpen] = useState(false);
  const options = TASTE_PROFILES[type];

  // Check if an option is contradictory with currently selected values
  const isContradictory = (option: string) => {
    const contradictions = CONTRADICTORY_PAIRS[type] || [];
    return contradictions.some(group => {
      const selectedFromGroup = value.filter(v => group.includes(v));
      return selectedFromGroup.length > 0 && group.includes(option) && !value.includes(option);
    });
  };

  // Get the conflicting selection for an option
  const getConflictingSelection = (option: string) => {
    const contradictions = CONTRADICTORY_PAIRS[type] || [];
    const conflictingGroup = contradictions.find(group => {
      const selectedFromGroup = value.filter(v => group.includes(v));
      return selectedFromGroup.length > 0 && group.includes(option) && !value.includes(option);
    });
    
    if (conflictingGroup) {
      return value.find(v => conflictingGroup.includes(v));
    }
    return null;
  };

  // Filter relevant options based on wine type
  const relevantOptions = options.filter(option => {
    if (!selectedWineType) return true;
    if (type === 'characteristics') {
      // Show characteristics that make sense for this type
      return true; // All characteristics can apply to any wine type
    }
    return true; // All pairings can apply to any wine type
  });

  // Validate and clean initial value against allowed options
  useEffect(() => {
    const validValues = value.filter(v => relevantOptions.includes(v));
    if (validValues.length !== value.length) {
      onChange(validValues);
    }
  }, [value, relevantOptions, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start text-left font-normal h-auto min-h-[2.5rem] py-2"
        >
          {value.length === 0 ? (
            <span className="text-muted-foreground">Select {label.toLowerCase()}...</span>
          ) : (
            <span className="line-clamp-2">{value.join(', ')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {relevantOptions.map((option) => {
              const contradictory = isContradictory(option);
              const conflictingSelection = getConflictingSelection(option);
              
              return (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    if (!contradictory) {
                      const newValue = value.includes(option)
                        ? value.filter(v => v !== option)
                        : [...value, option];
                      onChange(newValue);
                    }
                  }}
                  className={contradictory ? 'opacity-50 cursor-not-allowed' : ''}
                  disabled={contradictory}
                >
                  <div className={`
                    w-4 h-4 rounded border mr-2 flex items-center justify-center
                    ${value.includes(option) ? 'bg-rose-600 border-rose-600' : 'border-gray-300'}
                  `}>
                    {value.includes(option) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                  {contradictory && conflictingSelection && (
                    <span className="ml-2 text-xs text-rose-500">
                      (Conflicts with: {conflictingSelection})
                    </span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}