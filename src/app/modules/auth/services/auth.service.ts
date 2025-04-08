import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { User } from '../interface/user';
import { Observable } from 'rxjs';

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
  LoginUser(user: User) : Observable<User>{
    return this.http.post<User>(`${environment.API_URL}/auth/login`,user, {
      withCredentials: true
    })
  }

  registerUser(user:User) : Observable<User>{
    return this.http.post<User>(`${environment.API_URL}/auth/signup`,user, {
      withCredentials: true
    })
  }
}
