import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.css'
})
export class ProductFiltersComponent {
  @Input() searchTerm: string = '';
  @Input() statusFilter: string = 'all';
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();

  onSearch() {
    this.searchChange.emit(this.searchTerm);
  }

  onFilterChange() {
    this.filterChange.emit(this.statusFilter);
  }
}
