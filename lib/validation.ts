import { z } from 'zod';

// Schémas de validation pour les produits
export const createProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(255, 'Le nom est trop long'),
  description: z.string().optional(),
  price: z.number().positive('Le prix doit être positif'),
  image: z.string().min(1, 'L\'image est requise'),
  category: z.string().min(1, 'La catégorie est requise'),
  stock: z.number().int('Le stock doit être un entier').min(0, 'Le stock ne peut pas être négatif'),
  colors: z.union([
    z.array(z.string()),
    z.string().nullable(),
  ]).optional().nullable(),
  sizes: z.union([
    z.array(z.string()),
    z.string().nullable(),
  ]).optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

// Schémas de validation pour l'authentification
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Schémas de validation pour les commandes
export const createOrderSchema = z.object({
  userId: z.number().int().positive().optional().nullable(),
  guestEmail: z.string().email('Email invalide').optional().nullable(),
  guestName: z.string().min(2).max(255).optional().nullable(),
  totalAmount: z.number().positive('Le montant total doit être positif'),
  paymentMethod: z.enum(['cash_on_delivery']),
  deliveryAddress: z.string().min(10, 'L\'adresse de livraison est trop courte'),
  phoneNumber: z.string().regex(/^\+?224[0-9]{8,9}$/, 'Numéro de téléphone invalide (format: +224XXXXXXXXX)'),
  deliveryZoneId: z.number().int().positive().optional().nullable(),
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive('La quantité doit être positive'),
      price: z.number().positive('Le prix doit être positif'),
    })
  ).min(1, 'Au moins un article est requis'),
}).refine(
  (data) => data.userId || (data.guestEmail && data.guestName),
  {
    message: 'userId ou (guestEmail et guestName) sont requis',
    path: ['userId'],
  }
);

// Schémas de validation pour les avis
export const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  userId: z.number().int().positive(),
  rating: z.number().int().min(1, 'La note minimale est 1').max(5, 'La note maximale est 5'),
  comment: z.string().max(1000, 'Le commentaire est trop long').optional(),
});

// Schémas de validation pour le panier
export const addToCartSchema = z.object({
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive('La quantité doit être positive'),
});

// Schémas de validation pour la wishlist
export const addToWishlistSchema = z.object({
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
});
