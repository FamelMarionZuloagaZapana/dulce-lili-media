import { Module } from '@nestjs/common';
import { ReclamosController } from './reclamos.controller';
import { ReclamosService } from './reclamos.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FirebaseModule, EmailModule, AuthModule],
  controllers: [ReclamosController],
  providers: [ReclamosService],
})
export class ReclamosModule {}
