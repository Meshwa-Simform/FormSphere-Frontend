import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.css',
})
export class ThankYouComponent implements OnInit{
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.launchConfetti();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  launchConfetti() {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        spread: 90,
        startVelocity: 40,
        origin: { x: 0.5, y: 0.5 }, // Center of the screen
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

}
