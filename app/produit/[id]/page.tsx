import { redirect } from 'next/navigation'

interface ProduitsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProduitPage({ params }: ProduitsPageProps) {
  const { id } = await params
  redirect(`/product/${id}`)
}
