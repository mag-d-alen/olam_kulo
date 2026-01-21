import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { SetAuthTokenInterceptor } from '../auth/interceptors/set-auth-token.interceptor';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
@UseGuards(SupabaseAuthGuard)
@UseInterceptors(SetAuthTokenInterceptor)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('addHomeCity')
  async addHomeCity(
    @Body() body: { city: string; country: string; lat: number; lng: number },
    @CurrentUser('id') userId: string,
  ) {
    try {
      return this.onboardingService.addHomeCity({
        city: body.city,
        country: body.country,
        lat: body.lat,
        lng: body.lng,
        userId: userId,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error adding home city, ${(error as Error).message}`);
    }
  }
}
