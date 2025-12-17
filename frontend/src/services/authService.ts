import axios from 'axios';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface SignUpData {
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  accessToken?: string;
  refreshToken?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  [key: string]: unknown;
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, data);
      return response.data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      try {
        await axios.post(
          `${API_URL}/auth/signout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    }
  },

  async getOAuthUrl(provider: string, redirectTo?: string): Promise<string> {
    const response = await axios.get(`${API_URL}/auth/oauth`, {
      params: { provider, redirectTo },
    });
    return response.data.url;
  },

  async handleOAuthCallback(code: string): Promise<AuthResponse> {
    try {
      const response = await axios.get(`${API_URL}/auth/callback`, {
        params: { code },
      });
      return response.data;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw error;
    }
  },

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },

  async getCurrentUser(accessToken: string): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
};
