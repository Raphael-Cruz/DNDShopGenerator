import { Component,EventEmitter, Output } from '@angular/core';
import { AuthModalService } from '../input-datas';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})


export class Navbar {

  constructor(private authService: AuthModalService) {}

  openLogin() {
    this.authService.open('login');   
    console.log("loggin called")
  }

  openRegister() {
    this.authService.open('register'); 
     console.log("loggin called")
  }
}