import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarChartComponent } from './component/bar-chart/bar-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { DemoComponent } from './demo/demo.component';
import { PieChartComponent } from './component/pie-chart/pie-chart.component';
@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    DemoComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxEchartsModule.forRoot({
      echarts,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
