/**
 * CategoryCard Component
 * Displays a single category as a clickable card
 */

import { memo } from 'react';
import type { Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface CategoryCardProps {
  category: Category;
  onClick: (category: Category) => void;
}

export const CategoryCard = memo(({ category, onClick }: CategoryCardProps) => {
  const gradientClass = CATEGORY_COLORS[category.id] || 'from-gray-500 to-gray-600';

  return (
    <button
      onClick={() => onClick(category)}
      className={`
        group relative overflow-hidden rounded-xl p-6 
        bg-gradient-to-br ${gradientClass}
        text-white shadow-lg
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-2xl
        focus:outline-none focus:ring-4 focus:ring-white/30
        active:scale-100
      `}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <span className="text-4xl filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
          {category.icon}
        </span>
        <h3 className="text-lg font-semibold text-center leading-tight">
          {category.name}
        </h3>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
    </button>
  );
});

CategoryCard.displayName = 'CategoryCard';
