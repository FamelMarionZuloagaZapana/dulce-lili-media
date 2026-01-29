import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

// Opcional: Solo si quieres un manejador de errores personalizado
class CustomErrorHandler implements ErrorHandler {
  handleError(error: any) {
    // Tu lógica personalizada aquí
    console.error('Error capturado:', error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()), // Usar fetch en lugar de XMLHttpRequest
    provideAnimations(),
    
    // Solo si realmente necesitas manejo de errores global
    // { provide: ErrorHandler, useClass: CustomErrorHandler }
    
    // Para zoneless (sin Zone.js):
    // provideExperimentalZonelessChangeDetection()
  ]
};