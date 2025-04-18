import { Component } from '@angular/core';

@Component({
  selector: 'app-stylebar',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './stylebar.component.html',
  styleUrl: './stylebar.component.css'
})
export class StylebarComponent {
  isStylebarOpen = false;

  toggleStylebar(): void {
    this.isStylebarOpen = !this.isStylebarOpen;
  }
}
