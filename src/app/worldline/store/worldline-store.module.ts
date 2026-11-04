import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StateModule } from "@spartacus/core";
import { effects } from "./effects";
import { WORLDLINE_FEATURE } from "./worldline-state";
import { reducerToken, metaReducers, reducerProvider } from "./reducers";

@NgModule({
    imports: [
        CommonModule,
        StateModule,
        StoreModule.forFeature(WORLDLINE_FEATURE, reducerToken, { metaReducers }),
        EffectsModule.forFeature(effects),
        RouterModule
    ],
    providers: [reducerProvider],
})
export class WorldlineStoreModule { }
