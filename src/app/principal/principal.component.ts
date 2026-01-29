import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonComponent } from '../../components/buttons/buttons.component';
import { Router } from '@angular/router';
import { InicioSesionComponent } from '../inicio-sesion/inicio-sesion.component';
import { TerminoscondicionesComponent } from './terminoscondiciones/terminoscondiciones.component';

@Component({
  standalone: true,
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  imports: [CommonModule, RouterModule, CardModule, ButtonComponent, TerminoscondicionesComponent]
})
export class PrincipalComponent {

  irInicio() {
    this.router.navigate(['/inicio-sesion']).then(
      (success) => console.log('Navegación exitosa:', success),
      (error) => console.error('Error en navegación:', error)
    );
  }

  constructor(private router: Router) {}
  
  iniciarReclamo() {
    console.log('iniciarReclamo llamado');
    this.router.navigate(['/reclamo']).then(
      (success) => console.log('Navegación exitosa:', success),
      (error) => console.error('Error en navegación:', error)
    );
  }
}