import { Component, OnInit } from '@angular/core';
import { of, fromEvent, animationFrameScheduler } from 'rxjs';
import { map, switchMap, takeUntil, subscribeOn } from 'rxjs/operators';
import { EditBox } from '../interface'

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  element: string = '.barchart';
  editBox = {
    type: 1,
    title: '11',
    category: ['123', '456'],
    data: ['234', '789']
  }
  i=1
  reportData :any[] = []
  barChartOption: any = [];

  testContent: any = '<app-pie-chart class="piechart" ></app-pie-chart>'
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
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
      box!.style.top = `${pos.top}px`
      box!.style.left = `${pos.left}px`
    });

  }

  mousedown(event: any) {
    this.element = event;
  }

  generate() {
    this.i+=1
    console.log(this.editBox)

    this.reportData.push(this.editBox)
    console.log(this.reportData)



  }
}
