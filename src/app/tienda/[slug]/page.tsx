import type { Metadata } from 'next';
import ProductDetail from './ProductDetail';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API}/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Producto | Adaptive Overland' };
    const product = await res.json();
    const image = product.images?.find((i: { isMain: boolean }) => i.isMain) ?? product.images?.[0];
    return {
      title: `${product.name} | Adaptive Overland`,
      description: product.description ?? `${product.name} — Adaptive Overland`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: image ? [{ url: image.url }] : [],
      },
    };
  } catch {
    return { title: 'Producto | Adaptive Overland' };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
