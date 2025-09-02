import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item, MagicItem } from '../app/models/item-model';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid'; // for generating unique IDs

// --- Types ---
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

export interface IShop {
  name: string;
  id: string;
  formData: FormDataType;
}

// --- Main Service ---
@Injectable({
  providedIn: 'root'
})
export class InputDatas {
  private shops: IShop[] = [];

  constructor(private http: HttpClient) {}

  // --- GET all local shops ---
  getShops(): IShop[] {
    return this.shops;
  }

getAllItems(): (Item | MagicItem)[] {
  return this.allItems;
}

  // --- Save shop to backend ---
saveShopToDB(payload: { name: string; items: any[]; formData: FormDataType }) {
  return this.http.post('http://localhost:3000/myshops', payload);
}

  registerNewShop(): string | null {
    const id = uuidv4();
    const currentFormData = this.formData.value;

    if (!currentFormData) {
      console.warn('No form data to save for this shop.');
      return null;
    }

    const name = currentFormData.shopName || 'Unnamed Shop';
    const clonedData: FormDataType = JSON.parse(JSON.stringify(currentFormData));

    this.shops.push({ name, id, formData: clonedData });
    console.log("New shop registered:", id, clonedData);

    return id;
  }

  
  getShopById(id: string): IShop | undefined {
    const shop = this.shops.find(shop => shop.id === id);
    return shop
      ? { ...shop, formData: JSON.parse(JSON.stringify(shop.formData)) }
      : undefined;
  }

  // --- Form Data ---
  private formData = new BehaviorSubject<FormDataType | null>(null);
  formData$ = this.formData.asObservable();

  setFormData(data: FormDataType) {
    this.formData.next(data);
  }

  // --- Items ---
  private allItems: (Item | MagicItem)[] = [];
  private allItemsSubject = new BehaviorSubject<(Item | MagicItem)[]>([]);
  allItems$ = this.allItemsSubject.asObservable();

  private selectedSourcesSubject = new BehaviorSubject<string[]>([]);
  selectedSources$ = this.selectedSourcesSubject.asObservable();

  private filteredItemsSubject = new BehaviorSubject<(Item | MagicItem)[]>([]);
  filteredItems$ = this.filteredItemsSubject.asObservable();

  setAllItems(items: (Item | MagicItem)[]) {
    this.allItems = items;
    this.allItemsSubject.next(items);
    this.updateFilteredItems();
  }

  setSelectedSources(sources: string[]) {
    this.selectedSourcesSubject.next(sources);
    this.updateFilteredItems();
  }

  private updateFilteredItems() {
    const selectedSources = this.selectedSourcesSubject.value;
    if (selectedSources.length === 0) {
      this.filteredItemsSubject.next(this.allItems);
    } else {
      this.filteredItemsSubject.next(
        this.allItems.filter(item => item.source && selectedSources.includes(item.source))
      );
    }
  }
}

// --- Random Input Data Service ---
@Injectable({
  providedIn: 'root'
})
export class RandomInputData {
  private randomDataSubject = new BehaviorSubject<{ randomItemsArray: (Item | MagicItem)[] }>({ randomItemsArray: [] });
  randomData$ = this.randomDataSubject.asObservable();

  setRandomData(data: { randomItems: Item | MagicItem }) {
    const current = this.randomDataSubject.value;
    const existingArray: (Item | MagicItem)[] = current?.randomItemsArray ?? [];

    const itemWithQuantity = { ...data.randomItems, quantity: data.randomItems.quantity ?? 1 };
    const newArray = [...existingArray, itemWithQuantity];

    this.randomDataSubject.next({ randomItemsArray: newArray });
  }
}

// --- New Item Data Service ---
@Injectable({
  providedIn: 'root'
})
export class NewItemData {
  private newItemDataSubject = new BehaviorSubject<{ newItemData: string } | null>({ newItemData: '' });
  newItemData$ = this.newItemDataSubject.asObservable();

  setNewItemData(data: { newItemData: string }) {
    const current = this.newItemDataSubject.value;
    const existing = current?.newItemData ?? '';
    const newValue = existing
      ? `${existing}, ${data.newItemData}`
      : data.newItemData;

    this.newItemDataSubject.next({ newItemData: newValue });
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
