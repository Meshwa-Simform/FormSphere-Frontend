import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-animation',
  standalone: false,
  templateUrl: './auth-animation.component.html',
  styleUrl: './auth-animation.component.css'
})
export class AuthAnimationComponent {
  isSignUpMode = false;
  isMobile = false;


  constructor(private route: ActivatedRoute,private router : Router , private authService:AuthService) {}
  ngOnInit() {
    // Listen for route changes dynamically
    this.route.children.forEach((childRoute) => {
      childRoute.url.subscribe((urlSegments) => {
        const path = urlSegments[0]?.path; // Get the route (e.g., 'login' or 'signup')
        this.isSignUpMode = path === 'signup';
        this.authService.setMode(this.isSignUpMode);
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
    this.authService.setMode(this.isSignUpMode);

    // Navigate to the child route
    const mode = signUp ? 'signup' : 'login';
    this.router.navigate([`/auth/${mode}`]);
  }
}
