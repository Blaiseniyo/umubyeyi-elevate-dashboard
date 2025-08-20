const ACCESS_TOKEN_KEY = 'access_token';

export class TokenStorage {
  static setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  static clearAll(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}
