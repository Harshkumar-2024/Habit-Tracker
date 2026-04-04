export interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  picture: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}