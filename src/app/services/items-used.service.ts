// items.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ItemsUsedService {

  private itemsUsed: {
    results: any[];
  };
  private itemsUsedSource = new BehaviorSubject(this.itemsUsed);
  public itemsUsedList = this.itemsUsedSource.asObservable();

  private items: any[];
  private itemsSource = new BehaviorSubject(this.items);
  public itemsList = this.itemsSource.asObservable();

  constructor(private http: HttpClient) { }

  loadItemsUsed(daysBack: number = 0) {

    const requestParams = 'daysBack=' + daysBack;
    this.http.get<any>('https://api.hawleywebdesign.com/last-time?' + requestParams).subscribe(response => {

      this.itemsUsedSource.next(response);
    },
    (err) => {
      console.log('error', 'Error loading Items Used History : ' + err.error.message);
    });
  }

  loadItems() {
    this.http.get<any>('https://api.hawleywebdesign.com/last-time/items').subscribe(response => {

        this.itemsSource.next(response);
      },
      (err) => {
        console.log('error', 'Error loading Items : ' + err.error.message);
      });
  }

  addItemUsed(itemId: number, dateUsed: Date) {

    if (!itemId || !dateUsed) {
      return;
    }

    const apiParams = 'item_id=' + itemId + '&date_used=' + encodeURIComponent(dateUsed.toDateString());
    this.http.get<any>('https://api.hawleywebdesign.com/last-time/add-item-used?' + apiParams).subscribe(response => {

        console.log('Added Item Used');
      },
      (err) => {
        console.log('error', 'Error adding Item Used : ' + err.error.message);
      });
  }

  removeItemUsed(id: number) {

    if (!id) {
      return;
    }

    const apiParams = 'id=' + id;
    this.http.get<any>('https://api.hawleywebdesign.com/last-time/delete-item-used?' + apiParams).subscribe(response => {

        console.log('Deleted Item used');
      },
      (err) => {
        console.log('error', 'Error deleting Item Used : ' + err.error.message);
      });
  }
}
