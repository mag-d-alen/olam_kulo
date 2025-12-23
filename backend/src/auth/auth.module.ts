import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { SetAuthTokenInterceptor } from './interceptors/set-auth-token.interceptor';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard, SetAuthTokenInterceptor],
  exports: [AuthService, SupabaseAuthGuard, SetAuthTokenInterceptor],
})
export class AuthModule {}
