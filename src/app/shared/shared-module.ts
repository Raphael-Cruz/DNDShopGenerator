import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProperCasePipe, TipForSourcePipe, TipForTypePipe } from './pipes/pipes';
import { Pipes } from './pipes/pipes';



@NgModule({
  declarations: [
    Pipes
  ],
  imports: [
    CommonModule,
    ProperCasePipe,
    TipForSourcePipe,
    TipForTypePipe,
    
  ], exports: [
    ProperCasePipe,
    TipForSourcePipe,
    TipForTypePipe,
    
  ]
})
export class SharedModule { }
