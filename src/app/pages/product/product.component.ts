import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductStatsComponent } from '../../components/product-stats/product-stats.component';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters.component';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';
import { Product } from '../../modal/product/ProductDto';
import { ProductService } from '../../service/product-service/product.service';

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
  successMessage: string = '';

  totalProducts: number = 0;
  activeAlerts: number = 0;
  totalProfit: number = 0;
  outOfStockCount: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.calculateStats();
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  calculateStats() {
    this.totalProducts = this.products.length;
    this.outOfStockCount = this.products.filter(p => p.stockStatus === 'out_of_stock').length;
    this.totalProfit = this.products.reduce((sum, p) => sum + (p.profit ?? 0), 0);
    this.activeAlerts = this.products.filter(p => p.alertsEnabled && p.stockStatus === 'low_stock').length;
  }

  applyFilters() {
    let filtered = this.products;
    
    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.asin?.toLowerCase().includes(this.searchTerm.toLowerCase())
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

  saveProduct(savedProduct: Product) {
    this.products.push(savedProduct);
    this.applyFilters();
    this.calculateStats();
    this.showSuccess('Product added successfully!');
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
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