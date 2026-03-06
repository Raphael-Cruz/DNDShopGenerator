import { Component, OnInit } from '@angular/core';
import { Item, MagicItem } from '../models/item-model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { InputDatas, IShop } from '../input-datas';
import { AuthService } from '../core/services/auth';


@Component({
  selector: 'app-create-item',
  standalone: false,
  templateUrl: './create-item.html',
  styleUrls: ['./create-item.css']
})
export class CreateItem implements OnInit {

  items: Item[] = [];           // only THIS user's created items
  uniqueRarities: string[] = [];
  userShops: IShop[] = [];
  formValues: any;

  itemName = '';
  itemType = '';
  itemWeight = '';
  selectedRarity = '';
  itemSource = '';
  itemCost: number = 0;
  itemDescription = '';

  private apiUrl = 'http://localhost:3000/items';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private inputDatas: InputDatas,
    private authService: AuthService,
  ) { }

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
    const defaultRarities = ['Artifact', 'Common', 'Legendary', 'Mundane', 'Rare', 'Uncommon', 'Very Rare'];

    // Fetch ONLY this user's items from the dedicated endpoint
    this.loadMyItems();

    // Rarities still come from the full pool (for the dropdown)
    this.inputDatas.items$.subscribe(items => {
      const raritiesFromDB = items
        .map(item => item.rarity || '')
        .filter(r => r !== '');
      this.uniqueRarities = Array.from(new Set([...defaultRarities, ...raritiesFromDB])).sort();
    });

    if (this.inputDatas.getAllItems().length === 0) {
      this.inputDatas.refreshItems();
    }

    this.inputDatas.formData$.subscribe(data => {
      this.formValues = data;
    });

    this.inputDatas.getShops().subscribe(shops => {
      this.userShops = shops;
    });
  }

  // Calls /items/mine — returns only items owned by the logged-in user
  private loadMyItems(): void {
    this.http.get<Item[]>(`${this.apiUrl}/mine`).subscribe({
      next: (items) => {
        this.items = items;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load user items', err)
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

    const newItem: any = {
      name: this.itemName,
      type: this.itemType,
      weight: this.itemWeight,
      rarity: this.selectedRarity,
      source: this.itemSource,
      cost: typeof this.itemCost === 'string' ? parseFloat(this.itemCost) || 0 : this.itemCost,
      // userId is stamped by the backend from the JWT — not sent from frontend
      description: this.itemDescription,
    };

    this.http.post(this.apiUrl, newItem).subscribe({
      next: (response: any) => {
        console.log('Item created successfully:', response);

        // Push the saved item (with its real _id from the DB) directly into the list
        this.items = [...this.items, response];
        this.cdr.detectChanges();

        this.itemName = '';
        this.itemType = '';
        this.itemWeight = '';
        this.selectedRarity = '';
        this.itemSource = '';
        this.itemCost = 0;
        this.itemDescription = '';

        alert('New item saved to database!');
      },
      error: (err) => {
        console.error('Error creating item:', err);
        const errorMsg = err.error?.error || 'Failed to save item.';
        alert(errorMsg);
      }
    });
  }

  deleteItem(item: Item) {
    const id = (item as any)._id;
    if (!id) return;

    if (!confirm(`Delete "${item.name}" permanently?`)) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.items = this.items.filter(i => (i as any)._id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to delete item', err);
        alert('Failed to delete item.');
      }
    });
  }

  addItemToShop(item: Item, shopId: string) {
    const shop = this.userShops.find(s => (s._id || s.id) === shopId);
    if (!shop) return;

    this.inputDatas.getShopById(shopId).subscribe(fullShop => {
      const currentItems = fullShop.items || [];
      const newItemsList = [...currentItems, item];

      this.inputDatas.updateShopItems(shopId, newItemsList).subscribe({
        next: () => alert(`Item "${item.name}" added to shop "${fullShop.name}"`),
        error: (err) => {
          console.error('Error adding item to shop:', err);
          alert('Failed to add item to shop.');
        }
      });
    });
  }
}