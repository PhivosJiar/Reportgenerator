import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() chartData: any = '';
  pieChartOption: any = [];
  data:any[]=[];
  constructor() { }

  ngOnInit(): void {
      for(let i =0 ; i< this.chartData.category.length; i++){
      this.data.push({value:this.chartData.data[i],name:this.chartData.category[i]})
    }
 
    this.pieChartOption = {
      title: {
        text: this.chartData.title,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: this.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    
  }

}
