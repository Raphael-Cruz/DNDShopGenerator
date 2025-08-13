import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProperCasePipe } from './pipes/pipes';
import { Pipes } from './pipes/pipes';



@NgModule({
  declarations: [
    Pipes
  ],
  imports: [
    CommonModule,
    ProperCasePipe
  ], exports: [
    ProperCasePipe
  ]
})
export class SharedModule { }
