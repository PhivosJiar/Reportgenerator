import { Component, OnInit } from '@angular/core';
import { of, fromEvent, animationFrameScheduler } from 'rxjs';
import { map, switchMap, takeUntil, subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  element: string = '.barchart';
  iconDisplay:boolean=false;
  left:number=0;
  top:number =0;
  editBox = {
    type: 1,
    title: '',
    category: [''],
    data: [''],
    left:300,
    top:300
  }
  reportData: any[] = [
    {
      type: 1,
      title: '',
      category: [''],
      data: [''],
      left:300,
      top:300
    }
  ]
  barChartOption: any = [];

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('reportData') == null) {
      localStorage.setItem('reportData',  JSON.stringify(this.reportData));
    } else {
      this.reportData=JSON.parse(localStorage.getItem('reportData') || '{}');
    }
  }

  ngAfterViewInit(): void { //rxjs抓取物件及改變位置
    const validValue = (value: any, max: number, min: number) => {
      return Math.min(Math.max(value, min), max)
    }
    let box = document.querySelector<HTMLDivElement>(`${this.element}`);
    let input = document.querySelector<HTMLDivElement>('.editBox');
    let inputWidth = input!.getBoundingClientRect().width;
    const mousedown$ = fromEvent<MouseEvent>(document, 'mousedown');
    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');
    const drag$ = mousedown$.pipe(
      switchMap(
        (start) => {
          box = document.querySelector<HTMLDivElement>(`${this.element}`);
          return mousemove$.pipe(map(move => {
            move.preventDefault();
            return {
              left: validValue(move.clientX - start.offsetX, window.innerWidth - box!.getBoundingClientRect().width - inputWidth, 0),
              top: validValue(move.clientY - start.offsetY, window.innerHeight - box!.getBoundingClientRect().height - 80, 0)
            }
          }),
            takeUntil(mouseup$));
        }));
    const position$ = drag$.pipe(subscribeOn(animationFrameScheduler));
    position$.subscribe((pos: any) => {
      box!.style.top = `${pos.top}px`;
      box!.style.left = `${pos.left}px`;
      this.top=pos.top;
      this.left=pos.left
    });

  }

  mousedown(event: any) {
    this.element = event;
  }
  mouseup(index:number){
    this.reportData[index].left=this.left;
    this.reportData[index].top=this.top;
    localStorage.setItem('reportData', JSON.stringify(this.reportData));
  }
  generate() {
    this.editBox.category = this.editBox.category.toString().split(',');
    this.editBox.data = this.editBox.data.toString().split(',');
    let pushData = JSON.parse(JSON.stringify(this.editBox))
    this.reportData.push(pushData)

    this.editBox.title = '';
    this.editBox.category = [];
    this.editBox.data = [];

    localStorage.setItem('reportData', JSON.stringify(this.reportData));
  }

  delete(index: number) {
    console.log(this.reportData.splice(index, 1))
    localStorage.setItem('reportData', JSON.stringify(this.reportData));
  }
}
