import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signout')
  @UseGuards(SupabaseAuthGuard)
  async signOut(@Request() req) {
    return this.authService.signOut(req.accessToken);
  }

  @Get('oauth')
  async getOAuthUrl(
    @Query('provider') provider: string,
    @Query('redirectTo') redirectTo?: string,
  ) {
    return this.authService.getOAuthUrl(provider, redirectTo);
  }

  @Get('callback')
  async handleOAuthCallback(@Query('code') code: string) {
    return this.authService.handleOAuthCallback(code);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async getCurrentUser(@Request() req) {
    return this.authService.getUser(req.accessToken);
  }
}
