/**
 * Session manager using sessionStorage
 * Persists session across page refreshes but clears when tab closes
 */

const SESSION_STORAGE_KEY = 'auth_token';
const SESSION_EXPIRY_KEY = 'auth_token_expiry';
const USER_ID_KEY = 'auth_user_id';

export interface Session {
  access_token: string;
  expires_at?: number;
  user?: {
    id: string;
  };
}

export const sessionManager = {
  setSession(session: Session | null): void {
    if (session?.access_token) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, session.access_token);
      if (session.expires_at) {
        sessionStorage.setItem(
          SESSION_EXPIRY_KEY,
          session.expires_at.toString()
        );
      }
      if (session.user?.id) {
        sessionStorage.setItem(USER_ID_KEY, session.user.id);
      }
    } else {
      this.clearSession();
    }
  },

  getAccessToken(): string | null {
    const token = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!token) return null;
    const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);
    if (expiry) {
      const expiryTime = parseInt(expiry, 10);
      if (Date.now() / 1000 >= expiryTime) {
        this.clearSession();
        return null;
      }
    }

    return token;
  },

  getSession(): Session | null {
    const token = this.getAccessToken();
    if (!token) return null;

    const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);
    const userId = sessionStorage.getItem(USER_ID_KEY);
    return {
      access_token: token,
      expires_at: expiry ? parseInt(expiry, 10) : undefined,
      user: userId ? { id: userId } : undefined,
    };
  },

  clearSession(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_EXPIRY_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
  },

  hasSession(): boolean {
    return this.getAccessToken() !== null;
  },
};
