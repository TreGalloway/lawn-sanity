import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Service, ServiceArea, GalleryItem, SiteSettings, Page } from '../types';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
const dataset = process.env.PUBLIC_SANITY_DATASET || import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

const fallbackSettings: SiteSettings = {
  _id: 'fallback',
  companyName: 'MI Premier Lawn Care, L.L.C',
  phoneNumber: '(810) 309-9528',
  email: 'info@mipremierlawncare.com',
  address: 'Flint, MI',
  heroTitle: 'Professional Lawn Care Services',
  heroSubtitle: 'Serving Flint, MI and surrounding areas',
  footerTagline: 'Your trusted local lawn care experts',
  quoteButtonText: 'Get a Free Quote',
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await sanityClient.fetch<SiteSettings>(
      `*[_type == "siteSettings"][0]`
    );
    return settings || fallbackSettings;
  } catch {
    return fallbackSettings;
  }
}

export async function fetchServices(): Promise<Service[]> {
  try {
    return await sanityClient.fetch<Service[]>(
      `*[_type == "service"] | order(displayOrder asc)`
    );
  } catch {
    return [];
  }
}

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  try {
    return await sanityClient.fetch<Service | null>(
      `*[_type == "service" && slug.current == $slug][0]`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function fetchServiceAreas(): Promise<ServiceArea[]> {
  try {
    return await sanityClient.fetch<ServiceArea[]>(
      `*[_type == "serviceArea"] | order(displayOrder asc)`
    );
  } catch {
    return [];
  }
}

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  try {
    return await sanityClient.fetch<GalleryItem[]>(
      `*[_type == "galleryItem"] | order(date desc)`
    );
  } catch {
    return [];
  }
}

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  try {
    return await sanityClient.fetch<Page | null>(
      `*[_type == "page" && slug.current == $slug][0]`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function fetchAllPages(): Promise<Page[]> {
  try {
    return await sanityClient.fetch<Page[]>(
      `*[_type == "page"]`
    );
  } catch {
    return [];
  }
}
