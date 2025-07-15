import mitt from 'mitt';

type Events = {
  'wine:created': string;
  'wine:updated': { id: string; [key: string]: any };
  'wine:deleted': string;
  'quiz:updated': void;
  'db:changed': void;
};

export const events = mitt<Events>();