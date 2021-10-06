import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {
  @Input() chartData: any = '';
  element: string = '.barchart';
  barChartOption: any = [];

  constructor() { }

  ngOnInit(): void {

    this.barChartOption = {
      xAxis: {
        type: 'category',
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        data: this.chartData.category
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: this.chartData.data,
          type: 'bar'
        }
      ]
    };

  }
  mousedown(event: any) {
    this.element = event;
  }

  mouseup() {
    this.element = '';
  }
}
