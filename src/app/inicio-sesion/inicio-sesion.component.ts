import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonComponent } from '../../components/buttons/buttons.component';
import { Router, RouterModule } from '@angular/router';
import { PrincipalComponent } from '../principal/principal.component';

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

  
  irInicioSesion() {
    this.router.navigate(['/bandejaprincipal']);
  }
  irReclamo() {
  }
  irPrincipal() {
    this.router.navigate(['/principal']);
  }
}
