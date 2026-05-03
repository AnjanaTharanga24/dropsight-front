import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageProductComponent } from '../../components/manage-product/manage-product.component';

export interface Product {
  id: number;
  title: string;
  amazonUrl: string;
  sellingPrice: number;
  costPrice: number;
  profit: number;
  profitMargin: number;
  status: 'active' | 'out-of-stock' | 'paused' | 'removed';
  images: string[];
  dateAdded: Date;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ManageProductComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  searchQuery  = '';
  activeFilter: 'all' | 'active' | 'out-of-stock' | 'paused' | 'removed' = 'all';
  showModal    = false;
  editingProduct: Product | null = null;
  private nextId = 9;

  products: Product[] = [
    { id: 1, title: 'iPhone 15 Case Premium Leather Wallet',       amazonUrl: 'https://www.amazon.com/dp/B0C1234567', sellingPrice: 39.99,  costPrice: 12.50,  profit: 27.49, profitMargin: 68.7, status: 'active',       images: [], dateAdded: new Date('2024-01-15') },
    { id: 2, title: 'Nike Air Max 90 Men\'s Running Shoes',          amazonUrl: 'https://www.amazon.com/dp/B0C2345678', sellingPrice: 89.99,  costPrice: 55.00,  profit: 34.99, profitMargin: 38.9, status: 'out-of-stock',  images: [], dateAdded: new Date('2024-01-20') },
    { id: 3, title: 'Sony WH-1000XM5 Wireless Headphones',          amazonUrl: 'https://www.amazon.com/dp/B09XS7JWHH', sellingPrice: 279.99, costPrice: 195.00, profit: 84.99, profitMargin: 30.4, status: 'active',       images: [], dateAdded: new Date('2024-01-25') },
    { id: 4, title: 'Adidas Ultraboost 22 Running Shoes',           amazonUrl: 'https://www.amazon.com/dp/B0C3456789', sellingPrice: 119.99, costPrice: 75.00,  profit: 44.99, profitMargin: 37.5, status: 'active',       images: [], dateAdded: new Date('2024-02-01') },
    { id: 5, title: 'Samsung Galaxy Watch 6 Smart Watch',           amazonUrl: 'https://www.amazon.com/dp/B0C4567890', sellingPrice: 249.99, costPrice: 180.00, profit: 69.99, profitMargin: 28.0, status: 'active',       images: [], dateAdded: new Date('2024-02-05') },
    { id: 6, title: 'Anker PowerBank 26800mAh Portable Charger',    amazonUrl: 'https://www.amazon.com/dp/B01MF9MFG8', sellingPrice: 59.99,  costPrice: 32.00,  profit: 27.99, profitMargin: 46.7, status: 'paused',       images: [], dateAdded: new Date('2024-02-10') },
    { id: 7, title: 'Logitech MX Master 3S Wireless Mouse',         amazonUrl: 'https://www.amazon.com/dp/B09HMKFDXC', sellingPrice: 79.99,  costPrice: 48.00,  profit: 31.99, profitMargin: 40.0, status: 'active',       images: [], dateAdded: new Date('2024-02-15') },
    { id: 8, title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker', amazonUrl: 'https://www.amazon.com/dp/B00FLYWNYQ', sellingPrice: 99.99, costPrice: 65.00, profit: 34.99, profitMargin: 35.0, status: 'removed', images: [], dateAdded: new Date('2024-02-20') },
  ];

  get counts() {
    return {
      all:            this.products.length,
      active:         this.products.filter(p => p.status === 'active').length,
      'out-of-stock': this.products.filter(p => p.status === 'out-of-stock').length,
      paused:         this.products.filter(p => p.status === 'paused').length,
      removed:        this.products.filter(p => p.status === 'removed').length,
    };
  }

  get filteredProducts(): Product[] {
    let list = [...this.products];
    if (this.activeFilter !== 'all') {
      list = list.filter(p => p.status === this.activeFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.amazonUrl.toLowerCase().includes(q)
      );
    }
    return list;
  }

  setFilter(f: typeof this.activeFilter) { this.activeFilter = f; }

  openAdd() {
    this.editingProduct = null;
    this.showModal = true;
  }

  openEdit(p: Product) {
    this.editingProduct = { ...p, images: [...p.images] };
    this.showModal = true;
  }

  deleteProduct(id: number) {
    if (confirm('Remove this product from your catalog?')) {
      this.products = this.products.filter(p => p.id !== id);
    }
  }

  onSaved(p: Product) {
    if (p.id) {
      const idx = this.products.findIndex(x => x.id === p.id);
      if (idx !== -1) this.products[idx] = p;
    } else {
      this.products = [{ ...p, id: this.nextId++, dateAdded: new Date() }, ...this.products];
    }
    this.showModal = false;
    this.editingProduct = null;
  }

  onCancelled() {
    this.showModal = false;
    this.editingProduct = null;
  }

  statusLabel(s: string): string {
    return ({ 'active': 'Active', 'out-of-stock': 'Out of Stock', 'paused': 'Paused', 'removed': 'Removed' } as any)[s] ?? s;
  }

  shortUrl(url: string): string {
    return url.replace('https://www.', '').replace('https://', '');
  }

  trackById(_: number, p: Product) { return p.id; }
}
