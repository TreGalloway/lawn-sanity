export interface Service {
  _id: string;
  name: string;
  slug: { current: string };
  shortDescription?: string;
  fullDescription?: any[];
  icon?: string;
  displayOrder?: number;
  tabOrder?: number;
  pricingTable?: PricingTier[];
  ctaButton?: {
    text?: string;
    link?: string;
  };
  heroImage?: SanityImage;
}

export interface PricingTier {
  tier: string;
  price: string;
  description?: string;
  features?: string[];
}

export interface ServiceArea {
  _id: string;
  areaName: string;
  displayOrder?: number;
}

export interface GalleryItem {
  _id: string;
  title?: string;
  image: SanityImage;
  description?: string;
  date?: string;
}

export interface SiteSettings {
  _id: string;
  companyName?: string;
  owner?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  founded?: string;
  serviceAreas?: string[];
  yardbookUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  footerTagline?: string;
  hoursOfOperation?: string;
  quoteButtonText?: string;
  facebookUrl?: string;
  navLinks?: NavLink[];
}

export interface Page {
  _id: string;
  title: string;
  slug: { current: string };
  blocks?: PageBlock[];
}

export interface PageBlock {
  _type: string;
  _key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  services?: Service[];
  areas?: ServiceArea[];
  items?: GalleryItem[];
  [key: string]: any;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}
