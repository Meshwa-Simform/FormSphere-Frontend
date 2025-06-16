import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsService implements CanActivate{

  constructor(public _authService: AuthService, private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._authService.authenticateUser().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          console.log('User is not authenticated');
          this._router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url} });
        }
      }),
      map((isAuthenticated) => isAuthenticated) // Return the boolean value
    );
  }
}
