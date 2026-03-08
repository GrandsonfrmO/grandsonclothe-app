import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNav } from '@/components/bottom-nav';
import { SearchBar } from '@/components/search-bar';
import { SearchFilters } from '@/components/search-filters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rechercher | GRANDSON CLOTHES',
  description: 'Recherchez nos produits streetwear authentiques. Filtrez par catégorie, prix et plus.',
  openGraph: {
    title: 'Rechercher | GRANDSON CLOTHES',
    description: 'Recherchez nos produits streetwear authentiques.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: number;
}

'use client';

function SearchContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, hasMore: false });

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="sticky top-0 z-10 bg-background py-4">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <SearchFilters />
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Aucun produit trouvé</p>
              </Card>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''} (Page {page} sur {pagination.pages})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="aspect-square bg-muted overflow-hidden">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-lg">
                              {parseFloat(product.price).toFixed(2)} €
                            </span>
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                          {product.stock > 0 ? (
                            <p className="text-xs text-green-600">En stock</p>
                          ) : (
                            <p className="text-xs text-red-600">Rupture de stock</p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Précédent
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                        <Button
                          key={p}
                          variant={page === p ? "default" : "outline"}
                          onClick={() => setPage(p)}
                          className="w-10"
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={!pagination.hasMore}
                    >
                      Suivant
                    </Button>
                  </div>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SearchContent />
    </Suspense>
  );
}
