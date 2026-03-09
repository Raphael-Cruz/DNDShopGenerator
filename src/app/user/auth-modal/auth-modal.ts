import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../core/services/auth';
import { InputDatas } from '../../input-datas';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.css'],
  animations: [
    trigger('overlayAnim', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease', style({ opacity: 0 }))]),
    ]),
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.92) translateY(20px)' }),
        animate('280ms cubic-bezier(.34,1.56,.64,1)', style({ opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [
        animate('200ms ease', style({ opacity: 0, transform: 'scale(.95) translateY(10px)' })),
      ]),
    ]),
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('200ms ease', style({ opacity: 1, transform: 'none' })),
      ]),
    ]),
    trigger('successAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.8)' }),
        animate('400ms cubic-bezier(.34,1.56,.64,1)', style({ opacity: 1, transform: 'none' })),
      ]),
    ]),
    trigger('formAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(16px)' }),
        animate('220ms ease', style({ opacity: 1, transform: 'none' })),
      ]),
    ]),
  ],
})
export class AuthModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Output() closed = new EventEmitter<void>();

  activeTab: 'login' | 'register' = 'login';
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPass = false;

  get passwordMismatch(): boolean {
    const { password, confirmPassword } = this.registerForm.value;
    return !!confirmPassword && password !== confirmPassword;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private shopData: InputDatas,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildForms();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']?.currentValue === true) {
      this.resetState();
    }
  }

  private buildForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [null],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  private resetState() {
    this.successMessage = '';
    this.errorMessage = '';
    this.isLoading = false;
    this.showPass = false;
    this.activeTab = 'login';
    // Rebuild forms so previous values/touched state are cleared
    this.buildForms();
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  closeModal() {
    this.successMessage = '';
    this.errorMessage = '';
    this.closed.emit();
  }


  // Após qualquer login bem-sucedido — salvar pending shop se existir
  private async onLoginSuccess() {
    const pending = this.shopData.getPendingShop();
    if (pending) {
      try {
        await firstValueFrom(this.shopData.saveShopToDB(pending));
        this.shopData.clearPendingShop();
        this.shopData.setFormData(null as any);
        this.successMessage = 'Account created & shop saved! ✨';
      } catch {
        // Shop não foi salvo — não é fatal, continua
        this.successMessage = "You're logged in! 🎉";
      }
    } else {
      this.successMessage = "You're logged in! 🎉";
    }
    setTimeout(() => {
      this.closeModal();
      if (this.shopData.getPendingShop() === null) {
        this.router.navigate(['/myshops']);
      }
    }, 1800);
  }

  async submitLogin() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const { email, password } = this.loginForm.value;
      await firstValueFrom(this.auth.login(email, password));
      await this.onLoginSuccess();
    } catch {
      this.errorMessage = 'Invalid credentials. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async submitRegister() {
    if (this.registerForm.invalid || this.passwordMismatch) {
      this.registerForm.markAllAsTouched();
      if (this.passwordMismatch) this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const { name, email, password } = this.registerForm.value;
      await firstValueFrom(this.auth.register(name, email, password));
      // Login automático após register
      await firstValueFrom(this.auth.login(email, password));
      await this.onLoginSuccess();
    } catch {
      this.errorMessage = 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}