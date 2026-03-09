import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Item } from './models/item-model';

// --- Form Data Type ---
export type FormDataType = {
  shopName: string;
  mundaneItems: string;
  commonItems: string;
  uncommonItems: string;
  rareItems: string;
  veryRareItems: string;
  legendaryItems: string;
  artifactItems: string;
};

// --- Shop interface ---
export interface IShop {
  _id?: string;
  id?: string;
  name: string;
  items?: Item[];
  formData: FormDataType;
}

// --- Main Shop Service ---
@Injectable({
  providedIn: 'root'
})
export class InputDatas {
  private shops: IShop[] = [];
  private apiUrl = 'https://rollforshopbackend.onrender.com/myshops';
  private apiUrlItems = 'https://rollforshopbackend.onrender.com/items';

  constructor(private http: HttpClient) {
    this.refreshItems();
  }

  // --- Backend communication ---
  getShops(): Observable<IShop[]> {
    return this.http.get<IShop[]>(this.apiUrl).pipe(
      tap(shops => this.shops = shops)
    );
  }

  getShopById(id: string): Observable<IShop> {
    return this.http.get<IShop>(`${this.apiUrl}/${id}`);
  }

  // --- Items Management ---
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSubject.asObservable();

  private shopUpdatedSubject = new BehaviorSubject<string | null>(null);
  shopUpdated$ = this.shopUpdatedSubject.asObservable();

  notifyShopUpdate(shopId: string) {
    this.shopUpdatedSubject.next(shopId);
  }

  refreshItems() {
    this.http.get<Item[]>(this.apiUrlItems).subscribe({
      next: (items) => {
        const normalized = items.map(i => this.normalizeItem(i));
        this.allItems = normalized;
        this.itemsSubject.next(normalized);
        this.updateFilteredItems();
      },
      error: (err) => {
        console.error('Error fetching items:', err);
      }
    });
  }

  // --- Form Data ---
  private formDataSubject = new BehaviorSubject<FormDataType | null>(null);
  formData$ = this.formDataSubject.asObservable();

  setFormData(data: FormDataType) {
    this.formDataSubject.next(data);
  }

  getFormData(): FormDataType | null {
    return this.formDataSubject.value;
  }

  // --- Items ---

  private allItems: Item[] = [];
  private allItemsSubject = new BehaviorSubject<Item[]>([]);
  allItems$ = this.allItemsSubject.asObservable();

  setAllItems(items: Item[]) {
    this.allItems = items.map(i => this.normalizeItem(i));
    this.allItemsSubject.next(this.allItems);
  }

  getAllItems(): Item[] {
    return this.allItems;
  }

  // --- Sources filter ---
  private selectedSourcesSubject = new BehaviorSubject<string[]>([]);
  selectedSources$ = this.selectedSourcesSubject.asObservable();

  setSelectedSources(sources: string[]) {
    this.selectedSourcesSubject.next(sources);
  }

  // --- Filtered Items ---
  private filteredItemsSubject = new BehaviorSubject<Item[]>([]);
  filteredItems$ = this.filteredItemsSubject.asObservable();

  updateFilteredItems() {
    const sources = this.selectedSourcesSubject.value;
    if (!sources.length) this.filteredItemsSubject.next(this.allItems);
    else this.filteredItemsSubject.next(
      this.allItems.filter(i => i.source && sources.includes(i.source))
    );
  }

  // --- Save shop to backend ---
  saveShopToDB(payload: { name: string; items: Item[]; formData: FormDataType }) {
    return this.http.post<IShop>(this.apiUrl, payload);
  }

  // --- Update shop items ---
  updateShopItems(shopId: string, items: Item[]): Observable<IShop> {
    return this.http.put<IShop>(`${this.apiUrl}/${shopId}`, { items });
  }

  // --- Delete shop from backend ---
  deleteShop(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // --- Helper ---
  private rarityMap: Record<string, string> = {
    'Mundane': 'Mun.',
    'Common': 'Com.',
    'Uncommon': 'Unc.',
    'Rare': 'Rare',
    'Very Rare': 'V.Rare',
    'Legendary': 'Leg.',
    'Artifact': 'Art.'
  };

  normalizeItem(item: Item): Item {
    const normalizedRarity = this.rarityMap[item.rarity || ''] || item.rarity;
    return {
      ...item,
      rarity: normalizedRarity,
      quantity: item.quantity ?? 1,
      cost: typeof item.cost === 'string' ? parseFloat(item.cost) || 0 : item.cost ?? 0,
      weight: typeof item.weight === 'string' ? parseFloat(item.weight as string) || 0 : item.weight ?? 0
    };
  }
}

// --- Random Input Data Service 
@Injectable({
  providedIn: 'root'
})
export class RandomInputData {
  private randomDataSubject = new BehaviorSubject<{ randomItemsArray: Item[] }>({ randomItemsArray: [] });
  randomData$ = this.randomDataSubject.asObservable();

  setRandomData(item: Item) {
    const current = this.randomDataSubject.value.randomItemsArray;
    const normalized = this.normalizeItem(item);
    this.randomDataSubject.next({ randomItemsArray: [...current, normalized] });
  }

  getRandomItems(): Item[] {
    return this.randomDataSubject.value.randomItemsArray;
  }

  clear() {
    this.randomDataSubject.next({ randomItemsArray: [] });
  }

  private normalizeItem(item: Item): Item {
    return {
      ...item,
      quantity: item.quantity ?? 1,
      cost: typeof item.cost === 'string' ? parseFloat(item.cost) || 0 : item.cost ?? 0,
      weight: typeof item.weight === 'string' ? parseFloat(item.weight as string) || 0 : item.weight ?? 0
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class NewItemData {
  private newItemDataSubject = new BehaviorSubject<{ newItemData: string } | null>({ newItemData: '' });
  newItemData$ = this.newItemDataSubject.asObservable();

  setNewItemData(data: { newItemData: string }) {
    const current = this.newItemDataSubject.value?.newItemData || '';
    const newValue = current ? `${current}, ${data.newItemData}` : data.newItemData;
    this.newItemDataSubject.next({ newItemData: newValue });
  }

  clear() {
    this.newItemDataSubject.next({ newItemData: '' });
  }
}

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  private modalSubject = new BehaviorSubject<'login' | 'register' | null>(null);
  modal$ = this.modalSubject.asObservable();

  open(tab: 'login' | 'register' = 'login') {
    this.modalSubject.next(tab);
  }

  close() {
    this.modalSubject.next(null);
  }
}