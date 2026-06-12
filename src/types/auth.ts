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

export interface ResetPasswordDTO {
  reset_token: string;
  new_password: string;
  confirm_new_password: string;
}

// Espelha a regex de senha forte do backend (create-user / reset-password)
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const STRONG_PASSWORD_MESSAGE =
  'A senha deve ter no mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial.';
