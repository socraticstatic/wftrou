import { useEffect, useState, useCallback } from 'react';

export function useAdminShortcut() {
  const [showAdmin, setShowAdmin] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Mac: Command (metaKey) + Option (altKey) + A
    // Windows/Linux: Control (ctrlKey) + Alt (altKey) + A
    if (
      ((event.metaKey || event.ctrlKey) && event.altKey && event.key.toLowerCase() === 'a') ||
      (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a')
    ) {
      event.preventDefault();
      setShowAdmin(prev => !prev);
    }

    // Handle Escape key to exit admin panel
    if (event.key === 'Escape' && showAdmin) {
      setShowAdmin(false);
    }
  }, [showAdmin]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Add a class to the body when admin panel is shown
  useEffect(() => {
    if (showAdmin) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [showAdmin]);

  return { showAdmin, setShowAdmin };
}