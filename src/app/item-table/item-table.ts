import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Item } from '../models/item-model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InputDatas, AuthModalService } from '../input-datas';
import { AuthService } from '../core/services/auth';

@Component({
  selector: 'app-item-table',
  standalone: false,
  templateUrl: './item-table.html',
  styleUrls: ['./item-table.css']
})
export class ItemTable implements OnInit, AfterViewInit {
  @Input() shopId: string | null = null;
  displayedColumns: string[] = ['name', 'type', 'source', 'add-button'];

  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  items: Item[] = [];

  constructor(
    private dataShare: InputDatas,
    private authService: AuthService,
    public authModal: AuthModalService
  ) { }

  get isLoggedIn(): boolean { return this.authService.isLoggedIn(); }

  ngOnInit(): void {
    this.dataShare.items$.subscribe(items => {
      this.items = items;
      this.dataSource.data = this.items;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });

    // Initial load if empty
    if (this.dataShare.getAllItems().length === 0) {
      this.dataShare.refreshItems();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  showLockedOverlay = false;

  addItem(item: Item) {
    if (!this.authService.isLoggedIn()) {
      this.showLockedOverlay = true;
      return;
    }
    if (!this.shopId) {
      alert('No shop selected to add item to.');
      return;
    }

    this.dataShare.getShopById(this.shopId).subscribe(shop => {
      const currentItems = shop.items || [];
      const updatedItems = [...currentItems, item];

      this.dataShare.updateShopItems(this.shopId!, updatedItems).subscribe({
        next: () => {
          alert(`Item "${item.name}" added to shop "${shop.name}"`);
          this.dataShare.notifyShopUpdate(this.shopId!);
        },
        error: (err: any) => {
          console.error('Error adding item to shop:', err);
          alert('Failed to add item to shop.');
        }
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}