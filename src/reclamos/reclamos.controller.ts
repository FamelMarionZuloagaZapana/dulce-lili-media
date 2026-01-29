import { Controller, Post, Get, Body, HttpCode, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { ReclamosService } from './reclamos.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearReclamo(@Body() createReclamoDto: CreateReclamoDto) {
    try {
      return await this.reclamosService.crearReclamo(createReclamoDto);
    } catch (error) {
      console.error('Error en controller:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al procesar el reclamo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async obtenerReclamos() {
    try {
      return await this.reclamosService.obtenerReclamos();
    } catch (error) {
      console.error('Error en controller al obtener reclamos:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al obtener los reclamos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
