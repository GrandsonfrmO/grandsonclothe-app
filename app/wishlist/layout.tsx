import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ma Liste de Souhaits | GRANDSON CLOTHES',
  description: 'Consultez votre liste de souhaits et sauvegardez vos produits préférés.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
