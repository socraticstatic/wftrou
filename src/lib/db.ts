import Dexie, { type Table } from 'dexie';
import { wines as initialWines } from './wine-data';
import { quizQuestions as initialQuizQuestions } from './quiz-data';
import { events } from './events';

export interface Wine {
  id: string;
  name: string;
  type: 'red' | 'white' | 'sparkling' | 'dessert';
  region: string;
  country: string;
  characteristics: string[];
  pairings: string[];
  description: string;
  icon: string;
  favorite?: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  enabled: boolean;
  order: number;
}

export interface QuizOption {
  id: string;
  questionId: string;
  text: string;
  tasteProfile: string[];
  enabled: boolean;
  order: number;
}

export interface UserPreferences {
  id?: number;
  darkMode: boolean;
  favoriteWines: string[];
  searchHistory: string[];
  lastQuizResults?: string[];
}

class WineDatabase extends Dexie {
  wines!: Table<Wine>;
  quizQuestions!: Table<QuizQuestion>;
  quizOptions!: Table<QuizOption>;
  userPreferences!: Table<UserPreferences>;
  private initialized: boolean = false;

  constructor() {
    super('WineDatabase');
    
    this.version(1).stores({
      wines: 'id, type, name, region, country, favorite, *characteristics, *pairings',
      quizQuestions: 'id, enabled, order',
      quizOptions: 'id, questionId, enabled, order, *tasteProfile',
      userPreferences: '++id, darkMode'
    });

    // Add hooks for database modifications
    this.wines.hook('creating', (primKey, obj) => {
      obj.icon = `${obj.type}Wine`;
      return obj;
    });

    this.wines.hook('updating', (modifications, primKey, obj) => {
      if (modifications.type) {
        modifications.icon = `${modifications.type}Wine`;
      }
      return modifications;
    });
  }

  async reset() {
    try {
      await this.delete();
      const newDb = new WineDatabase();
      await newDb.open();
      return newDb;
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  }

  async initializeIfEmpty() {
    if (this.initialized) return true;

    try {
      const wineCount = await this.wines.count();
      const questionCount = await this.quizQuestions.count();
      const prefsCount = await this.userPreferences.count();
      
      await this.transaction('rw', [this.wines, this.quizQuestions, this.quizOptions, this.userPreferences], async () => {
        if (wineCount === 0) {
          await Promise.all(initialWines.map(wine => this.wines.put(wine)));
        }

        if (questionCount === 0) {
          await this.initializeQuizData();
        }

        if (prefsCount === 0) {
          await this.userPreferences.add({
            darkMode: false,
            favoriteWines: [],
            searchHistory: []
          });
        }
      });
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      if (error.name === 'VersionError' || error.name === 'DatabaseClosedError') {
        const newDb = await this.reset();
        return newDb.initializeIfEmpty();
      }
      return false;
    }
  }

  async getAllWines(page: number = 1, pageSize: number = 20) {
    try {
      await this.initializeIfEmpty();
      const offset = (page - 1) * pageSize;
      const total = await this.wines.count();
      
      const wines = await this.wines
        .orderBy('name')
        .offset(offset)
        .limit(pageSize)
        .toArray();

      return { wines, total };
    } catch (error) {
      console.error('Error fetching wines:', error);
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.getAllWines(page, pageSize);
      }
      return { wines: [], total: 0 };
    }
  }

