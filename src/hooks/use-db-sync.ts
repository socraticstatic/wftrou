import { useEffect } from 'react';
import { events } from '@/lib/events';
import { db } from '@/lib/db';

export function useDbSync() {
  useEffect(() => {
    const handleWineCreated = async () => {
      await db.initializeIfEmpty();
      events.emit('db:changed');
    };

    const handleWineUpdated = () => {
      events.emit('db:changed');
    };

    const handleWineDeleted = () => {
      events.emit('db:changed');
    };

    const handleQuizUpdated = () => {
      events.emit('db:changed');
    };

    // Subscribe to events
    events.on('wine:created', handleWineCreated);
    events.on('wine:updated', handleWineUpdated);
    events.on('wine:deleted', handleWineDeleted);
    events.on('quiz:updated', handleQuizUpdated);

    // Cleanup subscriptions
    return () => {
      events.off('wine:created', handleWineCreated);
      events.off('wine:updated', handleWineUpdated);
      events.off('wine:deleted', handleWineDeleted);
      events.off('quiz:updated', handleQuizUpdated);
    };
  }, []);
}