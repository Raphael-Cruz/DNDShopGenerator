import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item, MagicItem } from '../models/item-model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RandomInputData } from '../input-datas';

@Component({
  selector: 'app-item-table',
  standalone: false,
  templateUrl: './item-table.html',
  styleUrls: ['./item-table.css']
})
export class ItemTable implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'type', 'cost', 'weight', 'source'];
  dataSource = new MatTableDataSource<Item | MagicItem>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private randomDataShare: RandomInputData
  ) {}

  ngOnInit(): void {
    this.http.get<{ items: Item[], magicItems: { name: string, children: MagicItem[] }[] }>('assets/data/items.json')
      .subscribe(data => {
        const allMagicItems = data.magicItems.flatMap(group => group.children);
        const allItems: (Item | MagicItem)[] = [...data.items, ...allMagicItems];
        this.dataSource.data = allItems;
       
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

addItem(item: Item | MagicItem) {
  this.randomDataShare.setRandomData({ randomItems: { ...item, quantity: 1 } });
}
}

