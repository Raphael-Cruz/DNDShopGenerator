import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';


export interface IUser {
  _id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://rollforshopbackend.onrender.com/auth';

  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.autoLogin();
  }

  // --- LOGIN ---
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', res.token);
          }
          this.currentUserSubject.next(res.user);
        })
      );
  }

  // --- REGISTER ---
  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  // --- FETCH CURRENT USER ---
  getMe(): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  // --- AUTO LOGIN ON APP START ---
  private autoLogin() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.getMe().subscribe({
      error: () => this.logout()
    });
  }

  // --- LOGOUT ---
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }

    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  // --- AUTH STATE ---
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }
}