export interface LoginResult {
  token: string;
  expiresAt?: string;
}

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}
