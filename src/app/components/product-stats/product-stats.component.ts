import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-stats.component.html',
  styleUrl: './product-stats.component.css'
})
export class ProductStatsComponent {
  @Input() totalProducts: number = 0;
  @Input() outOfStockCount: number = 0;
  @Input() totalProfit: number = 0;
  @Input() activeAlerts: number = 0;
}
