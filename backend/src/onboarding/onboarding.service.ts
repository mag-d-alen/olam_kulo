import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PlacesService } from '../places/places.service';
import { PostgrestError } from '@supabase/supabase-js';

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
    let placeId = (await this.findIdOfExistingPlace(city, country))?.id;
    if (!placeId) {
      console.log('Creating new place');
      placeId = (await this.createNewPlace(city, country, lat, lng)).id;
    }
    console.log('User ID', userId);
    console.log('Place ID', placeId);
    const { data, error } = await supabase
      .from('user_home')
      .insert({
        home_id: placeId,
        user_id: userId,
      })
      .select()
      .single();
    if (error) throw new PostgrestError({
      message: 'Error adding home city' + error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return { message: 'Home city added successfully', data };
  }

  private async findIdOfExistingPlace(city: string, country: string) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('places')
      .select('id')
      .eq('city', city)
      .eq('country', country)
      .maybeSingle();
    if (error) throw new BadRequestException('Error finding existing place' + error );
    return data;
  }

  private async createNewPlace(city: string, country: string, lat: number, lng: number) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('places')
      .insert({ city, country, lat, lng })
      .select('id')
      .single();
    if (error) throw new BadRequestException('Error creating new place' + error.message);
    return data;
  }
}
