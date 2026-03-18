'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

interface ReviewsListProps {
  productId: number;
  refreshTrigger?: number;
}

export function ReviewsList({ productId, refreshTrigger }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);

          if (data.length > 0) {
            const avg = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length;
            setAverageRating(Math.round(avg * 10) / 10);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, refreshTrigger]);

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Chargement des avis...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun avis pour le moment. Soyez le premier à laisser un avis.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold">{averageRating}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`avg-star-${i}`}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Basé sur {reviews.length} avis
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium">{review.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={`review-${review.id}-star-${i}`}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
