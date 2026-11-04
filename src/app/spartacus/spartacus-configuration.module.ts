import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import { FeaturesConfig, I18nConfig, OccConfig, provideConfig, SiteContextConfig } from "@spartacus/core";
import { defaultCmsContentProviders, layoutConfig, mediaConfig } from "@spartacus/storefront";
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [provideConfig(layoutConfig), provideConfig(mediaConfig), ...defaultCmsContentProviders, provideConfig(<OccConfig>{
    backend: {
      occ: {
        baseUrl: environment.baseUrl,
      }
    },
  }), provideConfig(<SiteContextConfig>{
    context: {
      urlParameters: ['baseSite', 'language', 'currency'],
      currency: ['EUR', 'CHF', 'PLN', 'AUD'],
      baseSite: environment.b2b ? ['powertools-spa'] : ['apparel-uk-spa', 'apparel-de-spa'],
      language: ["fr", 'en', 'de', "fr", "it", "es", "nl"],
      // baseSite: ['apparel-uk-spa'],
      // language: ['en'],
      // currency: ['EUR'],
    },
  }), provideConfig(<I18nConfig>{
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }), provideConfig(<FeaturesConfig>{
    features: {
      level: '2211.32'
    }
  }),
  provideConfig({
    i18n: {
      backend: {
        loadPath: 'assets/i18n-assets/{{lng}}/{{ns}}.json'
      },
      chunks: {
        worldline: ['paymentMethod', 'tokenization', 'mandate', 'worldlineCheckoutReview', 'surcharge', 'replenishmentMessages'],
      }
    }
  }),]
})
export class SpartacusConfigurationModule { }
