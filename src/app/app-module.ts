import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ItemTable } from './item-table/item-table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShopInputs } from './shop-inputs/shop-inputs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdvancedTree } from './advanced-tree/advanced-tree';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GeneratedForm } from './generated-form/generated-form';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Footer } from './footer/footer';
import { Navbar } from './navbar/navbar';
import { Filters } from './filters/filters';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateItem } from './create-item/create-item';
import { UserModule } from './user/user-module';
import { RouterModule } from '@angular/router';
import { Myshops } from './myshops/myshops';
import { SharedModule } from './shared/shared-module';
import { ItemPage } from './item-page/item-page';
import { EntryBlock } from './entry-block/entry-block';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { LandingPageComponent } from './landingPage/landing-page-component/landing-page-component';
import { ShopPresets } from './ShopPreset/shop-preset/shop-presets'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipDescriptionUtility } from './item-tooltip/tooltip-description-utility/tooltip-description-utility';













@NgModule({
  declarations: [
    App,
    ItemTable,
    ShopInputs,
    AdvancedTree,
    GeneratedForm,
    Footer,
    Navbar,
    Filters,
    CreateItem,
    Myshops,
    ItemPage,
    EntryBlock,
    LandingPageComponent,
    ShopPresets,
    TooltipDescriptionUtility,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatSortModule,
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
    MatTooltipModule,
    UserModule,
    RouterModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    BrowserAnimationsModule,




  ], exports: [
    MatCardModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }