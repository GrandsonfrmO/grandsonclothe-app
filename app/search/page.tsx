'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPriceNumber } from '@/lib/format-price';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNav } from '@/components/bottom-nav';
import { SearchBar } from '@/components/search-bar';
import { SearchFilters } from '@/components/search-filters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Loader2, Grid3x3, List, SlidersHorizontal, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, hasMore: false });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        const q = searchParams.get('q');
        if (q) params.append('q', q);
        
        const category = searchParams.get('category');
        if (category) params.append('category', category);
        
        const minPrice = searchParams.get('minPrice');
        if (minPrice) params.append('minPrice', minPrice);
        
        const maxPrice = searchParams.get('maxPrice');
        if (maxPrice) params.append('maxPrice', maxPrice);
        
        const sortBy = searchParams.get('sortBy');
        if (sortBy) params.append('sortBy', sortBy);
        
        params.append('page', page.toString());
        params.append('limit', '12');

        const response = await fetch(`/api/products/search?${params.toString()}`);
        const data = await response.json();
        setProducts(data.data || data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, page]);

  const activeFilters = [];
  if (searchParams.get('category')) activeFilters.push({ key: 'category', label: searchParams.get('category') });
  if (searchParams.get('minPrice')) activeFilters.push({ key: 'minPrice', label: `Min: ${searchParams.get('minPrice')}€` });
  if (searchParams.get('maxPrice')) activeFilters.push({ key: 'maxPrice', label: `Max: ${searchParams.get('maxPrice')}€` });

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header avec barre de recherche */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Recherche</h1>
              <p className="text-muted-foreground mt-1">
                {searchParams.get('q') ? `Résultats pour "${searchParams.get('q')}"` : 'Explorez notre catalogue'}
              </p>
            </div>
          </div>
          
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 border-b">
            <SearchBar />
          </div>
        </div>

        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="gap-1">
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filtres - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32">
              <SearchFilters />
            </div>
          </aside>

          {/* Filtres Mobile - Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filtres</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <SearchFilters />
              </div>
            </div>
          )}

          {/* Zone de résultats */}
          <div className="lg:col-span-3 space-y-4">
            {/* Barre d'outils */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                  
                  {!loading && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{pagination.total || products.length}</span> produit{(pagination.total || products.length) > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Vue:</span>
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Résultats */}
            {loading ? (
              <div className="flex flex-col justify-center items-center h-96 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Recherche en cours...</p>
              </div>
            ) : products.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Grid3x3 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche ou de réinitialiser les filtres
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Grille de produits */}
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }>
                  {products.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-primary/50 ${
                        viewMode === 'list' ? 'flex flex-row' : ''
                      }`}>
                        <div className={`bg-gradient-to-br from-muted to-muted/50 overflow-hidden relative ${
                          viewMode === 'grid' ? 'aspect-square' : 'w-48 h-48'
                        }`}>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Grid3x3 className="h-16 w-16 text-muted-foreground/30" />
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Badge variant="destructive" className="text-sm">Rupture de stock</Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className={`p-5 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <Badge variant="outline" className="shrink-0 text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 mt-auto border-t">
                            <div>
                              <span className="text-2xl font-bold text-primary">
                                {formatPriceNumber(product.price)} GNF
                              </span>
                            </div>
                            {product.stock > 0 && (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                                En stock
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination améliorée */}
                {pagination.pages > 1 && (
                  <Card className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-full sm:w-auto"
                      >
                        ← Précédent
                      </Button>
                      
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                          let pageNum;
                          if (pagination.pages <= 7) {
                            pageNum = i + 1;
                          } else if (page <= 4) {
                            pageNum = i + 1;
                          } else if (page >= pagination.pages - 3) {
                            pageNum = pagination.pages - 6 + i;
                          } else {
                            pageNum = page - 3 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              onClick={() => setPage(pageNum)}
                              className="w-10 h-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                        disabled={!pagination.hasMore}
                        className="w-full sm:w-auto"
                      >
                        Suivant →
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function SearchPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SearchContent />
    </Suspense>
  );
}

export default SearchPage;
