import { apiClient } from '../../services/api';
import { sessionManager, Session } from '../../services/session';
import { User } from '../../types';

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
  user: {
    id: string;
    email: string;
    homeCity?: string;
    destinationCity?: string;
  };
}

export const authApi = {
  async signUp(data: SignUpData): Promise<SignUpResponse> {
    const response = await apiClient.post('/auth/signUp', data);
    console.log('response', response);
    const responseData = response.data as {
      session: Session;
      user: { id: string; email: string };
    };

    if (responseData.session) {
      sessionManager.setSession(responseData.session);
    }
    sessionManager.setSession(responseData.session);

    return { session: responseData.session, user: responseData.user };
  },

  async getUser(): Promise<User> {
    const response = await apiClient.get('/auth/getUser');
    return response.data as User;
  },

  async signIn(data: SignInData): Promise<SignInResponse> {
    try {
      const response = await apiClient.post<SignInResponse>(
        '/auth/signIn',
        data
      );

      if (!response.data.session || !response.data.user.id) {
        throw new Error('Invalid response data');
      }
      sessionManager.setSession(response.data.session);

      return { user: response.data.user, session: response.data.session };
    } catch (error) {
      throw new Error('Error signing in');
    }
  },
  async signOut(): Promise<void> {
    try {
      await apiClient.post('/auth/signOut');
      sessionManager.clearSession();
    } catch (error) {
      throw new Error('Error signing out: ' + error);
    }
  },
};
