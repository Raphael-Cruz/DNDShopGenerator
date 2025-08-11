import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  standalone: false,
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css'
})
export class AuthModal {

get selectedIndex(): number {
  return this.activeTab === 'login' ? 0 : 1;
}

set selectedIndex(value: number) {
  this.activeTab = value === 0 ? 'login' : 'register';
}

  isVisible = false; // controls modal visibility
  activeTab: 'login' | 'register' = 'login'; // track which tab is active

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize forms
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  openModal() {
    this.isVisible = true;
  
  }

  closeModal() {
    this.isVisible = false;
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  submitLogin() {
    if (this.loginForm.valid) {
      console.log('Login form values:', this.loginForm.value);
      this.closeModal();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  submitRegister() {
    if (this.registerForm.valid) {
      console.log('Register form values:', this.registerForm.value);
      this.closeModal();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}


