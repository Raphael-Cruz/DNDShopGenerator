import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormDataType } from '../../input-datas';
import { trigger, state, style, transition, animate } from '@angular/animations';


export interface ShopPreset {
  name: string;
  description: string;
  shopType: string;
  tier: string;
  region: string;
  reputation: string;
  formData: FormDataType;
}

export const SHOP_PRESETS: ShopPreset[] = [
  // ── BLACKSMITH ────────────────────────────────────────────────────────────
  {
    name: "The Iron Anvil",
    description: "Soot-stained walls and the ring of hammer on steel. Reliable blades, solid armour, one enchanted axe behind the counter.",
    shopType: "Blacksmith", tier: "Standard", region: "Civilized", reputation: "Honest Shop",
    formData: { shopName: "The Iron Anvil", mundaneItems: "18", commonItems: "4", uncommonItems: "2", rareItems: "1", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "Grimholt's Forge",
    description: "A frontier smithy trading in survival gear and scarred weapons. No frills — just sharp iron and tough leather.",
    shopType: "Blacksmith", tier: "Poor", region: "Frontier", reputation: "Honest Shop",
    formData: { shopName: "Grimholt's Forge", mundaneItems: "10", commonItems: "2", uncommonItems: "1", rareItems: "0", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Obsidian Blade",
    description: "Master-crafted arms favoured by generals. Rumour has it the owner once served a dragon.",
    shopType: "Blacksmith", tier: "Wealthy", region: "Civilized", reputation: "Legendary Merchant",
    formData: { shopName: "The Obsidian Blade", mundaneItems: "20", commonItems: "6", uncommonItems: "4", rareItems: "3", veryRareItems: "1", legendaryItems: "1", artifactItems: "0" }
  },
  {
    name: "Rustbucket Arms",
    description: "Dented shields and second-hand swords in a dimly lit Underdark corridor. Cheap. Possibly stolen.",
    shopType: "Blacksmith", tier: "Poor", region: "Underdark", reputation: "Suspicious Shop",
    formData: { shopName: "Rustbucket Arms", mundaneItems: "7", commonItems: "1", uncommonItems: "2", rareItems: "1", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Moonforged Armoury",
    description: "Weapons hammered under moonlight, enchanted with celestial runes. A legendary smith at the apex of their craft.",
    shopType: "Blacksmith", tier: "Legendary", region: "Feywild", reputation: "Legendary Merchant",
    formData: { shopName: "The Moonforged Armoury", mundaneItems: "15", commonItems: "8", uncommonItems: "6", rareItems: "4", veryRareItems: "3", legendaryItems: "2", artifactItems: "1" }
  },

  // ── ARCANE ────────────────────────────────────────────────────────────────
  {
    name: "The Amber Codex",
    description: "Floor-to-ceiling scrolls and tomes. A bespectacled gnome sells curious wands and minor trinkets.",
    shopType: "Arcane", tier: "Standard", region: "Civilized", reputation: "Honest Shop",
    formData: { shopName: "The Amber Codex", mundaneItems: "5", commonItems: "6", uncommonItems: "3", rareItems: "1", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "Whispers & Wonders",
    description: "A wagon crammed with bottled lights and speaking stones. The merchant changes face each time you visit.",
    shopType: "Arcane", tier: "Standard", region: "Frontier", reputation: "Suspicious Shop",
    formData: { shopName: "Whispers & Wonders", mundaneItems: "3", commonItems: "4", uncommonItems: "4", rareItems: "2", veryRareItems: "1", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Void Emporium",
    description: "Items sourced from planes unknown. Prices are steep; the shopkeeper accepts payment in memories.",
    shopType: "Arcane", tier: "Legendary", region: "Feywild", reputation: "Legendary Merchant",
    formData: { shopName: "The Void Emporium", mundaneItems: "2", commonItems: "4", uncommonItems: "5", rareItems: "4", veryRareItems: "3", legendaryItems: "2", artifactItems: "1" }
  },
  {
    name: "Shadowthread Arcana",
    description: "Hidden below a pawnshop. Sells enchanted items with no questions asked — and no receipts given.",
    shopType: "Arcane", tier: "Wealthy", region: "Underdark", reputation: "Black Market",
    formData: { shopName: "Shadowthread Arcana", mundaneItems: "2", commonItems: "1", uncommonItems: "5", rareItems: "4", veryRareItems: "2", legendaryItems: "1", artifactItems: "0" }
  },
  {
    name: "The Pale Lantern",
    description: "A modest wizard's shop on a cold northern street. Basic components and the occasional wand.",
    shopType: "Arcane", tier: "Poor", region: "Frontier", reputation: "Honest Shop",
    formData: { shopName: "The Pale Lantern", mundaneItems: "6", commonItems: "4", uncommonItems: "1", rareItems: "0", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },

  // ── ALCHEMIST ─────────────────────────────────────────────────────────────
  {
    name: "The Boiling Cauldron",
    description: "Potions stacked from floor to rafter. Healing draughts, antitoxins, and a suspiciously glowing green vial.",
    shopType: "Alchemist", tier: "Standard", region: "Civilized", reputation: "Honest Shop",
    formData: { shopName: "The Boiling Cauldron", mundaneItems: "12", commonItems: "5", uncommonItems: "2", rareItems: "1", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "Vex's Volatile Remedies",
    description: "Brews that heal... mostly. A hobgoblin alchemist who tests products on herself. Half the stock is unlabelled.",
    shopType: "Alchemist", tier: "Poor", region: "Frontier", reputation: "Suspicious Shop",
    formData: { shopName: "Vex's Volatile Remedies", mundaneItems: "7", commonItems: "2", uncommonItems: "2", rareItems: "0", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Gilded Flask",
    description: "Refined elixirs in crystal vials for the discerning adventurer. Rare transmutation draughts by appointment.",
    shopType: "Alchemist", tier: "Wealthy", region: "Civilized", reputation: "Honest Shop",
    formData: { shopName: "The Gilded Flask", mundaneItems: "10", commonItems: "6", uncommonItems: "4", rareItems: "2", veryRareItems: "1", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Spore Bazaar",
    description: "Deep fungal extracts and bioluminescent brews traded in the dark corridors of the Underdark.",
    shopType: "Alchemist", tier: "Standard", region: "Underdark", reputation: "Suspicious Shop",
    formData: { shopName: "The Spore Bazaar", mundaneItems: "6", commonItems: "3", uncommonItems: "3", rareItems: "2", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "Elixir of the Fey",
    description: "Potions brewed from moonpetals and starwater. Each bottle tastes different — and grants something unexpected.",
    shopType: "Alchemist", tier: "Legendary", region: "Feywild", reputation: "Legendary Merchant",
    formData: { shopName: "Elixir of the Fey", mundaneItems: "5", commonItems: "6", uncommonItems: "5", rareItems: "4", veryRareItems: "2", legendaryItems: "1", artifactItems: "0" }
  },

  // ── TEMPLE ────────────────────────────────────────────────────────────────
  {
    name: "The Healer's Nave",
    description: "Run by an order of clerics. Holy water, blessed salves, and the odd divine relic behind an iron grate.",
    shopType: "Temple", tier: "Standard", region: "Civilized", reputation: "Honest Shop",
    formData: { shopName: "The Healer's Nave", mundaneItems: "10", commonItems: "4", uncommonItems: "2", rareItems: "1", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "Shrine of the Undying",
    description: "A necromancer's temple trading in cursed relics and dark blessings. Not for the faint of faith.",
    shopType: "Temple", tier: "Wealthy", region: "Underdark", reputation: "Black Market",
    formData: { shopName: "Shrine of the Undying", mundaneItems: "2", commonItems: "2", uncommonItems: "4", rareItems: "3", veryRareItems: "2", legendaryItems: "1", artifactItems: "0" }
  },
  {
    name: "The Wayside Altar",
    description: "A crumbling roadside chapel with a single cleric selling basic salves and prayers for coin.",
    shopType: "Temple", tier: "Poor", region: "Frontier", reputation: "Honest Shop",
    formData: { shopName: "The Wayside Altar", mundaneItems: "6", commonItems: "2", uncommonItems: "0", rareItems: "0", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Radiant Sanctum",
    description: "A grand sun-deity temple stocked with legendary holy arms and artefacts of divine provenance.",
    shopType: "Temple", tier: "Legendary", region: "Civilized", reputation: "Legendary Merchant",
    formData: { shopName: "The Radiant Sanctum", mundaneItems: "8", commonItems: "6", uncommonItems: "5", rareItems: "4", veryRareItems: "2", legendaryItems: "2", artifactItems: "1" }
  },

  // ── TRAVELING MERCHANT ────────────────────────────────────────────────────
  {
    name: "Mira's Rolling Emporium",
    description: "A colourful wagon pulled by a mechanical horse. Stock changes every dawn — buy now or regret forever.",
    shopType: "Traveling Merchant", tier: "Standard", region: "Frontier", reputation: "Honest Shop",
    formData: { shopName: "Mira's Rolling Emporium", mundaneItems: "12", commonItems: "4", uncommonItems: "2", rareItems: "1", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Shadow Caravan",
    description: "Cloaked figures, no names given. Everything wrapped in black cloth. Dealers of the rare and forbidden.",
    shopType: "Traveling Merchant", tier: "Wealthy", region: "Underdark", reputation: "Black Market",
    formData: { shopName: "The Shadow Caravan", mundaneItems: "1", commonItems: "1", uncommonItems: "4", rareItems: "4", veryRareItems: "2", legendaryItems: "1", artifactItems: "0" }
  },
  {
    name: "Old Bram's Bargains",
    description: "A toothless halfling with a cart of junk. Most of it is worthless — but adventurers keep finding gems.",
    shopType: "Traveling Merchant", tier: "Poor", region: "Civilized", reputation: "Suspicious Shop",
    formData: { shopName: "Old Bram's Bargains", mundaneItems: "14", commonItems: "2", uncommonItems: "1", rareItems: "0", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Starborn Peddler",
    description: "Appears only at crossroads under a new moon. Sells items that cannot be found anywhere else — at any price.",
    shopType: "Traveling Merchant", tier: "Legendary", region: "Feywild", reputation: "Legendary Merchant",
    formData: { shopName: "The Starborn Peddler", mundaneItems: "3", commonItems: "4", uncommonItems: "4", rareItems: "4", veryRareItems: "3", legendaryItems: "2", artifactItems: "1" }
  },

  // ── FEY TRADER ────────────────────────────────────────────────────────────
  {
    name: "The Thorn Market",
    description: "A bramble-gate opens once a week. Inside: enchanted curios, glamoured weapons, and things that hum with old magic.",
    shopType: "Fey Trader", tier: "Standard", region: "Feywild", reputation: "Suspicious Shop",
    formData: { shopName: "The Thorn Market", mundaneItems: "4", commonItems: "5", uncommonItems: "4", rareItems: "2", veryRareItems: "1", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "Court of the Gilded Moth",
    description: "A grand fey bazaar in eternal twilight. Trade your name, your shadow, or mere gold for wonders.",
    shopType: "Fey Trader", tier: "Legendary", region: "Feywild", reputation: "Legendary Merchant",
    formData: { shopName: "Court of the Gilded Moth", mundaneItems: "2", commonItems: "4", uncommonItems: "6", rareItems: "5", veryRareItems: "4", legendaryItems: "2", artifactItems: "1" }
  },
  {
    name: "The Pixie's Satchel",
    description: "A tiny fey merchant no bigger than a sparrow, selling glamour-dusted trinkets and luck charms.",
    shopType: "Fey Trader", tier: "Poor", region: "Feywild", reputation: "Honest Shop",
    formData: { shopName: "The Pixie's Satchel", mundaneItems: "6", commonItems: "4", uncommonItems: "2", rareItems: "0", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "Mirewood Contraband",
    description: "Hidden behind a waterfall in the Feywild. Enchanted items stripped of names, origins, and previous owners.",
    shopType: "Fey Trader", tier: "Wealthy", region: "Feywild", reputation: "Black Market",
    formData: { shopName: "Mirewood Contraband", mundaneItems: "1", commonItems: "1", uncommonItems: "5", rareItems: "4", veryRareItems: "3", legendaryItems: "1", artifactItems: "0" }
  },
  {
    name: "The Dusk Exchange",
    description: "A frontier black market where desperate merchants sell cursed heirlooms and war trophies.",
    shopType: "Traveling Merchant", tier: "Poor", region: "Frontier", reputation: "Black Market",
    formData: { shopName: "The Dusk Exchange", mundaneItems: "4", commonItems: "1", uncommonItems: "3", rareItems: "2", veryRareItems: "0", legendaryItems: "0", artifactItems: "0" }
  },
  {
    name: "The Verdant Reliquary",
    description: "A druidic temple-market at the edge of a primeval forest. Nature's gifts: potions, staffs, and living armour.",
    shopType: "Temple", tier: "Wealthy", region: "Frontier", reputation: "Honest Shop",
    formData: { shopName: "The Verdant Reliquary", mundaneItems: "8", commonItems: "5", uncommonItems: "4", rareItems: "2", veryRareItems: "1", legendaryItems: "0", artifactItems: "0" }
  },
];

@Component({
  selector: 'app-shop-presets',
  templateUrl: './shop-presets.html',
  styleUrls: ['./shop-presets.css'],
  standalone: false,
  animations: [
    trigger('expandBody', [

      state('collapsed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),

      state('expanded', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),

      transition('collapsed <=> expanded', [
        animate('350ms cubic-bezier(.4,0,.2,1)')
      ])
    ])
  ]
})

export class ShopPresets implements OnInit {

  @Output() presetSelected = new EventEmitter<ShopPreset>();

  isExpanded = false;
  toggleExpanded() { this.isExpanded = !this.isExpanded; }

  allPresets: ShopPreset[] = SHOP_PRESETS;
  filtered: ShopPreset[] = [...SHOP_PRESETS];

  shopTypes = ['All', 'Blacksmith', 'Arcane', 'Alchemist', 'Temple', 'Traveling Merchant', 'Fey Trader'];
  tiers = ['All', 'Poor', 'Standard', 'Wealthy', 'Legendary'];
  regions = ['All', 'Civilized', 'Frontier', 'Underdark', 'Feywild'];
  reputations = ['All', 'Honest Shop', 'Suspicious Shop', 'Black Market', 'Legendary Merchant'];

  activeType = 'All';
  activeTier = 'All';
  activeRegion = 'All';
  activeRep = 'All';

  ngOnInit() { this.applyFilters(); }

  select(cat: 'type' | 'tier' | 'region' | 'rep', val: string) {
    if (cat === 'type') this.activeType = val;
    if (cat === 'tier') this.activeTier = val;
    if (cat === 'region') this.activeRegion = val;
    if (cat === 'rep') this.activeRep = val;
    this.applyFilters();
  }

  applyFilters() {
    this.filtered = this.allPresets.filter(p =>
      (this.activeType === 'All' || p.shopType === this.activeType) &&
      (this.activeTier === 'All' || p.tier === this.activeTier) &&
      (this.activeRegion === 'All' || p.region === this.activeRegion) &&
      (this.activeRep === 'All' || p.reputation === this.activeRep)
    );
  }

  applyPreset(preset: ShopPreset) {
    this.presetSelected.emit(preset);
  }

  repClass(rep: string): string {
    return {
      'Honest Shop': 'rep-honest', 'Suspicious Shop': 'rep-suspicious',
      'Black Market': 'rep-black', 'Legendary Merchant': 'rep-legendary'
    }[rep] ?? '';
  }

  tierClass(tier: string): string {
    return {
      'Poor': 'tier-poor', 'Standard': 'tier-std',
      'Wealthy': 'tier-wealthy', 'Legendary': 'tier-leg'
    }[tier] ?? '';
  }

  typeIcon(type: string): string {
    return {
      'Blacksmith': '⚒', 'Arcane': '✦', 'Alchemist': '⚗',
      'Temple': '☩', 'Traveling Merchant': '⛟', 'Fey Trader': '✿'
    }[type] ?? '◈';
  }
}