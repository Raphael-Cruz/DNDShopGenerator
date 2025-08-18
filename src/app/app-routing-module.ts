import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComp } from './main-comp/main-comp';
import { ShopInputs } from './shop-inputs/shop-inputs';
import { GeneratedForm } from './generated-form/generated-form';
import { Myshops } from './myshops/myshops';
import { ItemPage } from './item-page/item-page';


const routes: Routes = [
  { path: '', component: MainComp },
  { path: 'shop', component: ShopInputs },
  { path: 'generatedshop/:id', component: GeneratedForm },
  { path: 'generatedshop', component: GeneratedForm },
    { path: 'myshops', component: Myshops },
        { path: 'item-stats', component: ItemPage },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
