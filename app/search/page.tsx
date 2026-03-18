'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPriceNumber } from '@/lib/format-price';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNav } from '@/components/bottom-nav';
import { SearchFilters } from '@/components/search-filters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, SlidersHorizontal, X, Search, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, hasMore: false });
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '');

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
        if (data.pagination) setPagination(data.pagination);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchParams, page]);

  const activeFilters: { key: string; label: string }[] = [];
  if (searchParams.get('category')) activeFilters.push({ key: 'category', label: searchParams.get('category')! });
  if (searchParams.get('minPrice')) activeFilters.push({ key: 'minPrice', label: `Min: ${Number(searchParams.get('minPrice')).toLocaleString()} GNF` });
  if (searchParams.get('maxPrice')) activeFilters.push({ key: 'maxPrice', label: `Max: ${Number(searchParams.get('maxPrice')).toLocaleString()} GNF` });

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    window.location.href = `/search?${params.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (localQuery.trim()) params.set('q', localQuery.trim());
    else params.delete('q');
    window.location.href = `/search?${params.toString()}`;
  };

  const query = searchParams.get('q');

  return (
    <div className="min-h-screen bg-background pb-32">
      <MobileHeader />

      {/* Hero Search Header */}
      <div className="sticky top-0 z-30 bg-background/70 backdrop-blur-2xl border-b border-border/30">
        <div className="px-4 md:px-8 py-5 max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-accent transition-colors" />
            <input
              ref={inputRef}
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Rechercher un hoodie, t-shirt, pantalon..."
              className="w-full h-16 pl-14 pr-32 bg-secondary/20 border border-white/5 rounded-[2rem] font-bold text-base focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 focus:bg-secondary/30 transition-all placeholder:text-muted-foreground/30 italic"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 bg-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/20"
            >
              Chercher
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="space-y-1">
            {query ? (
              <>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">RÉSULTATS POUR</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter">&ldquo;{query}&rdquo;</h1>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">CATALOGUE COMPLET</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter">Explorer la Collection</h1>
              </>
            )}
            {!loading && (
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 mt-1">
                {pagination.total || products.length} article{(pagination.total || products.length) !== 1 ? 's' : ''} trouvé{(pagination.total || products.length) !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Active filters */}
            {activeFilters.map((f) => (
              <Badge
                key={f.key}
                className="h-9 px-4 rounded-full bg-accent/10 text-accent border-accent/20 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-accent/20 transition-all cursor-pointer"
                onClick={() => removeFilter(f.key)}
              >
                {f.label} <X className="w-3 h-3" />
              </Badge>
            ))}

            {/* Mobile filter button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-6 rounded-2xl border-white/10 bg-secondary/10 font-black text-[10px] uppercase tracking-widest hover:border-accent/40 gap-2 lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres {activeFilters.length > 0 && <span className="w-5 h-5 bg-accent text-white rounded-full text-[9px] flex items-center justify-center">{activeFilters.length}</span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-3xl border-l border-white/10 p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black italic tracking-tighter">Filtres</h2>
                </div>
                <SearchFilters />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 bg-secondary/5 border border-white/5 rounded-[2.5rem] p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-6">Affiner la recherche</h3>
              <SearchFilters />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-accent/20 animate-spin border-t-accent" />
                  <Sparkles className="w-6 h-6 text-accent absolute inset-0 m-auto animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 animate-pulse">
                  Exploration des archives...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 space-y-8 border-2 border-dashed border-white/5 rounded-[3rem] bg-secondary/5">
                <div className="text-6xl">🔍</div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black italic tracking-tighter">Aucun résultat</h3>
                  <p className="text-sm text-muted-foreground/40 font-bold max-w-xs">
                    Aucune pièce ne correspond à votre recherche. Essayez d&apos;autres mots-clés.
                  </p>
                </div>
                <Link href="/explorer">
                  <Button className="h-12 px-8 rounded-2xl bg-accent text-white font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-accent/90">
                    Explorer le catalogue <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="group">
                      <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-secondary/5 border border-white/5 hover:border-accent/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1">
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-secondary/10">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">👕</div>
                          )}
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/70 border border-white/20 px-4 py-2 rounded-full">
                                Épuisé
                              </span>
                            </div>
                          )}

                          {/* Category badge */}
                          <div className="absolute top-4 left-4">
                            <span className="text-[8px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md text-white/70 px-3 py-1.5 rounded-full border border-white/10">
                              {product.category}
                            </span>
                          </div>

                          {/* Arrow on hover */}
                          <div className="absolute bottom-4 right-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-lg shadow-accent/40">
                            <ArrowRight className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 md:p-5 space-y-2">
                          <h3 className="font-black italic tracking-tighter leading-tight text-sm md:text-base uppercase line-clamp-2 group-hover:text-accent transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-base md:text-xl font-black tracking-tighter">
                              {formatPriceNumber(product.price)}
                              <span className="text-[9px] md:text-[10px] text-muted-foreground/40 font-bold ml-1">GNF</span>
                            </span>
                            {product.stock > 0 && product.stock < 5 && (
                              <span className="text-[8px] font-black uppercase text-amber-500 animate-pulse">
                                {product.stock} restant{product.stock > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-12 bg-secondary/5 border border-white/5 p-4 rounded-full w-fit mx-auto shadow-2xl">
                    <Button
                      variant="ghost"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-full h-11 px-6 font-black uppercase text-[10px] tracking-widest disabled:opacity-20"
                    >
                      ← Préc.
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                        let pageNum = i + 1;
                        if (pagination.pages > 5 && page > 3) pageNum = page - 2 + i;
                        if (pageNum > pagination.pages) return null;
                        return (
                          <Button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={cn(
                              'w-10 h-10 rounded-full font-black text-xs transition-all duration-300',
                              page === pageNum
                                ? 'bg-accent text-white shadow-xl shadow-accent/30 scale-110'
                                : 'bg-transparent text-muted-foreground hover:bg-white/5'
                            )}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                      disabled={!pagination.hasMore}
                      className="rounded-full h-11 px-6 font-black uppercase text-[10px] tracking-widest disabled:opacity-20"
                    >
                      Suiv. →
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

export default SearchPage;
