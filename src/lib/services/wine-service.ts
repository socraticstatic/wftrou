import { db, type Wine } from '@/lib/db';
import { events } from '@/lib/events';

export interface CreateWineInput extends Omit<Wine, 'id' | 'icon'> {
  name: string;
  type: 'red' | 'white' | 'sparkling' | 'dessert';
  region: string;
  country: string;
  characteristics: string[];
  pairings: string[];
  description: string;
}

export interface WineOperationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export class WineService {
  /**
   * Creates a new wine entry in the database
   * @param wine The wine data to create
   * @returns A promise containing the operation result
   */
  static async createWine(wine: CreateWineInput): Promise<WineOperationResult> {
    try {
      // Validate required fields
      if (!wine.name?.trim()) {
        return { success: false, error: 'Wine name is required' };
      }
      if (!wine.type) {
        return { success: false, error: 'Wine type is required' };
      }
      if (!wine.region?.trim()) {
        return { success: false, error: 'Wine region is required' };
      }
      if (!wine.country?.trim()) {
        return { success: false, error: 'Wine country is required' };
      }
      if (!wine.characteristics?.length) {
        return { success: false, error: 'At least one characteristic is required' };
      }
      if (!wine.pairings?.length) {
        return { success: false, error: 'At least one pairing is required' };
      }
      if (!wine.description?.trim()) {
        return { success: false, error: 'Wine description is required' };
      }

      // Ensure database is initialized
      await db.initializeIfEmpty();

      // Create wine with generated ID and icon
      const id = await db.wines.add({
        ...wine,
        id: crypto.randomUUID(),
        icon: `${wine.type}Wine`
      });

      // Emit creation event
      events.emit('wine:created', id);

      return {
        success: true,
        data: { id }
      };
    } catch (error) {
      console.error('Error creating wine:', error);
      
      // Handle specific error cases
      if (error.name === 'DatabaseClosedError') {
        try {
          await db.open();
          return this.createWine(wine);
        } catch (reopenError) {
          return {
            success: false,
            error: 'Failed to access database. Please try again.'
          };
        }
      }

      // Generic error handling
      return {
        success: false,
        error: 'Failed to create wine. Please try again.'
      };
    }
  }

  /**
   * Validates a wine object against required fields and constraints
   * @param wine The wine object to validate
   * @returns An array of validation error messages, empty if valid
   */
  static validateWine(wine: Partial<Wine>): string[] {
    const errors: string[] = [];

    // Required fields
    if (!wine.name?.trim()) errors.push('Name is required');
    if (!wine.type) errors.push('Type is required');
    if (!wine.region?.trim()) errors.push('Region is required');
    if (!wine.country?.trim()) errors.push('Country is required');
    
    // Array fields
    if (!Array.isArray(wine.characteristics) || wine.characteristics.length === 0) {
      errors.push('At least one characteristic is required');
    }
    if (!Array.isArray(wine.pairings) || wine.pairings.length === 0) {
      errors.push('At least one pairing is required');
    }
    
    // Description
    if (!wine.description?.trim()) errors.push('Description is required');

    // Type validation
    if (wine.type && !['red', 'white', 'sparkling', 'dessert'].includes(wine.type)) {
      errors.push('Invalid wine type');
    }

    return errors;
  }
}