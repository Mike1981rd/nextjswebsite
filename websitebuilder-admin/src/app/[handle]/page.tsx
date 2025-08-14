import { notFound } from 'next/navigation';
import PreviewPage from '@/components/preview/PreviewPage';
import { PageType } from '@/types/editor.types';

// Valid page handles that map to PageType enum
const validHandles: Record<string, PageType> = {
  'home': PageType.HOME,
  'product': PageType.PRODUCT,
  'cart': PageType.CART,
  'checkout': PageType.CHECKOUT,
  'collection': PageType.COLLECTION,
  'all_collections': PageType.ALL_COLLECTIONS,
  'all_products': PageType.ALL_PRODUCTS,
  'custom': PageType.CUSTOM
};

interface PageProps {
  params: {
    handle: string;
  };
}

export default function Page({ params }: PageProps) {
  const { handle } = params;
  
  // Check if handle is valid
  const pageType = validHandles[handle];
  if (!pageType) {
    notFound();
  }

  return <PreviewPage pageType={pageType} handle={handle} />;
}

// Generate static params for known pages
export async function generateStaticParams() {
  return Object.keys(validHandles).map((handle) => ({
    handle,
  }));
}