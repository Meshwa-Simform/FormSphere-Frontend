export interface loginUser {
  email: string;
  password: string;
}
export interface registerUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface loginResponse{
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  }
}