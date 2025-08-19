import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Item, MagicItem } from '../models/item-model';
import { InputDatas, RandomInputData, NewItemData } from '../input-datas';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {jsPDF} from 'jspdf';
import { TipForTypePipe} from '../shared/pipes/pipes';



@Component({
  selector: 'app-generated-form',
  standalone: false,
  templateUrl: './generated-form.html',
  
  styleUrls: ['./generated-form.css']  
})
export class GeneratedForm implements OnInit, OnDestroy {

  
  shops: { name: string; id: string; formData: any }[] = [];

  displayedColumns: string[] = ['qtdy', 'name', 'type', 'rarity', 'cost', 'weight', 'source', 'edit'];
  dataSource = new MatTableDataSource<Item | MagicItem>();
  shopId: string | null = null;
  formValues: any;
  randomItems: (Item | MagicItem)[] = [];
  manualItems: (Item | MagicItem)[] = [];

  allItems: Item[] = [];
  allMagicItems: MagicItem[] = [];

  selectedSources: string[] = [];



  private routeSub?: Subscription;
  private formDataSub?: Subscription;
  private selectedSourcesSub?: Subscription;
  private randomDataSub?: Subscription;
  private newItemDataSub?: Subscription;

  constructor(
      
    private dataShare: InputDatas,
    private randomDataShare: RandomInputData,
    private http: HttpClient,
    private newItemDataShare: NewItemData,
    private route: ActivatedRoute,
    private tipForTypePipe: TipForTypePipe,
    
  ) {}

