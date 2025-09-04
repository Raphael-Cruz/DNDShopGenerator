import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
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
  id: string;
  name: string;
  formData: FormDataType;
}

// --- Main Shop Service ---
@Injectable({
  providedIn: 'root'
})
export class InputDatas {
  private shops: IShop[] = [];

  constructor(private http: HttpClient) {}

  // --- Local shops ---
  getShops(): IShop[] {
    return this.shops;
  }

  getShopById(id: string): IShop | undefined {
    return this.shops.find(s => s.id === id);
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
    return this.http.post('http://localhost:3000/myshops', payload);
  }

  // --- Register new shop locally ---
  registerNewShop(): string | null {
    const currentFormData = this.formDataSubject.value;
    if (!currentFormData) return null;

    const id = uuidv4();
    const name = currentFormData.shopName || 'Unnamed Shop';
    this.shops.push({ id, name, formData: currentFormData });
    return id;
  }

  // --- Helper ---
  private normalizeItem(item: Item): Item {
    return {
      ...item,
      quantity: item.quantity ?? 1,
      cost: typeof item.cost === 'string' ? parseFloat(item.cost) || 0 : item.cost ?? 0,
      weight: typeof item.weight === 'string' ? parseFloat(item.weight as string) || 0 : item.weight ?? 0
    };
  }
}

// --- Random Input Data Service ---
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

// --- New Item Service (manual items) ---
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

// --- Auth Modal Service ---
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
