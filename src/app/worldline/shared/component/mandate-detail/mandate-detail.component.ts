import {Component, Input, OnInit} from '@angular/core';
import {MandateDetail} from "../../../model/mandateDetail";
import {combineLatest, Observable} from "rxjs";
import {Card} from "@spartacus/storefront";
import {filter, map} from "rxjs/operators";
import {TranslationService} from "@spartacus/core";

@Component({
  selector: 'mandate-detail',
  templateUrl: './mandate-detail.component.html',
  styleUrls: ['./mandate-detail.component.scss']
})
export class MandateDetailComponent implements OnInit {

  constructor(protected translation: TranslationService) {}
  order: any;

  @Input('order')
  set setOrder(order: any) {
    this.order = order;
  }
  ngOnInit(): void {
  }
  getMandateInfo(mandateDetail: MandateDetail): Observable<Card> {
    return combineLatest([
      this.translation.translate('mandate.info')
    ]).pipe(
      filter(() => Boolean(mandateDetail)),
      map(([textTitle]) => ({
        title: textTitle,
        textBold: `${mandateDetail.customer.personalInformation.title} ${mandateDetail.customer.personalInformation.firstName} ${mandateDetail.customer.personalInformation.lastName}`,
        text: [mandateDetail.customer.emailAddress, `${mandateDetail.customer.companyName} ${mandateDetail.customer.iban}`],
      }))
    );
  }

  getMandateAddress(mandateDetail: MandateDetail): Observable<Card> {
    return combineLatest([
      this.translation.translate('mandate.address')
    ]).pipe(
      filter(() => Boolean(mandateDetail)),
      map(([textTitle]) => ({
        title: textTitle,
        textBold: `${mandateDetail.customer.address.street}`,
        text: [mandateDetail.customer.address.city,mandateDetail.customer.address.zip, mandateDetail.customer.address.country],
      }))
    );
  }

}
