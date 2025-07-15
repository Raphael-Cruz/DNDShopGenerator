import { Component, OnInit, model } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MundaneNodes } from '../models/item-model'



@Component({
  selector: 'app-advanced-tree',
  standalone: false,
  templateUrl: './advanced-tree.html',
  styleUrl: './advanced-tree.css'
})

export class AdvancedTree implements OnInit {

    mundaneNodes: MundaneNodes[] = [];
  

  childrenAccessor = (node: MundaneNodes) => node.children ?? [];

  hasChild = (_: number, node: MundaneNodes) => !!node.children && node.children.length > 0;
isLeaf = (_: number, node: MundaneNodes) => !node.children || node.children.length === 0;

  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);

    constructor(private http: HttpClient) {}

ngOnInit(): void {
    this.http.get<{ mundaneNodes: MundaneNodes[] }>('assets/data/items.json').subscribe(data => {
      this.mundaneNodes = data.mundaneNodes;
    });
  }
}
