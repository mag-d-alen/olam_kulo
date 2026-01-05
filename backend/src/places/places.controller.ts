import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

    @Get('all')
    @UseGuards(SupabaseAuthGuard)
  async getAllPlaces(@CurrentUser('id') userId: string) {
    return this.placesService.getAllPlaces(userId);
  }

  @Get('visited')
  async getUserVisitedPlacesForUser(@Param('userId') userId: string) {
    return this.placesService.getUserVisitedPlacesForUser(userId);
  }

  @Post('setDestination')
  @UseGuards(SupabaseAuthGuard)
  async setDestination(
    @Body() body: { destination: { city: string; country: string } },
    @CurrentUser('id') userId: string,
  ) {
    try {
      return this.placesService.setDestination({
        destination: body.destination,
        userId: userId,
      });
    } catch (error) {
      console.error('Error setting destination:', error);
      throw new BadRequestException('Error setting destination');
    }
  }
}
