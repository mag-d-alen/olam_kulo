import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import {
  Session,
  User,
  SupabaseClient,
  PostgrestError,
} from '@supabase/supabase-js';
import { validateEmail, validatePassword } from './utils/validation.util';

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
    validateEmail(signUpDto.email);
    validatePassword(signUpDto.password);
    const supabase = this.supabaseService.getClient();
    const { email, password } = signUpDto;
    const trimmedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    if (error) {
      throw error;
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
    validateEmail(signInDto.email);
    validatePassword(signInDto.password);
    const supabase = this.supabaseService.getClient();
    const { email, password } = signInDto;
    const trimmedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
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
        homeCity: userData?.homeCity ?? null,
        destination: userData?.destination
          ? {
              id: userData.destination.id,
              city: userData.destination.city,
              country: userData?.destination?.country ?? null,
              lat: userData?.destination?.lat ?? 0,
              lng: userData?.destination?.lng ?? 0,
            }
          : null,
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
        .select(
          'home_city, destination_city, destination_country, destination_id',
        )
        .eq('id', userId)
        .single();

      if (userError) {
        throw new PostgrestError({
          message: userError.message,
          details: userError.details,
          hint: userError.hint,
          code: userError.code,
        });
      }
      if (!userData) {
        throw new PostgrestError({
          message: 'User not found',
          details: '',
          hint: 'User not found',
          code: '404',
        });
      }
      let placeData = null;
      if (userData.destination_id) {
        const { data: place, error: placeError } = await supabase
          .from('places')
          .select('lat, lng')
          .eq('id', userData.destination_id)
          .maybeSingle();

        if (placeError) {
          throw new PostgrestError({
            message: placeError.message,
            details: placeError.details,
            hint: placeError.hint,
            code: placeError.code,
          });
        }
        placeData = place;
      }

      const user = {
        id: userId,
        homeCity: userData.home_city ?? null,
        destination:
          userData.destination_id && placeData
            ? {
                id: userData.destination_id,
                city: userData.destination_city ?? null,
                country: userData.destination_country ?? null,
                lat: 0,
                lng: 0,
              }
            : null,
      };
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
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

  async updateUserDestination({
    userId,
    destination,
  }: {
    userId: string;
    destination: { city: string; country: string; id: string };
  }) {
    const supabase = this.getAuthClient();
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({
        destination_id: destination.id,
        destination_city: destination.city,
        destination_country: destination.country,
      })
      .eq('id', userId)
      .single();
    if (userError) {
      throw new UnauthorizedException(
        `Error updating user: ${userError.message}`,
      );
    }
  }
}
