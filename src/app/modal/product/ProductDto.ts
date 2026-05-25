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
}