  async searchWines(query: string, page: number = 1, pageSize: number = 20) {
    try {
      await this.initializeIfEmpty();
      if (!query.trim()) return { wines: [], total: 0 };
      
      const searchTerms = query.toLowerCase().split(' ');
      
      const collection = this.wines.filter(wine => {
        const searchableText = [
          wine.name,
          wine.type,
          wine.region,
          wine.country,
          wine.description,
          ...wine.characteristics,
          ...wine.pairings
        ].join(' ').toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      });

      const total = await collection.count();
      const wines = await collection
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      return { wines, total };
    } catch (error) {
      console.error('Error searching wines:', error);
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.searchWines(query, page, pageSize);
      }
      return { wines: [], total: 0 };
    }
  }

  async getRecommendations(characteristics: string[], page: number = 1, pageSize: number = 20) {
    try {
      await this.initializeIfEmpty();
      if (!characteristics.length) return { wines: [], total: 0 };
      
      const collection = this.wines.filter(wine => {
        const matchingCharacteristics = characteristics.filter(char =>
          wine.characteristics.includes(char)
        );
        
        return matchingCharacteristics.length >= 2;
      });

      const total = await collection.count();
      const wines = await collection
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      return { wines, total };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.getRecommendations(characteristics, page, pageSize);
      }
      return { wines: [], total: 0 };
    }
  }

  async addWine(wine: Omit<Wine, 'id' | 'icon'>) {
    try {
      await this.initializeIfEmpty();
      const id = await this.wines.add({
        ...wine,
        id: crypto.randomUUID(),
        icon: `${wine.type}Wine`
      });
      events.emit('wine:created', id);
      return id;
    } catch (error) {
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.addWine(wine);
      }
      throw error;
    }
  }

  async updateWine(id: string, wine: Partial<Wine>) {
    try {
      await this.initializeIfEmpty();
      await this.wines.update(id, wine);
      events.emit('wine:updated', { id, ...wine });
    } catch (error) {
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.updateWine(id, wine);
      }
      throw error;
    }
  }

  async deleteWine(id: string) {
    try {
      await this.initializeIfEmpty();
      await this.wines.delete(id);
      events.emit('wine:deleted', id);
    } catch (error) {
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.deleteWine(id);
      }
      throw error;
    }
  }

  async bulkAddWines(wines: Wine[]) {
    try {
      await this.initializeIfEmpty();
      await Promise.all(wines.map(wine => this.wines.put(wine)));
      events.emit('db:changed');
    } catch (error) {
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.bulkAddWines(wines);
      }
      throw error;
    }
  }

  private async initializeQuizData() {
    await this.transaction('rw', this.quizQuestions, this.quizOptions, async () => {
      await Promise.all([
        this.quizQuestions.clear(),
        this.quizOptions.clear()
      ]);

      for (const [qIndex, q] of initialQuizQuestions.entries()) {
        const questionId = crypto.randomUUID();
        await this.quizQuestions.add({
          id: questionId,
          text: q.question,
          enabled: true,
          order: qIndex
        });

        const options = Object.entries(q.tasteProfile).map(([text, profile], oIndex) => ({
          id: crypto.randomUUID(),
          questionId,
          text,
          tasteProfile: profile,
          enabled: true,
          order: oIndex
        }));

        await this.quizOptions.bulkAdd(options);
      }
    });
  }

  async updateQuestionOrder(updates: { id: string, order: number }[]) {
    try {
      await this.initializeIfEmpty();
      await this.transaction('rw', this.quizQuestions, async () => {
        for (const update of updates) {
          await this.quizQuestions.update(update.id, { order: update.order });
        }
      });
      events.emit('quiz:updated');
    } catch (error) {
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.updateQuestionOrder(updates);
      }
      throw error;
    }
  }

  async updateOptionOrder(updates: { id: string, order: number }[]) {
    try {
      await this.initializeIfEmpty();
      await this.transaction('rw', this.quizOptions, async () => {
        for (const update of updates) {
          await this.quizOptions.update(update.id, { order: update.order });
        }
      });
      events.emit('quiz:updated');
    } catch (error) {
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.updateOptionOrder(updates);
      }
      throw error;
    }
  }

  async toggleQuestionEnabled(id: string, enabled: boolean) {
    try {
      await this.initializeIfEmpty();
      await this.quizQuestions.update(id, { enabled });
      events.emit('quiz:updated');
    } catch (error) {
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.toggleQuestionEnabled(id, enabled);
      }
      throw error;
    }
  }

  async toggleOptionEnabled(id: string, enabled: boolean) {
    try {
      await this.initializeIfEmpty();
      await this.quizOptions.update(id, { enabled });
      events.emit('quiz:updated');
    } catch (error) {
      if (error.name === 'DatabaseClosedError') {
        await this.open();
        return this.toggleOptionEnabled(id, enabled);
      }
      throw error;
    }
  }
}

export const db = new WineDatabase();