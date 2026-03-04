import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})


export class Navbar {

  constructor(public authService: AuthService, private router: Router) { }

  modalOpen = false;



  openLogin() { this.modalOpen = true; }
  openItemStats() { /* your logic */ }
  logout() { this.authService.logout(); }
}


