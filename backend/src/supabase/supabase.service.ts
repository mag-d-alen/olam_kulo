import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient!: SupabaseClient;
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabaseAnonKey: string;

  constructor(private configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    this.supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';
    this.supabaseAnonKey =
      this.configService.get<string>('SUPABASE_ANON_KEY') || '';
  }

  onModuleInit() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error(
        'Missing Supabase credentials. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file',
      );
    }

    if (!this.supabaseAnonKey) {
      throw new Error('Missing SUPABASE_ANON_KEY. Please check your .env file');
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

  getClientForUser(accessToken: string): SupabaseClient {
    return createClient(this.supabaseUrl, this.supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
}
