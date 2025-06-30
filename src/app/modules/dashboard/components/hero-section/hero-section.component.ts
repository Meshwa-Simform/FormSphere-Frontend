import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-hero-section',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnInit {
  isLogin = false;

  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this._authService.authenticateUser().subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const icons = document.querySelectorAll('.icon-button');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    icons.forEach((icon, index) => {
      const speed = (index + 1) * 0.003; // Adjust speed for each icon
      const x = (event.clientX - centerX) * speed;
      const y = (event.clientY - centerY) * speed;

      (icon as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
    });
  }
}
