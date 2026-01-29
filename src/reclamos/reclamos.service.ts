import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { EmailService } from '../email/email.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';

@Injectable()
export class ReclamosService {
  // Almacenamiento temporal en memoria (solo si Firebase no está disponible)
  private reclamosTemporales: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private emailService: EmailService,
  ) {}

  async crearReclamo(createReclamoDto: CreateReclamoDto) {
    try {
      let reclamoId: string | null = null;
      
      // 1. Intentar guardar en Firebase (no crítico si falla)
      if (this.firebaseService.estaInicializado()) {
        try {
          reclamoId = await this.firebaseService.guardarReclamo(createReclamoDto);
          console.log('Reclamo guardado en Firebase con ID:', reclamoId);
        } catch (firebaseError) {
          console.warn('No se pudo guardar en Firebase (guardando en memoria temporal):', firebaseError);
        }
      }

      // Fallback a memoria temporal si Firebase no está disponible o falló
      if (!reclamoId) {
        reclamoId = `temp-${Date.now()}`;
        this.reclamosTemporales.push({
          id: reclamoId,
          ...createReclamoDto,
          fechaCreacion: new Date(),
          estado: 'pendiente',
        });
      }
      
      // 2. Enviar correo al admin (en paralelo, no bloquea)
      this.emailService.enviarCorreoAdmin(createReclamoDto).catch((error) => {
        console.error('Error al enviar correo (no crítico):', error);
        // No lanzamos el error para que el reclamo se guarde aunque falle el correo
      });

      return {
        success: true,
        message: 'Reclamo registrado exitosamente',
        reclamoId: reclamoId || 'pending',
      };
    } catch (error) {
      console.error('Error al crear reclamo:', error);
      throw new Error(`Error al procesar el reclamo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async obtenerReclamos() {
    // Si Firebase no está configurado, evitamos excepciones/logs y devolvemos temporales.
    if (!this.firebaseService.estaInicializado()) {
      const reclamosOrdenados = [...this.reclamosTemporales].sort((a, b) => {
        const fechaA = a.fechaCreacion || new Date(0);
        const fechaB = b.fechaCreacion || new Date(0);
        return fechaB.getTime() - fechaA.getTime();
      });

      return {
        success: true,
        reclamos: reclamosOrdenados,
        total: reclamosOrdenados.length,
      };
    }

    // Intentar obtener de Firebase
    const reclamosFirebase = await this.firebaseService.obtenerReclamos();

    // Combinar con reclamos temporales (si existen)
    const todosLosReclamos = [...reclamosFirebase, ...this.reclamosTemporales];

    // Ordenar por fecha de creación (más recientes primero)
    todosLosReclamos.sort((a, b) => {
      const fechaA = a.fechaCreacion?.toDate?.() || a.fechaCreacion || new Date(0);
      const fechaB = b.fechaCreacion?.toDate?.() || b.fechaCreacion || new Date(0);
      return fechaB.getTime() - fechaA.getTime();
    });

    return {
      success: true,
      reclamos: todosLosReclamos,
      total: todosLosReclamos.length,
    };
  }
}
