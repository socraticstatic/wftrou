import { Wine as WineIcon, GlassWater, Sparkles, Candy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Wine {
  id: string;
  name: string;
  type: 'red' | 'white' | 'sparkling' | 'dessert';
  region: string;
  country: string;
  characteristics: string[];
  pairings: string[];
  description: string;
  icon: keyof typeof iconComponents;
  favorite?: boolean;
}

export const iconComponents: Record<string, LucideIcon> = {
  redWine: WineIcon,
  whiteWine: GlassWater,
  sparklingWine: Sparkles,
  dessertWine: Candy
};

// All 33 wines must be included - keeping all original data intact
export const wines = [
  {
    id: '1',
    name: 'Château Latour 2015',
    type: 'red',
    region: 'Pauillac, Bordeaux',
    country: 'France',
    characteristics: ['full-bodied', 'black fruits', 'complex', 'tannic', 'cedar'],
    pairings: ['red meat', 'aged cheese', 'game'],
    description: 'First Growth Bordeaux with exceptional power and finesse, showing cassis and cedar notes',
    icon: 'redWine'
  },
  {
    id: '2',
    name: 'Penfolds Grange 2017',
    type: 'red',
    region: 'South Australia',
    country: 'Australia',
    characteristics: ['full-bodied', 'black fruits', 'complex', 'spicy', 'oak'],
    pairings: ['red meat', 'game', 'aged cheese'],
    description: 'Australia\'s most famous wine, showing intense dark fruit and spice complexity',
    icon: 'redWine'
  },
  {
    id: '3',
    name: 'Vega Sicilia Único 2011',
    type: 'red',
    region: 'Ribera del Duero',
    country: 'Spain',
    characteristics: ['full-bodied', 'red fruits', 'complex', 'elegant', 'leather'],
    pairings: ['red meat', 'game', 'aged cheese'],
    description: 'Spain\'s most prestigious wine with remarkable complexity and aging potential',
    icon: 'redWine'
  },
  {
    id: '4',
    name: 'Caymus Special Selection 2019',
    type: 'red',
    region: 'Napa Valley',
    country: 'USA',
    characteristics: ['full-bodied', 'black fruits', 'spicy', 'oak', 'rich'],
    pairings: ['grilled', 'red meat', 'barbecue'],
    description: 'Powerful Napa Cabernet with rich black fruit and bold spice character',
    icon: 'redWine'
  },
  {
    id: '5',
    name: 'Gaja Barbaresco 2018',
    type: 'red',
    region: 'Piedmont',
    country: 'Italy',
    characteristics: ['full-bodied', 'red fruits', 'spicy', 'tannic', 'floral'],
    pairings: ['grilled', 'aged cheese', 'mushrooms'],
    description: 'Elegant Barbaresco with classic Nebbiolo spice and rose petal notes',
    icon: 'redWine'
  },
  {
    id: '6',
    name: 'Ornellaia 2018',
    type: 'red',
    region: 'Bolgheri',
    country: 'Italy',
    characteristics: ['full-bodied', 'black fruits', 'complex', 'smooth', 'chocolate'],
    pairings: ['aged cheese', 'red meat', 'pasta'],
    description: 'Super Tuscan blend with remarkable smoothness and depth',
    icon: 'redWine'
  },
  {
    id: '7',
    name: 'Château Angelus 2016',
    type: 'red',
    region: 'Saint-Émilion',
    country: 'France',
    characteristics: ['full-bodied', 'black fruits', 'rich', 'smooth', 'oak'],
    pairings: ['aged cheese', 'red meat', 'game'],
    description: 'Premier Grand Cru Classé A with exceptional richness and polish',
    icon: 'redWine'
  },
  {
    id: '8',
    name: 'Domaine Raveneau Chablis Grand Cru 2019',
    type: 'white',
    region: 'Chablis',
    country: 'France',
    characteristics: ['crisp', 'mineral', 'citrus', 'elegant', 'flinty'],
    pairings: ['seafood', 'shellfish', 'light dishes'],
    description: 'Legendary Chablis producer\'s Grand Cru with intense minerality',
    icon: 'whiteWine'
  },
  {
    id: '9',
    name: 'Didier Dagueneau Silex 2019',
    type: 'white',
    region: 'Loire Valley',
    country: 'France',
    characteristics: ['crisp', 'mineral', 'citrus', 'complex', 'smoky'],
    pairings: ['seafood', 'goat cheese', 'light dishes'],
    description: 'Iconic Pouilly-Fumé with distinctive gunflint minerality',
    icon: 'whiteWine'
  },
  {
    id: '10',
    name: 'Jermann Vintage Tunina 2020',
    type: 'white',
    region: 'Friuli-Venezia Giulia',
    country: 'Italy',
    characteristics: ['light', 'fresh', 'floral', 'tropical', 'mineral'],
    pairings: ['light salads', 'seafood', 'appetizers'],
    description: 'Complex Italian white blend with remarkable freshness',
    icon: 'whiteWine'
  },
  {
    id: '11',
    name: 'Domaine Leflaive Puligny-Montrachet 2019',
    type: 'white',
    region: 'Burgundy',
    country: 'France',
    characteristics: ['medium-bodied', 'mineral', 'citrus', 'elegant', 'oak'],
    pairings: ['seafood', 'poultry', 'fine cheese'],
    description: 'Prestigious white Burgundy with perfect balance and finesse',
    icon: 'whiteWine'
  },
  {
    id: '12',
    name: 'Krug Grande Cuvée',
    type: 'sparkling',
    region: 'Champagne',
    country: 'France',
    characteristics: ['elegant', 'complex', 'toasted', 'mineral', 'rich'],
    pairings: ['fine cheese', 'seafood', 'caviar'],
    description: 'Multi-vintage prestige cuvée with exceptional complexity',
    icon: 'sparklingWine'
  },
  {
    id: '13',
    name: 'Salon Blanc de Blancs 2012',
    type: 'sparkling',
    region: 'Champagne',
    country: 'France',
    characteristics: ['elegant', 'mineral', 'citrus', 'complex', 'refined'],
    pairings: ['fine cheese', 'seafood', 'caviar'],
    description: 'Rare and legendary Blanc de Blancs produced only in exceptional years',
    icon: 'sparklingWine'
  },
  {
    id: '14',
    name: 'Ca\' del Bosco Franciacorta Cuvée Prestige',
    type: 'sparkling',
    region: 'Lombardy',
    country: 'Italy',
    characteristics: ['fresh', 'light', 'citrus', 'floral', 'crisp'],
    pairings: ['fresh fruits', 'appetizers', 'light dishes'],
    description: 'Premium Franciacorta with delicate bubbles and fresh character',
    icon: 'sparklingWine'
  },
  {
    id: '15',
    name: 'Taittinger Comtes de Champagne 2008',
    type: 'sparkling',
    region: 'Champagne',
    country: 'France',
    characteristics: ['elegant', 'mineral', 'citrus', 'complex', 'refined'],
    pairings: ['fine cheese', 'seafood', 'light dishes'],
    description: 'Prestigious Blanc de Blancs with remarkable elegance',
    icon: 'sparklingWine'
  },
  {
    id: '16',
    name: 'Château d\'Yquem 2015',
    type: 'dessert',
    region: 'Sauternes',
    country: 'France',
    characteristics: ['sweet', 'rich', 'honey', 'tropical', 'complex'],
    pairings: ['elegant desserts', 'blue cheese', 'foie gras'],
    description: 'The world\'s most famous sweet wine with perfect balance',
    icon: 'dessertWine'
  },
  {
    id: '17',
    name: 'Royal Tokaji Aszú 6 Puttonyos 2016',
    type: 'dessert',
    region: 'Tokaj',
    country: 'Hungary',
    characteristics: ['sweet', 'rich', 'honey', 'apricot', 'complex'],
    pairings: ['elegant desserts', 'blue cheese', 'fruit desserts'],
    description: 'Luxurious Hungarian dessert wine with intense sweetness',
    icon: 'dessertWine'
  },
  {
    id: '18',
    name: 'Antinori Tignanello 2018',
    type: 'red',
    region: 'Tuscany',
    country: 'Italy',
    characteristics: ['full-bodied', 'red fruits', 'complex', 'tobacco', 'spicy'],
    pairings: ['red meat', 'aged cheese', 'grilled'],
    description: 'Iconic Super Tuscan that helped revolutionize Italian wine',
    icon: 'redWine'
  },
  {
    id: '19',
    name: 'Château Palmer 2016',
    type: 'red',
    region: 'Margaux',
    country: 'France',
    characteristics: ['full-bodied', 'black fruits', 'complex', 'violet', 'elegant'],
    pairings: ['red meat', 'game', 'aged cheese'],
    description: 'Third Growth that often performs at First Growth level',
    icon: 'redWine'
  },
  {
    id: '20',
    name: 'Domaine de la Romanée-Conti La Tâche 2018',
    type: 'red',
    region: 'Burgundy',
    country: 'France',
    characteristics: ['medium-bodied', 'red fruits', 'complex', 'spicy', 'elegant'],
    pairings: ['fine cheese', 'game', 'mushrooms'],
    description: 'Legendary Burgundy with extraordinary complexity and finesse',
    icon: 'redWine'
  },
  {
    id: '21',
    name: 'Domaine Leroy Musigny Grand Cru 2019',
    type: 'red',
    region: 'Burgundy',
    country: 'France',
    characteristics: ['medium-bodied', 'red fruits', 'elegant', 'floral', 'spicy'],
    pairings: ['game', 'mushrooms', 'fine cheese'],
    description: 'Legendary Burgundy producer\'s flagship wine with extraordinary finesse and complexity',
    icon: 'redWine'
  },
  {
    id: '22',
    name: 'Screaming Eagle Cabernet Sauvignon 2018',
    type: 'red',
    region: 'Napa Valley',
    country: 'USA',
    characteristics: ['full-bodied', 'black fruits', 'complex', 'oak', 'tobacco'],
    pairings: ['red meat', 'aged cheese', 'grilled'],
    description: 'Cult Napa Cabernet with incredible depth and precision',
    icon: 'redWine'
  },
  {
    id: '23',
    name: 'Egon Müller Scharzhofberger Riesling Trockenbeerenauslese 2019',
    type: 'dessert',
    region: 'Mosel',
    country: 'Germany',
    characteristics: ['sweet', 'honey', 'tropical', 'mineral', 'complex'],
    pairings: ['desserts', 'blue cheese', 'fruit desserts'],
    description: 'Legendary German sweet wine with perfect balance of sweetness and acidity',
    icon: 'dessertWine'
  },
  {
    id: '24',
    name: 'Domaine Leflaive Montrachet Grand Cru 2018',
    type: 'white',
    region: 'Burgundy',
    country: 'France',
    characteristics: ['full-bodied', 'mineral', 'complex', 'oak', 'citrus'],
    pairings: ['seafood', 'poultry', 'fine cheese'],
    description: 'One of the world\'s greatest white wines with remarkable depth and minerality',
    icon: 'whiteWine'
  },
  {
    id: '25',
    name: 'Giuseppe Quintarelli Amarone della Valpolicella Classico 2012',
    type: 'red',
    region: 'Veneto',
    country: 'Italy',
    characteristics: ['full-bodied', 'dried fruits', 'complex', 'spicy', 'rich'],
    pairings: ['aged cheese', 'game', 'grilled'],
    description: 'Legendary Amarone with incredible depth and complexity',
    icon: 'redWine'
  },
  {
    id: '26',
    name: 'Château d\'Yquem 2001',
    type: 'dessert',
    region: 'Sauternes',
    country: 'France',
    characteristics: ['sweet', 'honey', 'tropical', 'complex', 'botrytis'],
    pairings: ['foie gras', 'blue cheese', 'desserts'],
    description: 'Legendary vintage of the world\'s most famous sweet wine',
    icon: 'dessertWine'
  },
  {
    id: '27',
    name: 'Krug Clos du Mesnil 2004',
    type: 'sparkling',
    region: 'Champagne',
    country: 'France',
    characteristics: ['complex', 'mineral', 'citrus', 'elegant', 'toasted'],
    pairings: ['seafood', 'caviar', 'fine cheese'],
    description: 'Single-vineyard blanc de blancs Champagne of extraordinary precision',
    icon: 'sparklingWine'
  },
  {
    id: '28',
    name: 'Alvaro Palacios L\'Ermita 2018',
    type: 'red',
    region: 'Priorat',
    country: 'Spain',
    characteristics: ['full-bodied', 'mineral', 'complex', 'black fruits', 'spicy'],
    pairings: ['red meat', 'game', 'aged cheese'],
    description: 'Spain\'s most prestigious wine from old-vine Garnacha',
    icon: 'redWine'
  },
  {
    id: '29',
    name: 'Domaine de la Romanée-Conti Montrachet 2018',
    type: 'white',
    region: 'Burgundy',
    country: 'France',
    characteristics: ['full-bodied', 'complex', 'mineral', 'floral', 'oak'],
    pairings: ['lobster', 'fine cheese', 'poultry'],
    description: 'DRC\'s only white wine, considered among the world\'s finest',
    icon: 'whiteWine'
  },
  {
    id: '30',
    name: 'Giacomo Conterno Monfortino Barolo Riserva 2013',
    type: 'red',
    region: 'Piedmont',
    country: 'Italy',
    characteristics: ['full-bodied', 'tannic', 'complex', 'red fruits', 'tar'],
    pairings: ['game', 'truffles', 'aged cheese'],
    description: 'Legendary traditional Barolo of extraordinary depth and longevity',
    icon: 'redWine'
  },
  {
    id: '31',
    name: 'Trimbach Clos Ste Hune 2015',
    type: 'white',
    region: 'Alsace',
    country: 'France',
    characteristics: ['dry', 'mineral', 'complex', 'citrus', 'elegant'],
    pairings: ['seafood', 'poultry', 'spicy food'],
    description: 'Legendary dry Riesling with incredible precision and minerality',
    icon: 'whiteWine'
  },
  {
    id: '32',
    name: 'Dominus Estate 2016',
    type: 'red',
    region: 'Napa Valley',
    country: 'USA',
    characteristics: ['full-bodied', 'black fruits', 'complex', 'tobacco', 'mineral'],
    pairings: ['red meat', 'aged cheese', 'grilled'],
    description: 'Christian Moueix\'s California masterpiece of elegance and power',
    icon: 'redWine'
  },
  {
    id: '33',
    name: 'Micah Boswell Estate 2024',
    type: 'red',
    region: 'Sherman',
    country: 'Texas',
    characteristics: ['full-bodied', 'black fruits', 'complex', 'tobacco', 'mineral'],
    pairings: ['red meat', 'aged cheese', 'BBQ'],
    description: 'Micah Boswell and his new wine',
    icon: 'redWine'
  }
];