import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  lastUpdated = new Date();

  summaryCards = [
    { title: 'Total Profit',      subtitle: 'vs last month',    value: '$12,450', change: '+8.2%',  changeClass: 'pill-up',   trendUp: true,  colorClass: 'mc-emerald', route: 'analytics', symbol: '💰' },
    { title: 'Total Revenue',     subtitle: 'gross sales',      value: '$48,320', change: '+12.5%', changeClass: 'pill-up',   trendUp: true,  colorClass: 'mc-blue',    route: 'analytics', symbol: '📈' },
    { title: 'Total Expenses',    subtitle: 'operational cost', value: '$35,870', change: '+4.1%',  changeClass: 'pill-down', trendUp: true,  colorClass: 'mc-rose',    route: 'analytics', symbol: '💸' },
    { title: 'Active Products',   subtitle: 'in your store',    value: '234',     change: '+5',     changeClass: 'pill-up',   trendUp: true,  colorClass: 'mc-violet',  route: 'products',  symbol: '📦' },
    { title: 'Out of Stock',      subtitle: 'need restocking',  value: '18',      change: '+3',     changeClass: 'pill-warn', trendUp: true,  colorClass: 'mc-amber',   route: 'products',  symbol: '⚠️' },
    { title: 'Unresolved Alerts', subtitle: 'action required',  value: '7',       change: '-2',     changeClass: 'pill-up',   trendUp: false, colorClass: 'mc-orange',  route: 'alerts',    symbol: '🔔' },
  ];

  profitData = [3200, 4100, 3800, 5200, 4800, 6100, 5500, 7200, 6800, 8100, 7500, 9200];
  months     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  revenueExpenses = [
    { month: 'Jan', revenue: 3800, expenses: 2900 },
    { month: 'Feb', revenue: 4200, expenses: 3100 },
    { month: 'Mar', revenue: 3900, expenses: 2800 },
    { month: 'Apr', revenue: 5100, expenses: 3600 },
    { month: 'May', revenue: 4800, expenses: 3400 },
    { month: 'Jun', revenue: 6200, expenses: 4100 },
  ];

  alerts = [
    { message: 'Nike Air Max 90 is out of stock',               time: '5 min ago',  severity: 'error',   route: 'products' },
    { message: 'Supplier price increased for 3 items',          time: '23 min ago', severity: 'warning', route: 'alerts'   },
    { message: 'Adidas Ultraboost listing removed by supplier', time: '1 hr ago',   severity: 'error',   route: 'alerts'   },
    { message: 'Sony WH-1000XM5 low stock (2 remaining)',       time: '2 hr ago',   severity: 'warning', route: 'products' },
    { message: 'Profit margin dropped below 15% on 5 items',    time: '3 hr ago',   severity: 'warning', route: 'products' },
  ];

  topProducts = [
    { name: 'iPhone 15 Case Premium', revenue: 4200, profit: 1680, margin: 40, status: 'active'       },
    { name: 'Nike Air Max 90',         revenue: 3800, profit: 1140, margin: 30, status: 'out-of-stock' },
    { name: 'Sony WH-1000XM5',         revenue: 3500, profit: 1225, margin: 35, status: 'active'       },
    { name: 'Adidas Ultraboost 22',    revenue: 2900, profit:  870, margin: 30, status: 'active'       },
    { name: 'Samsung Galaxy Watch 6',  revenue: 2600, profit:  780, margin: 30, status: 'active'       },
  ];

  get linePoints(): string {
    const W = 480, padX = 10, padY = 10, chartH = 105;
    const min = Math.min(...this.profitData);
    const max = Math.max(...this.profitData);
    const range = max - min;
    return this.profitData.map((v, i) => {
      const x = padX + (i / (this.profitData.length - 1)) * (W - padX * 2);
      const y = padY + ((max - v) / range) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  get areaPoints(): string {
    const pts = this.linePoints.split(' ');
    const firstX = pts[0].split(',')[0];
    const lastX  = pts[pts.length - 1].split(',')[0];
    return `${firstX},122 ${this.linePoints} ${lastX},122`;
  }

  getBarHeight(value: number): number {
    return Math.round((value / 7000) * 145);
  }

  revenueBarPct(revenue: number): number {
    return Math.round((revenue / 4200) * 100);
  }

  getMarginClass(margin: number): string {
    if (margin >= 35) return 'tag tag-green';
    if (margin >= 25) return 'tag tag-amber';
    return 'tag tag-red';
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'tag tag-green' : 'tag tag-red';
  }

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  refresh(): void {
    this.lastUpdated = new Date();
  }
}
