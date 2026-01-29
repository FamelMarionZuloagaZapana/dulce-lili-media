# Guía de Despliegue en Render + UptimeRobot

## Paso 1: Preparar el Repositorio

1. Asegúrate de que tu código esté en GitHub
2. Verifica que el archivo `render.yaml` esté en la carpeta `backend/`

## Paso 2: Crear Cuenta en Render

**IMPORTANTE**: Si la app es para un cliente, usa el correo del CLIENTE, no el tuyo.

1. Ve a https://render.com
2. Clic en "Get Started for Free"
3. Regístrate con GitHub (recomendado) o email del CLIENTE
4. Confirma el email del CLIENTE

## Paso 3: Desplegar el Backend en Render

1. En el dashboard de Render, clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub:
   - Selecciona tu repositorio
   - Autoriza a Render a acceder
3. Configura el servicio:
   - **Name**: `dulcelili-backend` (o el nombre que prefieras)
   - **Region**: Elige la más cercana (ej: Oregon para Perú)
   - **Branch**: `main` (o la rama que uses)
   - **Root Directory**: `backend` (importante: apunta a la carpeta backend)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: `Free`

4. Clic en **"Advanced"** y configura las variables de entorno:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render usa este puerto automáticamente)
   - `FRONTEND_URL` = `https://tu-frontend.netlify.app` (actualiza con tu URL real)
   - `FIREBASE_SERVICE_ACCOUNT` = `{"type":"service_account",...}` (tu JSON completo como string)
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `correo-del-cliente@gmail.com` (correo del CLIENTE que enviará los emails)
   - `SMTP_PASSWORD` = `app-password-del-cliente` (contraseña de aplicación del correo del cliente)
   - `ADMIN_EMAIL` = `correo-del-cliente@dulcelilimedia.com` (correo del CLIENTE que recibirá los reclamos)

5. Clic en **"Create Web Service"**

6. Render comenzará a desplegar tu aplicación (tarda 5-10 minutos)

7. Una vez desplegado, obtendrás una URL como: `https://dulcelili-backend.onrender.com`

## Paso 4: Configurar UptimeRobot (Ping cada 12 minutos)

**IMPORTANTE**: Usa el correo del CLIENTE para que el cliente pueda gestionar el monitor.

1. Ve a https://uptimerobot.com
2. Clic en **"Sign Up"** (gratis)
3. Crea una cuenta con el correo del CLIENTE (puedes usar email o Google)

4. Una vez dentro del dashboard:
   - Clic en **"+ Add New Monitor"**
   - **Monitor Type**: Selecciona **"HTTP(s)"**
   - **Friendly Name**: `DulceLili Backend` (o el nombre que prefieras)
   - **URL (or IP)**: Pega la URL de Render (ej: `https://dulcelili-backend.onrender.com`)
   - **Monitoring Interval**: Selecciona **"Custom"** y configura:
     - **Minutes**: `12`
     - Esto hará ping cada 12 minutos
   - **Alert Contacts**: Agrega tu email (opcional, para recibir alertas si falla)
   - Clic en **"Create Monitor"**

5. ¡Listo! UptimeRobot hará ping cada 12 minutos a tu backend, manteniéndolo despierto

## Paso 5: Verificar que Funciona

1. Espera 2-3 minutos después de crear el monitor en UptimeRobot
2. Visita la URL de tu backend: `https://dulcelili-backend.onrender.com`
3. Deberías ver: `Hello World!` (o la respuesta de tu endpoint raíz)
4. Prueba crear un reclamo desde el frontend

## Paso 6: Actualizar Frontend

1. Actualiza la URL del backend en `frontend/src/app/reclamo/services/reclamo.service.ts`:
   ```typescript
   private apiUrl = 'https://dulcelili-backend.onrender.com/api/reclamos';
   ```

2. También actualiza en `frontend/src/app/auth/services/auth.service.ts`:
   ```typescript
   private apiUrl = 'https://dulcelili-backend.onrender.com/api/auth';
   ```

3. Despliega el frontend en Netlify/Vercel con la nueva URL

## Notas Importantes

- **Render se duerme después de 15 min sin tráfico**, pero con UptimeRobot haciendo ping cada 12 minutos, nunca se duerme
- El plan gratuito de Render tiene límites, pero son suficientes para tu caso
- UptimeRobot gratuito permite hasta 50 monitores, más que suficiente
- Si cambias algo en el código, Render se redesplegará automáticamente

## Troubleshooting

**Problema**: El backend no responde
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs en Render (pestaña "Logs")

**Problema**: CORS errors
- Verifica que `FRONTEND_URL` esté configurado correctamente en Render
- Asegúrate de que la URL del frontend coincida exactamente

**Problema**: El backend se duerme
- Verifica que UptimeRobot esté activo y haciendo ping
- Revisa el intervalo (debe ser 12 minutos o menos)