  ngOnInit(): void {

     this.shops = this.dataShare.getShops(); 

    // Subscribe to route params to handle navigation within the same component
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.shopId = params.get('id');
      if (this.shopId) {
        const shopData = this.dataShare.getShopById(this.shopId);
        if (shopData) {
          this.formValues = shopData.formData;
          this.updateItemsList();
        } else {
          console.warn(`Shop with id ${this.shopId} not found.`);
          this.formValues = null;
          this.updateItemsList();
        }
      } else {
        this.formValues = null;
        this.updateItemsList();
      }
    });

    
    this.http
      .get<{ items: Item[]; magicItems: { name: string; children: MagicItem[] }[] }>('assets/data/full_magic_items_list.json')
      .subscribe(data => {
        this.allItems = data.items.filter(item => item.rarity === 'Mun.');

        const allowedRarities = ['Mun','Com.', 'Var.', 'Rare', 'V.Rare','Unc.', 'Leg.', 'Art.', 'Unk.'];
        this.allMagicItems = data.magicItems
          .flatMap(group => group.children)
          .filter(mItem => allowedRarities.includes(mItem.rarity));

        this.updateItemsList();
      });

    this.formDataSub = this.dataShare.formData$.subscribe(data => {
      this.formValues = data;
      this.updateItemsList();
    });

    this.selectedSourcesSub = this.dataShare.selectedSources$.subscribe(sources => {
      this.selectedSources = sources;
      this.updateItemsList();
    });

    this.randomDataSub = this.randomDataShare.randomData$.subscribe(data => {
  if (data && data.randomItemsArray) {
    this.manualItems = [...data.randomItemsArray]; 
  } else {
    this.manualItems = [];
  }
  this.dataSource.data = [...this.randomItems, ...this.manualItems];
});

    this.newItemDataSub = this.newItemDataShare.newItemData$.subscribe(newItemData => {
      if (newItemData?.newItemData) {
        try {
          const newItem = JSON.parse(newItemData.newItemData);
          this.manualItems.push(newItem);
          this.dataSource.data = [...this.randomItems, ...this.manualItems];
        } catch (error) {
          console.error('Failed to parse new item JSON:', error);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.formDataSub?.unsubscribe();
    this.selectedSourcesSub?.unsubscribe();
    this.randomDataSub?.unsubscribe();
    this.newItemDataSub?.unsubscribe();
  }

  private updateItemsList(): void {
    if (!this.formValues || (!this.allItems.length && !this.allMagicItems.length)) {
      this.randomItems = [];
      this.dataSource.data = [...this.manualItems];
      return;
    }

    const mundaneCount = parseInt(this.formValues.mundaneItems, 10);
    const commonCount = parseInt(this.formValues.commonItems, 10);
    const uncommonCount = parseInt(this.formValues.uncommonItems, 10);
    const rareCount = parseInt(this.formValues.rareItems, 10);
    const veryRareCount = parseInt(this.formValues.veryRareItems, 10);
    const legendaryCount = parseInt(this.formValues.legendaryItems, 10);
    const artifactCount = parseInt(this.formValues.artifactItems, 10);

    if (
      [mundaneCount, commonCount, uncommonCount, rareCount, veryRareCount, legendaryCount, artifactCount].every(
        c => isNaN(c) || c <= 0
      )
    ) {
      this.randomItems = [];
      this.dataSource.data = [...this.manualItems];
      return;
    }

    const result: (Item | MagicItem)[] = [];

    // Filter mundane items by selected sources if any
    let filteredMundane = this.allItems;
    if (this.selectedSources.length > 0) {
      filteredMundane = filteredMundane.filter(item => this.selectedSources.includes(item.source));
    }
    if (!isNaN(mundaneCount) && mundaneCount > 0) {
      const shuffledMundane = this.shuffleArray([...filteredMundane])
        .slice(0, mundaneCount)
        .map(item => ({ ...item, quantity: 1 }));
      result.push(...shuffledMundane);
    }

    const addMagicItemsByRarity = (rarity: string | string[], count: number) => {
      if (!isNaN(count) && count > 0) {
        let filtered = this.allMagicItems.filter(item =>
          Array.isArray(rarity)
            ? rarity.includes(item.rarity)
            : item.rarity === rarity
        );

        if (this.selectedSources.length > 0) {
          filtered = filtered.filter(item =>
            this.selectedSources.includes(item.source)
          );
        }

        const shuffled = this.shuffleArray([...filtered])
          .slice(0, count)
          .map(item => ({ ...item, quantity: 1 }));
        result.push(...shuffled);
      }
    };

    addMagicItemsByRarity(['Com.'], commonCount);
    addMagicItemsByRarity(['Unc.', 'Var.'], uncommonCount);
    addMagicItemsByRarity(['Rare', 'Var.'], rareCount);
    addMagicItemsByRarity(['V.Rare', 'Var.'], veryRareCount);
    addMagicItemsByRarity(['Leg.', 'Var.'], legendaryCount);
    addMagicItemsByRarity(['Art.', 'Var.'], artifactCount);

    this.randomItems = result;
    this.dataSource.data = [...this.randomItems, ...this.manualItems];
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  clearItems(): void {
    this.randomItems = [];
    this.manualItems = [];
    this.dataSource.data = [];
  }

  editingIndex: number | string |null = null;

  editItems(index: number) {
    this.editingIndex = index;
  }

  saveEdit() {
    this.editingIndex = null;
  }

downloadPDF() {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Load parchment image
  const parchmentImg = new Image();
  parchmentImg.src = '/assets/images/scroll.png';

  parchmentImg.onload = () => {
    const leftMargin = 25; // left margin
    const topMargin = 60;  // start after header
    const lineHeight = 8;  // row spacing
    const maxRowsPerPage = 22;

    let y = topMargin;
    let rowCount = 0;

    // Column widths: Qty, Name, Type, Cost, Weight
    const columnWidths = [12, 50, 60, 30, 20];
    const headers = ['Qty', 'Name', 'Type', 'Cost', 'Weight'];

    // Draw full-page parchment
    pdf.addImage(parchmentImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // Draw shop header
    pdf.setFont('MedievalSharp', 'normal');
    pdf.setFontSize(16);
    pdf.text('Magic Shoppe', pdfWidth / 2, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Providing quality magical wares since 1368 DR', pdfWidth / 2, 28, { align: 'center' });

    // Draw table header
    pdf.setFontSize(10);
    let x = leftMargin;
    headers.forEach((header, i) => {
      pdf.text(header, x, y);
      x += columnWidths[i];
    });
    y += lineHeight;

    // Draw table rows
    this.dataSource.data.forEach(item => {
      x = leftMargin;
      rowCount++;

      const row = [
        item.quantity?.toString() || '1',
        item.name || '',
        this.tipForTypePipe.transform(item.type || ''),
        item.cost || '',
        item.weight || ''
      ];

      row.forEach((cell, i) => {
        const text = cell ? cell.toString() : '';
        if (headers[i] === 'Name' || headers[i] === 'Type') {
          // Word-wrap for Name and Type
          const splitText = pdf.splitTextToSize(text, columnWidths[i] - 2);
          pdf.text(splitText, x, y);
          if (splitText.length > 1) {
            y += (splitText.length - 1) * lineHeight;
          }
        } else {
          pdf.text(text, x, y);
        }
        x += columnWidths[i];
      });

      y += lineHeight;

      // New page if row limit reached or bottom exceeded
      if (rowCount >= maxRowsPerPage || y > pdfHeight - 20) {
        pdf.addPage();
        pdf.addImage(parchmentImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        y = topMargin;
        rowCount = 0;

        // Re-draw table header on new page
        x = leftMargin;
        headers.forEach((header, i) => {
          pdf.text(header, x, y);
          x += columnWidths[i];
        });
        y += lineHeight;
      }
    });

    pdf.save('magic-shop-scroll.pdf');
  };

  parchmentImg.onerror = (err) => {
    console.error('Failed to load parchment image', err);
  };
}


}

