import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class PlacesService {
  constructor(private readonly authService: AuthService) { }

  async getAllPlaces(userId: string) {
    const supabase = this.authService.getAuthClient();
    const userDestinations: string[] = await this.getUserDestinations(userId);
    const userHome = await this.getHomeCityData(userId);
    let query = supabase.from('places').select('*');
    if (userDestinations.length > 1) {
      query = query.not('id', 'in', `(${userDestinations})`);
    }
    if (userDestinations.length === 1) {
      query = query.neq('id', userDestinations[0]);
    }
    if (userHome?.id) {
      query = query.neq('id', userHome.id);
    }
    const { data
    } = await query;
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

  async getCityByLatLng({ lat, lng }: { lat: number, lng: number }) {
    try {
    } catch (error) {
      console.error('Error getting city by lat and lng:', error);
      throw new BadRequestException('Error getting city by lat and lng');
    }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      , {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
    const data = await res.json();
    return {
      city: data.address.city,
      country: data.address.country,
    };
  }

  private async getUserDestinations(userId: string) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('user_destinations')
      .select('*, places(*)')
      .eq('user_id', userId);
    if (error) throw error;
    if (!data) return [];
    const destinations = data.map((place) => ({
      ...place.places,
    }));
    return destinations.map((destination) => destination.id)
  }

  async getHomeCityData(userId: string) {
    const supabase = this.authService.getAuthClient();
    const { data, error } = await supabase
      .from('user_home')
      .select('home_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const homeCity = await this.getPlaceData(data.home_id);
    return homeCity;
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
