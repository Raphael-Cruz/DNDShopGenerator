import { Component,EventEmitter, Output } from '@angular/core';
import { AuthModalService } from '../input-datas';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: '../main-comp/main-comp.css'
})


export class Navbar {

  constructor(private authService: AuthModalService) {}

  openLogin() {
    this.authService.open('login');   
  }

  openRegister() {
    this.authService.open('register'); 
  }
}