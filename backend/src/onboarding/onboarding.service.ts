import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PlacesService } from '../places/places.service';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async addHomeCity({
    city,
    country,
    lat,
    lng,
    userId,
  }: {
    city: string;
    country: string;
    lat: number;
    lng: number;
    userId: string;
  }) {
    const supabase = this.authService.getAuthClient();

    let placeId: string | null = null;

    const { data: existingPlace, error: checkError } = await supabase
      .from('places')
      .select('id')
      .eq('city', city)
      .eq('country', country)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingPlace) {
      placeId = existingPlace.id;
    } else {
      const { data: newPlace, error: createError } = await supabase
        .from('places')
        .insert({
          city,
          country,
          lat,
          lng,
        })
        .select('id')
        .single();

      if (createError) {
        throw createError;
      }
      placeId = newPlace.id;
    }

    const { data, error } = await supabase
      .from('user_home')
      .insert({
        user_id: userId,
        home_id: placeId,
      })
      .select()
      .single();

    if (error) throw error;
    return { message: 'Home city added successfully', data };
  }
}
