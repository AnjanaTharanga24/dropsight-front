export interface ProductImage {
  id?: number;
  urls: string;
}

export interface Product {
  id?: number;
  title: string;
  ebayUrl: string;
  category: string;
  quantity: number;
  ebayPrice: number;
  shippingCharge: number;
  description: string;
  productImageList?: ProductImage[];
  amazonUrl: string;
  amazonPrice: number;
  shippingCost: number;
  // UI-only fields
  freeShipping?: boolean;
  stockStatus?: string;
  alertsEnabled?: boolean;
  asin?: string;
  profit?: number;
  margin?: number;
  images?: string[];
  lastChecked?: Date;
}