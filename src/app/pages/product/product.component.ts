import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductStatsComponent } from '../../components/product-stats/product-stats.component';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters.component';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';

export interface Product {
  id: number;
  title: string;
  asin: string;
  ebayUrl: string;
  amazonUrl: string;
  amazonPrice: number;
  ebayPrice: number;
  profit: number;
  margin: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  images: string[];
  lastChecked: Date;
  alertsEnabled: boolean;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductStatsComponent, ProductFiltersComponent, ProductTableComponent, ProductModalComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  
  isModalOpen: boolean = false;
  selectedProduct: Product | null = null;
  
  // Stats
  totalProducts: number = 0;
  activeAlerts: number = 0;
  totalProfit: number = 0;
  outOfStockCount: number = 0;

  ngOnInit() {
    this.loadMockData();
    this.calculateStats();
  }

  loadMockData() {
    this.products = [
      {
        id: 1,
        title: 'Wireless Bluetooth Headphones',
        asin: 'B08N5WRWNW',
        ebayUrl: 'https://ebay.com/listing/123',
        amazonUrl: 'https://amazon.com/dp/B08N5WRWNW',
        amazonPrice: 29.99,
        ebayPrice: 49.99,
        profit: 20.00,
        margin: 40,
        stockStatus: 'in_stock',
        images: ['headphones.jpg'],
        lastChecked: new Date('2024-01-15'),
        alertsEnabled: true
      },
      {
        id: 2,
        title: 'Smart Watch Fitness Tracker',
        asin: 'B07Z8Q9X5M',
        ebayUrl: 'https://ebay.com/listing/456',
        amazonUrl: 'https://amazon.com/dp/B07Z8Q9X5M',
        amazonPrice: 45.50,
        ebayPrice: 79.99,
        profit: 34.49,
        margin: 43,
        stockStatus: 'low_stock',
        images: ['watch.jpg'],
        lastChecked: new Date('2024-01-14'),
        alertsEnabled: true
      },
      {
        id: 3,
        title: 'USB-C Charging Cable 3-Pack',
        asin: 'B09G9Y7K4L',
        ebayUrl: 'https://ebay.com/listing/789',
        amazonUrl: 'https://amazon.com/dp/B09G9Y7K4L',
        amazonPrice: 8.99,
        ebayPrice: 18.99,
        profit: 10.00,
        margin: 53,
        stockStatus: 'out_of_stock',
        images: ['cable.jpg'],
        lastChecked: new Date('2024-01-13'),
        alertsEnabled: false
      }
    ];
    this.applyFilters();
  }

  calculateStats() {
    this.totalProducts = this.products.length;
    this.outOfStockCount = this.products.filter(p => p.stockStatus === 'out_of_stock').length;
    this.totalProfit = this.products.reduce((sum, p) => sum + p.profit, 0);
    this.activeAlerts = this.products.filter(p => p.alertsEnabled && p.stockStatus === 'low_stock').length;
  }

  applyFilters() {
    let filtered = this.products;
    
    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.asin.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(p => p.stockStatus === this.statusFilter);
    }
    
    this.filteredProducts = filtered;
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  onFilterChange(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  openAddModal() {
    this.selectedProduct = null;
    this.isModalOpen = true;
  }

  openEditModal(product: Product) {
    this.selectedProduct = { ...product };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  saveProduct(productData: any) {
    if (this.selectedProduct) {
      // Update
      const index = this.products.findIndex(p => p.id === this.selectedProduct!.id);
      if (index !== -1) {
        const updated = {
          ...this.selectedProduct,
          ...productData,
          profit: productData.ebayPrice - productData.amazonPrice,
          margin: ((productData.ebayPrice - productData.amazonPrice) / (productData.ebayPrice || 1)) * 100
        };
        this.products[index] = updated;
      }
    } else {
      // Add
      const newProduct: Product = {
        id: this.products.length + 1,
        title: productData.title || '',
        asin: productData.asin || '',
        ebayUrl: productData.ebayUrl || '',
        amazonUrl: productData.amazonUrl || '',
        amazonPrice: productData.amazonPrice || 0,
        ebayPrice: productData.ebayPrice || 0,
        profit: (productData.ebayPrice || 0) - (productData.amazonPrice || 0),
        margin: (((productData.ebayPrice || 0) - (productData.amazonPrice || 0)) / (productData.ebayPrice || 1)) * 100,
        stockStatus: 'in_stock',
        images: [],
        lastChecked: new Date(),
        alertsEnabled: productData.alertsEnabled || false
      };
      this.products.push(newProduct);
    }
    
    this.applyFilters();
    this.calculateStats();
    this.closeModal();
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products = this.products.filter(p => p.id !== id);
      this.applyFilters();
      this.calculateStats();
    }
  }

  toggleAlerts(product: Product) {
    product.alertsEnabled = !product.alertsEnabled;
    this.calculateStats(); // Recalculate stats since alerts changed
  }
}