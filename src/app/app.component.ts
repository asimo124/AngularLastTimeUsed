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
    }
    this.isVisible = true;
  }

  onDateChanged(newDate: Date) {

  }

  handleOk(): void {
    this.itemsUsedService.addItemUsed(this.selectedItem, this.dateUsed);
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
