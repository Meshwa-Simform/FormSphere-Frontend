import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLogin = false;
  constructor(private _authService: AuthService){}
  ngOnInit() {
    this._authService.authenticateUser().subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
    });
  }
  logout() {
    this._authService.logoutUser().subscribe(() => {
      this.isLogin = false;
    });
  }
}
