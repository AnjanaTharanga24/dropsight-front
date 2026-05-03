import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../pages/product/product.component';

interface ImageItem {
  preview: string;   // base64 data URL
  name:    string;
  size:    string;
  file:    File | null;
}

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent implements OnChanges {

  @Input()  product:    Product | null = null;
  @Output() saved     = new EventEmitter<Product>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  form = {
    title:        '',
    amazonUrl:    '',
    sellingPrice: null as number | null,
    costPrice:    null as number | null,
    status:       'active' as Product['status'],
  };

  imageItems: ImageItem[] = [];
  isDragOver = false;
  submitted  = false;

  ngOnChanges() {
    this.submitted  = false;
    this.isDragOver = false;
    if (this.product) {
      this.form = {
        title:        this.product.title,
        amazonUrl:    this.product.amazonUrl,
        sellingPrice: this.product.sellingPrice,
        costPrice:    this.product.costPrice,
        status:       this.product.status,
      };
      this.imageItems = this.product.images.map(preview => ({
        preview,
        name: 'saved image',
        size: '',
        file: null,
      }));
    } else {
      this.form = { title: '', amazonUrl: '', sellingPrice: null, costPrice: null, status: 'active' };
      this.imageItems = [];
    }
  }

  get computedProfit(): number {
    return +((this.form.sellingPrice ?? 0) - (this.form.costPrice ?? 0)).toFixed(2);
  }

  get computedMargin(): number {
    const s = this.form.sellingPrice ?? 0;
    return s ? +((this.computedProfit / s) * 100).toFixed(1) : 0;
  }

  get isValid(): boolean {
    return !!(this.form.title.trim() && this.form.amazonUrl.trim());
  }

  // ── File picking ──────────────────────────────────────
  openFilePicker() {
    this.fileInputRef.nativeElement.click();
  }

  onFileInputChange(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    this.addFiles(files);
    (event.target as HTMLInputElement).value = '';   // reset so same file can be re-added
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = Array.from(event.dataTransfer?.files ?? [])
      .filter(f => f.type.startsWith('image/'));
    this.addFiles(files);
  }

  private addFiles(files: File[]) {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageItems.push({
          preview: e.target!.result as string,
          name:    file.name,
          size:    this.formatSize(file.size),
          file,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(i: number) { this.imageItems.splice(i, 1); }

  private formatSize(bytes: number): string {
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  // ── Save ──────────────────────────────────────────────
  save() {
    this.submitted = true;
    if (!this.isValid) return;
    this.saved.emit({
      id:           this.product?.id ?? 0,
      title:        this.form.title.trim(),
      amazonUrl:    this.form.amazonUrl.trim(),
      sellingPrice: +(this.form.sellingPrice ?? 0),
      costPrice:    +(this.form.costPrice ?? 0),
      profit:       this.computedProfit,
      profitMargin: this.computedMargin,
      status:       this.form.status,
      images:       this.imageItems.map(i => i.preview),
      dateAdded:    this.product?.dateAdded ?? new Date(),
    });
  }

  cancel() { this.cancelled.emit(); }
}
