import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item-model';
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
  displayedColumns: string[] = ['name', 'type',  'source', 'add-button'];

  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

    items: Item[] = [];

  constructor(
    private http: HttpClient,
    private randomDataShare: RandomInputData
  ) {}


	


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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*
addItem(item: Item ) {
  this.randomDataShare.setRandomData({ randomItems: { ...item, quantity: 1 } });
}
*/

}

