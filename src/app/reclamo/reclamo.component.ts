import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from '../../components/buttons/buttons.component';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from "primeng/card";
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmacionDialogComponent } from './components/confirmaciondialog/confirmaciondialog.component';
import { FinalizarDialogComponent } from './components/finalizardialog/finalizardialog.component';
import { ReclamoService } from './services/reclamo.service';
import { ubigeoData, Departamento, Provincia, Distrito } from './ubigeo.types';


@Component({
    selector: 'app-reclamo',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, ButtonComponent, CalendarModule, CardModule, InputTextModule, InputTextareaModule, DropdownModule, CheckboxModule, ConfirmacionDialogComponent, FinalizarDialogComponent],
    templateUrl: './reclamo.component.html'
})

export class ReclamoComponent implements OnInit {
    // Opciones para tipo de documento
    tiposDocumento = [
        { label: 'DNI', value: 'DNI' },
        { label: 'Carné de Extranjería', value: 'CE' },
        { label: 'Pasaporte', value: 'Pasaporte' },
        { label: 'Otro', value: 'Otro' }
    ];
    tipoDocumentoSeleccionado: { label: string; value: string } | null = null;

    // Opciones para tipo de reclamación
    tiposReclamacion = [
        { label: 'Queja', value: 'Queja' },
        { label: 'Reclamo', value: 'Reclamo' },
        { label: 'Consulta', value: 'Consulta' },
        { label: 'Sugerencia', value: 'Sugerencia' }
    ];
    tipoReclamacionSeleccionado: { label: string; value: string } | null = null;

    // Campos del formulario
    numeroDocumento: string = '';
    nombreCompleto: string = '';
    telefono: string = '';
    correo: string = '';
    direccion: string = '';
    detalle: string = '';
    pedidoConsumidor: string = '';

    // Datos de Ubigeo (estructura jerárquica completa)
    departamentosCompletos: Departamento[] = ubigeoData;

    // Opciones disponibles para cada dropdown (se actualizan dinámicamente)
    departamentosDisponibles: Departamento[] = [];
    provinciasDisponibles: Provincia[] = [];
    distritosDisponibles: Distrito[] = [];

    // Valores seleccionados
    departamentoSeleccionado: Departamento | null = null;
    provinciaSeleccionada: Provincia | null = null;
    distritoSeleccionado: Distrito | null = null;

    // Checkboxes separados
    aceptaTerminos: boolean = false;
    aceptaPrivacidad: boolean = false;

    @ViewChild('confirmacionDialog') confirmacionDialog!: ConfirmacionDialogComponent;
    @ViewChild('finalizarDialog') finalizarDialog!: FinalizarDialogComponent;

    isLoading: boolean = false;

    constructor(private reclamoService: ReclamoService) { }

    ngOnInit() {
        this.departamentosDisponibles = this.departamentosCompletos;
        this.provinciasDisponibles = [];
        this.distritosDisponibles = [];
    }

    onDepartamentoChange(departamento: Departamento | null) {
        if (!departamento) {
            this.departamentoSeleccionado = null;
            this.provinciasDisponibles = [];
            this.provinciaSeleccionada = null;
            this.distritosDisponibles = [];
            this.distritoSeleccionado = null;
            return;
        }

        this.departamentoSeleccionado = departamento;
        this.provinciasDisponibles = this.departamentoSeleccionado.provincias || [];
        this.provinciaSeleccionada = null;
        this.distritosDisponibles = [];
        this.distritoSeleccionado = null;
    }

    onProvinciaChange(provincia: Provincia | null) {
        if (!provincia) {
            this.provinciaSeleccionada = null;
            this.distritosDisponibles = [];
            this.distritoSeleccionado = null;
            return;
        }

        this.provinciaSeleccionada = provincia;
        this.distritosDisponibles = provincia.distritos || [];
        this.distritoSeleccionado = null;

    }


