import { Module } from '@nestjs/common';
import { HomeCityController } from './home-city.controller';
import { HomeCityService } from './home-city.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HomeCityController],
  providers: [HomeCityService],
})
export class HomeCityModule {}
