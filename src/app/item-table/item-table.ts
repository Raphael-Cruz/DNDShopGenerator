import { Component, OnInit, ViewChild,AfterViewInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-item-table',
  standalone: false,
  templateUrl: './item-table.html',
  styleUrls: ['./item-table.css']
})
export class ItemTable implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'type', 'cost', 'weight', 'source'];

  dataSource = new MatTableDataSource<Item>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{items:Item[] }>('assets/data/items.json').subscribe(data => {
      this.dataSource.data = data.items;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
     
    });
  }

  ngAfterViewInit(): void{
 this.dataSource.paginator = this.paginator; //link paginator to datasource
  }
}
