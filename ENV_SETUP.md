# Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del backend con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:4200

# Firebase Configuration
# Opción 1: JSON completo como string (recomendado para producción)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"tu-proyecto",...}

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password

# Email del administrador que recibirá los reclamos
ADMIN_EMAIL=admin@dulcelilimedia.com
```

## Pasos para configurar:

### 1. Firebase:
- Ve a Firebase Console: https://console.firebase.google.com
- Selecciona tu proyecto
- Ve a "Configuración del proyecto" → "Cuentas de servicio"
- Genera una nueva clave privada
- Copia el JSON completo y pégalo en `FIREBASE_SERVICE_ACCOUNT` (como string)

### 2. Email (Gmail):
- Ve a tu cuenta de Google
- Activa la verificación en 2 pasos
- Genera una "Contraseña de aplicación"
- Usa esa contraseña en `SMTP_PASSWORD`
