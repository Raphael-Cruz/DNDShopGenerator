import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Item } from '../models/item-model';
import { InputDatas, RandomInputData, NewItemData } from '../input-datas';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import { TipForTypePipe } from '../shared/pipes/pipes';
import { ShopGeneratorService } from '../core/services/shop-generator-service';
import { Shop } from '../models/shop-model';

@Component({
  selector: 'app-generated-form',
  templateUrl: './generated-form.html',
  standalone: false,
  styleUrls: ['./generated-form.css']
})
export class GeneratedForm implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatSort) sort!: MatSort;
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
  isSaving = false;
  shop!: Shop;

  constructor(
    private dataShare: InputDatas,
    private randomDataShare: RandomInputData,
    private newItemDataShare: NewItemData,
    private route: ActivatedRoute,
    private router: Router,
    private tipForTypePipe: TipForTypePipe,
    private generator: ShopGeneratorService
  ) { }

  ngOnInit(): void {
    this.generate();

    // Load full item catalogue first so we can enrich shop items later
    if (this.dataShare.getAllItems().length === 0) {
      this.dataShare.refreshItems();
    }

    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        this.shopId = params.get('id');
        if (this.shopId) {
          this.dataShare.getShopById(this.shopId).subscribe({
            next: (shopData) => {
              this.formValues = shopData?.formData ?? null;
              if (shopData.items && shopData.items.length > 0) {
                this.randomItems = shopData.items.map(i => this.normalizeToItem(i));
                this.randomItems = this.enrichItemsWithCatalogue(this.randomItems);
                this.refreshDataSource();
              } else {
                this.updateItemsList();
              }
            },
            error: (err) => console.error('Failed to fetch shop', err)
          });
        } else {
          this.formValues = this.dataShare.getFormData();
          this.updateItemsList();
        }
      })
    );

    this.subscriptions.push(
      this.dataShare.items$.subscribe(items => {
        this.allItems = items;
        if (!this.shopId) {
          this.updateItemsList();
        } else {
          // Re-enrich now that catalogue is loaded
          this.randomItems = this.enrichItemsWithCatalogue(this.randomItems);
          this.refreshDataSource();
        }
      })
    );

    this.subscriptions.push(
      this.dataShare.formData$.subscribe(data => {
        this.formValues = data;
        if (!this.shopId) this.updateItemsList();
      })
    );

    this.subscriptions.push(
      this.dataShare.selectedSources$.subscribe(sources => {
        this.selectedSources = sources;
        if (!this.shopId) this.updateItemsList();
      })
    );

    this.subscriptions.push(
      this.randomDataShare.randomData$.subscribe(data => {
        this.randomItems = data?.randomItemsArray ?? [];
        this.randomItems = this.enrichItemsWithCatalogue(this.randomItems);
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

    this.subscriptions.push(
      this.dataShare.shopUpdated$.subscribe(updatedId => {
        if (updatedId && updatedId === this.shopId) {
          this.dataShare.getShopById(updatedId).subscribe({
            next: (shopData) => {
              this.formValues = shopData?.formData ?? null;
              if (shopData.items) {
                this.randomItems = shopData.items.map(i => this.normalizeToItem(i));
                this.randomItems = this.enrichItemsWithCatalogue(this.randomItems);
                this.refreshDataSource();
              }
            },
            error: (err) => console.error('Failed to re-fetch shop after update', err)
          });
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
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

  /**
   * Enriches a list of items (typically loaded from shop.items, which may
   * only carry display fields) with the full item data from the catalogue
   * (allItems, loaded from the items collection).
   *
   * Matching is done by name + source (most unique combination available).
   * If only name matches, that is used as a fallback.
   *
   * Fields that are already set on the shop item (cost, quantity, weight) are
   * preserved — only MISSING fields (entries, description, etc.) are filled in.
   */
  private enrichItemsWithCatalogue(items: Item[]): Item[] {
    if (!this.allItems.length) return items;

    return items.map(shopItem => {
      // Skip if already has description content
      const hasEntries = Array.isArray(shopItem.entries) && shopItem.entries.length > 0;
      const hasDescription = shopItem.description && shopItem.description.trim().length > 0;
      if (hasEntries || hasDescription) return shopItem;

      // Find matching item in catalogue
      const nameNorm = (shopItem.name ?? '').toLowerCase().trim();
      const sourceNorm = (shopItem.source ?? '').toLowerCase().trim();

      const match =
        // Prefer exact name + source match
        this.allItems.find(
          ci =>
            ci.name?.toLowerCase().trim() === nameNorm &&
            ci.source?.toLowerCase().trim() === sourceNorm
        ) ??
        // Fallback: name only
        this.allItems.find(ci => ci.name?.toLowerCase().trim() === nameNorm);

      if (!match) return shopItem;

      // Merge: shop item fields win for display/editable fields;
      // catalogue fills in missing content fields
      return {
        ...match,          // Full catalogue data (entries, description, etc.)
        ...shopItem,       // Shop item overrides (cost, quantity, weight, rarity set by DM)
        // Restore catalogue entries/description if shop item had them blank
        entries: hasEntries ? shopItem.entries : (match.entries ?? []),
        description: hasDescription ? shopItem.description : (match.description ?? ''),
      };
    });
  }

  private updateItemsList(): void {
    if (this.shopId) { this.refreshDataSource(); return; }
    if (!this.formValues) { this.refreshDataSource(); return; }

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
      result.push(...this.shuffleArray(pool).slice(0, count).map(i => this.normalizeToItem(i)));
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

  private get currentItems(): Item[] {
    return [...this.randomItems, ...this.manualItems];
  }

  private persistToBackend(): void {
    if (!this.shopId) return;
    this.dataShare.updateShopItems(this.shopId, this.currentItems).subscribe({
      next: () => console.log('Shop items saved to DB'),
      error: (err) => console.error('Failed to persist shop items', err)
    });
  }

  editItems(index: number) {
    this.editingIndex = index;
  }

  saveEdit() {
    this.editingIndex = null;
    this.persistToBackend();
  }

  deleteItems(item: Item) {
    this.randomItems = this.randomItems.filter(i => i !== item);
    this.manualItems = this.manualItems.filter(i => i !== item);
    this.refreshDataSource();
    this.persistToBackend();
  }

  saveShop() {
    if (!this.shopId) return;
    this.isSaving = true;
    this.dataShare.updateShopItems(this.shopId, this.currentItems).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Shop saved successfully!');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to save shop', err);
        alert('Failed to save shop.');
      }
    });
  }

  clearItems() {
    this.manualItems = [];
    this.randomItems = [];
    this.refreshDataSource();
    this.persistToBackend();
  }

  generate() {
    this.shop = this.generator.generateShop();
  }

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
      headers.forEach((header, i) => { pdf.text(header, x, y); x += columnWidths[i]; });
      y += lineHeight;

      items.forEach(item => {
        x = 25; rowCount++;
        const row = [
          item.quantity?.toString() || '1',
          item.name || '',
          this.tipForTypePipe.transform(item.type || ''),
          item.cost?.toString() || '0',
          item.weight?.toString() || '0'
        ];
        row.forEach((cell, i) => {
          const text = cell?.toString() ?? '';
          if (headers[i] === 'Name' || headers[i] === 'Type') {
            const splitText = pdf.splitTextToSize(text, columnWidths[i] - 2);
            pdf.text(splitText, x, y);
            if (splitText.length > 1) y += (splitText.length - 1) * lineHeight;
          } else {
            pdf.text(text, x, y);
          }
          x += columnWidths[i];
        });
        y += lineHeight;
        if (rowCount >= maxRowsPerPage || y > pdfHeight - 20) {
          pdf.addPage();
          pdf.addImage(parchmentImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          y = topMargin; rowCount = 0; x = 25;
          headers.forEach((h, i) => { pdf.text(h, x, y); x += columnWidths[i]; });
          y += lineHeight;
        }
      });

      pdf.save('magic-shop-scroll.pdf');
    };

    parchmentImg.onerror = err => console.error('Failed to load parchment image', err);
  }
}