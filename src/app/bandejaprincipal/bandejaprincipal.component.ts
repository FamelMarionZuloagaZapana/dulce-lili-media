import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonComponent } from '../../components/buttons/buttons.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Router } from '@angular/router';
import { InicioSesionComponent } from '../inicio-sesion/inicio-sesion.component';
import { RouterModule } from '@angular/router';

interface Reclamo {
  nombre: string;
  asunto: string;
  fecha: string;
  hora: string;
}

@Component({
  selector: 'app-bandejaprincipal',
  standalone: true,
  templateUrl: './bandejaprincipal.component.html',
  styleUrls: ['./bandejaprincipal.component.scss'],
  imports: [CommonModule, FormsModule, CardModule, ButtonComponent, AutoCompleteModule, RouterModule]
})
export class BandejaPrincipalComponent {
  selectedItem: string = '';
  suggestions: string[] = [];
  bandejaCount: number = 124;
  router: Router;
  constructor(router: Router) {
    this.router = router;
  }
  reclamos: Reclamo[] = [
    { nombre: 'Marcel Gutierres', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Marcia Torres', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Gabriel Enriquez', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Luis Marin', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Enrique Flores', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Luzmila Perez', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Elizabeth Quispe Torres', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Roberto Silva', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Carmen Mendoza', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' },
    { nombre: 'Fernando Castro', asunto: 'Reclamo 22/10/2026', fecha: '22/10/2026', hora: '12:26 p.m.' }
  ];

  search(event: any) {
    // Aquí puedes implementar la lógica de búsqueda
    // Por ejemplo, filtrar opciones basadas en event.query
    this.suggestions = ['Opción 1', 'Opción 2', 'Opción 3'];
  }

  buscar() {
    // Implementar lógica de búsqueda
    console.log('Buscando:', this.selectedItem);
  }

  irRegresarALogin() {
    this.router.navigate(['/inicio-sesion']);
  }
}