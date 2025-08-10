import { Component, OnInit } from '@angular/core';
import { Item, MagicItem} from '../models/item-model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, NgZone  } from '@angular/core';
import { InputDatas, NewItemData } from '../input-datas';


@Component({
  selector: 'app-create-item',
  standalone: false,
  templateUrl: './create-item.html',
  styleUrl: './create-item.css'
})

export class CreateItem implements OnInit{

  items: Item[] = [];
  magicItems: Item[] = [];
  allMagicItems: MagicItem[] = [];
  
  uniqueRarities: string[] = [];

   newItems: (Item | MagicItem)[] = [];
   formValues: any;

  
  itemName = '';
  itemType = '';
  itemWeight = '';
  selectedRarity = '';
  itemSource = '';
  itemCost = '';
  
  constructor(private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private inputDatas: InputDatas,
    private dataShare: InputDatas,
    private newItemDataShare: NewItemData,
  ) {}



  private sourceFortips: Record<string, string> = {
  "Art.": "Artifact",
  "Com.": "Common",
  "Leg.": "Legendary",
  "Mun.": "Mundane",
  "Rare": "Rare",
  "Unc.": "Uncommon",
  "Unk.": "Unknown (Magic)",
  "V.Rare": "Very Rare",
  "Var.": "Varies",
}

ngOnInit(): void {
  this.http.get<{ items: Item[]; magicItems: any[] }>('assets/data/full_magic_items_list.json')
    .subscribe((data) => {
      // Mundane items rarities
      this.items = data.items;

      // Magic items rarities
      this.magicItems = [];
      if (data.magicItems && Array.isArray(data.magicItems)) {
        for (const mi of data.magicItems) {
          if (mi.children && Array.isArray(mi.children)) {
            this.magicItems.push(...mi.children);
          }
        }
      }

      // Extract and deduplicate rarities
      const mundaneRarities = this.items.map(item => item.rarity);
      const magicRarities = this.magicItems.map(item => item.rarity);
      this.uniqueRarities = Array.from(new Set([...mundaneRarities, ...magicRarities])).sort();

      
      //console.log('Unique rarities:', this.uniqueRarities);
      
      this.dataShare.formData$.subscribe(data => {
      this.formValues = data;
    
    });

  }

 );
 
}


  getTipForRarity(rarity: string): string {
  return this.sourceFortips[rarity] ?? "Unknown rarity";
  
}


   createNewItem() {
    if (!this.itemName || !this.itemType || !this.selectedRarity) {
      alert('Please fill in required fields: Item Name, Type, Rarity and Source.');
      return;
    }

    const newItem: Item | MagicItem = {
      name: this.itemName,
      type: this.itemType,
      weight: this.itemWeight,
      rarity: this.selectedRarity,
      source: this.itemSource,
      cost: this.itemCost
     
    };

    // Convert to JSON string to send to your service
    const itemStr = JSON.stringify(newItem);

    // Send new item string to your service
    this.newItemDataShare.setNewItemData({ newItemData: itemStr });

    // clear form fields after submission
    this.itemName = '';
    this.itemType = '';
    this.itemWeight = '';
    this.selectedRarity = '';
    this.itemSource = '';
     this.itemCost = '';

    alert('New item registered and sent!');

    //no need to say, but, our json is static for now, only way to update the json is send the new item JSON via HTTP POST to that backend
  }
}


