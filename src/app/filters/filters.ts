import { Component, OnInit } from '@angular/core';
import { Item, MagicItem } from '../models/item-model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.html',
  styleUrls: ['./filters.css'],
  standalone: false,
})export class Filters implements OnInit {
  items: Item[] = [];
  magicItems: MagicItem[] = [];
  sources: { name: string; checked: boolean }[] = [];

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
    "DSotDQ": "Dragonlance: Shadow of the Dragon Queen",
    "WBtW": "The Wild Beyond the Witchlight",
    "VGM": "Volo's Guide to Monsters",
    "SatO": "Sigil and the Outlands",
    "BGG": "Bigby Presents: Glory of the Giants",
    "OotA": "Out of the Abyss",
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ items: Item[]; magicItems: any[] }>('assets/data/full_magic_items_list.json')
      .subscribe(data => {
        this.items = data.items || [];

        this.magicItems = [];
        if (data.magicItems && Array.isArray(data.magicItems)) {
          for (const mi of data.magicItems) {
            if (mi.children && Array.isArray(mi.children)) {
              this.magicItems.push(...mi.children);
            }
          }
        }

        const allItems = [...this.items, ...this.magicItems];
        const sourcesWithValue = allItems
          .map(i => i.source?.trim())
          .filter(s => !!s && s.length > 0);

        const uniqueSources = Array.from(new Set(sourcesWithValue));

        this.sources = uniqueSources.map(source => ({
          name: source,
          checked: false,
        }));
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
    if (source) {
      source.checked = false;
    }
  }

  get filteredItems(): (Item | MagicItem)[] {
    const allItems = [...this.items, ...this.magicItems];
    if (this.selectedSources.length === 0) {
      return allItems;
    }
    return allItems.filter(item => this.selectedSources.includes(item.source));
  }
}