'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';

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

  return (
    <Card className="p-4 space-y-4">
      {/* Sort */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Trier par</Label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Catégorie</Label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">Toutes les catégories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Gamme de prix</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Appliquer
        </Button>
        <Button onClick={resetFilters} variant="outline" className="flex-1">
          Réinitialiser
        </Button>
      </div>
    </Card>
  );
}
