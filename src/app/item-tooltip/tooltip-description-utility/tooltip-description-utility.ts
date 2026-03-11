import { Component } from '@angular/core';

/**
 * TooltipDescriptionUtility
 *
 * Handles all entry structures found in the 5e tools JSON format:
 *  - Plain strings (possibly containing {@tag text|source} notation)
 *  - { type: 'entries', name?, entries[] }
 *  - { type: 'list',   style?, items[]  }
 *  - { type: 'table',  caption?, colLabels[], rows[][] }
 *
 * Also strips the {@tag ...} inline markup so only readable text reaches the tooltip.
 */

export interface TableEntry {
  type: 'table';
  caption?: string;
  colLabels: string[];
  colStyles: string[];
  rows: string[][];
}

export interface ListEntry {
  type: 'list';
  style?: string;
  items: Array<string | TableEntry | EntriesEntry | ListEntry>;
}

export interface EntriesEntry {
  type: 'entries';
  name?: string;
  entries: Array<string | TableEntry | ListEntry | EntriesEntry>;
}

export type Entry = string | TableEntry | ListEntry | EntriesEntry;

@Component({
  selector: 'app-tooltip-description-utility',
  standalone: false,
  templateUrl: './tooltip-description-utility.html',
  styleUrls: ['./tooltip-description-utility.css'],
})
export class TooltipDescriptionUtility {

  // ─────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────

  static getDescription(item: any): string {
    if (!item) return '';

    // Priority 1: user-typed description field
    if (this.isValidString(item.description)) {
      return this.cleanTags(item.description.trim());
    }

    // Priority 2: entries array from DB (the primary source for 5e tools data)
    if (Array.isArray(item.entries) && item.entries.length > 0) {
      const extracted = this.extractFromEntries(item.entries as Entry[]);
      if (extracted.trim()) return extracted.trim();
    }

    // Priority 3: text field (some items use this instead of entries)
    if (this.isValidString(item.text)) {
      return this.cleanTags(item.text.trim());
    }

    // Priority 4: fall back to the item name itself
    return item.name ?? '';
  }

  static getSummary(item: any, maxChars = 250): string {
    const full = this.getDescription(item);
    if (full.length <= maxChars) return full;
    const truncated = full.substring(0, maxChars);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > maxChars * 0.8 ? truncated.substring(0, lastSpace) : truncated) + '…';
  }

  static hasDescription(item: any): boolean {
    return this.getDescription(item).trim().length > 0;
  }

  static getFormattedDescription(item: any): string {
    return this.getDescription(item).replace(/\s+/g, ' ').trim();
  }

  // ─────────────────────────────────────────────────────────────
  // {@tag} cleaner
  // ─────────────────────────────────────────────────────────────

  /**
   * Strips 5etools inline tags like:
   *   {@dice 1d4}           → "1d4"
   *   {@item sword|PHB}     → "sword"
   *   {@spell fireball}     → "fireball"
   *   {@book PH|PHB|1}      → "PH"
   *   {@b bold text}        → "bold text"
   *   {@hit +5}             → "+5"
   *   {@damage 2d6 fire}    → "2d6 fire"
   *   {@condition poisoned} → "poisoned"
   */
  static cleanTags(text: string): string {
    if (!text) return '';
    // Repeatedly replace until no more tags remain (handles nested tags)
    let result = text;
    let previous = '';
    while (result !== previous) {
      previous = result;
      // {@tag displayText|optionalPipe1|optionalPipe2}
      // Capture everything up to the first pipe or closing brace as display text
      result = result.replace(/\{@\w+\s+([^|}]+?)(?:\|[^}]*)?\}/g, '$1');
      // {@tag} with no content — remove entirely
      result = result.replace(/\{@\w+\}/g, '');
    }
    return result;
  }

  // ─────────────────────────────────────────────────────────────
  // Entry extraction
  // ─────────────────────────────────────────────────────────────

  private static extractFromEntries(entries: Entry[]): string {
    return entries
      .map(e => this.extractFromEntry(e))
      .filter(Boolean)
      .join('\n\n');
  }

  private static extractFromEntry(entry: Entry): string {
    if (!entry) return '';

    // ── Plain string ──
    if (typeof entry === 'string') {
      return this.cleanTags(entry);
    }

    // ── Table ──
    if (this.isTable(entry)) {
      // Tables are too wide for a tooltip — just surface the caption
      return entry.caption ? this.cleanTags(entry.caption) : '';
    }

    // ── List ──
    if (this.isList(entry)) {
      const items = (entry.items as Entry[])
        .map(item => {
          const text = this.extractFromEntry(item);
          return text ? `• ${text}` : '';
        })
        .filter(Boolean);
      return items.join('\n');
    }

    // ── Entries (nested section with optional name/title) ──
    if (this.isEntries(entry)) {
      const parts: string[] = [];
      if (entry.name) {
        parts.push(`${this.cleanTags(entry.name)}:`);
      }
      const nested = this.extractFromEntries(entry.entries as Entry[]);
      if (nested) parts.push(nested);
      return parts.join(' ');
    }

    return '';
  }

  // ─────────────────────────────────────────────────────────────
  // Type guards
  // ─────────────────────────────────────────────────────────────

  private static isTable(entry: Entry): entry is TableEntry {
    return typeof entry === 'object' && (entry as any).type === 'table';
  }

  private static isList(entry: Entry): entry is ListEntry {
    return typeof entry === 'object' && (entry as any).type === 'list';
  }

  private static isEntries(entry: Entry): entry is EntriesEntry {
    return typeof entry === 'object' && (entry as any).type === 'entries';
  }

  private static isValidString(value: any): boolean {
    return value && typeof value === 'string' && value.trim().length > 0;
  }

  // ─────────────────────────────────────────────────────────────
  // Metadata fallback
  // ─────────────────────────────────────────────────────────────

  private static constructBasicInfo(item: any): string {
    const parts: string[] = [];
    if (item.type) parts.push(`Type: ${item.type}`);
    if (item.rarity) parts.push(`Rarity: ${item.rarity}`);
    if (item.weight) parts.push(`Weight: ${item.weight} lb`);
    if (item.cost) parts.push(`Cost: ${item.cost} gp`);
    return parts.join(' | ');
  }
}