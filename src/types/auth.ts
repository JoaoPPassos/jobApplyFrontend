// Espelha src/modules/auth do backend
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type AuthLogin = AuthTokens & { user: AuthUser };

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}
