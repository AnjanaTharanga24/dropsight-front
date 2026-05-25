import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../service/product-service/product.service';
import { Product } from '../../modal/product/ProductDto';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css'
})
export class ProductModalComponent implements OnChanges {
  @Input() product: Product | null = null;
  @Input() isOpen: boolean = false;

  @Output() save = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();

  editingProduct: Product = this.emptyProduct();
  isLoading = false;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] || changes['isOpen']) {
      if (this.isOpen) {
        this.editingProduct = this.product ? { ...this.product } : this.emptyProduct();
        this.errorMessage = '';
      }
    }
  }

  onSave() {
    this.isLoading = true;
    this.errorMessage = '';
    this.productService.addProduct(this.editingProduct).subscribe({
      next: (saved) => {
        this.isLoading = false;
        this.save.emit(saved);
        this.onClose();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to save product. Please try again.';
        console.error(err);
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  private emptyProduct(): Product {
    return {
      title: '',
      ebayUrl: '',
      category: '',
      quantity: 0,
      ebayPrice: 0,
      shippingCharge: 0,
      description: '',
      productImageList: [],
      amazonUrl: '',
      amazonPrice: 0,
      shippingCost: 0
    };
  }
}
