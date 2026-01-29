import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firestore: admin.firestore.Firestore | null = null;
  private isInitialized: boolean = false;

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length) {
      try {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
          ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
          : null;

        if (serviceAccount && serviceAccount.project_id) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
          this.firestore = admin.firestore();
          this.isInitialized = true;
          console.log('Firebase inicializado correctamente');
        } else {
          console.warn('Firebase no configurado. Configura FIREBASE_SERVICE_ACCOUNT en .env');
          this.isInitialized = false;
        }
      } catch (error) {
        console.error('Error al inicializar Firebase:', error);
        this.isInitialized = false;
      }
    } else {
      this.firestore = admin.firestore();
      this.isInitialized = true;
    }
  }

  private ensureInitialized() {
    if (!this.isInitialized || !this.firestore) {
      throw new Error('Firebase no está inicializado. Verifica la configuración de FIREBASE_SERVICE_ACCOUNT en .env');
    }
  }

  /**
   * Permite a otros servicios decidir si deben usar Firebase o un fallback,
   * evitando excepciones y logs repetitivos cuando no está configurado.
   */
  estaInicializado(): boolean {
    return this.isInitialized && !!this.firestore;
  }

  async guardarReclamo(reclamo: any): Promise<string> {
    this.ensureInitialized();
    
    try {
      // Filtrar campos undefined para que Firestore los acepte
      const reclamoLimpio = Object.fromEntries(
        Object.entries(reclamo).filter(([_, value]) => value !== undefined)
      );
      
      const docRef = await this.firestore!.collection('reclamos').add({
        ...reclamoLimpio,
        fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
        estado: 'pendiente',
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
      throw new Error('Error al guardar el reclamo en la base de datos');
    }
  }

  async obtenerReclamos(): Promise<any[]> {
    this.ensureInitialized();
    
    try {
      const snapshot = await this.firestore!.collection('reclamos')
        .orderBy('fechaCreacion', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate?.() || new Date(),
      }));
    } catch (error) {
      console.error('Error al obtener reclamos:', error);
      throw new Error('Error al obtener los reclamos de la base de datos');
    }
  }
}
