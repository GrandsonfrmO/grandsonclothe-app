'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = ['Électronique', 'Vêtements', 'Maison', 'Sports', 'Livres'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Nouveau' },
  { value: 'popular', label: 'Populaire' },
  { value: 'price-asc', label: 'Prix (bas→haut)' },
  { value: 'price-desc', label: 'Prix (haut→bas)' },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    category: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    else params.delete('category');
    
    params.set('sortBy', sortBy);

    router.push(`/search?${params.toString()}`);
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory('all');
    setSortBy('newest');
    router.push('/search');
  };

  const hasActiveFilters = minPrice || maxPrice || selectedCategory !== 'all' || sortBy !== 'newest';

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-muted/50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h2 className="font-semibold">Filtres</h2>
          </div>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Actifs
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Sort Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('sort')}
            className="w-full flex items-center justify-between text-sm font-semibold hover:text-primary transition-colors"
          >
            <span>Trier par</span>
            {expandedSections.sort ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.sort && (
            <div className="space-y-2">
              {SORT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Category Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between text-sm font-semibold hover:text-primary transition-colors"
          >
            <span>Catégorie</span>
            {expandedSections.category ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.category && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === 'all'}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Toutes les catégories</span>
              </label>
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={selectedCategory === cat}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Price Range Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-sm font-semibold hover:text-primary transition-colors"
          >
            <span>Gamme de prix</span>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Prix min</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Prix max</Label>
                  <Input
                    type="number"
                    placeholder="999"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              {(minPrice || maxPrice) && (
                <p className="text-xs text-muted-foreground text-center">
                  {minPrice || '0'} € - {maxPrice || '∞'} €
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-muted/30 border-t space-y-2">
        <Button onClick={applyFilters} className="w-full" size="lg">
          <Filter className="h-4 w-4 mr-2" />
          Appliquer les filtres
        </Button>
        {hasActiveFilters && (
          <Button onClick={resetFilters} variant="outline" className="w-full" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </div>
    </Card>
  );
}
