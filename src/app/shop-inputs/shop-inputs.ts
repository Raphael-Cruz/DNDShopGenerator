import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { InputDatas } from '../input-datas';

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
  artifactItems: string = '';

  selectedOptionMundane = 'one';
  selectedOptionCommon = 'one';
  selectedOptionUncommon = 'one';
  selectedOptionRare = 'one';
  selectedOptionVeryRare = 'one';
  selectedOptionLegendary = 'one';
  selectedOptionArtifact = 'one';

  constructor(private dataShare: InputDatas) {}

  @Output() newItemEvent = new EventEmitter<{
    mundaneItems: string;
    commonItems: string;
    uncommonItems: string;
    rareItems: string;
    veryRareItems: string;
    legendaryItems: string;
    artifactItems: string;
  }>();

  isInputEnabled(option: string): boolean {
    return option === 'one' || !option;
  }

  onSelectChange(field: string, option: string) {
    let value = '';
    if (option === 'one' || !option) {
      value = '';
    } else {
      switch (option) {
        case 'two':
          value = '5';
          break;
        case 'three':
          value = '10';
          break;
        case 'four':
          value = this.roll1d3().toString();
          break;
        case 'five':
          value = this.roll2d4().toString();
          break;
        case 'six':
          value = this.roll1d12().toString();
          break;
        case 'seven':
          value = this.roll1d43().toString();
          break;
        case 'eight':
          value = this.roll1d2019().toString();
          break;
        default:
          value = '';
      }
    }

    switch (field) {
      case 'mundaneItems':
        this.mundaneItems = value;
        this.selectedOptionMundane = option;
        break;
      case 'commonItems':
        this.commonItems = value;
        this.selectedOptionCommon = option;
        break;
      case 'uncommonItems':
        this.uncommonItems = value;
        this.selectedOptionUncommon = option;
        break;
      case 'rareItems':
        this.rareItems = value;
        this.selectedOptionRare = option;
        break;
      case 'veryRareItems':
        this.veryRareItems = value;
        this.selectedOptionVeryRare = option;
        break;
      case 'legendaryItems':
        this.legendaryItems = value;
        this.selectedOptionLegendary = option;
        break;
      case 'artifactItems':
        this.artifactItems = value;
        this.selectedOptionLegendary = option;
        break;
    }
  }

  //aqui to mandando isso para o service datashare
  onInputChange() {
    this.dataShare.setFormData({
      mundaneItems: this.mundaneItems,
      commonItems: this.commonItems,
      uncommonItems: this.uncommonItems,
      rareItems: this.rareItems,
      veryRareItems: this.veryRareItems,
      legendaryItems: this.legendaryItems,
      artifactItems: this.artifactItems,
    
    });

    //reset
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

  // funções de dados
  roll1d3(): number {
    return Math.floor(Math.random() * 3) + 1;
  }

  roll2d4(): number {
    return (Math.floor(Math.random() * 4) + 1) + (Math.floor(Math.random() * 4) + 1);
  }

  roll1d12(): number {
    return Math.floor(Math.random() * 12) + 1;
  }

  roll1d43(): number {
    return Math.floor(Math.random() * 4) + 1 + 3;
  }

  roll1d2019(): number {
    const isCrit = Math.floor(Math.random() * 20) + 1 === 20;
    return isCrit ? 1 : 0;
  }


}
