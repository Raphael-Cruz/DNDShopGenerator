import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item-model';

@Component({
  selector: 'app-item-table',
  standalone: false,
  templateUrl: './item-table.html',
  styleUrls: ['./item-table.css']
})
export class ItemTable implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'cost', 'weight', 'source'];
  dataSource: Item[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Item[]>('assets/data/items.json').subscribe(data => {
      this.dataSource = data;
    });
  }
}


