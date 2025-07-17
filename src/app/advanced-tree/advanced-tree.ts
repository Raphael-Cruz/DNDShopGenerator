import { Component, OnInit, model, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MundaneNodes, MagicNodes } from '../models/item-model'




@Component({
  selector: 'app-advanced-tree',
  standalone: false,
  templateUrl: './advanced-tree.html',
  styleUrl: './advanced-tree.css'
})

export class AdvancedTree implements OnInit {

  
    mundaneNodes: MundaneNodes[] = [];
    magicNodes: MagicNodes[] = [];
    


  readonly panelOpenState = signal(false);
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);

    constructor(private http: HttpClient) {}

ngOnInit(): void {
    this.http.get<{ mundaneNodes: MundaneNodes[], magicNodes: MagicNodes[] }>('assets/data/items.json').subscribe(data => {
      this.mundaneNodes = data.mundaneNodes;
      this.magicNodes = data.magicNodes;
      
    });
    
  }
 
  /*
 logSelections() {
   console.log('Mundane Nodes Selected:');
  this.mundaneNodes.forEach(group => {
    (group.children ?? [])
      .filter(child => child.checked)
      .forEach(child => console.log(`- ${child.type}`));
  });
    
}
  */


  
}

