import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Item, MagicItem } from '../models/item-model';
import { InputDatas, RandomInputData, NewItemData } from '../input-datas';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-generated-form',
  standalone: false,
  templateUrl: './generated-form.html',
  styleUrl: '../main-comp/main-comp.css'
})
export class GeneratedForm implements OnInit {

  displayedColumns: string[] = ['qtdy','name', 'type', 'rarity', 'cost', 'weight', 'source', 'edit'];
  dataSource = new MatTableDataSource<Item | MagicItem>();
  shopId: string | null = null;
  formValues: any;
  randomItems: (Item | MagicItem)[] = [];
  manualItems: (Item | MagicItem)[] = [];

  allItems: Item[] = [];
  allMagicItems: MagicItem[] = [];

  selectedSources: string[] = []; // <-- track selected sources here

 constructor(
    private dataShare: InputDatas,
    private randomDataShare: RandomInputData,
    private http: HttpClient,
    private newItemDataShare: NewItemData,
    private route: ActivatedRoute,    // <--- add here
  ) {}

  ngOnInit(): void {
     this.shopId = this.route.snapshot.paramMap.get('id');
    
    if (this.shopId) {
      const shopData = this.dataShare.getShopById(this.shopId);
      if (shopData) {
        this.formValues = shopData.formData;
        this.updateItemsList();
      } else {
        console.warn(`Shop with id ${this.shopId} not found.`);
      }
    }
    
    this.http
      .get<{ items: Item[]; magicItems: { name: string; children: MagicItem[] }[] }>('assets/data/full_magic_items_list.json')
      .subscribe((data) => {
        this.allItems = data.items.filter(item => item.rarity === "Mun.");

        const allowedRarities = ['Mun','Com.', 'Var.', 'Rare', 'V.Rare','Unc.', 'Leg.', 'Art.', 'Unk.'];
        this.allMagicItems = data.magicItems
          .flatMap(group => group.children)
          .filter(mItem => allowedRarities.includes(mItem.rarity));

        this.updateItemsList();
      });

    this.dataShare.formData$.subscribe(data => {
      this.formValues = data;
      this.updateItemsList();
    });

    this.dataShare.selectedSources$.subscribe(sources => {
      this.selectedSources = sources;
      this.updateItemsList();
    });

    this.randomDataShare.randomData$.subscribe(data => {
      if (data && data.randomItems) {
        try {
          const itemsJson = `[${data.randomItems}]`;
          this.manualItems = JSON.parse(itemsJson);
        } catch (e) {
          console.error('Failed to parse new item JSON:', e);
          this.manualItems = [];
        }
      } else {
        this.manualItems = [];
      }
      this.dataSource.data = [...this.randomItems, ...this.manualItems];
    });

    // Subscribe to new items from CreateItem component
    this.newItemDataShare.newItemData$.subscribe(newItemData => {
      if (newItemData?.newItemData) {
        try {
          const newItem = JSON.parse(newItemData.newItemData);
          this.manualItems.push(newItem);
          this.dataSource.data = [...this.randomItems, ...this.manualItems];
        } catch (error) {
          console.error('Failed to parse new item JSON:', error);
        }
      }
    });
  }

  private updateItemsList(): void {
    if (!this.formValues || (!this.allItems.length && !this.allMagicItems.length)) {
      this.randomItems = [];
      this.dataSource.data = [...this.manualItems];
      return;
    }

    const mundaneCount = parseInt(this.formValues.mundaneItems, 10);
    const commonCount = parseInt(this.formValues.commonItems, 10);
    const uncommonCount = parseInt(this.formValues.uncommonItems, 10);
    const rareCount = parseInt(this.formValues.rareItems, 10);
    const veryRareCount = parseInt(this.formValues.veryRareItems, 10);
    const legendaryCount = parseInt(this.formValues.legendaryItems, 10);
    const artifactCount = parseInt(this.formValues.artifactItems, 10);

    if (
      [mundaneCount, commonCount, uncommonCount, rareCount, veryRareCount, legendaryCount, artifactCount].every(
        c => isNaN(c) || c <= 0
      )
    ) {
      this.randomItems = [];
      this.dataSource.data = [...this.manualItems];
      return;
    }

    const result: (Item | MagicItem)[] = [];

    // Filter mundane items by selected sources if any
    let filteredMundane = this.allItems;
    if (this.selectedSources.length > 0) {
      filteredMundane = filteredMundane.filter(item => this.selectedSources.includes(item.source));
    }
   if (!isNaN(mundaneCount) && mundaneCount > 0) {
  const shuffledMundane = this.shuffleArray([...filteredMundane])
    .slice(0, mundaneCount)
    .map(item => ({ ...item, quantity: 1 })); // default 1
  result.push(...shuffledMundane);
}
    

    const addMagicItemsByRarity = (rarity: string | string[], count: number) => {
      if (!isNaN(count) && count > 0) {
        let filtered = this.allMagicItems.filter(item =>
          Array.isArray(rarity)
            ? rarity.includes(item.rarity)
            : item.rarity === rarity
        );

        if (this.selectedSources.length > 0) {
          filtered = filtered.filter(item =>
            this.selectedSources.includes(item.source)
          );
        }

       const shuffled = this.shuffleArray([...filtered])
        .slice(0, count)
        .map(item => ({ ...item, quantity: 1 }));
      result.push(...shuffled);
      }
    };

    addMagicItemsByRarity(['Com.'], commonCount);
    addMagicItemsByRarity(['Unc.', 'Var.'], uncommonCount);
    addMagicItemsByRarity(['Rare', 'Var.'], rareCount);
    addMagicItemsByRarity(['V.Rare', 'Var.'], veryRareCount);
    addMagicItemsByRarity(['Leg.', 'Var.'], legendaryCount);
    addMagicItemsByRarity(['Art.', 'Var.'], artifactCount);

    this.randomItems = result;
    this.dataSource.data = [...this.randomItems, ...this.manualItems];
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  clearItems(): void {
  this.randomItems = [];
  this.manualItems = [];
  this.dataSource.data = [];
}
editingIndex: number | null = null;

editItems(index: number) {
  this.editingIndex = index;
}

saveEdit() {
  this.editingIndex = null;
}

}
