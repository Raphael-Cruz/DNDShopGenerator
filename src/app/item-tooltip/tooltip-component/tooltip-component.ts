import {
  Component, Input, OnChanges, SimpleChanges,
  ChangeDetectionStrategy, ChangeDetectorRef,
  HostListener, Output, EventEmitter
} from '@angular/core';
import { Item } from '../../models/item-model';
import { TooltipDescriptionUtility } from '../../item-tooltip/tooltip-description-utility/tooltip-description-utility';

@Component({
  selector: 'app-item-tooltip',
  standalone: false,
  templateUrl: './tooltip-component.html',
  styleUrls: ['./tooltip-component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ItemTooltipComponent implements OnChanges {
  @Input() item: Item | null = null;
  @Input() x = 0;
  @Input() y = 0;
  @Input() visible = false;

  /** When true the tooltip is "pinned" — stays open and is scrollable */
  @Input() pinned = false;

  /** Emits when the user clicks the close button on a pinned tooltip */
  @Output() closed = new EventEmitter<void>();

  tags: string[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.item) {
      this.tags = this.buildTags(this.item);
      this.cdr.markForCheck();
    }
  }

  /** Called by the directive when the user clicks the row */
  pin() {
    this.pinned = true;
    this.cdr.markForCheck();
  }

  unpin() {
    this.pinned = false;
    this.closed.emit();
    this.cdr.markForCheck();
  }

  /** Close button inside the tooltip */
  onClose(event: MouseEvent) {
    event.stopPropagation();
    this.unpin();
  }

  /** Stop hover-leave from hiding a pinned tooltip */
  get isVisible(): boolean {
    return this.visible || this.pinned;
  }

  private buildTags(item: Item): string[] {
    const t: string[] = [];

    const typeMap: Record<string, string> = {
      'A': 'Ammunition', 'AF': 'Ammunition', 'AT': "Artisan's Tools",
      'EM': 'Eldritch Machine', 'EXP': 'Explosive', 'FD': 'Food & Drink',
      'G': 'Adventuring Gear', 'GS': 'Gaming Set', 'HA': 'Heavy Armor',
      'INS': 'Instrument', 'LA': 'Light Armor', 'M': 'Melee Weapon',
      'MA': 'Medium Armor', 'MNT': 'Mount', 'P': 'Potion',
      'R': 'Ranged Weapon', 'RD': 'Rod', 'RG': 'Ring',
      'S': 'Shield', 'SC': 'Scroll', 'SCF': 'Spellcasting Focus',
      'T': 'Tools', 'TG': 'Trade Good', 'WD': 'Wand',
      'VEH': 'Vehicle (Land)', 'SHP': 'Vehicle (Water)',
      'AIR': 'Vehicle (Air)', 'SPC': 'Vehicle (Space)',
    };

    if (item.weaponCategory) {
      t.push('Weapon');
      t.push(item.weaponCategory);
    } else if (item.type) {
      t.push(typeMap[item.type] ?? item.type);
    } else {
      t.push('Wondrous Item');
    }

    if (item.property?.length) {
      item.property.slice(0, 2).forEach(p => {
        const propMap: Record<string, string> = {
          'T': 'Thrown', 'F': 'Finesse', 'L': 'Light', 'H': 'Heavy',
          'R': 'Reach', 'V': 'Versatile', 'A': 'Ammunition',
          'LD': 'Loading', 'S': 'Special', 'RLD': 'Reload'
        };
        t.push(propMap[p] ?? p);
      });
    }

    if (item.rarity) {
      const rarityDisplay: Record<string, string> = {
        'Mun.': 'Mundane', 'Com.': 'Common', 'Unc.': 'Uncommon',
        'Rare': 'Rare', 'V.Rare': 'Very Rare', 'Leg.': 'Legendary',
        'Art.': 'Artifact',
        // also handle full names from the raw JSON
        'mundane': 'Mundane', 'common': 'Common', 'uncommon': 'Uncommon',
        'rare': 'Rare', 'very rare': 'Very Rare', 'legendary': 'Legendary',
        'artifact': 'Artifact'
      };
      t.push(rarityDisplay[item.rarity] ?? item.rarity);
    }

    if (item.reqAttune) {
      t.push(typeof item.reqAttune === 'string' && item.reqAttune !== 'true'
        ? `Attune: ${item.reqAttune}` : 'Requires Attunement');
    }

    return t;
  }

  rarityClass(item: Item): string {
    const r = (item.rarity ?? '').toLowerCase().trim();
    if (r.includes('artifact') || r === 'art.') return 'artifact';
    if (r.includes('legendary') || r === 'leg.') return 'legendary';
    if (r.includes('very') || r === 'v.rare') return 'very-rare';
    if (r === 'rare') return 'rare';
    if (r.includes('uncommon') || r === 'unc.') return 'uncommon';
    if (r.includes('common') || r === 'com.') return 'common';
    if (r.includes('mundane') || r === 'mun.') return 'mundane';
    return 'common';
  }

  get description(): string {
    if (!this.item) return '';
    return TooltipDescriptionUtility.getDescription(this.item);
  }
}