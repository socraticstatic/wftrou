# Wine Discovery Application

An elegant, production-ready wine discovery platform that helps users find their perfect wine match through an interactive quiz, advanced search, and curated recommendations.

![Wine Discovery App](https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200&h=400)

## Overview

Wine Discovery is a modern web application designed to make wine selection accessible and enjoyable for everyone. Whether you're a wine enthusiast or just starting your wine journey, our platform helps you discover wines that match your taste preferences.

## Key Features

### Interactive Wine Quiz
- Personalized recommendations based on taste preferences
- Multi-step questionnaire covering:
  - Wine style preferences
  - Flavor profile preferences
  - Food pairing preferences
- Real-time results with matching wines

### Advanced Search
- Natural language search support
  - Search by wine characteristics
  - Search by food pairings
  - Search by region or type
- Real-time search results with elegant animations
- Smart filtering system

### Wine Database
- Comprehensive wine information
  - Detailed tasting notes
  - Region and origin
  - Food pairing suggestions
  - Characteristics and style
- Regular updates with new wines
- Expert-curated selections

### User Experience
- Responsive design for all devices
- Dark mode support
- Offline capability
- Accessibility features
- Touch-optimized mobile interface

## Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: 
  - Tailwind CSS
  - CSS Variables for theming
  - Responsive design system
- **Components**: 
  - shadcn/ui component library
  - Custom React components
  - Framer Motion animations
- **Icons**: Lucide React icon set

### State Management
- React Hooks for local state
- Custom hooks for shared logic
- Event-based system for real-time updates

### Data Layer
- IndexedDB for local storage
- Dexie.js for database operations
- Optimistic UI updates
- Offline-first architecture

### Performance
- Virtual scrolling for large lists
- Lazy loading of components
- Debounced search
- Image optimization
- Code splitting

## Development

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/wine-discovery.git
cd wine-discovery
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # React components
│   ├── admin/        # Admin interface components
│   ├── ui/           # Reusable UI components
│   └── wine-search/  # Search-related components
├── hooks/            # Custom React hooks
├── lib/              # Core utilities and services
│   ├── db.ts        # Database operations
│   ├── events.ts    # Event system
│   └── services/    # Business logic services
└── styles/          # Global styles and themes
```

## Best Practices

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-first architecture

### Performance
- Lazy loading of routes
- Image optimization
- Bundle size monitoring
- Performance monitoring

### Testing
- Unit tests for utilities
- Component testing
- End-to-end testing
- Accessibility testing

## Contributing

1. Fork the repository
2. Create your feature branch
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes
```bash
git commit -m 'Add amazing feature'
```
4. Push to the branch
```bash
git push origin feature/amazing-feature
```
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Wine data curated from expert sommeliers
- UI design inspired by modern wine apps
- Icons provided by Lucide React
- Stock photos from Unsplash