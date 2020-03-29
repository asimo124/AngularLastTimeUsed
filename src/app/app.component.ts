import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ItemsUsedService} from './services/items-used.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked, AfterViewInit {
  title = 'contactsV3';
  itemsUsedResults: {
    results: any[];
  };
  itemsUsedList: any[];

  itemsList: any[];

  currentDaysBack = 0;
  isVisible = false;

  subs: Subscription[] = [];

  selectedItem = 1;
  selectedName = '';
  dateUsed: Date;

  dateFormat = 'MM/dd/yyyy';
  monthFormat = 'MM/yyyy';

  @ViewChild('mainContent', null) private mainContent: ElementRef;

  constructor(private router: Router,  private itemsUsedService: ItemsUsedService) {

    // get and subscribe to Used Items List
    this.subs.push(this.itemsUsedService.itemsUsedList.subscribe(response => {
      if (response) {
        this.itemsUsedResults = response;
        this.itemsUsedList = response.results;
        console.log('itemsUsedList: ', this.itemsUsedList);
      }
    }));

    // get and subscribe to Items List
    this.subs.push(this.itemsUsedService.itemsList.subscribe(response => {
      if (response) {
        this.itemsList = response;
        if (this.itemsList && this.itemsList.length > 0) {
          this.selectedItem = this.itemsList[0].id;
          this.selectedName = this.itemsList[0].title;
        }
        console.log('itemsList: ', this.itemsList);
      }
    }));

    this.loadItems();
    this.loadItemsUsed();
  }

  ngOnInit() {

  }

  ngAfterViewChecked() {

  }

  ngAfterViewInit() {
    this.router.navigate(['/'], { fragment: 'top' });
  }

  loadItems() {
    this.itemsUsedService.loadItems();
  }

  loadItemsUsed() {

    this.currentDaysBack = 0;
    this.itemsUsedService.loadItemsUsed(this.currentDaysBack);
  }

  backThreeMonths() {

    this.currentDaysBack += 28;
    this.itemsUsedService.loadItemsUsed(this.currentDaysBack);
  }

  addItemUsed(getDate) {
    if (getDate) {
      this.dateUsed = new Date(getDate);
    } else {
      this.dateUsed = null;
    }
    if (this.itemsList && this.itemsList.length > 0) {
      this.selectedItem = this.itemsList[0].id;
      this.selectedName = this.itemsList[0].title;
    }
    this.isVisible = true;
  }

  onDateChanged(newDate: Date) {

  }

  convertDateToString(getDate: Date) {

    const day = getDate.getDate();
    const month = getDate.getMonth() + 1;
    const year = getDate.getFullYear();
    let day2 = String(day);
    if (day < 10) {
      day2 = '0' + day;
    }
    let month2 = String(month);
    if (month < 10) {
      month2 = '0' + month;
    }
    return month2 + '/' + day2 + '/' + year;
  }

  handleOk(): void {
    this.itemsUsedService.addItemUsed(this.selectedItem, this.dateUsed);

    const dateUsed2 = this.convertDateToString(this.dateUsed);
    let i = 0;
    this.itemsUsedList.forEach((item) => {
      let t = 0;
      item.days.forEach((dayItem) => {

        if (dateUsed2 === dayItem.Date) {
          const newDesc = dayItem.desc;
          newDesc.push({
            id: this.selectedItem,
            item_name: this.selectedName,
            color: '#18cc99',
            date_used: dateUsed2,
          });
          const newItemsUsed = this.itemsUsedList;
          this.itemsUsedList = null;
          newItemsUsed[i].days[t].desc = newDesc;
          this.itemsUsedList = newItemsUsed;
        }
        t++;
      });
      i++;
    });

    this.itemsUsedService.loadItemsUsed(this.currentDaysBack);
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
