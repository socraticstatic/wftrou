import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { quizQuestions } from '@/lib/quiz-data';
import { db } from '@/lib/db';

interface QuizProps {
  onComplete: (recommendations: string[]) => void;
  onClose: () => void;
}

export function WineQuiz({ onComplete, onClose }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
    
  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    
    if (currentQuestion < quizQuestions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestion(curr => curr + 1);
    } else {
      try {
        const tasteProfile = newAnswers.flatMap((ans, index) => {
          const question = quizQuestions[index];
          return question.tasteProfile[ans] || [];
        });
        
        const uniqueProfile = [...new Set(tasteProfile)];
        
        // Verify database connection before proceeding
        const count = await db.wines.count();
        if (count === 0) {
          throw new Error('Wine database is not initialized');
        }
        
        onComplete(uniqueProfile);
      } catch (err) {
        console.error('Quiz completion error:', err);
        setError('Failed to process quiz results. Please try again.');
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setError(null);
  };

  const question = quizQuestions[currentQuestion];

  return (
    <div className="fixed inset-0 isolate z-50">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
        style={{ zIndex: 1 }}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-6 bg-white dark:bg-gray-800/90 space-y-6 shadow-xl relative border-rose-100 dark:border-rose-800">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-rose-200">
                Find Your Perfect Wine
              </h2>
              <Button 
                onClick={onClose}
                className="bg-rose-600 hover:bg-rose-700 text-white h-10 px-4"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500 dark:text-rose-400">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  className="text-rose-600 hover:text-rose-700 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>

              {error ? (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 rounded-lg">
                  {error}
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="mt-2 w-full dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl text-gray-800 dark:text-rose-200">{question.question}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        className="h-auto py-4 px-6 text-left justify-between 
                                hover:bg-rose-50 hover:text-rose-600 
                                dark:border-rose-800 dark:text-rose-300
                                dark:hover:bg-rose-900/30 dark:hover:text-rose-200
                                mobile-tap-target flex items-center"
                        onClick={() => handleAnswer(option)}
                      >
                        <span className="flex-1">{option}</span>
                        <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}