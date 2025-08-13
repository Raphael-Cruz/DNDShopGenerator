import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item, MagicItem } from '../app/models/item-model';

type FormDataType = {
  shopName: string;
  mundaneItems: string;
  commonItems: string;
  uncommonItems: string;
  rareItems: string;
  veryRareItems: string;
  legendaryItems: string;
  artifactItems: string;
};

interface IShop {
  name: string;
  id: string;
  formData: FormDataType;
}

@Injectable({
  providedIn: 'root'
})
export class InputDatas {
  private shops: IShop[] = [];

  getShops(): IShop[] {
    return this.shops;
  }

  // existing form data behavior subject
  private formData = new BehaviorSubject<FormDataType | null>(null);
  formData$ = this.formData.asObservable();

  setFormData(data: FormDataType) {
    this.formData.next(data);
  }

  // --- New part: items + sources + filtered items ---
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
        this.allItems.filter(
          item => item.source && selectedSources.includes(item.source)
        )
      );
    }
  }

  registerNewShop(): string | null {
    const id = crypto.randomUUID();
    const currentFormData = this.formData.value;

    if (!currentFormData) {
      console.warn('No form data to save for this shop.');
      return null;
    }

    const name = currentFormData.shopName || 'Unnamed Shop';

    // Deep clone to prevent mutation issues for now until backend is up
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
}

@Injectable({
  providedIn: 'root'
})
export class RandomInputData {
  private randomData = new BehaviorSubject<{ randomItems: string } | null>({ randomItems: '' });
  randomData$ = this.randomData.asObservable();

  setRandomData(data: { randomItems: string }) {
    const current = this.randomData.value;
    const existing = current?.randomItems ?? '';
    const newValue = existing
      ? `${existing}, ${data.randomItems}`
      : data.randomItems;

    this.randomData.next({ randomItems: newValue });
  }
}

@Injectable({
  providedIn: 'root'
})
export class NewItemData {
  private newItemData = new BehaviorSubject<{ newItemData: string } | null>({ newItemData: '' });
  newItemData$ = this.newItemData.asObservable();

  setNewItemData(data: { newItemData: string }) {
    const current = this.newItemData.value;
    const existing = current?.newItemData ?? '';
    const newValue = existing
      ? `${existing}, ${data.newItemData}`
      : data.newItemData;

    this.newItemData.next({ newItemData: newValue });
  }
}
