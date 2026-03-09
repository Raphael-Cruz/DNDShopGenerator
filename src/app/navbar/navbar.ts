import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../core/services/auth';
import { AuthModalService } from '../input-datas';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    private router: Router,
    private authModalService: AuthModalService  // ← adicione
  ) { }

  modalOpen = false;
  mobileMenuOpen = false;

  private modalSub!: Subscription;

  ngOnInit() {
    // Ouve o AuthModalService — qualquer componente pode abrir o modal
    this.modalSub = this.authModalService.modal$.subscribe(tab => {
      if (tab) {
        this.modalOpen = true;
      }
    });
  }

  ngOnDestroy() {
    this.modalSub?.unsubscribe();
  }

  openLogin() { this.modalOpen = true; }

  logout() { this.authService.logout(); }
}