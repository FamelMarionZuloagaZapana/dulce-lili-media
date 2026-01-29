import { Controller, Post, Body, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al iniciar sesión',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() body: { token: string }) {
    try {
      const isValid = await this.authService.validateToken(body.token);
      return { valid: isValid };
    } catch (error) {
      return { valid: false };
    }
  }
}
