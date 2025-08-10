import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item, MagicItem } from '../app/models/item-model';

@Injectable({
  providedIn: 'root'
})
export class InputDatas {
  // existing form data behavior subject
  private formData = new BehaviorSubject<{ mundaneItems: string; commonItems: string, uncommonItems: string, rareItems: string, veryRareItems: string, legendaryItems: string, artifactItems: string } | null>(null);
  formData$ = this.formData.asObservable();

  setFormData(data: { mundaneItems: string; commonItems: string, uncommonItems: string, rareItems: string, veryRareItems: string, legendaryItems: string,  artifactItems: string }) {
    this.formData.next(data);
  }

  // --- New part: items + sources + filtered items ---
  private allItems: (Item | MagicItem)[] = [];

  // Holds list of all loaded items
  private allItemsSubject = new BehaviorSubject<(Item | MagicItem)[]>([]);
  allItems$ = this.allItemsSubject.asObservable();

  // Holds the list of selected sources (strings)
  private selectedSourcesSubject = new BehaviorSubject<string[]>([]);
  selectedSources$ = this.selectedSourcesSubject.asObservable();

  // Holds filtered items according to selected sources
  private filteredItemsSubject = new BehaviorSubject<(Item | MagicItem)[]>([]);
  filteredItems$ = this.filteredItemsSubject.asObservable();

  // Call this to load all items ( from your HTTP call)
  setAllItems(items: (Item | MagicItem)[]) {
    this.allItems = items;
    this.allItemsSubject.next(items);
    this.updateFilteredItems();
  }

  // Call this when selected sources change (array of source names)
  setSelectedSources(sources: string[]) {
    this.selectedSourcesSubject.next(sources);
    this.updateFilteredItems();
  }

  // Compute filtered items and emit them
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
      ? `${existing}, ${data.randomItems}`  // acumula novos itens
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


