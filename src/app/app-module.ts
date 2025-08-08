import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
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
import {MatExpansionModule} from '@angular/material/expansion';
import { AdvancedTree } from './advanced-tree/advanced-tree';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { GeneratedForm } from './generated-form/generated-form';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Footer } from './footer/footer';
import { Navbar } from './navbar/navbar';
import { Filters } from './filters/filters';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CreateItem } from './create-item/create-item';









@NgModule({
  declarations: [
    App,
    ItemTable,
    MainComp,
    ShopInputs,
    AdvancedTree,
    GeneratedForm,
    Footer,
    Navbar,
    Filters,
    CreateItem
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatChipsModule,
    MatTooltipModule
    
 
    
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
     provideHttpClient(withFetch()),
     
  ],
  bootstrap: [App]
})
export class AppModule { }
