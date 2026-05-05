import { getProducts, getContent } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import ManifiestoSection from '@/components/home/ManifiestoSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import VideoSection from '@/components/home/VideoSection';
import type { ContentSection } from '@/lib/types';

export const revalidate = 60;

function findSection(sections: ContentSection[], key: string) {
  return sections.find((s) => s.key === key);
}

export default async function HomePage() {
  const [products, content] = await Promise.all([
    getProducts({ featured: true }).catch(() => []),
    getContent().catch(() => []),
  ]);

  const hero = findSection(content, 'hero');
  const manifesto = findSection(content, 'manifesto');
  const video = findSection(content, 'featured_video');

  const featured = products.slice(0, 4);

  return (
    <>
      <HeroSection title={hero?.title} mediaUrl={hero?.mediaUrl} />
      <ManifiestoSection body={manifesto?.body} />
      <FeaturedProductsSection products={featured} />
      <VideoSection youtubeUrl={video?.youtubeUrl} title={video?.title} />
    </>
  );
}
