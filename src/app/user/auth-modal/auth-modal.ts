import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModalService } from '../../input-datas';

@Component({
  selector: 'app-auth-modal',
  standalone: false,
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.css']
})
export class AuthModal implements OnInit {
  isVisible = false;
  activeTab: 'login' | 'register' = 'login';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthModalService) {
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

  ngOnInit() {
    this.authService.modal$.subscribe(tab => {
      if (tab) {
        this.activeTab = tab;
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
    });
  }

  get selectedIndex(): number {
    return this.activeTab === 'login' ? 0 : 1;
  }

  set selectedIndex(value: number) {
    this.activeTab = value === 0 ? 'login' : 'register';
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  submitLogin() {
    if (this.loginForm.valid) {
      console.log('Login form values:', this.loginForm.value);
      this.authService.close();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
closeModal() {
  this.authService.close();
}
  submitRegister() {
    if (this.registerForm.valid) {
      console.log('Register form values:', this.registerForm.value);
      this.authService.close();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
