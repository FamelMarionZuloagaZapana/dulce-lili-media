import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar el transporter de nodemailer
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async enviarCorreoAdmin(reclamo: any): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dulcelilimedia.com';

    const htmlContent = `
      <h2>Nuevo Reclamo Registrado</h2>
      <p>Se ha registrado un nuevo reclamo en el sistema:</p>
      <hr>
      <p><strong>Datos del Consumidor:</strong></p>
      <ul>
        <li><strong>Tipo de Documento:</strong> ${reclamo.tipoDocumento}</li>
        <li><strong>Número de Documento:</strong> ${reclamo.numeroDocumento}</li>
        <li><strong>Nombre Completo:</strong> ${reclamo.nombreCompleto}</li>
        <li><strong>Teléfono:</strong> ${reclamo.telefono}</li>
        <li><strong>Correo:</strong> ${reclamo.correo}</li>
        <li><strong>Departamento:</strong> ${reclamo.departamento}</li>
        ${reclamo.provincia ? `<li><strong>Provincia:</strong> ${reclamo.provincia}</li>` : ''}
        ${reclamo.distrito ? `<li><strong>Distrito:</strong> ${reclamo.distrito}</li>` : ''}
      </ul>
      <hr>
      <p><strong>Detalle del Reclamo:</strong></p>
      <ul>
        <li><strong>Tipo:</strong> ${reclamo.tipoReclamacion}</li>
        <li><strong>Detalle:</strong> ${reclamo.detalle}</li>
        ${reclamo.pedidoConsumidor ? `<li><strong>Pedido del Consumidor:</strong> ${reclamo.pedidoConsumidor}</li>` : ''}
      </ul>
      <hr>
      <p><em>Fecha de registro: ${new Date().toLocaleString('es-PE')}</em></p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: adminEmail,
        subject: `Nuevo Reclamo - ${reclamo.nombreCompleto}`,
        html: htmlContent,
      });
      console.log('Correo enviado exitosamente al admin');
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw new Error('Error al enviar el correo al administrador');
    }
  }
}
