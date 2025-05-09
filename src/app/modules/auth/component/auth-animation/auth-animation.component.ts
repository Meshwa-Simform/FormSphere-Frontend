import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-auth-animation',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './auth-animation.component.html',
  styleUrl: './auth-animation.component.css'
})
export class AuthAnimationComponent implements OnInit {
  isSignUpMode = false;
  isMobile = false;


  constructor(private _route: ActivatedRoute,private _router : Router , private _authService:AuthService) {}
  ngOnInit() {
    // Listen for route changes dynamically
    this._route.children.forEach((childRoute) => {
      childRoute.url.subscribe((urlSegments) => {
        const path = urlSegments[0]?.path; // Get the route (e.g., 'login' or 'signup')
        this.isSignUpMode = path === 'signup';
        this._authService.setMode(this.isSignUpMode);
      });
    });
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleMode(signUp: boolean) {
    this.isSignUpMode = signUp;
    this._authService.setMode(this.isSignUpMode);

    // Get the returnUrl from the current query parameters
    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl') || '/';

    // Navigate to the child route
    const mode = signUp ? 'signup' : 'login';
    this._router.navigate([`/auth/${mode}`], { queryParams: { returnUrl } });
  }
}
