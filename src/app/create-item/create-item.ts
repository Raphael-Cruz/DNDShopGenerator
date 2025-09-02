import { Component, OnInit } from '@angular/core';
import { Item, MagicItem } from '../models/item-model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { InputDatas } from '../input-datas';

@Component({
  selector: 'app-create-item',
  standalone: false,
  templateUrl: './create-item.html',
  styleUrls: ['./create-item.css']
})
export class CreateItem implements OnInit {

  items: Item[] = [];
  magicItems: MagicItem[] = [];
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

  // ⚡ Backend URL
  private apiUrl = 'http://localhost:3000/api/items';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private inputDatas: InputDatas,
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
  };

  ngOnInit(): void {
    // ⚡ Load items directly from backend
    this.http.get<(Item | MagicItem)[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.items = data as Item[];

        // Extract rarities
        const rarities = data.map(item => (item as Item).rarity || '');
        this.uniqueRarities = Array.from(new Set(rarities)).sort();
      },
      error: (err) => {
        console.error('Error fetching items from backend:', err);
      }
    });

    // Still keep form values listening
    this.inputDatas.formData$.subscribe(data => {
      this.formValues = data;
    });
  }

  getTipForRarity(rarity: string): string {
    return this.sourceFortips[rarity] ?? "Unknown rarity";
  }

  createNewItem() {
    if (!this.itemName || !this.itemType || !this.selectedRarity || !this.itemSource) {
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

    // ⚡ POST to backend
    this.http.post(this.apiUrl, newItem).subscribe({
      next: (response) => {
        console.log('Item created successfully:', response);

        // refresh list of items
        this.http.get<(Item | MagicItem)[]>(this.apiUrl).subscribe(items => {
          this.items = items as Item[];
        });

        // reset form
        this.itemName = '';
        this.itemType = '';
        this.itemWeight = '';
        this.selectedRarity = '';
        this.itemSource = '';
        this.itemCost = '';

        alert('New item saved to database!');
      },
      error: (err) => {
        console.error('Error creating item:', err);
        alert('Failed to save item.');
      }
    });
  }
}
