import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HomeCityService } from './home-city.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { SetAuthTokenInterceptor } from '../auth/interceptors/set-auth-token.interceptor';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('home-city')
@UseGuards(SupabaseAuthGuard)
@UseInterceptors(SetAuthTokenInterceptor)
export class HomeCityController {
  constructor(private readonly homeCityService: HomeCityService) {}

  @Post('add')
  async addHomeCity(
    @Body() body: { homeCity: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.homeCityService.addHomeCity(body.homeCity, userId);
  }
}
