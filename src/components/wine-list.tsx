import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Grape, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Wine } from '@/lib/wine-data';
import { iconComponents } from '@/lib/wine-data';

interface WineListItemProps {
  wine: Wine;
  isEditorsChoice?: boolean;
}

export const WineListItem = forwardRef<HTMLDivElement, WineListItemProps>(
  ({ wine, isEditorsChoice = false }, ref) => {
    const IconComponent = iconComponents[wine.icon];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="group"
        layout
      >
        <Card className={`
          p-4 sm:p-6 transition-all duration-300 
          ${isEditorsChoice 
            ? 'border-rose-300 dark:border-rose-600 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-rose-50 dark:from-gray-800 dark:to-rose-900/30' 
            : 'border-rose-100 dark:border-rose-800 hover:shadow-lg dark:bg-gray-800/50'
          }
        `}>
          <div className="flex gap-4 sm:gap-6">
            <div className={`
              flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-lg
              ${isEditorsChoice
                ? 'bg-rose-100 dark:bg-rose-800/50 text-rose-700 dark:text-rose-300'
                : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600'
              }
            `}>
              {IconComponent && (
                <IconComponent className="w-8 h-8 sm:w-12 sm:h-12" />
              )}
            </div>
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-rose-200">
                    {wine.name}
                  </h3>
                  {isEditorsChoice && (
                    <Badge 
                      variant="secondary" 
                      className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center gap-1"
                    >
                      <Award className="w-3 h-3" />
                      Editor's Choice
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-rose-300">
                  <MapPin className="w-4 h-4" />
                  {wine.region}, {wine.country}
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-rose-300">
                {wine.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {wine.characteristics.map((char) => (
                  <span
                    key={char}
                    className={`
                      px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm
                      ${isEditorsChoice
                        ? 'bg-rose-100 dark:bg-rose-800/50 text-rose-700 dark:text-rose-300'
                        : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300'
                      }
                    `}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Grape className="w-4 h-4 text-gray-400 dark:text-rose-400" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-rose-300">
                  Pairs well with: {wine.pairings.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
);