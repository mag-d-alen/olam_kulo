import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(private configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    this.supabaseKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  onModuleInit() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error(
        'Missing Supabase credentials. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file',
      );
    }

    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
