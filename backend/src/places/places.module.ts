import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  imports: [AuthModule],
})
export class PlacesModule {}
