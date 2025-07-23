import { Component, signal } from '@angular/core';


@Component({
  selector: 'app-main-comp',
  standalone: false,
  templateUrl: './main-comp.html',
  styleUrl: './main-comp.css'
})
export class MainComp {

  readonly panelOpenState = signal(false);
}
