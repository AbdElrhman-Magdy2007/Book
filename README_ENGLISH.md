# Digital Library - Books Showcase

A modern, responsive digital library application built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🚀 Core Features

- **Advanced Search**: Real-time search with smart debouncing
- **Smart Filtering**: Filter books by category with custom icons
- **Responsive Design**: Works perfectly on all devices
- **Auto Refresh**: Automatic data updates every 5 minutes
- **Error Handling**: Robust error handling with offline support

### 🎨 Design Features

- **Glass Morphism**: Modern glass-like effects
- **Animated Background**: Floating particles animation
- **Smooth Transitions**: Framer Motion powered animations
- **Professional UI**: Clean and modern interface
- **Dark Theme**: Eye-friendly dark color scheme

### ⚡ Performance Features

- **Lazy Loading**: Images load only when needed
- **Skeleton Loading**: Beautiful loading states
- **Optimized Requests**: Prevents duplicate API calls
- **Memory Management**: Efficient resource usage
- **Fast Rendering**: Optimized React components

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── menu/
│   │   ├── page.tsx              # Main books showcase page
│   │   └── page.module.css       # Custom styles
│   └── server/
│       └── db/
│           └── products.ts       # Database queries
├── components/
│   └── BooksShowcase/
│       ├── index.ts              # Component exports
│       ├── BookCard.tsx          # Individual book card
│       ├── SearchAndFilters.tsx  # Search and category filters
│       ├── BookCardSkeleton.tsx  # Loading skeletons
│       ├── EmptyState.tsx        # No results state
│       ├── ErrorState.tsx        # Error handling
│       └── ResultsCount.tsx      # Results statistics
├── hooks/
│   └── useBooks.ts               # Custom hook for books management
└── types/
    └── product.ts                # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd book-landing
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000/menu](http://localhost:3000/menu)

## Usage

### Using the Books Showcase

1. **Search Books**: Use the search bar to find books by title, description, or technology
2. **Filter by Category**: Click on category buttons to filter books
3. **View Book Details**: Hover over book cards to see actions
4. **Download Books**: Click the download button to access book files
5. **Keyboard Shortcuts**: Press `/` to quickly focus the search bar

### Custom Hook Usage

```typescript
import { useBooks } from "@/hooks/useBooks";

const {
  books,
  categories,
  filteredBooks,
  isLoading,
  error,
  selectedCategory,
  searchQuery,
  setSelectedCategory,
  setSearchQuery,
  clearSearch,
  retry,
  totalBooks,
  hasResults,
  isSearching,
} = useBooks({
  autoRefresh: true,
  refreshInterval: 300000, // 5 minutes
  enableNotifications: true,
});
```

### Component Usage

```typescript
import {
  BookCard,
  SearchAndFilters,
  BooksGridSkeleton,
  EmptyState,
  ErrorState,
  ResultsCount,
} from "@/components/BooksShowcase";

// Use components in your JSX
<SearchAndFilters
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onClearSearch={clearSearch}
  selectedCategory={selectedCategory}
  onCategorySelect={setSelectedCategory}
  categories={categories}
/>;
```

## Customization

### Adding New Categories

1. Update the `CATEGORY_ICONS` object in `src/hooks/useBooks.ts`:

   ```typescript
   const CATEGORY_ICONS: Record<string, string> = {
     "New Category": "🎯",
     // ... existing categories
   };
   ```

2. Add the category to your database through the admin panel

### Modifying Styles

1. **Custom CSS**: Edit `src/app/menu/page.module.css`
2. **Tailwind Classes**: Modify component className props
3. **Theme Colors**: Update Tailwind config for brand colors

### Adding New Features

1. **New Components**: Create in `src/components/BooksShowcase/`
2. **New Hooks**: Add to `src/hooks/` directory
3. **Database Changes**: Update Prisma schema and run migrations

## API Endpoints

### Books API

- `GET /api/books` - Get all books with categories
- `GET /api/books/search?q=query` - Search books
- `GET /api/books/category/:id` - Get books by category

### Categories API

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Performance Optimization

### Loading Optimization

- **Skeleton Loading**: Shows loading placeholders
- **Lazy Loading**: Images load on demand
- **Debounced Search**: Reduces API calls during typing
- **Caching**: Intelligent data caching

### Memory Management

- **useMemo**: Prevents unnecessary recalculations
- **useCallback**: Prevents unnecessary re-renders
- **Cleanup**: Proper resource cleanup on unmount
- **AbortController**: Cancels pending requests

## Error Handling

### Network Errors

- Automatic retry functionality
- Offline status detection
- User-friendly error messages
- Graceful degradation

### Data Errors

- Validation of API responses
- Fallback to cached data
- Clear error boundaries
- Recovery mechanisms

## Accessibility

### ARIA Support

- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

### Visual Accessibility

- High contrast colors
- Clear typography
- Responsive design
- Touch-friendly targets

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the code examples

## Roadmap

### Planned Features

- [ ] Book ratings and reviews
- [ ] Reading progress tracking
- [ ] Offline reading capability
- [ ] Social sharing features
- [ ] Advanced filtering options
- [ ] Book recommendations
- [ ] Multi-language support
- [ ] Audio book support

### Performance Improvements

- [ ] Service Worker for offline support
- [ ] Image optimization
- [ ] Bundle size reduction
- [ ] CDN integration
- [ ] Database query optimization

---

Built with ❤️ using modern web technologies
