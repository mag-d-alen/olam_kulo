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

    // First, check if place exists in places table, if not create it
    let placeId: string | null = null;

    // Check if place already exists
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
      // Create new place
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

    // Update user with home city information
    const { data, error } = await supabase
      .from('users')
      .update({
        home_city: city,
        home_country: country,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { message: 'Home city added successfully', data };
  }
}
