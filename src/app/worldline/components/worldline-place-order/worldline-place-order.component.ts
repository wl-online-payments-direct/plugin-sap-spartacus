import {Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { RoutingService, EventService } from '@spartacus/core';
import { recurrencePeriod, ORDER_TYPE, OrderFacade, ScheduledReplenishmentOrderFacade, OrderPlacedEvent } from '@spartacus/order/root';
import { CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';
import { RemoveCartEvent } from '@spartacus/cart/base/root';
import {LaunchDialogService, LAUNCH_CALLER} from '@spartacus/storefront';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {TokenizationService} from '../../facade/tokenization.service';
import {CheckoutPaymentTypeFacade} from '@spartacus/checkout/b2b/root';
import {PlaceOrderService} from "../../facade/place-order.service";
import {PaymentInfoService} from "../../facade/payment-info.service";
import {worldlineConstants} from "../../constants/worldlineConstants";
import {GetHostedCheckoutService} from "../../facade/get-hosted-checkout.service";
import {HOSTED_CHECKOUT_TYPE} from "../../enums/worldline-enums";
import {WorldlineScheduleReplenishmentForm} from "../../model/cart.model";
import {WorldlineCheckoutReplenishmentFormService} from "../../facade/worldline-checkout-replenishment-form-service";
import {WorldlineRedirectTokenizationEvent} from '../../events';
import { NgIfContext } from '@angular/common';

@Component({
  selector: 'app-worldline-place-order',
  templateUrl: './worldline-place-order.component.html',
  styleUrls: ['./worldline-place-order.component.scss']
})
export class WorldlinePlaceOrderComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  currentOrderType: ORDER_TYPE;
  scheduleReplenishmentFormData: WorldlineScheduleReplenishmentForm;
  placedOrder: void | Observable<ComponentRef<any>>;
  tokenizeCardPayment$ =  new BehaviorSubject<boolean>(false);
  temporaryToken: boolean;

  checkoutSubmitForm: FormGroup = this.fb.group({
    termsAndConditions: [false, Validators.requiredTrue],
    tokenizeHOPPayment: [false, Validators.requiredTrue]
  });
HTP: TemplateRef<NgIfContext<BehaviorSubject<boolean>>>;

  get termsAndConditionInvalid(): Boolean {
    return this.checkoutSubmitForm.invalid;
  }

  constructor(
    protected orderFacade: OrderFacade,
    protected scheduledReplenishmentOrderFacade: ScheduledReplenishmentOrderFacade,
    protected placeOrderService: PlaceOrderService,
    protected routingService: RoutingService,
    protected eventService: EventService,
    protected fb: FormBuilder,
    protected checkoutReplenishmentFormService: WorldlineCheckoutReplenishmentFormService,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected getHostedCheckoutService:GetHostedCheckoutService,
    protected paymentTypeService: CheckoutPaymentTypeFacade,
    protected tokenizationService: TokenizationService,
    protected paymentInfoService: PaymentInfoService
  ) {
  }

  worldlineSubmitForm(): void {
    this.getHostedCheckoutService.clearSubmitState();
    if (this.checkoutSubmitForm.valid && Boolean(this.currentOrderType)) {
      this.subscription.add(
        this.paymentTypeService.isAccountPayment().subscribe(isAccount => {
          if (isAccount) {
            switch (this.currentOrderType) {
              case ORDER_TYPE.PLACE_ORDER: {
                this.orderFacade.placeOrder(this.checkoutSubmitForm.valid);
                break;
              }
              case ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER: {
                this.scheduledReplenishmentOrderFacade.scheduleReplenishmentOrder(
                  this.scheduleReplenishmentFormData,
                  this.checkoutSubmitForm.valid
                );
                break;
              }
            }
          } else {
            this.placeOrder();
          }
        }));
    } else {
      this.checkoutSubmitForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.placeOrderService.resetCheckoutMethod();
    this.placeOrderService.worldlinePlaceOrder(this.checkoutSubmitForm.valid);
    this.accountOrderSubscriptions();
    this.hostedCheckoutOrderSubscriptions();
    this.checkCardPaymentMethod();
    this.placeOrderService.getCheckoutMethod().subscribe(method => {
        if (method.worldlineCheckoutType) {
          if (method.worldlineCheckoutType == HOSTED_CHECKOUT_TYPE.HOSTED_TOKENIZATION && this.currentOrderType == ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER) {
            this.placeOrderService.isTokenTemporary().subscribe(value => this.temporaryToken = value);
          }
        }
    })
    this.subscription.add(this.eventService
    .get(WorldlineRedirectTokenizationEvent)
    .subscribe(({ tokenizationResponse }) => {
      switch (tokenizationResponse.status) {
        case "OK": {
          return this.routingService.go({cxRoute: 'orderConfirmation'});
        }
        case "NEED_3DS": {
          return window.location.href = tokenizationResponse.redirectTo;
        }
        case "REJECTED": {
          this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
          return this.routingService.go({cxRoute: worldlineConstants.cms.contentPages.worldlinePaymentMethod.id}, {queryParams: {'state': 'REJECTED'}});
        }
        default: {
          this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
          return null;
        }
      }


    }))

  }

  placeOrder(): void {
    this.placedOrder = this.launchDialogService.launch(
      "PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */,
      this.vcr
    );
    this.subscription.add(
      this.placeOrderService.getCheckoutMethod().subscribe(method => {
          if (method.worldlineCheckoutType) {
            if (method.worldlineCheckoutType == HOSTED_CHECKOUT_TYPE.HOSTED_CHECKOUT) {
              this.getHostedCheckoutService.submit(this.currentOrderType);
            } else if (method.worldlineCheckoutType == HOSTED_CHECKOUT_TYPE.HOSTED_TOKENIZATION) {

              if (this.currentOrderType == ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER) {
                  if (this.temporaryToken) {
                    this.tokenizationService.showMessage(true);
                    this.routingService.go({cxRoute: 'worldlineCheckoutPaymentMethodsPage'});
                  } else {
                    this.tokenizationService.showMessage(false);
                    this.tokenizationPlaceOrder();
                  }

              } else {
                this.tokenizationService.showMessage(false);
                this.tokenizationPlaceOrder();
              }

            } else if (method.worldlineCheckoutType == HOSTED_CHECKOUT_TYPE.GOOGLE_PAY) {
              if (this.checkoutSubmitForm.valid) {
                this.placedOrder = this.launchDialogService.launch("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */, this.vcr);
                this.placeOrderService.placeOrderGooglePay(this.checkoutSubmitForm.valid, this.currentOrderType).subscribe({
                  error: () => {
                    if (!this.placedOrder) {
                      return;
                    }
                    this.placedOrder
                      .subscribe((component) => {
                        this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
                        if (component) {
                          component.destroy();
                        }
                      })
                      .unsubscribe();
                  },
                  next: () => {
                    this.onSuccess(true)
                  },
                });
              } else {
                this.checkoutSubmitForm.markAllAsTouched();
              }
            } else if (method.worldlineCheckoutType == HOSTED_CHECKOUT_TYPE.PAY_BY_LINK) {
              this.placedOrder = this.launchDialogService.launch("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */, this.vcr);
              this.placeOrderService.placeOrderPayByLink(this.checkoutSubmitForm.valid, this.currentOrderType).subscribe({
                next: () => {
                  this.onSuccess(true);
                }
              })
            }
          }
        }, () => {
          this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
        }
      ));
  }

  onSuccess(data: boolean): void {
    if (data) {
      switch (this.currentOrderType) {
        case ORDER_TYPE.PLACE_ORDER: {
          this.routingService.go({cxRoute: 'orderConfirmation'});
          break;
        }

        case ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER: {
          this.routingService.go({cxRoute: 'replenishmentConfirmation'});
          break;
        }
      }
      this.checkoutReplenishmentFormService.resetScheduleReplenishmentFormData();
    }
  }


  accountOrderSubscriptions(): void {
    this.subscription.add(
      this.checkoutReplenishmentFormService
        .getOrderType()
        .subscribe((orderType) => (this.currentOrderType = orderType))
    );

    this.subscription.add(
      this.checkoutReplenishmentFormService
        .getScheduleReplenishmentFormData()
        .subscribe((data) => {
          this.scheduleReplenishmentFormData = data;

        })
    );
  }

  tokenizationOrderSubscriptions(): void {
    this.subscription.add(
      combineLatest([
        this.tokenizationService.getSubmitSuccess(),
        this.tokenizationService.getSubmitFail(),
      ]).subscribe(([success, error]) => {
        if (error) {
          this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
        }

        if (success) {
          this.tokenizationService.getSubmitData().subscribe(result => {
            switch (result.status) {
              case "OK": {
                this.tokenizationService.submitOrder(result.order);
                return this.routingService.go({cxRoute: 'orderConfirmation'});
              }
              case "NEED_3DS": {
                return window.location.href = result.redirectTo;
              }
              case "REJECTED": {
                this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
                return this.routingService.go({cxRoute: worldlineConstants.cms.contentPages.worldlinePaymentMethod.id}, {queryParams: {'state': 'REJECTED'}});
              }
              default: {
                this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
                return null;
              }
            }
          });
        }
      })
    );
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
    this.getHostedCheckoutService.clearSubmitState();
    this.placeOrderService.resetCheckoutMethod();
  }

  private hostedCheckoutOrderSubscriptions() {
    this.subscription.add(
      combineLatest([
        this.getHostedCheckoutService.getSubmitSuccess(),
        this.getHostedCheckoutService.getSubmitFail(),
      ]).subscribe(([success, error]) => {
        if (error) {
          this.launchDialogService.clear(LAUNCH_CALLER.PLACE_ORDER_SPINNER);
        }

        if (success) {
          this.getHostedCheckoutService.getSubmitData().subscribe(hostedCheckout=>
          {
            window.location.href = hostedCheckout.redirectURL;
          })
        }
        }));


  }
  private checkCardPaymentMethod() {
  this.paymentInfoService.getPaymentInfo().subscribe((info) => {
      if ((this.currentOrderType == ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER && info.paymentMethod === "card") && info.worldlineCheckoutType.worldlineCheckoutType == HOSTED_CHECKOUT_TYPE.HOSTED_CHECKOUT) {
        this.tokenizeCardPayment$.next(true);
      } else {
        this.tokenizeCardPayment$.next(false);
      }
      this.checkoutSubmitForm.controls['tokenizeHOPPayment'].setValue(!this.tokenizeCardPayment$.value);
    });
  }

  private tokenizationPlaceOrder() {
    if (this.checkoutSubmitForm.valid) {
        this.placedOrder = this.launchDialogService.launch("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */, this.vcr);
        this.placeOrderService.placeOrderHT(this.checkoutSubmitForm.valid, this.currentOrderType).subscribe({
            error: () => {
                if (!this.placedOrder) {
                    return;
                }
                this.placedOrder
                    .subscribe((component) => {
                    this.launchDialogService.clear("PLACE_ORDER_SPINNER" /* LAUNCH_CALLER.PLACE_ORDER_SPINNER */);
                    if (component) {
                        component.destroy();
                    }
                })
                    .unsubscribe();
            },
            next: () => {
            this.onSuccess(true)},
        });
    }
    else {
        this.checkoutSubmitForm.markAllAsTouched();
    }

  }
}
