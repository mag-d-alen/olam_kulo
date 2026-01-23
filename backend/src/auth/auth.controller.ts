import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { SetAuthTokenInterceptor } from './interceptors/set-auth-token.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      return await this.authService.signUp(signUpDto);
    } catch (error) {
      console.error('Error signing up:', error);
      throw new BadRequestException('Error signing up');
    }
  }

  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      return await this.authService.signIn(signInDto);
    } catch (error) {
      console.error('Error signing in:', error);
      throw new BadRequestException('Error signing in');
    }
  }

  @Post('signOut')
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(SetAuthTokenInterceptor)
  async signOut() {
    try {
      return await this.authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw new BadRequestException('Error signing out');
    }
  }

  @Get('getUser')
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(SetAuthTokenInterceptor)
  async getUser(@CurrentUser('id') userId: string) {
    try {
      return await this.authService.getUser(userId);
    } catch (error) {
      console.error('Error getting user:', error);
      throw new BadRequestException('Error getting user');
    }
  }
}
