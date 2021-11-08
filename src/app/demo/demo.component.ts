import { Component, OnInit, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { of, fromEvent, animationFrameScheduler } from 'rxjs';
import { map, switchMap, takeUntil, subscribeOn } from 'rxjs/operators';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  element: string = '.barchart0';
  iconDisplay: boolean = false;
  isEdit: boolean = false;
  left: number = 0;
  top: number = 0;
  tempEditBox = {
    type: 1,
    title: '',
    category: [''],
    data: [''],
    left: 300,
    top: 300
  }
  editBox = {
    type: 1,
    title: '',
    category: [''],
    data: [''],
    left: 300,
    top: 300
  }
  reportData: any[] = [
    {
      type: 1,
      title: '',
      category: [''],
      data: [''],
      left: 300,
      top: 300
    }
  ]
  itemIndex: number = 0;
  barChartOption: any = [];
  constructor(
    private nzContextMenuService: NzContextMenuService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('reportData') == null) {
      localStorage.setItem('reportData', JSON.stringify(this.reportData));
    } else {
      this.find();
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
      throttle(pos);
    });

    let func = (item: any) => {
      box!.style.top = `${item.top}px`;
      box!.style.left = `${item.left}px`;
      this.top = item.top;
      this.left = item.left
    }

    let throttle = _.throttle(func, 30);
  }
  find() {
    this.reportData = JSON.parse(localStorage.getItem('reportData') || '{}');
  }
  mousedown(event: string) {
    this.element = event;
  }
  mouseup(index: number) {
    this.element = '.barchart0';
    this.reportData[index].left = this.left;
    this.reportData[index].top = this.top;
    localStorage.setItem('reportData', JSON.stringify(this.reportData));
  }
  generate() {
    this.editBox.category = this.editBox.category.toString().split(',');
    this.editBox.data = this.editBox.data.toString().split(',');
    this.reportData.push(_.cloneDeep(this.editBox))
  

    localStorage.setItem('reportData', JSON.stringify(this.reportData));
    this.clearEditBox();
  }

  delete() {
    this.reportData.splice(this.itemIndex, 1)
    localStorage.setItem('reportData', JSON.stringify(this.reportData));
  }

  contextMenu(
    $event: MouseEvent, menu: NzDropdownMenuComponent
    , Index: number, item: any): void {

    this.tempEditBox = _.cloneDeep(item)
    this.nzContextMenuService.create($event, menu);
    this.itemIndex = Index;
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  edit() {
    this.isEdit = true
    this.editBox = this.reportData[this.itemIndex];
    this.editBox.type == 1 ? this.iconDisplay = false : this.iconDisplay = true;
  }

  saveChange() {
    this.editBox.category = this.editBox.category.toString().split(',');
    this.editBox.data = this.editBox.data.toString().split(',');
    this.save();
  }
  copy() {
    this.reportData.push(_.cloneDeep(this.reportData[this.itemIndex]))
    this.save();
  }

  save() {
    localStorage.setItem('reportData', JSON.stringify(this.reportData));
    this.find();
    this.clearEditBox();

  }

  clearEditBox(){
    this.editBox.title = '';
    this.editBox.category = [];
    this.editBox.data = [];
  }
  public async onShareClick(){
    const shareData = {
      title: 'report-generator',
      text: '我找到一款超好用的報表產生器<br>超適合你的<br>趕快一起來使用!!!',
      url: 'https://report-generator-from-angular.herokuapp.com/'
    }

    await navigator.share(shareData)
   
  }
}
