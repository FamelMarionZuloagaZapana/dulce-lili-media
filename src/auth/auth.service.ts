import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  // Credenciales de administrador (por ahora hardcodeadas)
  // TODO: Mover a Firebase o variables de entorno
  private readonly ADMIN_CREDENTIALS = {
    correo: process.env.ADMIN_EMAIL || 'admin@dulcelilimedia.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  };

  async login(loginDto: LoginDto): Promise<{ success: boolean; token: string; message: string }> {
    const { correo, password } = loginDto;

    // Validar credenciales
    if (
      correo === this.ADMIN_CREDENTIALS.correo &&
      password === this.ADMIN_CREDENTIALS.password
    ) {
      // Generar token simple (en producción usar JWT)
      const token = this.generateSimpleToken(correo);
      return {
        success: true,
        token,
        message: 'Inicio de sesión exitoso',
      };
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }

  async validateToken(token: string): Promise<boolean> {
    // Validar token simple
    // En producción usar JWT
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [email, timestamp] = decoded.split('|');
      const tokenAge = Date.now() - parseInt(timestamp, 10);
      
      // Token válido por 24 horas
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return false;
      }

      return email === this.ADMIN_CREDENTIALS.correo;
    } catch (error) {
      return false;
    }
  }

  private generateSimpleToken(email: string): string {
    const timestamp = Date.now().toString();
    const tokenData = `${email}|${timestamp}`;
    return Buffer.from(tokenData).toString('base64');
  }
}
