import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usar proxy en desarrollo, URL completa en producción
  private apiUrl = window.location.hostname === 'localhost' 
    ? '/api/auth'  // Usa proxy en desarrollo
    : 'https://dulce-lili-media-1.onrender.com/api/auth';  // URL completa en producción
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return false;
    }
    // Validar token con el backend
    return true; // Por ahora retornamos true si existe, la validación real se hace en el guard
  }

  validateToken(): Observable<{ valid: boolean }> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.next({ valid: false });
        observer.complete();
      });
    }
    return this.http.post<{ valid: boolean }>(`${this.apiUrl}/validate`, { token });
  }
}
