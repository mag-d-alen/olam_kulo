import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignInDto, SignUpDto, UserDto } from './dto/auth.dto';
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
    let emptyPlace = {
      id: '',
      city: '',
      country: '',
      lat: 0,
      lng: 0,
    };
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      user: {
        id: this.user.id,
        email: this.user.email,
        homeCity: {
          id: userData?.homeCity.id ?? emptyPlace.id,
          city: userData?.homeCity?.city ?? emptyPlace.city,
          country: userData?.homeCity?.country ?? emptyPlace.country,
          lat: userData?.homeCity?.lat ?? emptyPlace.lat,
          lng: userData?.homeCity?.lng ?? emptyPlace.lng,
        },
        destination: {
          id: userData?.destination.id ?? emptyPlace.id,
          city: userData?.destination?.city ?? emptyPlace.city,
          country: userData?.destination?.country ?? emptyPlace.country,
          lat: userData?.destination?.lat ?? emptyPlace.lat,
          lng: userData?.destination?.lng ?? emptyPlace.lng,
        },
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
    const emptyPlace = {
      id: '',
      city: '',
      country: '',
      lat: 0,
      lng: 0,
    };
    try {
      const supabase = this.getAuthClient();

      const { data: homeCityData, error: homeCityError } = await supabase
        .from('user_home')
        .select('places(*)')
        .eq('user_id', userId);

      let homeCity = emptyPlace;
      if (homeCityData && homeCityData.length > 0) {
        const firstRow = homeCityData[0];
        if (firstRow.places) {
          homeCity = Array.isArray(firstRow.places)
            ? firstRow.places[0] || emptyPlace
            : firstRow.places;
        }
      }

      if (homeCityError) {
        throw new PostgrestError({
          message: homeCityError.message,
          details: homeCityError.details,
          hint: homeCityError.hint,
          code: homeCityError.code,
        });
      }

      const { data: lastDestination, error: destinationError } = await supabase
        .from('user_destinations')
        .select('destination_id, places(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      let destination = emptyPlace;
      if (lastDestination && lastDestination.length > 0) {
        const firstRow = lastDestination[0];
        if (firstRow.places) {
          destination = Array.isArray(firstRow.places)
            ? firstRow.places[0] || emptyPlace
            : firstRow.places;
        }
      }
      if (destinationError) {
        throw new PostgrestError({
          message: destinationError.message,
          details: destinationError.details,
          hint: destinationError.hint,
          code: destinationError.code,
        });
      }

      const user: UserDto = {
        id: userId,
        homeCity: homeCity,
        destination: destination,
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
    destination: {
      city: string;
      country: string;
      id: string;
    };
  }) {
    const supabase = this.getAuthClient();
    const { error: userError } = await supabase
      .from('user_destinations')
      .update({
        destination_id: destination.id,
        destination_city: destination.city,
        destination_country: destination.country,
      })
      .eq('id', userId);
    if (userError) {
      throw new UnauthorizedException(
        `Error updating user: ${userError.message}`,
      );
    }
    return { message: 'Destination updated successfully' };
  }
}
