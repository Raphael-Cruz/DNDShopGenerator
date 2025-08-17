import { Component,Input  } from '@angular/core';


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
  items: Array<string | TableEntry | EntriesEntry>;
}

export interface EntriesEntry {
  type: 'entries';
  entries: Array<string | TableEntry | ListEntry | EntriesEntry>;
}

export type Entry = string | TableEntry | ListEntry | EntriesEntry;



@Component({
  selector: 'app-entry-block',
  standalone: false,
  templateUrl: './entry-block.html',
  styleUrl: './entry-block.css'
})
export class EntryBlock {
@Input() entry!: Entry;

  isTable(entry: Entry): entry is TableEntry {
    return typeof entry === 'object' && entry.type === 'table';
  }

  isList(entry: Entry): entry is ListEntry {
    return typeof entry === 'object' && entry.type === 'list';
  }

  isEntries(entry: Entry): entry is EntriesEntry {
    return typeof entry === 'object' && entry.type === 'entries';
  }
}

