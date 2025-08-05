import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComp } from './main-comp/main-comp';
import { ShopInputs } from './shop-inputs/shop-inputs';
import { GeneratedForm } from './generated-form/generated-form';

const routes: Routes = [
  { path: '', component: MainComp },         // Default route
  { path: 'shop', component: ShopInputs },   // /magic shop inputs
    { path: 'generatedshop', component: GeneratedForm },   // /shop generated
  { path: '**', redirectTo: '' }                  // Wildcard for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})





export class AppRoutingModule { }
