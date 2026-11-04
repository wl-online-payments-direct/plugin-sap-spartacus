import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AppRoutingModule } from "@spartacus/storefront";
import { AppComponent } from './app.component';
import { SpartacusModule } from './spartacus/spartacus.module';
import { environment } from '../environments/environment';

const devImports = [];

if (!environment.production) {
  devImports.push(StoreDevtoolsModule.instrument({
    name: 'Worldline Store',
    maxAge: 150,
    trace: true,
    connectInZone: true,
    logOnly: false,
    autoPause: false,
    traceLimit: 250
  }),);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    AppRoutingModule,
    EffectsModule.forRoot([]),
    SpartacusModule,
    ...devImports
  ],
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule {

}
