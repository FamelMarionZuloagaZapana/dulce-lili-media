import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonComponent } from '../../components/buttons/buttons.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Router, RouterModule } from '@angular/router';
import { ReclamoService } from '../reclamo/services/reclamo.service';
import { AuthService } from '../auth/services/auth.service';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  selector: 'app-bandejaprincipal',
  standalone: true,
  templateUrl: './bandejaprincipal.component.html',
  styleUrls: ['./bandejaprincipal.component.scss'],
  imports: [CommonModule, FormsModule,  CardModule, ButtonComponent, AutoCompleteModule, RouterModule]
})
export class BandejaPrincipalComponent implements OnInit {
  selectedItem: string = '';
  suggestions: string[] = [];
  bandejaCount: number = 0;
  reclamos: Reclamo[] = [];
  reclamosFiltrados: Reclamo[] = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private reclamoService: ReclamoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarReclamos();
  }

  cargarReclamos() {
    console.log('🔄 Iniciando carga de reclamos...');
    this.isLoading = true;
    this.reclamos = [];
    this.reclamosFiltrados = [];
    
    // Mecanismo de seguridad: si después de 15 segundos isLoading sigue en true, forzar a false
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('⚠️ TIMEOUT: La carga de reclamos tomó más de 15 segundos. Forzando isLoading a false.');
        this.isLoading = false;
        if (this.reclamos.length === 0) {
          console.warn('⚠️ No se pudieron cargar los reclamos. Verifica la conexión y la autenticación.');
        }
      }
    }, 15000);
    
    this.reclamoService.obtenerReclamos()
      .pipe(
        timeout(10000), // Timeout de 10 segundos
        catchError((error) => {
          console.error('❌ Error en la petición HTTP:', error);
          // Retornar un objeto vacío para que el código continúe
          return of({ success: false, reclamos: [], total: 0 });
        })
      )
      .subscribe({
        next: (response) => {
          console.log('📥 Respuesta completa del servidor:', JSON.stringify(response, null, 2));
          
          // Validar que la respuesta tenga la estructura esperada
          let reclamosArray: any[] = [];
          
          if (response) {
            if (Array.isArray((response as any).reclamos)) {
              reclamosArray = (response as any).reclamos;
              console.log('✅ Encontrado response.reclamos (array)');
            } else if (Array.isArray(response)) {
              reclamosArray = response;
              console.log('✅ Response es directamente un array');
            } else if ((response as any).data && Array.isArray((response as any).data)) {
              reclamosArray = (response as any).data;
              console.log('✅ Encontrado response.data (array)');
            }
          }
          
          console.log('📊 Array de reclamos extraído:', reclamosArray.length, 'elementos');
          
          // Mapear los reclamos
          this.reclamos = reclamosArray.map((r: any) => {
            // Manejar diferentes formatos de fecha
            let fecha: Date;
            if (r.fechaCreacion) {
              if (r.fechaCreacion.seconds) {
                fecha = new Date(r.fechaCreacion.seconds * 1000);
              } else if (r.fechaCreacion.toDate) {
                fecha = r.fechaCreacion.toDate();
              } else if (r.fechaCreacion instanceof Date) {
                fecha = r.fechaCreacion;
              } else {
                fecha = new Date(r.fechaCreacion);
              }
            } else {
              fecha = new Date();
            }
            
            return {
              id: r.id,
              nombreCompleto: r.nombreCompleto || 'Sin nombre',
              tipoReclamacion: r.tipoReclamacion || 'Sin tipo',
              fechaCreacion: fecha,
              fecha: this.formatearFecha(fecha),
              hora: this.formatearHora(fecha),
              asunto: r.asunto || `Reclamo ${this.formatearFecha(fecha)}`,
              tipoDocumento: r.tipoDocumento || '',
              numeroDocumento: r.numeroDocumento || '',
              telefono: r.telefono || '',
              correo: r.correo || '',
              departamento: r.departamento || '',
              provincia: r.provincia || '',
              distrito: r.distrito || '',
              detalle: r.detalle || '',
              pedidoConsumidor: r.pedidoConsumidor || ''
            };
          });
          
          // IMPORTANTE: Inicializar reclamosFiltrados con todos los reclamos automáticamente
          // Esto asegura que los reclamos se muestren sin necesidad de usar el buscador
          this.reclamosFiltrados = this.reclamos.length > 0 ? [...this.reclamos] : [];
          this.bandejaCount = (response as any).total || this.reclamos.length;
          
          // Limpiar búsqueda para asegurar que se muestren todos los reclamos
          this.selectedItem = '';
          
          // Marcar como no cargando DESPUÉS de asignar los datos
          this.isLoading = false;
          
          // Verificación final: asegurar que reclamosFiltrados tenga datos
          if (this.reclamos.length > 0 && this.reclamosFiltrados.length === 0) {
            console.warn('⚠️ ADVERTENCIA: reclamosFiltrados está vacío pero hay reclamos. Corrigiendo...');
            this.reclamosFiltrados = [...this.reclamos];
          }
          
          console.log('✅ Reclamos cargados:', this.reclamos.length);
          console.log('✅ Reclamos filtrados (deben ser iguales):', this.reclamosFiltrados.length);
          console.log('✅ selectedItem limpio:', this.selectedItem);
          console.log('✅ Estado final - isLoading:', this.isLoading, '| reclamos:', this.reclamos.length, '| filtrados:', this.reclamosFiltrados.length);
          
          // Forzar detección de cambios para asegurar que Angular actualice la vista
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error al cargar reclamos:', error);
          console.error('❌ Detalles del error:', JSON.stringify(error, null, 2));
          this.reclamos = [];
          this.reclamosFiltrados = [];
          this.bandejaCount = 0;
          this.isLoading = false; // IMPORTANTE: siempre poner isLoading en false
        },
        complete: () => {
          console.log('✅ Observable completado');
          // Asegurar que isLoading esté en false incluso si hay algún problema
          if (this.isLoading) {
            console.warn('⚠️ isLoading todavía era true al completar. Corrigiendo...');
            this.isLoading = false;
          }
          // Forzar detección de cambios al completar
          this.cdr.detectChanges();
        }
      });
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatearHora(fecha: Date): string {
    return fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  search(event: any) {
    const query = event.query?.toLowerCase() || '';
    // Filtrar sugerencias basadas en el query
    this.suggestions = this.reclamos
      .map(reclamo => reclamo.correo || '')
      .filter(correo => correo.toLowerCase().includes(query))
      .filter((correo, index, self) => self.indexOf(correo) === index); // Eliminar duplicados
  }

  buscar() {
    console.log('🔍 Método buscar() llamado - SOLO para filtrar cuando hay búsqueda activa');
    console.log('🔍 Estado actual - reclamos:', this.reclamos.length, '| filtrados:', this.reclamosFiltrados.length, '| selectedItem:', this.selectedItem);
    
    // Si no hay reclamos cargados y no está cargando, intentar cargar de nuevo
    if (this.reclamos.length === 0 && !this.isLoading) {
      console.log('⚠️ No hay reclamos cargados. Intentando cargar de nuevo...');
      this.cargarReclamos();
      return;
    }
    
    // Solo filtrar si hay un término de búsqueda
    if (!this.selectedItem || this.selectedItem.trim() === '') {
      // Si no hay búsqueda, mostrar todos los reclamos (esto ya debería estar hecho automáticamente)
      this.reclamosFiltrados = [...this.reclamos];
      console.log('✅ Restableciendo filtro - Mostrando todos los reclamos:', this.reclamosFiltrados.length);
    } else {
      // Filtrar reclamos por correo, nombre o asunto
      const query = this.selectedItem.toLowerCase().trim();
      this.reclamosFiltrados = this.reclamos.filter(reclamo => 
        reclamo.correo?.toLowerCase().includes(query) ||
        reclamo.nombreCompleto?.toLowerCase().includes(query) ||
        reclamo.asunto?.toLowerCase().includes(query)
      );
      console.log('🔍 Búsqueda realizada. Resultados:', this.reclamosFiltrados.length);
    }
    
    // Forzar detección de cambios después de filtrar
    this.cdr.detectChanges();
  }

  irRegresarALogin() {
    this.authService.logout();
    this.router.navigate(['/inicio-sesion']);
  }

  verDetalleReclamo(reclamo: Reclamo) {
    if (reclamo.id) {
      this.router.navigate(['/vistacorreo', reclamo.id], {
        state: { reclamo },
      });
    }
  }

  trackByReclamoId(index: number, reclamo: Reclamo): any {
    return reclamo.id || index;
  }
}