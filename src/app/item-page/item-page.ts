import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from '../models/item-model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-item-page',
  standalone: false,
  templateUrl: './item-page.html',
  styleUrls: ['./item-page.css']  // fixed typo
})
export class ItemPage implements OnInit, AfterViewInit {

  constructor(private http: HttpClient) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'type', 'rarity', 'weight'];
  dataSource = new MatTableDataSource<Item>();

  items: Item[] = [];
  selectedItem?: Item;

  ngOnInit(): void {
    this.http.get<{ item: Item[] }>('assets/data/items.json')
      .subscribe(data => {
        this.items = data.item;
        this.dataSource.data = this.items;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  selectItem(item: Item) {
    this.selectedItem = item;
  }
}
