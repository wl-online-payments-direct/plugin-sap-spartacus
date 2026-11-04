import { Component } from '@angular/core';
import {
  Address,
  Country,
  TranslationService,
  UserAddressService
} from '@spartacus/core';
import { ActiveCartFacade, Cart, CartOutlets, OrderEntry } from '@spartacus/cart/base/root';
import { PromotionLocation, DeliveryMode } from '@spartacus/cart/base/root';
import { Card, ICON_TYPE } from '@spartacus/storefront';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap, filter } from 'rxjs/operators';
import { CheckoutStepService, CheckoutReviewSubmitComponent } from "@spartacus/checkout/base/components";
import {
  CheckoutDeliveryModesFacade,
  CheckoutStep,
  CheckoutStepType,
  CheckoutDeliveryAddressFacade
} from "@spartacus/checkout/base/root";
import { CheckoutPaymentTypeFacade } from '@spartacus/checkout/b2b/root';
import { PaymentInfoService } from "../../../../facade/payment-info.service";
import { PaymentMethodService } from "../../../../facade/payment-method.service";
import { WorldlinePaymentInfo } from "../../../../model/cart.model";
import { PaymentProduct } from "../../../../model/payment.model";

@Component({
  selector: 'worldline-review-submit',
  templateUrl: './worldline-review-submmit.component.html',
  styleUrls: ['./worldline-review-submit.component.scss']
})
export class WorldlineCartReviewSubmitComponent {
  iconTypes = ICON_TYPE;
  checkoutStepType: CheckoutStepType;
  promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;

  checkoutStepTypeDeliveryAddress = CheckoutStepType.DELIVERY_ADDRESS;
  checkoutStepTypePaymentDetails = CheckoutStepType.PAYMENT_DETAILS;
  checkoutStepTypeDeliveryMode = CheckoutStepType.DELIVERY_MODE;

  readonly CartOutlets = CartOutlets;

  constructor(
    protected checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    protected userAddressService: UserAddressService,
    protected activeCartFacade: ActiveCartFacade,
    protected translation: TranslationService,
    protected paymentTypeService: CheckoutPaymentTypeFacade,
    protected checkoutStepService: CheckoutStepService,
    protected paymentInfoService: PaymentInfoService,
    protected paymentMethodService: PaymentMethodService,
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade
  ) {


    paymentInfoService.loadPaymentInfo();
    paymentMethodService.loadPaymentMethods();

  }

  get cart$(): Observable<Cart> {
    return this.activeCartFacade.getActive();
  }

  get paymentInfo$(): Observable<WorldlinePaymentInfo> {
    return this.paymentInfoService.getPaymentInfo()
  }

  get paymentProducts$(): Observable<PaymentProduct[]> {
    return this.paymentMethodService.getPaymentMethods();
  }

  get entries$(): Observable<OrderEntry[]> {
    return this.activeCartFacade.getEntries();
  }

  get steps$(): Observable<CheckoutStep[]> {
    return this.checkoutStepService.steps$;
  }

  get deliveryAddress$(): Observable<Address> {
    return this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(filter((state) => !state.loading), map((state) => state.data));
  }

  get deliveryMode$(): Observable<DeliveryMode> {
    return this.checkoutDeliveryModesFacade.getSelectedDeliveryModeState().pipe(filter((state) => !state.loading && !state.error), map((state) => state.data));
  }


  get countryName$(): Observable<string> {
    return this.deliveryAddress$.pipe(
      switchMap((address: Address) =>
        this.userAddressService.getCountry(address?.country?.isocode)
      ),
      tap((country: Country) => {
        if (country === null) {
          this.userAddressService.loadDeliveryCountries();
        }
      }),
      map((country: Country) => country && country.name)
    );
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
          countryName = deliveryAddress?.country?.isocode;
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
        };
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


  getPaymentTypeCard(info: WorldlinePaymentInfo, paymentMethods: PaymentProduct[]): Observable<Card> {
    const method = paymentMethods.length > 0 ? paymentMethods.filter(it => it.id == info.paymentProductId).length > 0 ? paymentMethods.filter(it => it.id == info.paymentProductId)[0].displayHints.label : info.paymentMethod : info.paymentMethod;
    return combineLatest([
      this.translation.translate('paymentForm.payment'),
      this.translation.translate('paymentForm.billingAddress'),
    ]).pipe(
      map(([textTitle, billingAddress]) => {
        const region = info.billingAddress?.region?.isocode
          ? info.billingAddress?.region?.isocode + ', '
          : '';

        return {
          title: textTitle,
          textBold: method,
          paragraphs: [
            {
              title: billingAddress + ':',
              text: [
                info.billingAddress?.firstName +
                ' ' +
                info.billingAddress?.lastName,
                info.billingAddress?.line1,
                info.billingAddress?.town +
                ', ' +
                region +
                info.billingAddress?.country?.isocode,
                info.billingAddress?.postalCode,
              ],
            },
          ],
        };
      })
    );
  }

  get poNumber$(): Observable<string | undefined> {
    return this.paymentTypeService.getPurchaseOrderNumberState().pipe(filter((state) => !state.loading && !state.error), map((state) => state.data));
  }
  getCheckoutStepUrl(stepType: CheckoutStepType): string {
    const step = this.checkoutStepService.getCheckoutStep(stepType);
    return step && step.routeName;
  }

  getPaymentProductsStepUrl(steps: CheckoutStep[]): string {
    return steps.filter(s => s.id == "worldlinePaymentDetails")[0].routeName;
  }

  shippingSteps(steps: CheckoutStep[]): CheckoutStep[] {
    return steps.filter((step) => this.getCheckoutDeliverySteps().includes(step.type[0]));
  }

  getCheckoutDeliverySteps() {
    return ["deliveryAddress" /*CheckoutStepType.DELIVERY_ADDRESS*/, "deliveryMode" /* CheckoutStepType.DELIVERY_MODE */];
  }
}
