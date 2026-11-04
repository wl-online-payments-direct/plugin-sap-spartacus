import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CheckoutDeliveryModesFacade,
  CheckoutDeliveryAddressFacade,
} from '@spartacus/checkout/base/root';
import {CheckoutPaymentFacade} from '@spartacus/checkout/base/root';
import {CheckoutPaymentTypeFacade, CheckoutCostCenterFacade} from '@spartacus/checkout/b2b/root';
import {CheckoutStep, CheckoutStepType} from '@spartacus/checkout/base/root';
import {
  Address,
  CostCenter,
  Country,
  PaymentDetails,
  TranslationService,
  UserAddressService,
  UserCostCenterService,
} from '@spartacus/core';
import { ActiveCartFacade, Cart, CartOutlets, OrderEntry } from '@spartacus/cart/base/root';
import { PromotionLocation, DeliveryMode, PaymentType } from '@spartacus/cart/base/root';
import { Card, ICON_TYPE } from '@spartacus/storefront';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import {CheckoutStepService, CheckoutReviewSubmitComponent} from "@spartacus/checkout/base/components";

@Component({
  selector: 'cx-review-submit',
  templateUrl: './account-review-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountReviewSubmitComponent {
  iconTypes = ICON_TYPE;
  checkoutStepType: CheckoutStepType;
  promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;

  readonly CartOutlets = CartOutlets;

  constructor(
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    protected checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    protected checkoutPaymentService: CheckoutPaymentFacade,
    protected userAddressService: UserAddressService,
    protected activeCartFacade: ActiveCartFacade,
    protected translation: TranslationService,
    protected checkoutStepService: CheckoutStepService,
    protected paymentTypeService: CheckoutPaymentTypeFacade,
    protected checkoutCostCenterService: CheckoutCostCenterFacade,
    protected userCostCenterService: UserCostCenterService,
  ) {}

  get cart$(): Observable<Cart> {
    return this.activeCartFacade.getActive();
  }

  get entries$(): Observable<OrderEntry[]> {
    return this.activeCartFacade.getEntries();
  }

  get steps$(): Observable<CheckoutStep[]> {
    return this.checkoutStepService.steps$;
  }

  get deliveryAddress$(): Observable<Address> {
    return this.checkoutDeliveryAddressFacade
                       .getDeliveryAddressState()
                       .pipe(filter((state) => !state.loading), map((state) => state.data));
  }

  get deliveryMode$(): Observable<DeliveryMode | null | undefined> {
    return this.checkoutDeliveryModesFacade.getSelectedDeliveryModeState().pipe(filter((state) => !state.loading && !state.error), map((state) => state.data));
  }

  get paymentDetails$(): Observable<PaymentDetails> {
    return this.checkoutPaymentService.getPaymentDetailsState().pipe(filter((state) => !state.loading && !state.error), map((state) => state.data));
  }

  get countryName$(): Observable<string | undefined> {
    return this.deliveryAddress$.pipe(
      switchMap((address: Address) =>
        this.userAddressService.getCountry(address?.country?.isocode as string)
      ),
      tap((country: Country) => {
        if (country === null) {
          this.userAddressService.loadDeliveryCountries();
        }
      }),
      map((country: Country) => country && country.name)
    );
  }

  get poNumber$(): Observable<string | undefined> {
    return this.paymentTypeService.getPurchaseOrderNumberState().pipe(filter((state) => !state.loading && !state.error), map((state) => state.data));
  }

  get paymentType$(): Observable<PaymentType | undefined> {
    return this.paymentTypeService.getSelectedPaymentTypeState().pipe(filter((state) => !state.loading && !state.error), map((state) => state.data));
  }

  get isAccountPayment$(): Observable<boolean> {
    return this.paymentTypeService.isAccountPayment();
  }

  get costCenter$(): Observable<CostCenter | undefined> {
    return this.checkoutCostCenterService.getCostCenterState().pipe(filter((state) => !state.loading && !state.error), map((state) => state.data));
  }

  getShippingAddressCard(
    deliveryAddress: Address,
    countryName: string
  ): Observable<Card> {
    return combineLatest([
      this.translation.translate('addressCard.shipTo'),
    ]).pipe(
      map(([textTitle]) => {
        if (!countryName) {
          countryName = deliveryAddress?.country?.isocode as string;
        }

        let region = '';
        if (
          deliveryAddress &&
          deliveryAddress.region &&
          deliveryAddress.region.isocode
        ) {
          region = deliveryAddress.region.isocode + ', ';
        }

        return {
          title: textTitle,
          textBold: deliveryAddress.firstName + ' ' + deliveryAddress.lastName,
          text: [
            deliveryAddress.line1,
            deliveryAddress.line2,
            deliveryAddress.town + ', ' + region + countryName,
            deliveryAddress.postalCode,
            deliveryAddress.phone,
          ],
        } as Card;
      })
    );
  }

  getCostCenterCard(costCenter?: CostCenter): Observable<Card> {
    return combineLatest([
      this.translation.translate('checkoutPO.costCenter'),
    ]).pipe(
      map(([textTitle]) => {
        return {
          title: textTitle,
          textBold: costCenter?.name,
          text: ['(' + costCenter?.unit?.name + ')'],
        };
      })
    );
  }

  getDeliveryModeCard(deliveryMode: DeliveryMode): Observable<Card> {
    return combineLatest([
      this.translation.translate('checkoutShipping.shippingMethod'),
    ]).pipe(
      map(([textTitle]) => {
        return {
          title: textTitle,
          textBold: deliveryMode.name,
          text: [
            deliveryMode.description,
            deliveryMode.deliveryCost?.formattedValue
              ? deliveryMode.deliveryCost?.formattedValue
              : '',
          ],
        } as Card;
      })
    );
  }

  getPaymentMethodCard(paymentDetails: PaymentDetails): Observable<Card> {
    return combineLatest([
      this.translation.translate('paymentForm.payment'),
      this.translation.translate('paymentCard.expires', {
        month: paymentDetails.expiryMonth,
        year: paymentDetails.expiryYear,
      }),
      this.translation.translate('paymentForm.billingAddress'),
    ]).pipe(
      map(([textTitle, textExpires, billingAddress]) => {
        const region = paymentDetails.billingAddress?.region?.isocode
          ? paymentDetails.billingAddress?.region?.isocode + ', '
          : '';
        return {
          title: textTitle,
          textBold: paymentDetails.accountHolderName,
          text: [paymentDetails.cardNumber, textExpires],
          paragraphs: [
            {
              title: billingAddress + ':',
              text: [
                paymentDetails.billingAddress?.firstName +
                  ' ' +
                  paymentDetails.billingAddress?.lastName,
                paymentDetails.billingAddress?.line1,
                paymentDetails.billingAddress?.town +
                  ', ' +
                  region +
                  paymentDetails.billingAddress?.country?.isocode,
                paymentDetails.billingAddress?.postalCode,
              ],
            },
          ],
        } as Card;
      })
    );
  }

  getPoNumberCard(poNumber?: string | null): Observable<Card> {
    return combineLatest([
      this.translation.translate('checkoutReview.poNumber'),
      this.translation.translate('checkoutPO.noPoNumber'),
    ]).pipe(
      map(([textTitle, noneTextTitle]) => {
        return {
          title: textTitle,
          textBold: poNumber ? poNumber : noneTextTitle,
        };
      })
    );
  }

  getPaymentTypeCard(paymentType?: string): Observable<Card> {
    return combineLatest([
      this.translation.translate('checkoutProgress.methodOfPayment'),
      this.translation.translate('paymentTypes.paymentType_' + paymentType),
    ]).pipe(
      map(([textTitle, paymentTypeTranslation]) => {
        return {
          title: textTitle,
          textBold: paymentTypeTranslation,
        };
      })
    );
  }

  getCheckoutStepUrl(stepType: CheckoutStepType): string | undefined {
    const step = this.checkoutStepService.getCheckoutStep(stepType);
    return step && step.routeName;
  }

  shippingSteps(steps: CheckoutStep[]): CheckoutStep[] {
    return steps.filter((step) => this.getCheckoutDeliverySteps().includes(step.type[0]));
  }

  paymentSteps(steps: CheckoutStep[]): CheckoutStep[] {
    return steps.filter((step) => this.getCheckoutPaymentSteps().includes(step.type[0]));
  }

  getCheckoutDeliverySteps() {
      return ["deliveryAddress" /* CheckoutStepType.DELIVERY_ADDRESS */, "deliveryMode" /* CheckoutStepType.DELIVERY_MODE */];
  }
  getCheckoutPaymentSteps() {
      return [
          "paymentDetails" /* CheckoutStepType.PAYMENT_DETAILS */,
          "paymentType" /* CheckoutStepType.PAYMENT_TYPE */,
          "deliveryAddress" /* CheckoutStepType.DELIVERY_ADDRESS */,
      ];
  }
}
