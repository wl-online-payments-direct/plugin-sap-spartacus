import {ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewContainerRef, ComponentRef, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {
  AddressValidation,
  Country,
  Address,
  UserPaymentService,
  GlobalMessageService,
  Region,
  UserAddressService,
  RoutingService
} from '@spartacus/core';
import {
  Card, LaunchDialogService, LAUNCH_CALLER
} from '@spartacus/storefront';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {map, tap, take, switchMap, delay, filter} from 'rxjs/operators';
import {PaymentMethodService} from '../../facade/payment-method.service';
import {TokenizationService} from '../../facade/tokenization.service';
import {ReplenishmentService} from "../../facade/replenishment.service";
import {CheckoutMethod, PaymentProduct, GooglePay} from '../../model/payment.model';
import {SavedToken} from '../../model/token.model';
import {CheckoutStepService} from "@spartacus/checkout/base/components";
import {CheckoutDeliveryAddressFacade} from "@spartacus/checkout/base/root";
import {WorldlinePaymentMethod} from "../../model/WorldlinePaymentMethod";
import {HOSTED_CHECKOUT_TYPE} from "../../enums/worldline-enums";
import { SurchargeService } from '../../facade/surcharge.service';
import {WorldlineCheckoutReplenishmentFormService} from "../../facade/worldline-checkout-replenishment-form-service";
import { ORDER_TYPE } from '@spartacus/order/root';
import { ActiveCartFacade } from '@spartacus/cart/base/root';

declare const Tokenizer: any;
declare const paymentData: any;
declare var ApplePaySession: any;
declare var window: any;
declare var google: any;

@Component({
  selector: 'app-worldline-payment-method',
  templateUrl: './worldline-payment-method.component.html',
  styleUrls: ['./worldline-payment-method.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldlinePaymentMethodComponent implements OnInit, OnDestroy {
  private paymentSubmitting = false;
  paymentMethods$: Observable<PaymentProduct[]>;
  backBtnText = this.checkoutStepService.getBackBntText(this.activatedRoute);
  subscription: Subscription = new Subscription();
  tokenizer: any;
  disallowSubmit$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  tokens$: BehaviorSubject<SavedToken[]> = new BehaviorSubject([]);
  redirectURL: string;
  hostedCheckoutPaymentModeId: string = '-2';
  hostedTokenizationPaymentModeId: string = '-1';
  paypalPaymentModeId: string = '302';
  googlePayMethodID$: string = '320';
  form: FormGroup = this.fb.group({});
  paymentProcessing: void | Observable<ComponentRef<any>>;
  savedTokenActive = false;
  cardsMap: WorldlinePaymentMethod[] = [];
  googlePayData$: GooglePay;
  googlePayInitialized: boolean = false;
  checkoutMethod$: BehaviorSubject<CheckoutMethod> = new BehaviorSubject({});
  paymentMethodForm: FormGroup = this.fb.group({
    paymentProductId: ['', Validators.required],
    googlePayEncryptedPaymentData: '',
    googlePayMobileDevice: ''
  });
  checked:boolean;
  selectedMethodID:String;
  displaySurcharge$: Observable<boolean>;
  displayHTPReplenishmentMessage$ = false;
  displaySavePaymentDetailsWarning$ = false;

  billingAddressForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    town: ['', Validators.required],
    region: this.fb.group({
      isocodeShort: [null, Validators.required],
    }),
    country: this.fb.group({
      isocode: [null, Validators.required],
    }),
    postalCode: ['', Validators.required],
  });
  displayWarningMessage = false;
  displayPaymentCancelledMessage = false;
  shippingAddress$: Observable<Address>;
  countries$: Observable<Country[]>;
  sameAsShippingAddress = true;
  regions$: Observable<Region[]>;
  selectedCountry$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  showSameAsShippingAddressCheckbox$: Observable<boolean>;
  protected deliveryAddress: Address;
  currentOrderType: ORDER_TYPE;
continueButtonPressed: any;
@ViewChild("googlePayBtn") googlePayBtn: ElementRef;

  constructor(private fb: FormBuilder,
              protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
              protected paymentMethodService: PaymentMethodService,
              protected checkoutStepService: CheckoutStepService,
              protected activatedRoute: ActivatedRoute,
              protected routingService: RoutingService,
              protected userPaymentService: UserPaymentService,
              protected globalMessageService: GlobalMessageService,
              protected userAddressService: UserAddressService,
              protected tokenizationService: TokenizationService,
              protected launchDialogService: LaunchDialogService,
              protected vcr: ViewContainerRef,
              protected store: Store,
              private route: ActivatedRoute,
              private surchargeService: SurchargeService,
              protected replenishmentService:ReplenishmentService,
              protected checkoutReplenishmentFormService: WorldlineCheckoutReplenishmentFormService,
              protected activeCartFacade: ActiveCartFacade) {
  }

  get getDisallowSubmit$(): Observable<boolean> {
    return this.disallowSubmit$;
  }

  get isBillingAddressInvalid(): boolean {
    return !this.sameAsShippingAddress ? this.billingAddressForm.invalid : false;
  }

  get selectedMethod() {
    return this.cardsMap.find(({id}) => id === this.paymentMethodForm.controls['paymentProductId'].value);
  }

  get getSavedTokens$(): Observable<SavedToken[]> {
    return this.tokens$;
  }

  ngOnInit(): void {
    this.fireSpinner();
    this.disallowSubmit$.next(true);
    this.displaySurcharge$ = this.surchargeService.displaySurcharge();

    this.route.queryParamMap.subscribe((params) => {
      if (params.get("state") == 'REJECTED') {
        this.displayWarningMessage = true;
      }
      if (params.get("state") == 'CANCELLED') {
        this.displayPaymentCancelledMessage = true;
      }
    });
    this.subscription.add(

      this.replenishmentService.getReplenishmentData().subscribe(data => {
          this.checkoutReplenishmentFormService.setOrderType(data.isReplenishmentOrder ? ORDER_TYPE["SCHEDULE_REPLENISHMENT_ORDER"] : ORDER_TYPE["PLACE_ORDER"]);
      })
    );



    this.subscription.add(
      this.tokenizationService.displayMessage.subscribe(val =>
        this.displaySavePaymentDetailsWarning$ = val)
    );
    this.subscription.add(
      this.checkoutReplenishmentFormService
        .getOrderType()
        .subscribe((orderType) => (this.currentOrderType = orderType))
    );
      this.subscription.add(this.tokenizationService.getToken().subscribe(token => {
          this.redirectURL = token.redirectURL;
          this.checkoutMethod$.next(token.checkoutType);
          if (this.currentOrderType == ORDER_TYPE.PLACE_ORDER) {
            this.tokens$.next(token.savedPaymentDetails ? token.savedPaymentDetails.payments : []);
            token.savedPaymentDetails.payments.forEach(payment => {
              this.cardsMap.push({
                id: payment.id,
                token: payment.token,
                saved: true,
                cardBrand: payment.cardBrand,
                alias: payment.alias,
                logo: payment.paymentMethodImageUrl,
                expiryDate: payment.expiryMonth + '/' + payment.expiryYear,
                accountHolderName: payment.accountHolderName,
                displayTokenizationForm: token.checkoutType.worldlineCheckoutType == HOSTED_CHECKOUT_TYPE.HOSTED_TOKENIZATION
              });
            });
          } else {
             if (this.isHostedTokenization$(this.checkoutMethod$.value)) {
               this.displayHTPReplenishmentMessage$ = true;
             }
           }
      }));
    this.paymentMethods$ = this.paymentMethodService.getPaymentMethods();
    this.paymentMethodService.clearPaymentMethods();
    this.paymentMethodService.loadPaymentMethods();
    this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(filter((state) => !state.loading), map((state) => state.data))
      .subscribe((address: Address) => {
        this.deliveryAddress = address;
      });

    this.countries$ = this.userPaymentService.getAllBillingCountries().pipe(tap((countries) => {
      // If the store is empty fetch countries. This is also used when changing language.
      if (Object.keys(countries).length === 0) {
        this.userPaymentService.loadBillingCountries();
      }
    }));

    this.shippingAddress$ = this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(filter((state) => !state.loading), map((state) => state.data));

    this.showSameAsShippingAddressCheckbox$ = combineLatest([this.countries$, this.shippingAddress$,]).pipe(map(([countries, address]) => {
      return (address?.country && !!countries.filter((country: Country): boolean => country.isocode === address.country.isocode).length);
    }), tap((shouldShowCheckbox) => {
      this.sameAsShippingAddress = shouldShowCheckbox;
    }));

    this.regions$ = this.selectedCountry$.pipe(switchMap((country) => this.userAddressService.getRegions(country)), tap((regions) => {
      const regionControl = this.billingAddressForm.get('region.isocodeShort');
      if (regions.length > 0) {
        regionControl.enable();
      } else {
        regionControl.disable();
      }
    }));

    this.subscription.add(this.paymentMethodService.getPaymentMethodsLoading().subscribe((res) => {
      this.subscription.add(this.paymentMethods$.subscribe(it => {
        it.forEach(method => {
          if (method.id == this.googlePayMethodID$) {
             this.subscription.add(this.paymentMethodService.getGooglePayData().subscribe((result) => {
              this.googlePayData$ = result;
            }))
          }
          this.cardsMap.push({
            id: method.id,
            token: '',
            saved: false,
            displayTokenizationForm: this.isNewCardPaymentMethod$(method)
          });
        });
        this.clearSpinner();
      }))
    }));
  }

  waitForElm(selector: string): Promise<Element> {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true, subtree: true
      });
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  changeMethod(): void {
    this.savedTokenActive = false;
    let selectedPaymentMethod = this.selectedMethod;
    if (selectedPaymentMethod != null && selectedPaymentMethod.displayTokenizationForm) {
      this.changeToken(selectedPaymentMethod);
      return;
    }

    if (selectedPaymentMethod != null && selectedPaymentMethod.id == this.googlePayMethodID$) {
      this.initGooglePay();
      return;
    }
    this.disallowSubmit$.next(true);

    if (this.paymentMethodForm.controls['paymentProductId'].valid) {
      this.disallowSubmit$.next(false);
    }
  }

  next(): void {
    if (this.paymentSubmitting) {
      return;
    }
    const id = this.paymentMethodForm.controls['paymentProductId'].value;
    if (id == undefined || id == null) {
      return;
    }
    let selectedMethodObj = this.selectedMethod;

    this.paymentSubmitting = true;
    this.fireSpinner();
    let address = this.sameAsShippingAddress ? this.deliveryAddress : this.billingAddressForm.value;
    let paymentMethod;
    if ((selectedMethodObj.saved || selectedMethodObj.id == this.hostedTokenizationPaymentModeId) && this.isHostedTokenization$(this.checkoutMethod$.value)) {
      this.tokenizer.submitTokenization()
        .then((result: { success: any; hostedTokenizationId: string; }) => {
          if (result.success) {
            paymentMethod = this.paymentMethodService.setPaymentMethod(this.hostedTokenizationPaymentModeId, result.hostedTokenizationId, selectedMethodObj.saved ? selectedMethodObj.id : '', this.paymentMethodForm.controls['googlePayEncryptedPaymentData'].value, address);
            this.onSuccess(paymentMethod);
          }
        });
    } else if (!this.isHostedTokenization$(this.checkoutMethod$.value) && selectedMethodObj.saved) {
      paymentMethod=this.paymentMethodService.setPaymentMethod(this.hostedCheckoutPaymentModeId, '', selectedMethodObj.saved ? selectedMethodObj.id : '', this.paymentMethodForm.controls['googlePayEncryptedPaymentData'].value, address);
      this.onSuccess(paymentMethod);
    } else {
      paymentMethod=this.paymentMethodService.setPaymentMethod(id, "", "", this.paymentMethodForm.controls['googlePayEncryptedPaymentData'].value, address);
      this.onSuccess(paymentMethod);
    }
  }

  onSuccess(paymentMethod: Observable<{}>): void {

      paymentMethod.subscribe((result)=>{
        if (this.isHostedTokenization$(this.checkoutMethod$.value)) {
          this.activeCartFacade.reloadActiveCart();
        }
        this.clearSpinner();
        this.routingService.go({ cxRoute: 'worldlineOrderReview' });
      },error=>{
        this.paymentSubmitting = false;
        this.clearSpinner();
      });
  }

  back(): void {
    this.checkoutStepService.back(this.activatedRoute);
  }

  toggleSameAsShippingAddress(): void {
    this.sameAsShippingAddress = !this.sameAsShippingAddress;
  }

  getAddressCardContent(address: Address): Card {
    let region = '';
    if (address.region && address.region.isocode) {
      region = address.region.isocode + ', ';
    }

    return {
      textBold: address.firstName + ' ' + address.lastName,
      text: [address.line1, address.line2, address.town + ', ' + region + address.country.isocode, address.postalCode, address.phone,],
    };
  }

  openSuggestedAddress(results: AddressValidation): void {
    this.launchDialogService.openDialogAndSubscribe("SUGGESTED_ADDRESSES" /* LAUNCH_CALLER.SUGGESTED_ADDRESSES */, undefined, {
                enteredAddress: this.billingAddressForm.value,
                suggestedAddresses: results.suggestedAddresses,
            });
            this.subscription.add(this.launchDialogService.dialogClose
                .pipe(filter((result) => Boolean(result)))
                .subscribe((result) => {
                if (typeof result === 'object') {
                    const address = {
                        ...result,
                        titleCode: this.billingAddressForm.value.titleCode,
                        phone: this.billingAddressForm.value.phone,
                        selected: true,
                    };
                }
            }));
  }

  countrySelected(country: Country): void {
    this.billingAddressForm.get('country.isocode').setValue(country.isocode);
    this.selectedCountry$.next(country.isocode);
  }

  tokenChange(token: string): void {
    if (token) {
      this.tokenizer.useToken(token);
      this.savedTokenActive = true;
    } else {
      this.tokenizer.useToken();
      this.savedTokenActive = false;
    }
  }

  ngOnDestroy() {
    this.paymentMethodService.clearPaymentMethods();
    this.subscription.unsubscribe();
    if (this.tokenizer) {
      this.tokenizationService.clearSubmitState();
      this.tokenizer.destroy();
    }
  }

  changeToken(paymentMethod: WorldlinePaymentMethod) {

    this.savedTokenActive = false;
    this.fireSpinner();
    this.disallowSubmit$.next(true);
    this.subscription.unsubscribe();
    this.waitForElm("#hostedTokenization-" + paymentMethod.id).then((elm) => {
      if (this.tokenizer) {
        this.tokenizationService.clearSubmitState();
        this.tokenizer.destroy();
      }

      this.tokenizer = new Tokenizer(this.redirectURL, elm.id, {
        hideCardholderName: false, hideTokenFields: false, validationCallback: (result: { valid: any; }) => {
          this.disallowSubmit$.next(!result.valid)
        }
      });
      ;


      this.tokenizer.initialize()
        .then(() => {
          this.clearSpinner();
          if (paymentMethod.token !== '') {
            this.tokenizer.useToken(paymentMethod.token);
            this.savedTokenActive = true;
          } else {
            this.tokenizer.useToken();
            this.savedTokenActive = false;
          }
          this.clearSpinner();
        }).catch((error: any) => {
        //TODO - display error
      });
    });


  }

  isHostedTokenization$(checkoutMethod: CheckoutMethod) {
    return checkoutMethod.worldlineCheckoutType === HOSTED_CHECKOUT_TYPE.HOSTED_TOKENIZATION;
  }

  isNewCardPaymentMethod$(paymentProduct: PaymentProduct) {
    return paymentProduct.id === this.hostedTokenizationPaymentModeId || paymentProduct.id == this.hostedCheckoutPaymentModeId;
  }

  isSelectedRadioButton(id: string) {
    return id === this.paymentMethodForm.controls['paymentProductId'].value
  }

  private fireSpinner(): void {
    this.paymentProcessing = this.launchDialogService.launch(LAUNCH_CALLER.PLACE_ORDER_SPINNER, this.vcr);
  }

  private clearSpinner(): void {
    if (this.paymentProcessing) {
      this.paymentProcessing.subscribe((component) => {
        this.launchDialogService.clear(LAUNCH_CALLER.PLACE_ORDER_SPINNER);
        component.destroy();
      })
        .unsubscribe();
    }
  }

  selectRadio(method: PaymentProduct) {

    let isSelected=this.isSelectedRadioButton(method.id);
    if (!isSelected)
    {
      this.selectedMethodID=method.id;
      this.paymentMethodForm.controls['paymentProductId'].setValue(method.id);
      this.changeMethod();
    }
  }

  isChecked(id: string):boolean {
    return (id===this.selectedMethodID);
  }

  // GooglePay methods
  googlePayClient(): any {
    if (!this.googlePayData$ || !window.google || !google.payments || !google.payments.api) {
      return null;
    }
    return new google.payments.api.PaymentsClient({environment: this.googlePayData$.environment || 'TEST'});
  }

  googlePayAllowedPaymentMethods(): any {
    var networks = (this.googlePayData$.networks || '').split(',').filter((network) => {return network;})

    return [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: networks
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: this.googlePayData$.gateway,
          gatewayMerchantId: this.googlePayData$.gatewayMerchantId
        }
      }
    }]

  }

  googlePayRequestBase(): {[key:string]: any} {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      // start with base arguments
      allowedPaymentMethods: this.googlePayAllowedPaymentMethods(),
    }

  }

  googlePayPaymentDataRequest(): {} {
    var request = this.googlePayRequestBase();;


    request['transactionInfo'] = {
      totalPriceStatus: 'FINAL',
      totalPrice: String(this.googlePayData$.totalPrice),
      currencyCode: this.googlePayData$.currencyCode,
      countryCode: this.googlePayData$.countryCode
    }
    request['merchantInfo'] = {
      merchantId: this.googlePayData$.merchantId,
      merchantName: this.googlePayData$.merchantName
    }
    return request;
  }

  requestGoPayPayment() {
    var parent = this;
    function requestGooglePayPayment(): void {

      var googlePayPaymentClient = parent.googlePayClient();
      if (!googlePayPaymentClient) {
        return;
      }
      googlePayPaymentClient.loadPaymentData(parent.googlePayPaymentDataRequest()).then((paymentData: {paymentMethodData: {tokenizationData: {token: string} }}) => {
        parent.paymentMethodForm.controls['googlePayEncryptedPaymentData'].setValue(paymentData.paymentMethodData.tokenizationData.token);
        parent.paymentMethodForm.controls['googlePayMobileDevice'].setValue(parent.isMobileDevice());
        parent.next();
        }).catch((error: any) => {
          if (error && error.statusCode === 'CANCELED') {
            return;
          }
          if (window.console && window.console.error) {
            window.console.error("Unknown Error :", error);
          }
      })
    }
    return requestGooglePayPayment;
  }

  isMobileDevice(): boolean {
    return /Mobi|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  clearGooglePayPaymentData(): void {
    this.paymentMethodForm.controls['googlePayEncryptedPaymentData'].setValue('');
    this.paymentMethodForm.controls['googlePayMobileDevice'].setValue('')
  }

  initGooglePay(): void {
    if (!this.googlePayInitialized) {
      var paymentsClient = this.googlePayClient();
      //remove
      var isReadyToRequest = this.googlePayRequestBase();
      paymentsClient.isReadyToPay(isReadyToRequest).then((response: { result: string }) => {
        if (response.result) {
          this.googlePayBtn.nativeElement.append(paymentsClient.createButton({
            onClick: this.requestGoPayPayment()
          }))
        } else {

        }
        this.googlePayInitialized = true;
      }).catch((error: any) => {

      })
    }
  }
}
