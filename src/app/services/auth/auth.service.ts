import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, map, Observable, tap } from 'rxjs';
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
    return this._http.post<loginUser>(
      `${environment.API_URL}/auth/login`,
      user,
      {
        withCredentials: true,
      }
    );
  }

  registerUser(user: registerUser): Observable<registerUser> {
    return this._http.post<registerUser>(
      `${environment.API_URL}/auth/signup`,
      user,
      {
        withCredentials: true,
      }
    );
  }

  logoutUser(): Observable<void> {
    return this._http.post<void>(
      `${environment.API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  authenticateUser(): Observable<boolean> {
    return this._http
      .get(`${environment.API_URL}/auth/authenticate`, {
        withCredentials: true,
      })
      .pipe(
        tap((d) => console.log('User authenticated', d)),
        map(() => true), // If the request succeeds, return true
        catchError(() => [false]) // If the request fails, return false
      );
  }
}
