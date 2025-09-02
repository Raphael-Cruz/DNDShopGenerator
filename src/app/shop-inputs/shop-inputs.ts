import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { InputDatas, FormDataType } from '../input-datas';
import { Item } from '../models/item-model';

@Component({
  selector: 'app-shop-inputs',
  standalone: false,
  templateUrl: './shop-inputs.html',
  styleUrls: ['./shop-inputs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopInputs {

  randomItems: (Item[]) = [];
  manualItems: (Item[]) = [];

  // --- Form fields ---
  shopName = '';
  mundaneItems = '';
  commonItems = '';
  uncommonItems = '';
  rareItems = '';
  veryRareItems = '';
  legendaryItems = '';
  artifactItems = '';

  // --- Select options for counts ---
  selectedOptionMundane = 'one';
  selectedOptionCommon = 'one';
  selectedOptionUncommon = 'one';
  selectedOptionRare = 'one';
  selectedOptionVeryRare = 'one';
  selectedOptionLegendary = 'one';
  selectedOptionArtifact = 'one';

  constructor(private dataShare: InputDatas, private router: Router) {}

  // --- Form validation ---
  get isFormValid(): boolean {
    return this.shopName.trim() !== '' && (
      this.mundaneItems.trim() !== '' ||
      this.commonItems.trim() !== '' ||
      this.uncommonItems.trim() !== '' ||
      this.rareItems.trim() !== '' ||
      this.veryRareItems.trim() !== '' ||
      this.legendaryItems.trim() !== '' ||
      this.artifactItems.trim() !== ''
    );
  }

isInputEnabled(option: string): boolean {
  return option !== 'one' && !!option === false ? true : true;
}

  onSelectChange(field: string, option: string) {
    let value = '';
    if (option === 'one' || !option) value = '';
    else {
      switch(option) {
        case 'two': value = '5'; break;
        case 'three': value = '10'; break;
        case 'four': value = this.roll1d3().toString(); break;
        case 'five': value = this.roll2d4().toString(); break;
        case 'six': value = this.roll1d12().toString(); break;
        case 'seven': value = this.roll1d43().toString(); break;
        case 'eight': value = this.roll1d2019().toString(); break;
        default: value = '';
      }
    }

    switch(field) {
      case 'mundaneItems': this.mundaneItems = value; this.selectedOptionMundane = option; break;
      case 'commonItems': this.commonItems = value; this.selectedOptionCommon = option; break;
      case 'uncommonItems': this.uncommonItems = value; this.selectedOptionUncommon = option; break;
      case 'rareItems': this.rareItems = value; this.selectedOptionRare = option; break;
      case 'veryRareItems': this.veryRareItems = value; this.selectedOptionVeryRare = option; break;
      case 'legendaryItems': this.legendaryItems = value; this.selectedOptionLegendary = option; break;
      case 'artifactItems': this.artifactItems = value; this.selectedOptionArtifact = option; break;
    }
  }

  // --- Generate random rolls ---
  roll1d3() { return Math.floor(Math.random() * 3) + 1; }
  roll2d4() { return Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1; }
  roll1d12() { return Math.floor(Math.random() * 12) + 1; }
  roll1d43() { return Math.floor(Math.random() * 4) + 1 + 3; }
  roll1d2019() { return Math.floor(Math.random() * 20) + 1 === 20 ? 1 : 0; }

  // --- Save shop to backend ---
  onSubmit() {
  if (!this.isFormValid) return;

  const formData: FormDataType = {
    shopName: this.shopName,
    mundaneItems: this.mundaneItems,
    commonItems: this.commonItems,
    uncommonItems: this.uncommonItems,
    rareItems: this.rareItems,
    veryRareItems: this.veryRareItems,
    legendaryItems: this.legendaryItems,
    artifactItems: this.artifactItems
  };

  // Combine all items manually
  const allItemsToSend = [
    ...this.randomItems,  // generated items
    ...this.manualItems   // manually added items
  ];

const payload = {
  name: formData.shopName,
  items: [...this.randomItems, ...this.manualItems].map(item => ({
    name: item.name,
    type: item.type,
    quantity: item.quantity ?? 1
  })),
  formData
};

  this.dataShare.saveShopToDB(payload).subscribe({
    next: (savedShop) => {
      console.log('Shop saved:', savedShop);
      this.resetForm();
      this.router.navigate(['/myshops']);
    },
    error: (err) => console.error('Failed to save shop', err)
  });
}

  // --- Reset form ---
  private resetForm() {
    this.shopName = '';
    this.mundaneItems = '';
    this.commonItems = '';
    this.uncommonItems = '';
    this.rareItems = '';
    this.veryRareItems = '';
    this.legendaryItems = '';
    this.artifactItems = '';

    this.selectedOptionMundane = 'one';
    this.selectedOptionCommon = 'one';
    this.selectedOptionUncommon = 'one';
    this.selectedOptionRare = 'one';
    this.selectedOptionVeryRare = 'one';
    this.selectedOptionLegendary = 'one';
    this.selectedOptionArtifact = 'one';
  }
}
