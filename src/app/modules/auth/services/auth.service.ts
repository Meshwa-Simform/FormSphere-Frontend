import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { loginUser, registerUser } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isSignUpMode = false;

  setMode(isSignUpMode: boolean) {
    this.isSignUpMode = isSignUpMode;
  }

  getMode(): boolean {
    return this.isSignUpMode;
  }

  constructor(private http:HttpClient) { }
  LoginUser(user: loginUser) : Observable<loginUser>{
    return this.http.post<loginUser>(`${environment.API_URL}/auth/login`,user, {
      withCredentials: true
    })
  }

  registerUser(user:registerUser) : Observable<registerUser>{
    return this.http.post<registerUser>(`${environment.API_URL}/auth/signup`,user, {
      withCredentials: true
    })
  }
}
