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
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
