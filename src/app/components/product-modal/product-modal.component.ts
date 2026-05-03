import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css'
})
export class ProductModalComponent implements OnChanges {
  @Input() product: any = null; // null for add, object for edit
  @Input() isOpen: boolean = false;
  
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  editingProduct: any = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] || changes['isOpen']) {
      if (this.isOpen) {
        if (this.product) {
          // Editing
          this.editingProduct = { ...this.product };
        } else {
          // Adding new
          this.editingProduct = {
            title: '',
            asin: '',
            ebayUrl: '',
            amazonPrice: 0,
            ebayPrice: 0,
            alertsEnabled: true,
            stockStatus: 'in_stock'
          };
        }
      }
    }
  }

  onSave() {
    this.save.emit(this.editingProduct);
  }

  onClose() {
    this.close.emit();
  }
}
