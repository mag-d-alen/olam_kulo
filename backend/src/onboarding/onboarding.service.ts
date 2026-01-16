import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PlacesService } from '../places/places.service';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async addHomeCity({
    homeCity,
    userId,
  }: {
    homeCity: string;
    userId: string;
  }) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('users')
      .update({ home_city: homeCity })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return { message: 'Home city added successfully', data };
  }
}
