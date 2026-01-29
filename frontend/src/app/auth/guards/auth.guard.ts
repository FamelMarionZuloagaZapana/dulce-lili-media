import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.authService.getToken();
    
    if (!token) {
      this.router.navigate(['/inicio-sesion']);
      return false;
    }

    // Validar token con el backend
    return this.authService.validateToken().pipe(
      map(response => {
        if (response.valid) {
          return true;
        } else {
          this.authService.logout();
          this.router.navigate(['/inicio-sesion']);
          return false;
        }
      }),
      catchError(() => {
        this.authService.logout();
        this.router.navigate(['/inicio-sesion']);
        return of(false);
      })
    );
  }
}
