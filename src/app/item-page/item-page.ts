import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Item } from '../models/item-model';
import { InputDatas } from '../input-datas';
import { AuthService } from '../core/services/auth';

export interface TableEntry {
  type: 'table';
  caption?: string;
  colLabels: string[];
  colStyles: string[];
  rows: string[][];
}

export interface ListEntry {
  type: 'list';
  items: string[];
}

type Entry = string | TableEntry | ListEntry;

@Component({
  selector: 'app-item-page',
  standalone: false,
  templateUrl: './item-page.html',
  styleUrls: ['./item-page.css']
})
export class ItemPage implements OnInit, AfterViewInit {

  constructor(
    private http: HttpClient,
    private dataShare: InputDatas,
    private authService: AuthService,
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'type', 'rarity', 'weight'];
  dataSource = new MatTableDataSource<Item>();
  items: Item[] = [];

  selectedItem?: any;

  // Convenience getter — always reads the live authenticated user's ID
  private get currentUserId(): string | null {
    return this.authService.getCurrentUser()?._id ?? null;
  }

  isTableEntry(entry: Entry): entry is TableEntry {
    return typeof entry === 'object' && (entry as any).type === 'table';
  }

  isListEntry(entry: Entry): entry is ListEntry {
    return typeof entry === 'object' && (entry as any).type === 'list';
  }

  ngOnInit(): void {
    this.dataShare.items$.subscribe(items => {
      const uid = this.currentUserId;
      // Only show items that belong to the logged-in user
      this.items = uid
        ? items.filter(i => (i as any).userId === uid)
        : [];
      this.dataSource.data = this.items;

      this.dataSource.filterPredicate = (data: Item, filter: string) =>
        data.name.toLowerCase().includes(filter);
    });

    if (this.dataShare.getAllItems().length === 0) {
      this.dataShare.refreshItems();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  selectItem(item: Item) {
    this.selectedItem = {
      ...item,
      entries: item.entries as Entry[]
    };
  }

  hasReqAttuneClasses(item: Item): boolean {
    return !!item.reqAttuneTags?.some(tag => tag.class);
  }

  getReqAttuneClasses(item: Item): string {
    return item.reqAttuneTags?.map(tag => tag.class).join(', ') || '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}