// Standard taste profiles that connect wines to quiz results
export const TASTE_PROFILES = {
  types: ['red', 'white', 'sparkling', 'dessert'],
  characteristics: [
    // Body
    'light',
    'medium-bodied',
    'full-bodied',
    
    // Primary Characteristics
    'dry',
    'sweet',
    'crisp',
    'rich',
    'fresh',
    'elegant',
    'complex',
    
    // Fruit Profiles
    'red fruits',
    'black fruits',
    'citrus',
    'tropical',
    'fruity',
    
    // Additional Characteristics
    'mineral',
    'floral',
    'spicy',
    'earthy',
    'tannic',
    'toasted',
    'oak',
    'vanilla',
    'tobacco'
  ],
  pairings: [
    // Meats
    'red meat',
    'poultry',
    'fish',
    'seafood',
    
    // Cooking Methods
    'grilled',
    'roasted',
    'smoked',
    
    // Dishes
    'pasta',
    'spicy food',
    'light dishes',
    'appetizers',
    
    // Vegetables & Salads
    'vegetables',
    'salads',
    
    // Cheese
    'cheese',
    'aged cheese',
    'soft cheese',
    'blue cheese',
    
    // Sweets
    'desserts',
    'fruit desserts',
    'chocolate',
    
    // Other
    'fruits',
    'nuts'
  ]
} as const;