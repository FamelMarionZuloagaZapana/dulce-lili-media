import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

export interface ReclamoData {
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
  telefono: string;
  correo: string;
  departamento: string;
  provincia?: string;
  distrito?: string;
  tipoReclamacion: string;
  detalle: string;
  pedidoConsumidor?: string;
}

export interface ReclamoResponse {
  success: boolean;
  message: string;
  reclamoId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {
  private apiUrl = 'https://dulce-lili-media-2.onrender.com/api/reclamos'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  crearReclamo(reclamo: ReclamoData): Observable<ReclamoResponse> {
    // Los reclamos pueden ser creados sin autenticación (cualquiera puede enviar un reclamo)
    return this.http.post<ReclamoResponse>(this.apiUrl, reclamo);
  }

  obtenerReclamos(): Observable<{ success: boolean; reclamos: any[]; total: number }> {
    // Requiere autenticación
    return this.http.get<{ success: boolean; reclamos: any[]; total: number }>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  obtenerReclamoPorId(id: string): Observable<{ success: boolean; reclamo: any }> {
    // Requiere autenticación
    return this.http.get<{ success: boolean; reclamo: any }>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
