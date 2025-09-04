import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Item, MagicItem } from '../models/item-model';
import { HttpClient } from '@angular/common/http';
import { InputDatas } from '../input-datas';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.html',
  standalone: false,
  styleUrls: ['./filters.css'],

})
export class Filters implements OnInit {

  items: Item[] = [];
  magicItems: MagicItem[] = [];
  sources: { name: string; checked: boolean }[] = [];
  allSelected: boolean = false;

  private sourceTooltips: Record<string, string> = { /* ...your tooltips... */ };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private inputDatas: InputDatas
  ) {}

  ngOnInit(): void {
    this.http.get<{ items: Item[]; magicItems: any[] }>('assets/data/full_magic_items_list.json')
      .subscribe(data => {
        this.zone.run(() => {
          this.items = data.items || [];

          this.magicItems = [];
          if (data.magicItems && Array.isArray(data.magicItems)) {
            for (const mi of data.magicItems) {
              if (mi.children && Array.isArray(mi.children)) {
                this.magicItems.push(...mi.children);
              }
            }
          }

          const allItems: (Item | MagicItem)[] = [...this.items, ...this.magicItems];
          this.inputDatas.setAllItems(allItems);

          // Extract unique sources safely
          const sourcesWithValue = allItems
            .map(i => i.source?.trim())
            .filter((s): s is string => !!s && s.length > 0); // type guard

          const uniqueSources = Array.from(new Set(sourcesWithValue));

          // Map strings to objects with checked
          this.sources = uniqueSources.map(s => ({ name: s, checked: false }));

          // Sort alphabetically
          this.sources.sort((a, b) => a.name.localeCompare(b.name));

          this.cdr.detectChanges();
        });
      });
  }

  getTooltipForSource(source: string): string {
    return this.sourceTooltips[source] ?? "Unknown source";
  }

  get selectedSources(): string[] {
    return this.sources.filter(s => s.checked).map(s => s.name);
  }

  removeSource(sourceName: string) {
    const source = this.sources.find(s => s.name === sourceName);
    if (source) source.checked = false;
  }

  get filteredItems(): (Item | MagicItem)[] {
    const allItems: (Item | MagicItem)[] = [...this.items, ...this.magicItems];
    if (this.selectedSources.length === 0) return allItems;

    // Filter safely, check for undefined
    return allItems.filter(item => item.source && this.selectedSources.includes(item.source));
  }

  onSourceCheckboxChange() {
    this.allSelected = this.sources.every(s => s.checked);
    this.inputDatas.setSelectedSources(this.selectedSources);
  }

  toggleAllSources(selectAll: boolean): void {
    this.sources.forEach(source => source.checked = selectAll);
    this.allSelected = selectAll;
    this.onSourceCheckboxChange();
  }
}
