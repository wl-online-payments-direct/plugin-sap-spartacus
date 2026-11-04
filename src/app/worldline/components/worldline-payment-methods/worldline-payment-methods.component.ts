import { Component, OnInit } from '@angular/core';
import { PaymentDetails, TranslationService, UserPaymentService } from '@spartacus/core';
import { Card, ICON_TYPE } from '@spartacus/storefront';
import { combineLatest, Observable } from 'rxjs';
import { map} from 'rxjs/operators';

@Component({
  selector: 'app-worldline-payment-methods',
  templateUrl: './worldline-payment-methods.component.html',
  styleUrls: ['./worldline-payment-methods.component.scss']
})
export class WorldlinePaymentMethodsComponent implements OnInit {
  paymentMethods$: Observable<PaymentDetails[]>;
  editCard: string;
  iconTypes = ICON_TYPE;
  loading$: Observable<boolean>;

  constructor(
    private userPaymentService: UserPaymentService,
    private translation: TranslationService
  ) { }

  ngOnInit(): void {
    this.paymentMethods$ = this.userPaymentService.getPaymentMethods();

    this.editCard = null;
    this.loading$ = this.userPaymentService.getPaymentMethodsLoading();
    this.userPaymentService.loadPaymentMethods();
  }

  getCardContent(paymentDetails: any): Observable<Card> {
    return combineLatest([
      this.translation.translate('paymentCard.setAsDefault'),
      this.translation.translate('common.delete'),
      this.translation.translate('paymentCard.deleteConfirmation'),
      this.translation.translate('paymentCard.expires', {
        month: paymentDetails.expiryMonth,
        year: paymentDetails.expiryYear,
      }),
      this.translation.translate('paymentCard.defaultPaymentMethod'),
    ]).pipe(
      map(
        ([
           textSetAsDefault,
           textDelete,
           textDeleteConfirmation,
           textExpires,
           textDefaultPaymentMethod,
         ]) => {
          const actions: { name: string; event: string }[] = [];
          if (!paymentDetails.defaultPayment) {
            actions.push({ name: textSetAsDefault, event: 'default' });
          }
          actions.push({ name: textDelete, event: 'edit' });
          const card: Card = {
            header: paymentDetails.defaultPayment ? textDefaultPaymentMethod : null,
            textBold: paymentDetails.accountHolderName,
            text: [paymentDetails.cardBrand,paymentDetails.alias, textExpires],
            actions,
            deleteMsg: textDeleteConfirmation,
          };

          return card;
        }
      )
    );
  }

  deletePaymentMethod(paymentMethod: PaymentDetails): void {
    this.userPaymentService.deletePaymentMethod(paymentMethod.id);
    this.editCard = null;
  }

  setDefaultPaymentMethod(paymentMethod: PaymentDetails): void {
    this.userPaymentService.setPaymentMethodAsDefault(paymentMethod.id);
  }


  setEdit(paymentMethod: PaymentDetails): void {
    this.editCard = paymentMethod.id;
  }

  cancelCard(): void {
    this.editCard = null;
  }
}
