import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';


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

export interface Item {
  name: string;
  source: string;
  page: number;
  rarity: string;
  quantity: number;
  cost: number;
  weaponCategory?: string;
  weight?: number;
  type?: string;
  wondrous: boolean; 
  entries?: Entry[];
  reqAttuneTags: any[];
}


type Entry = string | TableEntry | ListEntry;

@Component({
  selector: 'app-item-page',
  standalone: false,
  templateUrl: './item-page.html',
  styleUrls: ['./item-page.css']
})
export class ItemPage implements OnInit, AfterViewInit {

  constructor(private http: HttpClient) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'type', 'rarity', 'weight'];
  dataSource = new MatTableDataSource<Item>();
  items: Item[] = [];


  selectedItem?: Item & { entries?: Entry[] };

 
isTableEntry(entry: Entry): entry is TableEntry {
  return typeof entry === 'object' && entry.type === 'table';
}

isListEntry(entry: Entry): entry is ListEntry {
  return typeof entry === 'object' && entry.type === 'list';
}

ngOnInit(): void {
  this.http.get<{ item: Item[] }>('assets/data/items.json')
    .subscribe(data => {
      this.items = data.item;
      this.dataSource.data = this.items;

      // Filter by name only
      this.dataSource.filterPredicate = (data: Item, filter: string) => 
        data.name.toLowerCase().includes(filter);
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
}
