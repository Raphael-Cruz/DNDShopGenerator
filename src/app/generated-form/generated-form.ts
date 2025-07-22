import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Item, MagicItem } from '../models/item-model';
import { InputDatas } from '../input-datas';

@Component({
  selector: 'app-generated-form',
  standalone: false,
  templateUrl: './generated-form.html',
  styleUrl: './generated-form.css'
})
export class GeneratedForm implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'cost', 'weight', 'source'];
  dataSource = new MatTableDataSource<Item | MagicItem>();

  formValues: any;
  allMundaneItems: Item[] = [];
  allMagicItems: MagicItem[] = [];

  constructor(private dataShare: InputDatas, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ items: Item[], magicItems: { name: string, children: MagicItem[] }[] }>('assets/data/items.json').subscribe(data => {
      this.allMundaneItems = data.items.filter(item => item.rarity === 'Mun.');

      // Array com raridades permitidas
      const allowedRarities = ['Com.', 'Var.', 'Rare', 'Unc.', 'Leg.'];

      this.allMagicItems = data.magicItems
        .flatMap(magicGroup => magicGroup.children)
        .filter(mItem => allowedRarities.includes(mItem.rarity));

      this.updateItemsList();
    });

    this.dataShare.formData$.subscribe(data => {
      this.formValues = data;
      this.updateItemsList();
    });
  }

  private updateItemsList(): void {
  if (!this.formValues || (!this.allMundaneItems.length && !this.allMagicItems.length)) {
    this.dataSource.data = [];
    return;
  }

  const mundaneCount = parseInt(this.formValues.mundaneItems, 10);
  const commonCount = parseInt(this.formValues.commonItems, 10);
  const uncommonCount = parseInt(this.formValues.uncommonItems, 10);
  const rareCount = parseInt(this.formValues.rareItems, 10);
  const veryRareCount = parseInt(this.formValues.veryRareItems, 10);
  const legendaryCount = parseInt(this.formValues.legendaryItems, 10);

  // Se todos os counts forem inválidos ou zero, limpa lista
  if (
    [mundaneCount, commonCount, uncommonCount, rareCount, veryRareCount, legendaryCount]
      .every(c => isNaN(c) || c <= 0)
  ) {
    this.dataSource.data = [];
    return;
  }

  const result: (Item | MagicItem)[] = [];

  if (!isNaN(mundaneCount) && mundaneCount > 0) {
    const shuffledMundane = this.shuffleArray([...this.allMundaneItems]);
    result.push(...shuffledMundane.slice(0, mundaneCount));
  }

  // Função auxiliar para filtrar e adicionar mágicos de cada raridade
  const addMagicItemsByRarity = (rarity: string, count: number) => {
    if (!isNaN(count) && count > 0) {
      const filtered = this.allMagicItems.filter(item => item.rarity === rarity);
      const shuffled = this.shuffleArray([...filtered]);
      const selected = shuffled.slice(0, count).map(m => ({
        ...m,
        source: m.source || 'MagicBook'
      }));
      result.push(...selected);
    }
  };

  addMagicItemsByRarity('Com.', commonCount);
  addMagicItemsByRarity('Unc.', uncommonCount);
  addMagicItemsByRarity('Rare', rareCount);
  addMagicItemsByRarity('Var.', veryRareCount);
  addMagicItemsByRarity('Leg.', legendaryCount);

  this.dataSource.data = result;
}

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
