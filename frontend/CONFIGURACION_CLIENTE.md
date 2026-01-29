# Configuración para el Cliente - Guía Rápida

## 📧 Correos a Usar

### Para Render y UptimeRobot (Cuentas de Servicio)
**Usa el correo del CLIENTE** para que el cliente pueda:
- Acceder a las cuentas
- Ver el estado del servicio
- Recibir notificaciones
- Gestionar el despliegue

### Para SMTP (Envío de Emails)
**Opciones:**

#### Opción 1: Gmail del Cliente (Recomendado para empezar)
- `SMTP_USER` = Correo Gmail del cliente (ej: `cliente@gmail.com`)
- `SMTP_PASSWORD` = Contraseña de aplicación de Gmail del cliente
- **Ventaja**: Fácil de configurar
- **Desventaja**: El remitente será el correo personal del cliente

#### Opción 2: Correo con Dominio del Cliente (Más profesional)
- `SMTP_USER` = Correo con dominio del cliente (ej: `noreply@dulcelilimedia.com`)
- `SMTP_PASSWORD` = Contraseña del correo del cliente
- **Ventaja**: Más profesional, usa el dominio del cliente
- **Desventaja**: Requiere configurar email en Namecheap

### Para ADMIN_EMAIL (Recepción de Reclamos)
**DEBE ser el correo del CLIENTE** que recibirá los reclamos:
- `ADMIN_EMAIL` = Correo del cliente donde recibirá las notificaciones de reclamos
- Ejemplo: `admin@dulcelilimedia.com` o `cliente@dulcelilimedia.com`

## 📋 Checklist para el Cliente

Antes de desplegar, el cliente debe tener:

- [ ] Correo Gmail del cliente (para SMTP si usa Gmail)
- [ ] Contraseña de aplicación de Gmail generada (si usa Gmail)
- [ ] Correo del cliente para recibir reclamos (ADMIN_EMAIL)
- [ ] Acceso a Firebase (o tú lo configuras)
- [ ] Correo del cliente para crear cuentas en Render/UptimeRobot

## 🔐 Configuración de Gmail del Cliente (Si usa Gmail para SMTP)

El cliente debe:
1. Ir a su cuenta de Google
2. Activar verificación en 2 pasos
3. Generar "Contraseña de aplicación"
4. Darte esa contraseña para configurar en Render

## 📝 Variables de Entorno en Render

Cuando configures en Render, usa:

```
SMTP_USER = correo-del-cliente@gmail.com
SMTP_PASSWORD = app-password-del-cliente
ADMIN_EMAIL = correo-del-cliente@dulcelilimedia.com
```

## ⚠️ Importante

- **NO uses tu correo personal** para cuentas del cliente
- **NO uses tu correo personal** para ADMIN_EMAIL
- El cliente debe tener acceso a todas las cuentas
- Si usas tu correo, el cliente no podrá gestionar nada
