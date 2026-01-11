/**
 * CategoryBrowser Component
 * Main page for browsing OpenTDB categories
 */

import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/features/dashboard';
import { useCategories } from '../hooks/useCategories';
import { CategoryCard } from './CategoryCard';
import { QuizConfigDialog } from './QuizConfigDialog';
import type { Category } from '../types';
import { Loader2, RefreshCw, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const CategoryBrowser = () => {
  const { categories, isLoading, error, refetch, isFetching } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Explore Categories
            </h1>
            <p className="text-muted-foreground">
              Choose a category and test your knowledge with trivia from OpenTDB
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="text-6xl">😕</div>
            <h2 className="text-xl font-semibold">Failed to load categories</h2>
            <p className="text-muted-foreground max-w-md">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && (
          <>
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="text-6xl">🔍</div>
                <h2 className="text-xl font-semibold">No categories found</h2>
                <p className="text-muted-foreground">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Stats footer */}
        {!isLoading && categories.length > 0 && (
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            {categories.length} categories available • Powered by OpenTDB
          </div>
        )}
      </div>

      {/* Quiz Config Dialog */}
      <QuizConfigDialog
        category={selectedCategory}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
    </DashboardLayout>
  );
};
