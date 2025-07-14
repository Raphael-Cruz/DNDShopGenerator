import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ItemTable } from './item-table/item-table';
import {MatTableModule} from '@angular/material/table';
import { provideHttpClient,withFetch  } from '@angular/common/http';


@NgModule({
  declarations: [
    App,
    ItemTable
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule
    
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
     provideHttpClient(withFetch())
  ],
  bootstrap: [App]
})
export class AppModule { }
