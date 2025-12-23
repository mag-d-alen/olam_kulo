import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class HomeCityService {
  constructor(private readonly authService: AuthService) {}

  async addHomeCity(homeCity: string, userId: string) {
    try {
      const supabase = this.authService.getAuthClient();

      const { data, error } = await supabase
        .from('users')
        .update({ home_city: homeCity })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { message: 'Home city added successfully', data };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
