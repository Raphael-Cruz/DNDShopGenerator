import { Component, OnInit } from '@angular/core';
import { Item, MagicItem} from '../models/item-model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, NgZone  } from '@angular/core';
import { InputDatas } from '../input-datas';


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
  selectedRarity: string = '';
  uniqueRarities: string[] = [];

  constructor(private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private inputDatas: InputDatas ) {}



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
      

    });
 
}
  getTipForRarity(rarity: string): string {
  return this.sourceFortips[rarity] ?? "Unknown rarity";
}
}
