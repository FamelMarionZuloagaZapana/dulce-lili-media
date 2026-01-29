import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';            

@Component({
  selector: 'app-finalizar-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ProgressSpinnerModule],
  templateUrl: './finalizardialog.component.html',
  styleUrls: ['./finalizardialog.component.scss']
})
export class FinalizarDialogComponent {
  visible: boolean = false;
  isProcessing: boolean = true;
  private processingTimeout?: any;
  private closingTimeout?: any;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  show() {
    // Limpiar timeouts anteriores si existen
    this.clearTimeouts();
    
    this.visible = true;
    this.isProcessing = true;
    
    // Después de 2 segundos, cambiar a estado completado (mostrar check)
    this.processingTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.isProcessing = false;
        this.cdr.detectChanges();
        
        // Cerrar automáticamente después de mostrar el check por 2 segundos
        this.closingTimeout = setTimeout(() => {
          this.ngZone.run(() => {
            this.visible = false;
            this.cdr.detectChanges();
            // Limpiar solo el processingTimeout ya que closingTimeout ya se ejecutó
            if (this.processingTimeout) {
              clearTimeout(this.processingTimeout);
              this.processingTimeout = undefined;
            }
            this.closingTimeout = undefined;
          });
        }, 2000);
      });
    }, 2000);
  }

  hide() {
    this.clearTimeouts();
    this.visible = false;
  }

  private clearTimeouts() {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
      this.processingTimeout = undefined;
    }
    if (this.closingTimeout) {
      clearTimeout(this.closingTimeout);
      this.closingTimeout = undefined;
    }
  }
}