   // Método que se ejecuta cuando cambia el DISTRITO
   onDistritoChange(distrito: Distrito | null) {
    // Solo guardar la selección
    this.distritoSeleccionado = distrito;
}

    validarFormulario(): { valido: boolean; mensaje?: string } {
        // Validar campos requeridos
        if (!this.tipoDocumentoSeleccionado) {
            return { valido: false, mensaje: 'Por favor, seleccione el tipo de documento' };
        }
        if (!this.numeroDocumento || this.numeroDocumento.trim() === '') {
            return { valido: false, mensaje: 'Por favor, ingrese el número de documento' };
        }
        if (!this.nombreCompleto || this.nombreCompleto.trim() === '') {
            return { valido: false, mensaje: 'Por favor, ingrese su nombre completo' };
        }
        if (!this.telefono || this.telefono.trim() === '') {
            return { valido: false, mensaje: 'Por favor, ingrese su teléfono' };
        }
        if (!this.correo || this.correo.trim() === '') {
            return { valido: false, mensaje: 'Por favor, ingrese su correo electrónico' };
        }
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.correo)) {
            return { valido: false, mensaje: 'Por favor, ingrese un correo electrónico válido' };
        }
        if (!this.departamentoSeleccionado) {
            return { valido: false, mensaje: 'Por favor, seleccione un departamento' };
        }
        if (!this.tipoReclamacionSeleccionado) {
            return { valido: false, mensaje: 'Por favor, seleccione el tipo de reclamación' };
        }
        if (!this.detalle || this.detalle.trim() === '') {
            return { valido: false, mensaje: 'Por favor, ingrese el detalle de la reclamación' };
        }
        if (!this.aceptaTerminos) {
            return { valido: false, mensaje: 'Debe aceptar los términos y condiciones para continuar' };
        }
        if (!this.aceptaPrivacidad) {
            return { valido: false, mensaje: 'Debe aceptar la política de privacidad para continuar' };
        }
        return { valido: true };
    }

    enviarReclamo() {
        // Validar formulario antes de mostrar el diálogo de confirmación
        const validacion = this.validarFormulario();
        if (!validacion.valido) {
            alert(validacion.mensaje);
            return;
        }

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
            this.isLoading = true;

            // Preparar los datos del formulario
            const reclamoData = {
                tipoDocumento: this.tipoDocumentoSeleccionado?.value || '',
                numeroDocumento: this.numeroDocumento,
                nombreCompleto: this.nombreCompleto,
                telefono: this.telefono,
                correo: this.correo,
                departamento: this.departamentoSeleccionado?.nombre || '',
                provincia: this.provinciaSeleccionada?.nombre || undefined,
                distrito: this.distritoSeleccionado?.nombre || undefined,
                tipoReclamacion: this.tipoReclamacionSeleccionado?.value || '',
                detalle: this.detalle,
                pedidoConsumidor: this.pedidoConsumidor || undefined
            };

            // Enviar al backend
            this.reclamoService.crearReclamo(reclamoData).subscribe({
                next: (response) => {
                    console.log('Reclamo enviado exitosamente:', response);
                    this.isLoading = false;
                    // Mostrar diálogo de éxito
                    setTimeout(() => {
                        this.finalizarDialog.show();
                    }, 100);
                },
                error: (error) => {
                    console.error('Error al enviar reclamo:', error);
                    this.isLoading = false;

                    // Mostrar mensaje de error más detallado
                    let mensajeError = 'Error al enviar el reclamo. ';

                    if (error.status === 0) {
                        mensajeError += 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
                    } else if (error.status === 400) {
                        mensajeError += 'Datos inválidos. Por favor, verifica que todos los campos estén completos.';
                    } else if (error.status === 500) {
                        mensajeError += 'Error en el servidor. Por favor, intenta nuevamente más tarde.';
                    } else {
                        mensajeError += `Error ${error.status}: ${error.message || 'Error desconocido'}`;
                    }

                    alert(mensajeError);
                }
            });
        }

        onCancelarFinalizar() {
            console.log('Cancelado');
        }
    }