import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReclamoService } from '../reclamo/services/reclamo.service';
import { CardModule } from 'primeng/card';
import { ButtonComponent } from '../../components/buttons/buttons.component';
import { finalize } from 'rxjs';

interface Reclamo {
  id?: string;
  nombreCompleto: string;
  tipoReclamacion: string;
  fechaCreacion?: Date;
  fecha?: string;
  hora?: string;
  asunto?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  telefono?: string;
  correo?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  detalle?: string;
  pedidoConsumidor?: string;
}

@Component({
  selector: 'app-vistacorreo',
  standalone: true,
  templateUrl: './vistacorreo.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonComponent]
})
export class VistacorreoComponent implements OnInit {
  reclamo: Reclamo | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reclamoService: ReclamoService
  ) {}

  ngOnInit() {
    // 1) Intentar usar el state de navegación (viene desde bandeja) para evitar otra llamada HTTP.
    const stateReclamo = (history.state as any)?.reclamo as Reclamo | undefined;
    if (stateReclamo && stateReclamo.id) {
      this.reclamo = stateReclamo;
      this.isLoading = false;
      return;
    }

    // 2) Fallback: cargar por id desde la lista (mientras no exista endpoint GET /api/reclamos/:id).
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID de reclamo no proporcionado';
      return;
    }
    this.cargarReclamo(id);
  }

  cargarReclamo(id: string) {
    this.isLoading = true;
    this.error = null;
    
    this.reclamoService.obtenerReclamos().pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    ).subscribe({
      next: (response) => {
        const reclamoEncontrado = response.reclamos.find((r: any) => String(r.id) === String(id));
        if (reclamoEncontrado) {
          const fecha = reclamoEncontrado.fechaCreacion 
            ? new Date(reclamoEncontrado.fechaCreacion.seconds * 1000 || reclamoEncontrado.fechaCreacion) 
            : new Date();
          
          this.reclamo = {
            id: reclamoEncontrado.id,
            nombreCompleto: reclamoEncontrado.nombreCompleto || 'Sin nombre',
            tipoReclamacion: reclamoEncontrado.tipoReclamacion || 'Sin tipo',
            fechaCreacion: fecha,
            fecha: this.formatearFecha(fecha),
            hora: this.formatearHora(fecha),
            asunto: `Reclamo ${this.formatearFecha(fecha)}`,
            tipoDocumento: reclamoEncontrado.tipoDocumento || '',
            numeroDocumento: reclamoEncontrado.numeroDocumento || '',
            telefono: reclamoEncontrado.telefono || '',
            correo: reclamoEncontrado.correo || '',
            departamento: reclamoEncontrado.departamento || '',
            provincia: reclamoEncontrado.provincia || '',
            distrito: reclamoEncontrado.distrito || '',
            detalle: reclamoEncontrado.detalle || '',
            pedidoConsumidor: reclamoEncontrado.pedidoConsumidor || ''
          };
        } else {
          this.error = 'Reclamo no encontrado';
        }
      },
      error: (error) => {
        console.error('Error al cargar reclamo:', error);
        this.error = 'Error al cargar el reclamo';
      }
    });
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatearHora(fecha: Date): string {
    return fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  volverABandeja() {
    this.router.navigate(['/bandejaprincipal']);
  }
}