import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Item } from '../models/item-model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InputDatas } from '../input-datas';

@Component({
  selector: 'app-item-table',
  standalone: false,
  templateUrl: './item-table.html',
  styleUrls: ['./item-table.css']
})
export class ItemTable implements OnInit, AfterViewInit {
  @Input() shopId: string | null = null;
  displayedColumns: string[] = ['name', 'type', 'rarity', 'source', 'add-button'];

  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  items: Item[] = [];

  constructor(
    private dataShare: InputDatas
  ) { }

  ngOnInit(): void {
    // Custom filterPredicate — busca em name, type, rarity, source, description, entries
    this.dataSource.filterPredicate = (item: Item, filter: string) => {
      const search = filter.toLowerCase();
      const fields = [
        item.name,
        item.type,
        item.rarity,
        item.source,
        item.weaponCategory,
        item.description,
        ...(Array.isArray(item.entries) ? item.entries.map((e: any) =>
          typeof e === 'string' ? e : JSON.stringify(e)
        ) : [])
      ];
      return fields.some(f => f && f.toLowerCase().includes(search));
    };

    this.dataShare.items$.subscribe(items => {
      this.items = items;
      this.dataSource.data = this.items;
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    });

    if (this.dataShare.getAllItems().length === 0) {
      this.dataShare.refreshItems();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Sort accessor para rarity normalizada
    this.dataSource.sortingDataAccessor = (item: Item, sortHeaderId: string) => {
      const rarityOrder: Record<string, number> = {
        'Mun.': 1, 'Mundane': 1,
        'Com.': 2, 'Common': 2,
        'Unc.': 3, 'Uncommon': 3,
        'Rare': 4,
        'V.Rare': 5, 'Very Rare': 5,
        'Leg.': 6, 'Legendary': 6,
        'Art.': 7, 'Artifact': 7,
      };
      if (sortHeaderId === 'rarity') return rarityOrder[item.rarity ?? ''] ?? 0;
      return (item as any)[sortHeaderId] ?? '';
    };
  }

  addItem(item: Item) {
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