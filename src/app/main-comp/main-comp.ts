import { Component, signal, ViewChild } from '@angular/core';
import { AuthModal } from '../user/auth-modal/auth-modal';

@Component({
  selector: 'app-main-comp',
  standalone: false,
  templateUrl: './main-comp.html',
  styleUrl: './main-comp.css'
})
export class MainComp {

  readonly panelOpenState = signal(false);


}