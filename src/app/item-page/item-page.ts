import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Item } from '../models/item-model';
import { InputDatas } from '../input-datas';
import { AuthService } from '../core/services/auth';
import { combineLatest } from 'rxjs';


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

  displayedColumns: string[] = ['name', 'type', 'rarity', 'weight', 'cost'];
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


  private apiUrl = 'https://rollforshopbackend.onrender.com/items';

  ngOnInit(): void {
    this.loadMyItems();
  }

  private loadMyItems(): void {
    console.log('loadMyItems called');
    this.http.get<Item[]>(`${this.apiUrl}/mine?t=${Date.now()}`).subscribe({
      next: (items) => {
        console.log('items received:', items);
        console.log('first item keys:', items[0] ? Object.keys(items[0]) : 'empty array');

        // ← essas duas linhas que faltaram
        this.items = items;
        this.dataSource.data = items;
      },
      error: (err) => {
        console.error('ERRO no loadMyItems:', err);
      }
    });
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

  onItemCreated() {
    this.loadMyItems();
  }
}