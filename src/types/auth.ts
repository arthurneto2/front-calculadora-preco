
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface AuthorizationDTO {
  user: UserDTO;
  tokenJwt: string;
  expirationDate: string;
  roles: string[];
}

export interface UserRegisterRequestDto {
  name: string;
  email: string;
  password: string;
}
