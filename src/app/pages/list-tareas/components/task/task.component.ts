import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'todo-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() task: { estatus: string, _id: string, titulo: string, fechaVencimiento: string, fechaCreacion: string, checked: boolean };
  @Input() showCheck: boolean = false;

  constructor() { }

  ngOnInit() {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
