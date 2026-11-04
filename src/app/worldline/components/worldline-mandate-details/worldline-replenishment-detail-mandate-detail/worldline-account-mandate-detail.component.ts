import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {OrderDetailsService} from "@spartacus/order/components";

@Component({
  selector: 'worldline-account-mandate-detail',
  templateUrl: './worldline-account-mandate-detail.component.html',
  styleUrls: ['./worldline-account-mandate-detail.component.scss']
})
export class WorldlineAccountMandateDetailComponent implements OnInit {

  order$: Observable<any>;

  constructor(protected orderDetailsService: OrderDetailsService) {
  }

  ngOnInit() {
    this.order$ = this.orderDetailsService.getOrderDetails();
  }


}
