export const worldlineConstants =
  {
    cms: {
      contentPages: {
        worldlinePaymentMethod: {
          id: 'worldlineCheckoutPaymentMethodsPage',
          label: 'checkout/worldline-payment-method',
          slots: {
            bodyContentSlot: {
              id: 'BodyContentSlot-worldlineCheckoutPaymentMethods',
              components: {
                checkoutProgress: {
                  id: 'WorldlineCheckoutProgressComponent',
                  flexType: 'WorldlineCheckoutProgress'
                }, checkoutProgressMobileTop: {
                  id: 'WorldlineCheckoutProgressMobileTopComponent',
                  flexType: 'WorldlineCheckoutProgressMobileTop'
                }, paymentMethod: {
                  id: 'WorldlinePaymentMethodComponent',
                  flexType: 'WorldlinePaymentMethodComponent'
                }, checkoutProgressMobileBottom: {
                  id: 'WorldlineCheckoutProgressMobileBottomComponent',
                  flexType: 'WorldlineCheckoutProgressMobileBottom'
                },
              }
            },
            sideContentSlot: {
              id: 'SideContentSlot-worldlineCheckoutPaymentMethods',
              components: {
                orderSummary: {
                  id: 'WorldlineCheckoutOrderSummaryComponent',

                }
              }
            }
          }
        }
        ,
        worldlineOrderReview: {
          id: 'worldlineOrderReview',
          label: 'checkout/worldline-order-review',
          slots: {
            bodyContentSlot: {
              id: 'BodyContentSlot-worldlineOrderReview',
              components: {
                checkoutProgress: {
                  id: 'WorldlineCheckoutProgressComponent',
                  flexType: 'WorldlineCheckoutProgress'
                }, checkoutProgressMobileTop: {
                  id: 'WorldlineCheckoutProgressMobileTopComponent',
                  flexType: 'WorldlineCheckoutProgressMobileTop'
                }, WorldlineOrderReview: {
                  id: 'WorldlineReviewOrderSpaComponent',
                  flexType: 'WorldlineOrderReview'
                }, checkoutProgressMobileBottom: {
                  id: 'WorldlineCheckoutProgressMobileBottomComponent',
                  flexType: 'WorldlineCheckoutProgressMobileBottom'
                },
              }
            },
            sideContentSlot: {
              id: 'SideContentSlot-worldlineOrderReview',
              components: {
                orderSummary: {
                  id: 'WorldlineCheckoutOrderSummaryComponent',
                },
                placeOrder: {
                  id: 'WorldlinePlaceOrderComponent',
                  flexType: 'WorldlinePlaceOrder'
                }
              }
            }
          }

        }
        ,
        hostedcheckout: {
          id: 'hostedcheckout',
          label: 'hostedcheckout',
          slots: {
            section2A: {
              id: 'Section2A-worldlineHostedCheckoutResponse',
              components: {
                WorldlineHostedCheckoutResponse: {
                  id: 'WorldlineHostedCheckoutResponse',
                  flexType: 'WorldlineHostedCheckoutResponse'
                }
              }
            }
          }
        }
        ,
        hostedtokenization: {
          id: 'hostedtokenization-3ds',
          label: 'hostedtokenization-3ds',
          slots: {
            section2A: {
              id: 'Section2A-worldlineHostedCheckoutResponse',
              components: {
                WorldlineTokenization3DS: {
                  id: 'WorldlineTokenization3DS',
                  flexType: 'WorldlineTokenization3DS'
                }
              }
            }
          }

        }
      }


    }

  }
