import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {
  @Input() products: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  @Output() toggleAlert = new EventEmitter<any>();

  onEdit(product: any) {
    this.edit.emit(product);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onToggleAlert(product: any) {
    this.toggleAlert.emit(product);
  }

  getStockStatusClass(status: string): string {
    switch(status) {
      case 'in_stock': return 'status-in-stock';
      case 'low_stock': return 'status-low-stock';
      case 'out_of_stock': return 'status-out-of-stock';
      default: return '';
    }
  }

  getStockStatusText(status: string): string {
    switch(status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return '';
    }
  }
}
