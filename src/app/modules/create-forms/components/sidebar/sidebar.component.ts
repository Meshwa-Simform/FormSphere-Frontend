import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
