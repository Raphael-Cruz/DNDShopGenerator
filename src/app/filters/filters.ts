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

  private sourceTooltips: Record<string, string> = {
    "PHB'14": "Player's Handbook 2014",
    "ToR": "Tyranny of Dragons",
    "RoTOS": "Rise of Tiamat Online Supplement",
    "RoT": "Rise of Tiamat",
    "PHB'24": "Player's Handbook 2024",
    "TCE": "Tasha's Cauldron of Everything",
    "XGE": "Xanathar's Guide to Everything",
    "WDH": "Waterdeep: Dragon Heist",
    "ERLW": "Eberron: Rising from the Last War",
    "SCC": "Strixhaven: A Curriculum of Chaos",
    "DMG'24": "Dungeon Master's Guide 2024",
    "QftIS": "Quests from the Infinite Staircase",
    "IDRotF": "Icewind Dale: Rime of the Frostmaiden",
    "AAG": "Astral Adventurer's Guide",
    "SCAG": "Sword Coast Adventurer's Guide",
    "JttRC": "Journeys through the Radiant Citadel",
    "GGR": "Guildmaster's Guide to Ravnica",
    "MTF": "Mordenkainen's Tome of Foes",
    "PotA": "Princes of the Apocalypse",
    "DSotDQ": "Dragonlance: Shadow of the Dragon Queen",
    "WBtW": "The Wild Beyond the Witchlight",
    "VGM": "Volo's Guide to Monsters",
    "SatO": "Sigil and the Outlands",
    "BGG": "Bigby Presents: Glory of the Giants",
    "OotA": "Out of the Abyss",
    "ToA": "Tomb of Annihilation",
    "VRGR": "Van Richten's Guide to Ravenloft",
    "LoX": "Light of Xaryxis",
    "DMG'14": "Dungeon Master's Guide 2014",
    "BMT": "Book of Many Things",
    "BGDIA": "Baldur's Gate: Descent Into Avernus",
    "WDMM": "Waterdeep: Dungeon of the Mad Mage",
    "CoS": "Curse of Strahd",
    "AI": "Acquisitions Incorporated",
    "EET": "Elemental Evil Trinkets",
    "VEoR": "Vecna: Eve of Ruin",
    "BAM": "Boo’s Astral Menagerie",
    "CM": "Candlekeep Mysteries",
    "DitLCoT": "Descent into the Lost Caverns of Tsojcanth",
    "DC": "Divine Contention",
    "FTD": "Fizban’s Treasury of Dragons",
    "GoS": "Ghosts of Saltmarsh",
    "HotDQ": "Hoard of the Dragon Queen",
    "KftGV": "Keys from the Golden Vault",
    "LmoP": "Lost Mine of Phandelver",
    "MM'14": "Monster Manual (2014)",
    "MM'25": "Monster Manual (2025)",
    "MPMM": "Mordenkainen Presents: Monsters of the Multiverse",
    "MOT": "Mythic Odysseys of Theros",
    "PaBTSO": "Phandelver and Below: The Shattered Obelisk",
    "SDW": "Sleeping Dragon’s Wake",
    "SKT": "Storm King’s Thunder",
    "TftYP": "Tales from the Yawning Portal",
  };


  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private inputDatas: InputDatas
  ) { }

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
