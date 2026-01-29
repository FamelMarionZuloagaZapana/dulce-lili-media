import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../../../../components/buttons/buttons.component';

export interface DialogConfig {
  tipo?: 'default' | 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message?: string | null;
  icon?: string | null;
  textCancelButton?: string | null;
  textAcceptButton?: string | null;
  onAccept?: (data?: any) => void;
  onClose?: (data?: any) => void;
}

@Component({
  selector: 'app-confirmacion-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonComponent],
  templateUrl: './confirmaciondialog.component.html'
})
export class ConfirmacionDialogComponent {
  visible: boolean = false;
  
  // Propiedades para personalización
  tipo: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default';
  title: string = '';
  message: string | null = null;
  icon: string | null = null;
  textCancelButton: string | null = 'Cancelar';
  textAcceptButton: string | null = 'Aceptar';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  // Callbacks opcionales
  private onAcceptCallback?: (data?: any) => void;
  private onCloseCallback?: (data?: any) => void;

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  closeDialog() {
    this.visible = false;
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
    this.onCancel.emit();
    this.onCloseCallback = undefined;
  }

  confirmar() {
    this.visible = false;
    if (this.onAcceptCallback) {
      this.onAcceptCallback();
    }
    this.onConfirm.emit();
    this.onAcceptCallback = undefined;
  }

  openDialog(config: DialogConfig) {
    // Actualizar todas las propiedades
    this.tipo = config.tipo || 'default';
    this.title = config.title || '';
    this.message = config.message || null;
    this.icon = config.icon || null;
    this.textCancelButton = config.textCancelButton ?? 'Cancelar';
    this.textAcceptButton = config.textAcceptButton ?? 'Aceptar';
    
    // Asignar las funciones callback si existen
    this.onAcceptCallback = config.onAccept;
    this.onCloseCallback = config.onClose;
    
    // Mostrar el dialog
    this.visible = true;
  }

  getIconClass(): string {
    switch (this.tipo) {
      case 'info':
        return 'bg-blue-100 text-blue-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
