import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../components/buttons/buttons.component';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from "primeng/card";
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { cities, SelectedCity } from './reclamo.component.types';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmacionDialogComponent } from './components/confirmaciondialog/confirmaciondialog.component';
import { FinalizarDialogComponent } from './components/finalizardialog/finalizardialog.component';

@Component({
  selector: 'app-reclamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, CalendarModule, CardModule, InputTextModule, DropdownModule, CheckboxModule, ConfirmacionDialogComponent, FinalizarDialogComponent],
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.scss']
})
export class ReclamoComponent {
    value: string = '';
    value1: string = '';
    valuenombrecompleto: string = '';
    valuetelefono: string = '';
    valuecorreo: string = '';
    valuedepartamento: string = '';
    valueprovincia: string = '';
    valuedistrito: string = '';
    valuetiporeclamacion: string = '';
    valuedetalle: string = '';
    valuepedidoconsumidor: string = '';
    cities = cities;
    selectedCity: SelectedCity = { name: '', code: '' };
    checked: boolean = true;

    @ViewChild('confirmacionDialog') confirmacionDialog!: ConfirmacionDialogComponent;
    @ViewChild('finalizarDialog') finalizarDialog!: FinalizarDialogComponent;

    enviarReclamo() {
        this.confirmacionDialog.openDialog({
            tipo: 'default',
            title: '¿Estás seguro de finalizar el registro de reclamo?',
            message: 'Al finalizar no podrá realizar cambios en su reclamo y sera registrado de manera exitosa.',
            textCancelButton: 'Cancelar',
            textAcceptButton: 'Finalizar',
            onAccept: () => {
                this.onConfirmarFinalizar();
            },
            onClose: () => {
                this.onCancelarFinalizar();
            }
        });
    }

    onConfirmarFinalizar() {
        console.log('Reclamo finalizado');
        // Pequeño delay para asegurar que el diálogo de confirmación se cierre primero
        setTimeout(() => {
            this.finalizarDialog.show();
        }, 100);
        // Aquí puedes agregar la lógica para enviar el reclamo
    }

    onCancelarFinalizar() {
        console.log('Cancelado');
    }
}