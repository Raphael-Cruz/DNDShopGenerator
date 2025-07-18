import { Component, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';



@Component({
  selector: 'app-shop-inputs',
  standalone: false,
  templateUrl: './shop-inputs.html',
  styleUrl: '../main-comp/main-comp.css',

  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class ShopInputs {


mundaneItems: string = '';
  commonItems: string = '';
  uncommonItems: string = '';
  rareItems: string = '';
  veryRareItems: string = '';
  legendaryItems: string = '';


@Output() newItemEvent = new EventEmitter<{
  mundaneItems: string;
  commonItems: string;
  uncommonItems: string;
  rareItems: string;
  veryRareItems: string;
  legendaryItems: string;

}>();

 logShopInput() {
    console.log('Mundane Items:', this.mundaneItems);
    console.log('Common Items:', this.commonItems);
    console.log('Uncommon Items:', this.uncommonItems);
    console.log('Rare Items:', this.rareItems);
    console.log('Very Rare Items:', this.veryRareItems);
    console.log('Legendary Items:', this.legendaryItems);
   

    this.newItemEvent.emit({
      mundaneItems: this.mundaneItems,
      commonItems: this.commonItems,
      uncommonItems: this.uncommonItems,
      rareItems: this.rareItems,
      veryRareItems: this.veryRareItems,
      legendaryItems: this.legendaryItems,
    });
  }
}




