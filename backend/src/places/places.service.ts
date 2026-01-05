import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      .select('city, country')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map((place) => ({
      city: place.city,
      country: place.country,
    }));
  }

  async setDestination({
    destination,
    userId,
  }: {
    destination: { city: string; country: string };
    userId: string;
  }) {
    const supabase = this.authService.getAuthClient();
    const { error: userError } = await supabase
      .from('user_destinations')
      .insert({
        user_id: userId,
        destination_city: destination.city,
        destination_country: destination.country,
      })
      .eq('user_id', userId)
      .single();
    if (userError) throw userError;
    try {
      await this.authService.updateUserDestination(userId, destination.city);
    } catch (error) {
      throw error;
    }
    return { message: 'Destination set successfully' };
  }

  private async getUserDestinations(userId: string) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('user_destinations')
      .select('destination_city, destination_country')
      .eq('user_id', userId);
    if (error) throw error;
    const destinations = data.map((place) => ({
      city: place.destination_city,
      country: place.destination_country,
    }));
    return {
      cities: destinations.map((destination) => destination.city),
      countries: destinations.map((destination) => destination.country),
    };
  }
}
