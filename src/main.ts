import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para que el frontend pueda hacer peticiones
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:4200').replace(/\/$/, '');
  const allowedOrigins = new Set<string>([
    frontendUrl,
    'https://musical-starlight-984413.netlify.app',
    'https://dulcelilimedia.com',
    'https://www.dulcelilimedia.com',
  ]);

  app.enableCors({
    origin: (origin, callback) => {
      // Requests sin Origin (curl, health checks) deben pasar.
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/$/, '');
      const isNetlifyApp = normalized.endsWith('.netlify.app');
      const allowed = allowedOrigins.has(normalized) || isNetlifyApp;

      // Importante: si es allowed, devolvemos el origin para que se setee Access-Control-Allow-Origin.
      return allowed ? callback(null, normalized) : callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend corriendo en http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
