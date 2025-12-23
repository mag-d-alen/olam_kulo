import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { SetAuthTokenInterceptor } from './interceptors/set-auth-token.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signOut')
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(SetAuthTokenInterceptor)
  async signOut() {
    return this.authService.signOut();
  }

  @Get('getUser')
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(SetAuthTokenInterceptor)
  async getUser(@CurrentUser('id') userId: string) {
    return this.authService.getUser(userId);
  }
}
