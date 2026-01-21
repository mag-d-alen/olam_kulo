import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class PlacesService {
  constructor(private readonly authService: AuthService) {}

  async getAllPlaces(userId: string) {
    const supabase = this.authService.getAuthClient();
    const userDestination = await this.getUserDestinations(userId);
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .not(
        'city',
        'in',
        userDestination.cities?.length
          ? `(${userDestination.cities.join(',')})`
          : '(null)',
      );
    if (error) throw error;
    return data;
  }

  async getUserVisitedPlacesForUser(userId: string) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('user_destinations')
      .select('city, country, destination_id')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map((place) => ({
      city: place.city,
      country: place.country,
      id: place.destination_id,
    }));
  }

  async setDestination({
    destination,
    userId,
  }: {
    destination: { city: string; country: string; id: string };
    userId: string;
  }) {
    const supabase = this.authService.getAuthClient();
    const { error: userError } = await supabase
      .from('user_destinations')
      .insert({
        user_id: userId,
        destination_city: destination.city,
        destination_country: destination.country,
        destination_id: destination.id,
      })
      .eq('user_id', userId)
      .single();
    if (userError) throw userError;

    return { message: 'Destination set successfully' };
  }

  private async getUserDestinations(userId: string) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('user_destinations')
      .select('*, places(*)')
      .eq('user_id', userId);
    if (error) throw error;
    const destinations = data.map((place) => ({
      ...place.places,
    }));
    return {
      cities: destinations.map((destination) => destination.city),
      countries: destinations.map((destination) => destination.country),
      ids: destinations.map((destination) => destination.id),
    };
  }

  async getHomeCityData(city: string) {
    const data = await this.getPlaceData(city);
    return data;
  }

  async getDestinationCityData(city: string) {
    const data = await this.getPlaceData(city);
    return data;
  }

  private async getPlaceData(cityId: string) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', cityId)
      .single();
    if (error) throw error;
    return data;
  }
}
