import { useState, useEffect } from 'react';
import { Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminHint() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem('adminHintDismissed');
    if (dismissed) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('adminHintDismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 max-w-xs"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-rose-100 dark:border-rose-800">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              ×
            </button>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Command className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-sm">
                <p className="text-gray-900 dark:text-rose-200 font-medium">
                  Admin Access
                </p>
                <p className="text-gray-600 dark:text-rose-300 text-xs mt-1">
                  Press{' '}
                  {isMac ? (
                    <>
                      <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-xs">⌘</kbd>
                      {' + '}
                      <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-xs">⌥</kbd>
                    </>
                  ) : (
                    <>
                      <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-xs">Ctrl</kbd>
                      {' + '}
                      <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-xs">Alt</kbd>
                    </>
                  )}
                  {' + '}
                  <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-xs">A</kbd>
                  {' '}for admin access
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}