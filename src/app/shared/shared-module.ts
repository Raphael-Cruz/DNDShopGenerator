import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProperCasePipe, TipForSourcePipe, TipForTypePipe, RarityClassPipe, RarityLabelPipe } from './pipes/pipes';
import { Pipes } from './pipes/pipes';
import { ItemTooltipDirective } from '../item-tooltip/tooltip-directive/tooltip-directive';
import { ItemTooltipComponent } from '../item-tooltip/tooltip-component/tooltip-component';

@NgModule({
  declarations: [
    Pipes,
    ItemTooltipDirective,
    ItemTooltipComponent,
  ],
  imports: [
    CommonModule,
    ProperCasePipe,
    TipForSourcePipe,
    TipForTypePipe,
    RarityClassPipe,
    RarityLabelPipe,
  ],
  exports: [
    ProperCasePipe,
    TipForSourcePipe,
    TipForTypePipe,
    RarityClassPipe,
    RarityLabelPipe,
    ItemTooltipDirective,
    ItemTooltipComponent,
  ]
})
export class SharedModule { }