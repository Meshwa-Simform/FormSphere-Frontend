import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { loginUser, registerUser } from '../../modules/auth/interface/user';

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
  LoginUser(user: loginUser): Observable<loginUser> {
    return this._http
      .post<loginUser>(`${environment.API_URL}/auth/login`, user, {
        withCredentials: true,
      })
      .pipe(tap(() => localStorage.setItem('isLoggedIn', 'true')));
  }

  registerUser(user: registerUser): Observable<registerUser> {
    return this._http
      .post<registerUser>(`${environment.API_URL}/auth/signup`, user, {
        withCredentials: true,
      })
      .pipe(tap(() => localStorage.setItem('isLoggedIn', 'true')));
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
      .pipe(tap(() => localStorage.removeItem('isLoggedIn')));
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
