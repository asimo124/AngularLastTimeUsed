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

  searchItemsUsedResults: {
    results: any[];
  };
  searchItemsUsedList: any[];

  itemsList: any[];
  keyword: string;

  currentDaysBack = 0;
  isVisible = false;

  showSearch = false;

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

    //
    this.subs.push(this.itemsUsedService.searchItemsUsedList.subscribe(response => {
      if (response) {
        this.searchItemsUsedResults = response;
        this.searchItemsUsedList = response.results;
        console.log('searchItemsUsedList: ', this.searchItemsUsedList);
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

  toggleSearch() {

    this.showSearch = !(this.showSearch);
    if (this.showSearch) {
      this.beginSearchItemsUsed();
    }
  }

  beginSearchItemsUsed() {
    this.itemsUsedService.searchItemUsed(this.keyword);
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

    const dateUsed2 = this.convertDateToString(this.dateUsed);
    let i = 0;
    const newItemsUsed = this.itemsUsedList;
    this.itemsUsedList.forEach((item) => {
      let t = 0;
      item.days.forEach((dayItem) => {

        let useItemName = '';
        let useColor = '';
        this.itemsList.forEach((getItem) => {
          if (getItem.id == this.selectedItem) {
            useItemName = getItem.title;
            useColor = getItem.color;
          }
        })

        if (dateUsed2 === dayItem.Date) {
          const newDesc = dayItem.desc;
          newDesc.push({
            id: this.selectedItem,
            item_name: useItemName,
            color: useColor,
            date_used: dateUsed2,
          });
          console.log('did happen at 2');
          newItemsUsed[i].days[t].desc = newDesc;
        }
        t++;
      });
      i++;
    });
    console.log('newItemsUsed at 2: ', newItemsUsed);
    this.itemsUsedList = null;
    this.itemsUsedList = newItemsUsed;

    this.itemsUsedService.addItemUsed(this.selectedItem, this.dateUsed);



    // this.itemsUsedService.loadItemsUsed(this.currentDaysBack);
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
