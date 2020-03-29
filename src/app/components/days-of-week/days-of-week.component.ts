import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-days-of-week',
  templateUrl: './days-of-week.component.html',
  styleUrls: ['./days-of-week.component.scss']
})
export class DaysOfWeekComponent implements OnInit {

  @Input() billsDays: any;
  @Input() daysBack = 0;
  @Output() doClick = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  dayClicked(getDate) {
    this.doClick.emit(getDate);
  }

  didRemoveItem(weekToRemove, dateToRemove: string, itemId) {

    let i = 0;
    this.billsDays.forEach((item) => {
      if (i === weekToRemove) {
        let t = 0;
        item.days.forEach((dayItem) => {
            if (dateToRemove === dayItem.Date) {
              const newDesc = dayItem.desc.filter((descItem) => {
                return descItem.id !== itemId;
              });
              this.billsDays[i].days[t].desc = newDesc;
            }
            t++;
        });
      }
      i++;
    });
  }
}
