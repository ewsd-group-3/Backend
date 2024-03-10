export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

export interface AuthStaff {
  id: number;
  name: string;
  email: string;
  role: string;
}

// export interface
