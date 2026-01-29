import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonComponent } from '../../components/buttons/buttons.component';
import { Router, RouterModule } from '@angular/router';
import { PrincipalComponent } from '../principal/principal.component';
import { AuthService } from '../auth/services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss'],
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonComponent, RouterModule]
})
export class InicioSesionComponent {
  valuecorreo = '';
  valuepassword = '';
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  irInicioSesion() {
    if (this.isLoading) {
      return;
    }

    if (!this.valuecorreo || !this.valuepassword) {
      this.errorMessage = 'Por favor, ingresa correo y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.valuecorreo, this.valuepassword)
      .pipe(
        catchError((error) => {
          // Manejar errores sin congelar la aplicación
          console.log('Error capturado:', error);
          
          if (error.status === 400) {
            // Error de validación del backend
            this.errorMessage = 'Por favor, verifica que el correo sea válido y todos los campos estén completos';
          } else if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Credenciales inválidas';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Por favor, intenta nuevamente.';
          }
          
          this.cdr.detectChanges();
          
          return of({ success: false, token: '', message: this.errorMessage });
        }),
        finalize(() => {
          // Siempre resetear isLoading al finalizar (éxito o error)
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/bandejaprincipal']);
          }
        },
        error: (error) => {
         
          console.error('Error no capturado:', error);
          this.isLoading = false;
          this.errorMessage = 'Error inesperado. Por favor, intenta nuevamente.';
          this.cdr.detectChanges();
        }
      });
  }

  irReclamo() {
  }

  irPrincipal() {
    this.router.navigate(['/principal']);
  }
}
