import { Injectable } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';
import { AxiosError } from 'axios';
import { SupabaseService } from 'src/supabase/supabase.service';
@Injectable()
export class PlacesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getCountries() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('countries').select('*');
    if (error) {
      throw new PostgrestError({
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }
    return data;
  }

  async getVisitedPlaces(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_destinations')
      .select('*, places(*)')
      .eq('user_id', userId);
    if (error)
      throw new PostgrestError({
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    if (!data) return [];
    const destinations = data.map((place) => ({
      ...place.places,
    }));
    return destinations.map((destination) => destination.id);
  }

  async getUnvisitedPlaces(userId: string) {
    const supabase = this.supabaseService.getClient();
    const visitedPlaces: string[] = await this.getVisitedPlaces(userId);
    const userHome = await this.getHomeCityData(userId);
    let query = supabase.from('places').select('*');
    if (visitedPlaces.length > 1) {
      query = query.not('id', 'in', `(${visitedPlaces})`);
    }
    if (visitedPlaces.length === 1) {
      query = query.neq('id', visitedPlaces[0]);
    }
    if (userHome?.id) {
      query = query.neq('id', userHome.id);
    }
    const { data } = await query;
    return data;
  }

  // async getVisitedPlaces(userId: string) {
  //   const { data, error } = await this.supabase
  //     .from('user_destinations')
  //     .select('city, country, destination_id')
  //     .eq('user_id', userId);
  //   if (error) throw error;
  //   return data.map((place) => ({
  //     city: place.city,
  //     country: place.country,
  //     id: place.destination_id,
  //   }));
  // }

  async setDestination({
    destination,
    userId,
  }: {
    destination: { city: string; country: string; id: string };
    userId: string;
  }) {
    const supabase = this.supabaseService.getClient();
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
    if (userError)
      throw new PostgrestError({
        message: userError.message,
        details: userError.details,
        hint: userError.hint,
        code: userError.code,
      });
    return { message: 'Destination set successfully' };
  }

  async getCityByLatLng({ lat, lng }: { lat: number; lng: number }) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'User-Agent': 'MyApp/1.0',
          },
        },
      );

      const data = await res.json();
      return {
        city: data.address.city,
        country: data.address.country,
      };
    } catch (error) {
      console.error('Error getting city by lat and lng' + error);
      throw new AxiosError('Error getting city by lat and lng');
    }
  }

  private async getHomeCityData(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_home')
      .select('home_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (error)
      throw new PostgrestError({
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    if (!data) return null;
    const homeCity = await this.getPlaceData(data.home_id);
    return homeCity;
  }

  // async getDestinationCityData(city: string) {
  //   const data = await this.getPlaceData(city);
  //   return data;
  // }

  private async getPlaceData(cityId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', cityId)
      .single();
    if (error) throw error;
    return data;
  }
}
