import { apiClient } from '../../services/api';
import { sessionManager, Session } from '../../services/session';
import { User } from '../types';

export interface SignUpData {
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpResponse {
  session: Session | null;
  user: { id: string; email: string };
}

export interface SignInResponse {
  session: Session | null;
  user: { id: string; email: string; homeCity: string; homeCountry: string };
}

export const authApi = {
  async signUp(data: SignUpData): Promise<SignUpResponse> {
    try {
      const response = await apiClient.post('/auth/signUp', data);
      const responseData = response.data as {
        session: Session;
        user: { id: string; email: string };
      };

      if (responseData.session) {
        sessionManager.setSession(responseData.session);
      }

      return { session: responseData.session, user: responseData.user };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  async getUser(): Promise<User> {
    const response = await apiClient.get('/auth/getUser');
    return response.data as User;
  },

  async signIn(data: SignInData): Promise<SignInResponse> {
    try {
      const response = await apiClient.post('/auth/signIn', data);
      const responseData = response.data as {
        user: {
          id: string;
          email: string;
          homeCity: string;
          homeCountry: string;
        };
        session: Session;
      };
      if (!responseData.session || !responseData.user.id) {
        throw new Error('Invalid response data');
      }
      sessionManager.setSession(responseData.session);
      return { user: responseData.user, session: responseData.session };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },
  async signOut(): Promise<void> {
    try {
      await apiClient.post('/auth/signOut');
      sessionManager.clearSession();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
};
