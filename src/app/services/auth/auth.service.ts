import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { loginResponse, loginUser, registerUser } from '../../modules/auth/interface/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isSignUpMode = false;

  setMode(isSignUpMode: boolean) {
    this.isSignUpMode = isSignUpMode;
  }

  getMode(): boolean {
    return this.isSignUpMode;
  }

  constructor(private _http: HttpClient) {}
  LoginUser(user: loginUser): Observable<loginResponse> {
    return this._http
      .post<loginResponse>(`${environment.API_URL}/auth/login`, user, {
        withCredentials: true,
      })
      .pipe(tap((res) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
      }));
  }

  registerUser(user: registerUser): Observable<loginResponse> {
    return this._http
      .post<loginResponse>(`${environment.API_URL}/auth/signup`, user, {
        withCredentials: true,
      })
      .pipe(tap((res) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
      }));
  }

  logoutUser(): Observable<void> {
    return this._http
      .post<void>(
        `${environment.API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(tap(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
      }));
  }

  authenticateUser(): Observable<boolean> {
    // Instead of API call, check localStorage
    return new Observable<boolean>((observer) => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      observer.next(isLoggedIn);
      observer.complete();
    });
  }
}
