import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Session, User, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;
  private session: Session | null = null;

  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  getAuthClient(): SupabaseClient {
    if (!this.accessToken) {
      throw new UnauthorizedException('No access token provided');
    }
    return this.supabaseService.getClientForUser(this.accessToken);
  }

  async signUp(signUpDto: SignUpDto) {
    const supabase = this.supabaseService.getClient();
    const { email, password } = signUpDto;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log('error', error);

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    this.accessToken = data.session?.access_token ?? null;
    this.refreshToken = data.session?.refresh_token ?? null;
    this.user = data.user;
    this.session = data.session;
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      user: {
        id: this.user?.id,
        email: this.user?.email,
      },
      session: this.session ?? null,
    };
  }

  async signIn(signInDto: SignInDto) {
    const supabase = this.supabaseService.getClient();
    const { email, password } = signInDto;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    this.accessToken = data.session?.access_token;
    this.refreshToken = data.session?.refresh_token;
    this.user = data.user;
    this.session = data.session;

    const userData = await this.getUser(this.user.id);

    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      user: {
        id: this.user.id,
        email: this.user.email,
        homeCity: userData.homeCity,
        destinationCity: userData.destinationCity,
      },
      session: this.session,
    };
  }

  async signOut() {
    const supabase = this.getAuthClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { message: 'Successfully signed out' };
  }
  async getUser(userId: string) {
    try {
      const supabase = this.getAuthClient();
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, home_city, destination_city')
        .eq('id', userId)
        .single();

      if (userError) {
        throw new UnauthorizedException(
          `Error getting user data: ${userError.message}`,
        );
      }
      if (!userData) {
        throw new UnauthorizedException('User not found');
      }
      return {
        id: userData.id,
        email: userData.email,
        homeCity: userData.home_city ?? null,
        destinationCity: userData.destination_city ?? null,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException((error as Error).message);
    }
  }

  async getUserByEmail(email: string) {
    const supabase = this.getAuthClient();
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, home_city, destination_city')
      .eq('email', email)
      .single();
    if (userError) {
      throw new Error(userError.message);
    }
    return userData;
  }

  async updateUserDestination(userId: string, destination_city: string) {
    const supabase = this.getAuthClient();
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({ destination_city: destination_city })
      .eq('id', userId)
      .single();
    if (userError) {
      throw new UnauthorizedException(
        `Error updating user: ${userError.message}`,
      );
    }
  }
}
