import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemsUsedService} from '../../services/items-used.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  @Input() expenses: any[];
  @Input() daysBack = 0;
  @Output() removedItem = new EventEmitter();

  colors = [
    '#18cc99',
    '#ff0266',
    '#ffc412',
    '#7d52e3',
    '#ff9e22',
    '#0336ff',
    '#ee0290'
  ];

  constructor(private itemsUsedService: ItemsUsedService) { }

  ngOnInit() {
  }

  removeItemUsed(id: number, getEvent: Event) {

    getEvent.stopPropagation();
    this.removedItem.emit(id);
    this.itemsUsedService.removeItemUsed(id);
    // this.itemsUsedService.loadItemsUsed(this.daysBack);
  }

}
