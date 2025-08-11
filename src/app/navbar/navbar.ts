import { Component,EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: '../main-comp/main-comp.css'
})


export class Navbar {



 @Output() openModal = new EventEmitter<void>();

  onOpenModalClick() {
    this.openModal.emit();
  }
}
