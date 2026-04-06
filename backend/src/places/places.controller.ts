import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('unvisited')
  @UseGuards(SupabaseAuthGuard)
  async getUnvisitedDestinations(@CurrentUser('id') userId: string) {
    return await this.placesService.getUnvisitedPlaces(userId);
  }

  @Get('countries')
  @UseGuards(SupabaseAuthGuard)
  async getCountries() {
    try {
      return await this.placesService.getCountries();
    } catch (error) {
      throw new Error('Error getting all countries data' + error);
    }
  }

  @Get('visited')
  async getVisitedPlaces(@Param('userId') userId: string) {
    return this.placesService.getVisitedPlaces(userId);
  }

  @Post('setDestination')
  @UseGuards(SupabaseAuthGuard)
  async setDestination(
    @Body()
    body: { city: string; country: string; id: string },
    @CurrentUser('id') userId: string,
  ) {
    try {
      return this.placesService.setDestination({
        destination: body,
        userId: userId,
      });
    } catch (error) {
      console.error('Error setting destination:', error);
      throw new Error('Error setting destination');
    }
  }

  @Post('getCityByLatLng')
  @UseGuards(SupabaseAuthGuard)
  async getCityByLatLng(@Body() body: { lat: number; lng: number }) {
    try {
      return await this.placesService.getCityByLatLng({
        lat: body.lat,
        lng: body.lng,
      });
    } catch (error) {
      console.error('Error getting city by lat and lng:', error);
      throw new Error('Error getting city by lat and lng');
    }
  }
}
