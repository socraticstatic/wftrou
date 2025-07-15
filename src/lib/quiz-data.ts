export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  tasteProfile: {
    [key: string]: string[];
  };
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What's your preferred wine style?",
    options: [
      "Bold Red Wine",
      "Crisp White Wine", 
      "Elegant Sparkling Wine",
      "Sweet Dessert Wine"
    ],
    tasteProfile: {
      "Bold Red Wine": ["red", "full-bodied", "black fruits"],
      "Crisp White Wine": ["white", "crisp", "citrus"],
      "Elegant Sparkling Wine": ["sparkling", "elegant", "mineral"],
      "Sweet Dessert Wine": ["dessert", "sweet", "honey"]
    }
  },
  {
    id: "q2",
    question: "Which flavor profile appeals to you most?",
    options: [
      "Rich & Complex",
      "Fresh & Light",
      "Refined & Elegant",
      "Sweet & Fruity",
      "Bold & Spicy",
      "Mineral & Crisp",
      "Floral & Aromatic",
      "Smooth & Velvety"
    ],
    tasteProfile: {
      "Rich & Complex": ["full-bodied", "complex"],
      "Fresh & Light": ["light", "crisp"],
      "Refined & Elegant": ["elegant", "mineral"],
      "Sweet & Fruity": ["sweet", "tropical"],
      "Bold & Spicy": ["full-bodied", "spicy"],
      "Mineral & Crisp": ["mineral", "crisp"],
      "Floral & Aromatic": ["floral", "elegant"],
      "Smooth & Velvety": ["medium-bodied", "rich"]
    }
  },
  {
    id: "q3",
    question: "What foods would you pair with your wine?",
    options: [
      "Red Meats",
      "Grilled Foods",
      "Fresh Seafood",
      "Light Salads",
      "Fine Cheeses",
      "Aged Cheeses",
      "Elegant Desserts",
      "Fresh Fruits"
    ],
    tasteProfile: {
      "Red Meats": ["full-bodied", "tannic"],
      "Grilled Foods": ["full-bodied", "spicy"],
      "Fresh Seafood": ["crisp", "mineral"],
      "Light Salads": ["light", "fresh"],
      "Fine Cheeses": ["complex", "elegant"],
      "Aged Cheeses": ["full-bodied", "rich"],
      "Elegant Desserts": ["sweet", "rich"],
      "Fresh Fruits": ["light", "fruity"]
    }
  }
];