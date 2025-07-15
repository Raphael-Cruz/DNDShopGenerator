import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ItemTable } from './item-table/item-table';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideHttpClient,withFetch  } from '@angular/common/http';
import { MainComp } from './main-comp/main-comp';
import { ShopInputs } from './shop-inputs/shop-inputs';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatTreeModule} from '@angular/material/tree';
import { AdvancedTree } from './advanced-tree/advanced-tree';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';




@NgModule({
  declarations: [
    App,
    ItemTable,
    MainComp,
    ShopInputs,
    AdvancedTree
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatTreeModule,
    MatCardModule,
    MatCheckboxModule
    
 
    
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
     provideHttpClient(withFetch()),
     
  ],
  bootstrap: [App]
})
export class AppModule { }
