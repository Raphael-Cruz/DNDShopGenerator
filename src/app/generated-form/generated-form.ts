import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from '../models/item-model';
import { InputDatas, RandomInputData, NewItemData } from '../input-datas';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import { TipForTypePipe } from '../shared/pipes/pipes';

@Component({
  selector: 'app-generated-form',
  templateUrl: './generated-form.html',
  standalone: false,
  styleUrls: ['./generated-form.css']
})
export class GeneratedForm implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Item>();
  displayedColumns: string[] = ['qtdy', 'name', 'type', 'rarity', 'cost', 'weight', 'source', 'edit', 'delete'];

  shops: { name: string; id: string; formData: any }[] = [];
  formValues: any = null;
  shopId: string | null = null;

  randomItems: Item[] = [];
  manualItems: Item[] = [];
  allItems: Item[] = [];
  selectedSources: string[] = [];

  private subscriptions: Subscription[] = [];

  editingIndex: number | null = null;

  constructor(
    private dataShare: InputDatas,
    private randomDataShare: RandomInputData,
    private newItemDataShare: NewItemData,
    private route: ActivatedRoute,
    private router: Router,
    private tipForTypePipe: TipForTypePipe
  ) {}

  ngOnInit(): void {
    this.shops = this.dataShare.getShops();

    // --- Route param subscription ---
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        this.shopId = params.get('id');
        if (this.shopId) {
          const shopData = this.dataShare.getShopById(this.shopId);
          this.formValues = shopData?.formData ?? null;
        } else {
          this.formValues = null;
        }
        this.updateItemsList();
      })
    );

    // --- All items from service ---
    this.allItems = this.dataShare.getAllItems();

    // --- Reactive subscriptions ---
    this.subscriptions.push(
      this.dataShare.formData$.subscribe(data => {
        this.formValues = data;
        this.updateItemsList();
      })
    );

    this.subscriptions.push(
      this.dataShare.selectedSources$.subscribe(sources => {
        this.selectedSources = sources;
        this.updateItemsList();
      })
    );

    this.subscriptions.push(
      this.randomDataShare.randomData$.subscribe(data => {
        this.randomItems = data?.randomItemsArray ?? [];
        this.refreshDataSource();
      })
    );

    this.subscriptions.push(
      this.newItemDataShare.newItemData$.subscribe(newItemData => {
        if (newItemData?.newItemData) {
          try {
            const newItem: Item = JSON.parse(newItemData.newItemData);
            this.manualItems.push(this.normalizeToItem(newItem));
            this.refreshDataSource();
          } catch (err) {
            console.error('Failed to parse new item JSON', err);
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private refreshDataSource() {
    this.dataSource.data = [...this.randomItems, ...this.manualItems];
  }

  private normalizeToItem(raw: Item): Item {
    return {
      ...raw,
      cost: typeof raw.cost === 'string' ? parseFloat(raw.cost) || 0 : raw.cost || 0,
      weight: typeof raw.weight === 'string' ? parseFloat(raw.weight as string) || 0 : raw.weight || 0,
      quantity: raw.quantity ?? 1
    };
  }

  private updateItemsList(): void {
    if (!this.formValues) {
      this.refreshDataSource();
      return;
    }

    const counts = {
      mundane: parseInt(this.formValues.mundaneItems, 10),
      common: parseInt(this.formValues.commonItems, 10),
      uncommon: parseInt(this.formValues.uncommonItems, 10),
      rare: parseInt(this.formValues.rareItems, 10),
      veryRare: parseInt(this.formValues.veryRareItems, 10),
      legendary: parseInt(this.formValues.legendaryItems, 10),
      artifact: parseInt(this.formValues.artifactItems, 10),
    };

    const result: Item[] = [];

    const addItemsByRarity = (rarity: string, count: number) => {
      if (isNaN(count) || count <= 0) return;
      let pool = this.allItems.filter(i => i.rarity === rarity);
      if (this.selectedSources.length) {
        pool = pool.filter(i => i.source && this.selectedSources.includes(i.source));
      }
      const selected = this.shuffleArray(pool).slice(0, count).map(i => this.normalizeToItem(i));
      result.push(...selected);
    };

    addItemsByRarity('Mun.', counts.mundane);
    addItemsByRarity('Com.', counts.common);
    addItemsByRarity('Unc.', counts.uncommon);
    addItemsByRarity('Rare', counts.rare);
    addItemsByRarity('V.Rare', counts.veryRare);
    addItemsByRarity('Leg.', counts.legendary);
    addItemsByRarity('Art.', counts.artifact);

    this.randomItems = result;
    this.refreshDataSource();
  }

  private shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  editItems(index: number) { this.editingIndex = index; }
  saveEdit() { this.editingIndex = null; }

  deleteItems(item: Item) {
    this.manualItems = this.manualItems.filter(i => i.name !== item.name || i.type !== item.type);
    this.randomItems = this.randomItems.filter(i => i.name !== item.name || i.type !== item.type);
    this.refreshDataSource();
  }

  clearItems() {
    this.manualItems = [];
    this.randomItems = [];
    this.refreshDataSource();
  }

  // --- PDF downloader ---
  downloadPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const topMargin = 60;
    const lineHeight = 8;
    const maxRowsPerPage = 22;
    let y = topMargin;
    let rowCount = 0;

    const columnWidths = [12, 50, 60, 30, 20];
    const headers = ['Qty', 'Name', 'Type', 'Cost', 'Weight'];

    const items = this.dataSource.data;

    const parchmentImg = new Image();
    parchmentImg.src = '/assets/images/scroll.png';

    parchmentImg.onload = () => {
      pdf.addImage(parchmentImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      pdf.setFont('MedievalSharp', 'normal');
      pdf.setFontSize(16);
      pdf.text('Magic Shoppe', pdfWidth / 2, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text('Providing quality magical wares since 1368 DR', pdfWidth / 2, 28, { align: 'center' });

      pdf.setFontSize(10);
      let x = 25;
      headers.forEach((header, i) => {
        pdf.text(header, x, y);
        x += columnWidths[i];
      });
      y += lineHeight;

      items.forEach(item => {
        x = 25;
        rowCount++;

        const row = [
          item.quantity?.toString() || '1',
          item.name || '',
          this.tipForTypePipe.transform(item.type || ''),
          item.cost?.toString() || '0',
          item.weight?.toString() || '0'
        ];

        row.forEach((cell, i) => {
          const text = cell ? cell.toString() : '';
          if (headers[i] === 'Name' || headers[i] === 'Type') {
            const splitText = pdf.splitTextToSize(text, columnWidths[i] - 2);
            pdf.text(splitText, x, y);
            if (splitText.length > 1) y += (splitText.length - 1) * lineHeight;
          } else pdf.text(text, x, y);
          x += columnWidths[i];
        });

        y += lineHeight;
        if (rowCount >= maxRowsPerPage || y > pdfHeight - 20) {
          pdf.addPage();
          pdf.addImage(parchmentImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          y = topMargin;
          rowCount = 0;
          x = 25;
          headers.forEach((header, i) => { pdf.text(header, x, y); x += columnWidths[i]; });
          y += lineHeight;
        }
      });

      pdf.save('magic-shop-scroll.pdf');
    };

    parchmentImg.onerror = err => console.error('Failed to load parchment image', err);
  }
}
