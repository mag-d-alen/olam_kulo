import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
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
    @Body() body: { homeCity: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.onboardingService.addHomeCity(body.homeCity, userId);
  }
}
