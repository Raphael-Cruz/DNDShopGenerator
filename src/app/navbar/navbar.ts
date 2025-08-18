import { Component,EventEmitter, Output } from '@angular/core';
import { AuthModalService } from '../input-datas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})


export class Navbar {

  constructor(private authService: AuthModalService, private router: Router) {}

  openLogin() {
    this.authService.open('login');   
    console.log("loggin called")
  }
  openItemStats() {
    this.router.navigate(['/item-stats']);
  }
  openRegister() {
    this.authService.open('register'); 
     console.log("loggin called")
  }
}