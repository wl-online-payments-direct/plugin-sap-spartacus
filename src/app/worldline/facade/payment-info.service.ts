import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { StateWithProcess, UserIdService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { WorldlineActions } from '../store/actions';
import { StateWithWorldline } from '../store/worldline-state';
import { WorldlineSelectors } from '../store/selectors';
import { WorldlinePaymentInfo } from '../model/cart.model';
import { ActiveCartFacade } from '@spartacus/cart/base/root';

@Injectable({
    providedIn: 'root'
})
export class PaymentInfoService {
    constructor(
        protected store: Store<StateWithWorldline | StateWithProcess<void>>,
        protected activeCartFacade: ActiveCartFacade,
        protected userIdService: UserIdService
    ) { }

    public getPaymentInfoLoading(): Observable<boolean> {
        return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getPaymentInfoLoading(state as StateWithWorldline)));
    }

    public loadPaymentInfo(): void {
        let userId, cartId;

        this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
        this.activeCartFacade.getActiveCartId().subscribe(occId => cartId = occId).unsubscribe();

        this.store.dispatch(new WorldlineActions.LoadWorldlinePaymentInfo({ userId, cartId }));
    }

    public getPaymentInfo(): Observable<WorldlinePaymentInfo> {
        return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getPaymentInfo(state as StateWithWorldline)));
    }

}
